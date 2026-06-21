const mongoose = require('mongoose')
const Order = require('../models/Order')
const Agent = require('../models/Agent')
const { calculateFees, findAndLockAgent, releaseAgent } = require('../services/agentAssignmentService')

// POST /api/requests
const createRequest = async (req, res) => {
  try {
    const { amount, lat, lng } = req.body

    if (!amount || amount < 5000 || amount > 100000) {
      return res.status(400).json({ message: 'Amount must be between TSH 5,000 and 100,000' })
    }

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'Location coordinates are required' })
    }

    const fees = calculateFees(amount)

    const order = new Order({
      customer: req.user.userId,
      requestedAmount: amount,
      serviceFee: fees.serviceFee,
      deliveryFee: fees.deliveryFee,
      agentShare: fees.agentShare,
      cashwayShare: fees.cashwayShare,
      total: fees.total,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      status: 'searching'
    })

    await order.save()

    res.status(201).json({
      requestId: order._id,
      status: 'searching'
    })

    matchAgentToOrder(order._id)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Internal helper - runs matching and updates order
const matchAgentToOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
    if (!order || order.status !== 'searching') return

    const agent = await findAndLockAgent(
      order.requestedAmount,
      order.location.coordinates,
      order.cashwayShare
    )

    if (agent) {
      order.agent = agent._id
      order.status = 'matched'
      await order.save()
    }

  } catch (error) {
    console.log('Matching error:', error.message)
  }
}

// GET /api/requests/:id/status
const getRequestStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: 'agent',
      populate: { path: 'user', select: 'firstName lastName phone' }
    })

    if (!order) {
      return res.status(404).json({ message: 'Request not found' })
    }

    if (
      (order.status === 'searching' || order.status === 'matched') &&
      order.expiresAt < new Date()
    ) {
      if (order.agent) {
        await releaseAgent(order.agent._id)
      }
      order.status = 'expired'
      await order.save()
    }

    if (order.status === 'matched' && order.agent) {
      return res.status(200).json({
        status: 'matched',
        requestId: order._id,
        agent: {
          id: order.agent._id,
          name: `${order.agent.user.firstName} ${order.agent.user.lastName}`,
          phone: order.agent.user.phone,
          rating: order.agent.ratingAvg,
          deliveries: order.agent.totalDeliveries
        }
      })
    }

    return res.status(200).json({
      status: order.status,
      requestId: order._id
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// POST /api/requests/:id/confirm
const confirmRequest = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Request not found' })
    }

    if (order.status !== 'matched') {
      return res.status(400).json({ message: `Cannot confirm a request with status: ${order.status}` })
    }

    order.status = 'confirmed'
    order.confirmedAt = new Date()
    await order.save()

    res.status(200).json({ message: 'Request confirmed', status: 'confirmed' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// POST /api/requests/:id/decline
const declineRequest = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Request not found' })
    }

    if (order.agent) {
      await releaseAgent(order.agent)
    }

    order.agent = null
    order.status = 'searching'
    await order.save()

    res.status(200).json({ message: 'Declined, searching for new agent', status: 'searching' })

    matchAgentToOrder(order._id)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// POST /api/requests/:id/cancel
const cancelRequest = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Request not found' })
    }

    if (order.agent) {
      await releaseAgent(order.agent)
    }

    order.agent = null
    order.status = 'searching'
    order.confirmedAt = null
    await order.save()

    res.status(200).json({ message: 'Cancelled, searching for new agent', status: 'searching' })

    matchAgentToOrder(order._id)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET /api/requests/my-orders
const getMyRequests = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.userId })
      .populate({ path: 'agent', populate: { path: 'user', select: 'firstName lastName' } })
      .sort({ createdAt: -1 })

    res.status(200).json({ orders })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// POST /api/requests/:id/favour
const addFavour = async (req, res) => {
  try {
    const { favour } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { favour },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ message: 'Request not found' })
    }

    res.status(200).json({ message: 'Favour added', favour: order.favour })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// POST /api/requests/:id/generate-otp
const generateOTP = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Request not found' })
    }

    if (order.status !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot generate OTP before agent confirms' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    order.handoffOtp = {
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }
    await order.save()

    // TODO: send via Africa's Talking SMS once re-enabled
    console.log(`Handoff OTP for order ${order._id}: ${otp}`)

    res.status(200).json({ message: 'OTP generated', otp })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// POST /api/requests/:id/verify-otp
const verifyHandoffOTP = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    const { otp } = req.body

    session.startTransaction()

    const order = await Order.findById(req.params.id).session(session)

    if (!order) {
      await session.abortTransaction()
      return res.status(404).json({ message: 'Request not found' })
    }

    if (!order.handoffOtp || !order.handoffOtp.code) {
      await session.abortTransaction()
      return res.status(400).json({ message: 'No OTP was generated for this request' })
    }

    if (order.handoffOtp.expiresAt < new Date()) {
      await session.abortTransaction()
      return res.status(400).json({ message: 'OTP has expired' })
    }

    if (order.handoffOtp.code !== otp) {
      await session.abortTransaction()
      return res.status(400).json({ message: 'Incorrect OTP' })
    }

    await Agent.findByIdAndUpdate(
      order.agent,
      {
        $inc: {
          availableFloat: -order.requestedAmount,
          currentDebt: order.cashwayShare
          totalDeliveries: 1
        },
        isAvailable: true
      },
      { session }
    )

    order.status = 'completed'
    order.completedAt = new Date()
    order.handoffOtp = undefined
    await order.save({ session })

    await session.commitTransaction()

    res.status(200).json({ message: 'Delivery confirmed successfully', status: 'completed' })

  } catch (error) {
    await session.abortTransaction()
    res.status(500).json({ message: 'Server error', error: error.message })
  } finally {
    session.endSession()
  }
}

module.exports = {
  createRequest,
  getRequestStatus,
  confirmRequest,
  declineRequest,
  cancelRequest,
  getMyRequests,
  addFavour,
  generateOTP,
  verifyHandoffOTP
}