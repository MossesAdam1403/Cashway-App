const express = require('express')
const router = express.Router()
const { createRating, getAgentRatings } = require('../controllers/ratingController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createRating)
router.get('/agent/:agentId', protect, getAgentRatings)

module.exports = router