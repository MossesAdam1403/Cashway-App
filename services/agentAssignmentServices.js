const Agent = require('../models/Agent')

const findAvailableAgent = async (amount, coordinates) => {
  try {
    // Find nearest online verified agent with sufficient float
    const agents = await Agent.find({
      status: 'online',
      isVerified: true,
      availableFloat: { $gte: amount }
    })
    .populate('user', 'firstName lastName phone')
    .sort({ ratingAvg: -1 }) // prioritize highest rated

    if (agents.length === 0) {
      return null
    }

    // Find nearest agent using coordinates
    const nearestAgent = await Agent.findOne({
      status: 'online',
      isVerified: true,
      availableFloat: { $gte: amount },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: 5000 // 5km radius
        }
      }
    }).populate('user', 'firstName lastName phone')

    return nearestAgent || agents[0]

  } catch (error) {
    console.log('Agent finder error:', error.message)
    return null
  }
}

const reserveAgent = async (agentId, amount) => {
  try {
    await Agent.findByIdAndUpdate(agentId, {
      status: 'busy',
      availableFloat: { $inc: -amount }
    })
  } catch (error) {
    console.log('Agent reserve error:', error.message)
  }
}

const releaseAgent = async (agentId, amount) => {
  try {
    await Agent.findByIdAndUpdate(agentId, {
      status: 'online',
      availableFloat: { $inc: amount }
    })
  } catch (error) {
    console.log('Agent release error:', error.message)
  }
}

module.exports = { findAvailableAgent, reserveAgent, releaseAgent }