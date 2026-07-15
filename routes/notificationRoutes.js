const express = require('express')
const router = express.Router()

const { 
  saveDeviceToken, 
  sendNotification,
  getNotifications
} = require('../controllers/notificationController')

const { protect } = require('../middleware/authMiddleware')


router.post('/save-token', protect, saveDeviceToken)

router.get('/', protect, getNotifications)


// Test notification sender
router.post('/send', protect, async (req, res) => {
  try {
    const { userId, title, body } = req.body

    await sendNotification(
      userId,
      title,
      body
    )

    res.status(200).json({
      message: 'Notification sent successfully'
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})


module.exports = router