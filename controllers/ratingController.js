const Rating = require('../models/Rating')
const Order = require('../models/Order')
const Agent = require('../models/Agent')

// POST /api/ratings
const createRating = async (req, res) => {
  try {
    const { orderId, stars, tags, comment } = req.body

    if (!orderId || !stars) {
      return res.status(400).json({ message: 'Order ID and stars are required' })
    }

    // Verify order exists and belongs to this customer
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to rate this order' })
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed orders' })
    }

    if (!order.agent) {
      return res.status(400).json({ message: 'No agent to rate for this order' })
    }

    // Check if already rated
    const existingRating = await Rating.findOne({ order: orderId })
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this delivery' })
    }

    // Create rating
    const rating = await Rating.create({
      order: orderId,
      customer: req.user.userId,
      agent: order.agent,
      stars,
      tags: tags || [],
      comment: comment || ''
    })

    // Recalculate agent's average rating
    const allRatings = await Rating.find({ agent: order.agent })
    const avgRating = allRatings.reduce((sum, r) => sum + r.stars, 0) / allRatings.length

    await Agent.findByIdAndUpdate(order.agent, {
      ratingAvg: Math.round(avgRating * 10) / 10
    })

    res.status(201).json({
      message: 'Thank you for your rating!',
      rating: {
        stars: rating.stars,
        tags: rating.tags,
        comment: rating.comment
      }
    })

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already rated this delivery' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET /api/ratings/agent/:agentId — for agent profile
const getAgentRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ agent: req.params.agentId })
      .populate('customer', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(20)

    res.status(200).json({ ratings })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { createRating, getAgentRatings }