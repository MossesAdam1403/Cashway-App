const express = require('express')
const router = express.Router()
const { goOnline, goOffline, acceptOrder, updateOrderStatus, findNearbyAgents, updateLocation } = require('../controllers/agentController')
const { protect, agentOnly } = require('../middleware/authMiddleware')

router.post('/online', protect, agentOnly, goOnline)
router.post('/offline', protect, agentOnly, goOffline)
router.post('/accept/:id', protect, agentOnly, acceptOrder)
router.put('/order/:id/status', protect, agentOnly, updateOrderStatus)
router.put('/update-location', protect, agentOnly, updateLocation)
router.get('/nearby', protect, findNearbyAgents)

module.exports = router