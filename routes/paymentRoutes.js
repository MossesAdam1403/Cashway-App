const express = require('express')
const router = express.Router()
const { initiatePayment, paymentWebhook, checkPaymentStatus } = require('../controllers/paymentController')
const { protect } = require('../middleware/authMiddleware')

router.post('/initiate', protect, initiatePayment)
router.post('/webhook', paymentWebhook)
router.get('/status/:orderId', protect, checkPaymentStatus)

module.exports = router