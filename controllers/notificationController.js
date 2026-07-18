const User = require('../models/User')
const { messaging } = require('../config/firebaseAdmin')
const Notification = require('../models/Notification')

 //NOTIFICATION THAT BELONG TO THE LOGGED IN USER
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.userId
    })
    .sort({
      createdAt: -1
    })

    res.status(200).json({
      notifications
    })

  } catch (error) {
    console.error('Get notifications error:', error)

    res.status(500).json({
      message: 'Server error'
    })
  }
}


// Save device token for push notifications
const saveDeviceToken = async (req, res) => {
  try {
    const { deviceToken } = req.body

    if (!deviceToken) {
      return res.status(400).json({
        message: 'Device token is required'
      })
    }

    await User.findByIdAndUpdate(
      req.user.userId,
      { deviceToken },
      { new: true }
    )

    return res.status(200).json({
      message: 'Device token saved successfully'
    })

  } catch (error) {
    console.error('Save device token error:', error)

    return res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}


// Send notification to a specific user via Firebase Cloud Messaging
const sendNotification = async (userId, title, body) => {
  try {
    const user = await User.findById(userId)

    if (!user) {
      console.log('User not found:', userId)
      return null
    }

    if (!user.deviceToken) {
      console.log('No device token found for user:', userId)
      return null
    }

    const message = {
      notification: {
        title,
        body
      },
      token: user.deviceToken
    }

    const response = await messaging.send(message)

    console.log(
      'Firebase notification sent successfully:',
      response
    )

    return response

  } console.error('Firebase notification error:', error)
    if (
      error.code === 'messaging/registration-token-not-registered' ||
      error.code === 'messaging/invalid-registration-token'
    ) {
      await User.findByIdAndUpdate(userId, {
        $unset: { deviceToken: 1 }
      })

      console.log('Invalid device token removed from user.')
    }

    return null
  }
}


module.exports = {
  saveDeviceToken,
  sendNotification,
  getNotifications
}