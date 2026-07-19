const User = require('../models/User')
const Agent = require('../models/Agent')
const Order = require('../models/Order')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'firstName lastName phone')
      .populate('agent')
      .sort({ createdAt: -1 })
    res.status(200).json({ orders })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find()
      .populate('user', 'firstName lastName phone')
    res.status(200).json({ agents })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const verifyAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    )
    res.status(200).json({ message: 'Agent verified successfully', agent })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const completedOrders = await Order.countDocuments({ status: 'completed' })
    const totalAgents = await Agent.countDocuments()
    const onlineAgents = await Agent.countDocuments({ status: 'online' })
    const totalCustomers = await User.countDocuments({ role: 'customer' })

    res.status(200).json({
      totalOrders,
      completedOrders,
      totalAgents,
      onlineAgents,
      totalCustomers
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const rejectAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { isVerified: false, status: 'rejected' },
      { new: true }
    )

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' })
    }

    res.status(200).json({ message: 'Agent rejected', agent })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const clearAgentDebt = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { currentDebt: 0 },
      { new: true }
    )

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' })
    }

    res.status(200).json({ message: 'Agent debt cleared', agent })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

//THIS IS FOR THE LOGIN OF THE ADMIN 
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await User.findOne({ email })

    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({
        message: 'Invalid admin credentials'
      })
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid admin credentials'
      })
    }

    const token = jwt.sign(
      {
        userId: admin._id,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: `${admin.firstName} ${admin.lastName}`,
        email: admin.email,
        role: admin.role
      }
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}

module.exports = { getAllOrders, adminLogin, getAllAgents, verifyAgent, rejectAgent, getDashboardStats, clearAgentDebt }