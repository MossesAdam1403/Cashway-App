const express = require('express')
const router = express.Router()
const {
  createRequest,
  getRequestStatus,
  confirmRequest,
  declineRequest,
  cancelRequest,
  getMyRequests
} = require('../controllers/requestController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createRequest)
router.get('/my-orders', protect, getMyRequests)
router.get('/:id/status', protect, getRequestStatus)
router.post('/:id/confirm', protect, confirmRequest)
router.post('/:id/decline', protect, declineRequest)
router.post('/:id/cancel', protect, cancelRequest)

module.exports = router