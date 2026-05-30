const User = require('../models/User')
const Agent = require('../models/Agent')
const Order = require('../models/Order')

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
    const completedOrders = await Order.countDocuments({ status: 'handed_off' })
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

module.exports = { getAllOrders, getAllAgents, verifyAgent, getDashboardStats }