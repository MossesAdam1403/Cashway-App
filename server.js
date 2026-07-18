const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
require('./config/firebaseAdmin')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const app = express()

const sanitizeInput = require('./middleware/sanitize')
const { generalLimiter, loginLimiter, registerLimiter, otpLimiter, requestLimiter } = require('./middleware/rateLimiter')

// Middleware
app.use(cors())
app.use(express.json())
app.use(sanitizeInput)
app.use(generalLimiter)

// Routes imports
const authRoutes = require('./routes/authRoutes')
const orderRoutes = require('./routes/orderRoutes')
const agentRoutes = require('./routes/agentRoutes')
const adminRoutes = require('./routes/adminRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const agentRegistrationRoutes = require('./routes/agentRegistrationRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const requestRoutes = require('./routes/requestRoutes')


// Routes
app.use('/api/auth/login', loginLimiter)
app.use('/api/auth/register', registerLimiter)
app.use('/api/auth/verify-otp', otpLimiter)
app.use('/api/requests', requestLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/agents', agentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/agent-registration', agentRegistrationRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/orders', orderRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err))

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'CashWay Backend is running' })
})

//Error handling 
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`CashWay server running on port ${PORT}`)
})