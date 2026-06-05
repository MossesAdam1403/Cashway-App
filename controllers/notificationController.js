const User = require('../models/User')

// Save device token for push notifications
const saveDeviceToken = async (req, res) => {
  try {
    const { deviceToken } = req.body

    await User.findByIdAndUpdate(req.user.userId, {
      deviceToken
    })

    res.status(200).json({ message: 'Device token saved successfully' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Send notification to a specific user
const sendNotification = async (userId, title, body) => {
  try {
    const user = await User.findById(userId)

    if (!user || !user.deviceToken) {
      console.log('No device token found for user:', userId)
      return
    }

    // TODO: Integrate Firebase Cloud Messaging here
    // When Firebase credentials are ready replace this section
    console.log(`Notification sent to ${userId}`)
    console.log(`Title: ${title}`)
    console.log(`Body: ${body}`)

  } catch (error) {
    console.log('Notification error:', error.message)
  }
}

module.exports = { saveDeviceToken, sendNotification }