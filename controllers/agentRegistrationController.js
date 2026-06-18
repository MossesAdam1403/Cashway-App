const Agent = require('../models/Agent')
const User = require('../models/User')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Complete agent profile after registration
const completeAgentProfile = async (req, res) => {
  try {
    const {
      universityRegNumber,
      campusArea,
      mobileMoneyNumber,
      mobileMoneyProvider,
      profilePhotoBase64
    } = req.body

    // Check if agent profile already exists
    const existingAgent = await Agent.findOne({ user: req.user.userId })

    if (existingAgent) {
      return res.status(400).json({ 
        message: 'Agent profile already exists' 
      })
    }

    let profilePhotoUrl = null

    // Upload photo to Cloudinary if provided
    if (profilePhotoBase64) {
      const uploadResult = await cloudinary.uploader.upload(profilePhotoBase64, {
        folder: 'cashway/agents',
      })
      profilePhotoUrl = uploadResult.secure_url
    }

    // Update user role to agent
    await User.findByIdAndUpdate(req.user.userId, { role: 'agent' })

    // Create agent profile
    const agent = new Agent({
      user: req.user.userId,
      universityRegNumber,
      campusArea,
      mobileMoneyNumber,
      mobileMoneyProvider,
      profilePhoto: profilePhotoUrl,
      status: 'offline',
      isVerified: false
    })

    await agent.save()

    res.status(201).json({
      message: 'Agent profile created successfully. Awaiting admin verification.',
      agent: {
        id: agent._id,
        universityRegNumber: agent.universityRegNumber,
        campusArea: agent.campusArea,
        mobileMoneyNumber: agent.mobileMoneyNumber,
        mobileMoneyProvider: agent.mobileMoneyProvider,
        profilePhoto: agent.profilePhoto,
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