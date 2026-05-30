const express = require('express')
const router = express.Router()
const { createOrder, getOrder, getMyOrders } = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

router.post('/create', protect, createOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/:id', protect, getOrder)

module.exports = router