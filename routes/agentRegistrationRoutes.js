const express = require('express')
const router = express.Router()
const { completeAgentProfile, getAgentProfile } = require('../controllers/agentRegistrationController')
const { protect } = require('../middleware/authMiddleware')

router.post('/complete-profile', protect, completeAgentProfile)
router.get('/profile', protect, getAgentProfile)

module.exports = router