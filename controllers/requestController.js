const mongoose = require('mongoose')
const Order = require('../models/Order')
const Agent = require('../models/Agent')
const { notifyCustomer, notifyAgent } = require('../services/notificationService')
const { calculateFees, findAndLockAgent, releaseAgent } = require('../services/agentAssignmentService')
const WaitingCustomer = require('../models/WaitingCustomer')

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

      await notifyCustomer(
        order.customer,
        'Agent Found',
        'A CashWay agent has been assigned. Please confirm now.'
      )

      const agentRecord = await Agent.findById(order.agent).populate('user')
      if (agentRecord && agentRecord.user) {
        await notifyAgent(
          agentRecord.user._id,
          'New Delivery Request',
          `Deliver TSH ${order.requestedAmount.toLocaleString()} — open CashWay now`
        )
      }

      // Auto release after 2 minutes if customer does not confirm
      setTimeout(async () => {
        try {
          const latest = await Order.findById(orderId)
          if (latest && latest.status === 'matched') {
            await releaseAgent(latest.agent)
            latest.agent = null
            latest.status = 'expired'
            await latest.save()

            await notifyCustomer(
              latest.customer,
              'Request Expired',
              'You did not confirm in time. Your request has been cancelled.'
            )

            console.log(`Auto released agent for order ${orderId} after 2 min inactivity`)
          }
        } catch (err) {
          console.error('Auto release error:', err.message)
        }
      }, 2 * 60 * 1000)

    } else {
      order.status = 'no_agents_available'
      await order.save()

      await notifyCustomer(
        order.customer,
        'No Agents Available',
        'There are no agents near you right now. Please try again in a few minutes.'
      )
    }

  } catch (error) {
    console.log('Matching error:', error.message)
  }
}

// POST /api/requests/notify-when-available
const notifyWhenAvailable = async (req, res) => {
  try {
    const { lat, lng } = req.body

    await WaitingCustomer.deleteOne({ customer: req.user.userId })

    await WaitingCustomer.create({
      customer: req.user.userId,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    })

    res.status(200).json({
      message: 'We will notify you when an agent is available nearby'
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
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

    if (order.status === 'no_agents_available') {
      return res.status(200).json({
        status: 'no_agents_available',
        requestId: order._id
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

    const agent = await Agent.findById(order.agent).populate('user')

    if (agent && agent.user) {
      await notifyAgent(
        agent.user._id,
        'Request Confirmed',
        'The customer confirmed the request. You can proceed with delivery.'
      )
    }

    res.status(200).json({
      message: 'Request confirmed',
      status: 'confirmed'
    })

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

    const agent = await Agent.findOne({ user: req.user.userId })

    if (!agent || !order.agent || order.agent.toString() !== agent._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this request' })
    }

    await releaseAgent(order.agent)

    order.agent = null
    order.status = 'searching'
    await order.save()

    await notifyCustomer(
      order.customer,
      'Finding New Agent',
      'Your previous agent declined. We are searching for another agent.'
    )

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

    const agent = await Agent.findOne({ user: req.user.userId })

    if (!agent || !order.agent || order.agent.toString() !== agent._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this request' })
    }

    await releaseAgent(order.agent)

    order.agent = null
    order.status = 'searching'
    order.confirmedAt = null
    await order.save()

    await notifyCustomer(
      order.customer,
      'Request Cancelled',
      'Your agent could not complete the request. We are finding another available agent.',
      'order'
    )

    await User.findByIdAndUpdate(order.customer, {
      lastCancelledAt: new Date(),
      $inc: { dailyCancellationCount: 1 }
    })

    res.status(200).json({ message: 'Cancelled, searching for new agent', status: 'searching' })

    matchAgentToOrder(order._id)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET /api/requests/my-orders
const getMyRequests = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user.userId,
      status: { $in: ['confirmed', 'arrived', 'completed', 'cancelled'] }
    })
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

    await notifyAgent(
      order.agent,
      'Customer Added a Quick Favor',
      'The customer has added a new instruction to the request.',
      'order'
    )

    res.status(200).json({ message: 'Favour added', favour: order.favour })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// POST /api/requests/:id/arrived
const markArrived = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Request not found' })
    }

    const agent = await Agent.findOne({ user: req.user.userId })

    if (!agent || order.agent.toString() !== agent._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (order.status !== 'confirmed') {
      return res.status(400).json({
        message: `Cannot mark arrived for status: ${order.status}`
      })
    }

    order.status = 'arrived'
    await order.save()

    await notifyCustomer(
      order.customer,
      'Agent Arrived',
      'Your CashWay agent has arrived. Please open the app to continue.'
    )

    res.status(200).json({
      message: 'Marked as arrived',
      status: 'arrived'
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
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
          currentDebt: order.cashwayShare,
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

    await User.findByIdAndUpdate(
      order.customer,
      { lastCompletedAt: new Date() },
      { session }
    )

    await session.commitTransaction()

    await notifyCustomer(
      order.customer,
      'Delivery Completed',
      `TSH ${order.requestedAmount.toLocaleString()} delivered successfully.`
    )

    const agent = await Agent.findById(order.agent).populate('user')

    if (agent && agent.user) {
      await notifyAgent(
        agent.user._id,
        'Delivery Completed',
        'Cash delivery completed successfully.'
      )
    }

    res.status(200).json({
      message: 'Delivery confirmed successfully',
      status: 'completed'
    })

  } catch (error) {
    await session.abortTransaction()
    res.status(500).json({ message: 'Server error', error: error.message })
  } finally {
    session.endSession()
  }
}

// GET /api/requests/agent/deliveries
const getAgentDeliveries = async (req, res) => {
  try {
    const agent = await Agent.findOne({ user: req.user.userId })

    if (!agent) {
      return res.status(404).json({ message: 'Agent profile not found' })
    }

    const orders = await Order.find({
      agent: agent._id,
      status: { $in: ['confirmed', 'arrived', 'completed', 'cancelled'] }
    })
      .populate('customer', 'firstName lastName phone')
      .sort({ createdAt: -1 })

    res.status(200).json({ orders })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET /api/requests/agent/current
const getAgentCurrentRequest = async (req, res) => {
  try {
    const agent = await Agent.findOne({ user: req.user.userId })

    if (!agent) {
      return res.status(404).json({ message: 'Agent profile not found' })
    }

    const order = await Order.findOne({
      agent: agent._id,
      status: { $in: ['matched', 'confirmed', 'arrived'] }
    }).populate('customer', 'firstName lastName phone')

    if (!order) {
      return res.status(200).json({ hasRequest: false })
    }

    return res.status(200).json({
      hasRequest: true,
      requestId: order._id,
      status: order.status,
      amount: order.requestedAmount,
      serviceFee: order.serviceFee,
      deliveryFee: order.deliveryFee,
      total: order.total,
      favour: order.favour,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      customerPhone: order.customer.phone,
      location: order.location.coordinates
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
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
  markArrived,
  notifyWhenAvailable,
  generateOTP,
  verifyHandoffOTP,
  getAgentCurrentRequest,
  getAgentDeliveries
}