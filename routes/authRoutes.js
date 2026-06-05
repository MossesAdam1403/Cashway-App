const express = require('express')
const router = express.Router()
const { register, verifyOTP, login } = require('../controllers/authController')
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware')

router.post('/register', validateRegister, register)
router.post('/verify-otp', verifyOTP)
router.post('/login', validateLogin, login)

module.exports = router