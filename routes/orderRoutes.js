const express = require('express')
const router = express.Router()
const { createOrder, getOrder, getMyOrders, generateHandoffOTP, verifyHandoffOTP } = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')
const { validateOrder } = require('../middleware/validationMiddleware')

router.post('/create', protect, validateOrder, createOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/:id', protect, getOrder)
router.post('/:id/generate-otp', protect, generateHandoffOTP)
router.post('/:id/verify-otp', protect, verifyHandoffOTP)

module.exports = router