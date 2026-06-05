const express = require ('express')
const router = express.Router()
const { saveDeviceToken } = require('../controllers/notificationController')
const { protect } = require('../middleware/authMiddleware')

router.post('/save-token', protect, saveDeviceToken)

module.exports = router