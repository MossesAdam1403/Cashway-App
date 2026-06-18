const express = require('express')
const router = express.Router()
const { getAllOrders, getAllAgents, verifyAgent, rejectAgent, getDashboardStats } = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/orders', protect, adminOnly, getAllOrders)
router.get('/agents', protect, adminOnly, getAllAgents)
router.put('/agents/:id/verify', protect, adminOnly, verifyAgent)
router.put('/agents/:id/reject', protect, adminOnly, rejectAgent)
router.get('/stats', protect, adminOnly, getDashboardStats)

module.exports = router