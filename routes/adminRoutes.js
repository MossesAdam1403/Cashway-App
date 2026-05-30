const express = require('express')
const router = express.Router()
const { getAllOrders, getAllAgents, verifyAgent, getDashboardStats } = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/orders', protect, adminOnly, getAllOrders)
router.get('/agents', protect, adminOnly, getAllAgents)
router.put('/agents/:id/verify', protect, adminOnly, verifyAgent)
router.get('/stats', protect, adminOnly, getDashboardStats)

module.exports = router