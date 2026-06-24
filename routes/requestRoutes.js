const express = require('express')
const router = express.Router()
const {
  createRequest,
  getRequestStatus,
  confirmRequest,
  declineRequest,
  cancelRequest,
  getMyRequests,
  addFavour,
  generateOTP,
  verifyHandoffOTP,
  getAgentCurrentRequest
} = require('../controllers/requestController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createRequest)
router.get('/agent/current', protect, getAgentCurrentRequest)
router.get('/my-orders', protect, getMyRequests)
router.get('/:id/status', protect, getRequestStatus)
router.post('/:id/confirm', protect, confirmRequest)
router.post('/:id/decline', protect, declineRequest)
router.post('/:id/cancel', protect, cancelRequest)
router.post('/:id/favour', protect, addFavour)
router.post('/:id/generate-otp', protect, generateOTP)
router.post('/:id/verify-otp', protect, verifyHandoffOTP)

module.exports = router