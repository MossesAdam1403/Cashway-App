const express = require('express')
const router = express.Router()
const { adminLogin, getAllOrders, getAllAgents, verifyAgent, rejectAgent, getDashboardStats, clearAgentDebt } = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.post('/login', adminLogin)
router.get('/orders', protect, adminOnly, getAllOrders)
router.get('/agents', protect, adminOnly, getAllAgents)
router.put('/agents/:id/verify', protect, adminOnly, verifyAgent)
router.put('/agents/:id/reject', protect, adminOnly, rejectAgent)
router.post('/agents/:id/clear-debt', protect, adminOnly, clearAgentDebt)
router.get('/stats', protect, adminOnly, getDashboardStats)

module.exports = router