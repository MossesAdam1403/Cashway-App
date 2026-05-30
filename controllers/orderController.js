const Order = require('../models/Order')
const User = require('../models/User')

// Create new cash request
const createOrder = async (req, res) => {
  try {
    const { 
      amount, 
      deliveryAddress, 
      coordinates,
      paymentMethod,
      notes 
    } = req.body

    // Calculate fees
    const serviceFee = Math.round(amount * 0.03)
    const deliveryFee = 2000
    const totalAmount = amount + serviceFee + deliveryFee

    const order = new Order({
      customer: req.user.userId,
      amount,
      serviceFee,
      deliveryFee,
      totalAmount,
      deliveryAddress,
      location: {
        type: 'Point',
        coordinates: coordinates
      },
      paymentMethod,
      notes,
      status: 'requested'
    })

    await order.save()

    res.status(201).json({
      message: 'Cash request created successfully',
      order: {
        id: order._id,
        amount: order.amount,
        serviceFee: order.serviceFee,
        deliveryFee: order.deliveryFee,
        totalAmount: order.totalAmount,
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        status: order.status
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'firstName lastName phone')
      .populate('agent', 'user mobileMoneyNumber')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.status(200).json({ order })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get customer orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.userId })
      .sort({ createdAt: -1 })

    res.status(200).json({ orders })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const generateHandoffOTP = async (req, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        handoffOtp: {
          code: otp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        },
        status: 'arrived'
      },
      { new: true }
    )

    res.status(200).json({ 
      message: 'OTP generated',
      otp
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const verifyHandoffOTP = async (req, res) => {
  try {
    const { otp } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.handoffOtp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' })
    }

    if (order.handoffOtp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    order.status = 'handed_off'
    order.deliveredAt = new Date()
    order.handoffOtp = undefined
    await order.save()

    res.status(200).json({ message: 'Cash delivery confirmed successfully' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { createOrder, getOrder, getMyOrders, generateHandoffOTP, verifyHandoffOTP }
