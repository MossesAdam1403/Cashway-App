const Agent = require('../models/Agent')
const User = require('../models/User')

// Complete agent profile after registration
const completeAgentProfile = async (req, res) => {
  try {
    const {
      nidaNumber,
      mobileMoneyNumber,
      mobileMoneyProvider
    } = req.body

    // Check if agent profile already exists
    const existingAgent = await Agent.findOne({ user: req.user.userId })

    if (existingAgent) {
      return res.status(400).json({ 
        message: 'Agent profile already exists' 
      })
    }

    // Update user role to agent
    await User.findByIdAndUpdate(req.user.userId, { role: 'agent' })

    // Create agent profile
    const agent = new Agent({
      user: req.user.userId,
      nidaNumber,
      mobileMoneyNumber,
      mobileMoneyProvider,
      status: 'offline',
      isVerified: false
    })

    await agent.save()

    res.status(201).json({
      message: 'Agent profile created successfully. Awaiting admin verification.',
      agent: {
        id: agent._id,
        nidaNumber: agent.nidaNumber,
        mobileMoneyNumber: agent.mobileMoneyNumber,
        mobileMoneyProvider: agent.mobileMoneyProvider,
        status: agent.status,
        isVerified: agent.isVerified
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get agent profile
const getAgentProfile = async (req, res) => {
  try {
    const agent = await Agent.findOne({ user: req.user.userId })
      .populate('user', 'firstName lastName phone email')

    if (!agent) {
      return res.status(404).json({ message: 'Agent profile not found' })
    }

    res.status(200).json({ agent })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { completeAgentProfile, getAgentProfile }