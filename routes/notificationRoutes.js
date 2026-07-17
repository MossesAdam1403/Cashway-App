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

//we have to delete this after actually working 
router.post('/test-create', protect, async (req, res) => {
  try {

    const Notification = require('../models/Notification')

    const notification = await Notification.create({
      user: req.user.userId,
      title: 'Welcome to CashWay',
      body: 'This is a test notification from CashWay to tell you moses your doing great job than anyone dude.',
      type: 'system'
    })

    await sendNotification(
      req.user.userId,
      notification.title,
      notification.body
    )

    res.status(201).json({
      message: 'Moses Adam CashWay created',
      notification
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }
})


module.exports = router