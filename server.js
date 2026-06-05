const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require('./routes/authRoutes')
const orderRoutes = require('./routes/orderRoutes')
const agentRoutes = require('./routes/agentRoutes')
const adminRoutes = require('./routes/adminRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const agentRegistrationRoutes = require('./routes/agentRegistrationRoutes')
const notificationRoutes = require('./routes/notificationRoutes')


app.use('/api/notifications', notificationRoutes)
app.use('/api/agent-registration', agentRegistrationRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/agents', agentRoutes)
app.use('/api/admin', adminRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err))

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'CashWay Backend is running' })
})

//Error handling 
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`CashWay server running on port ${PORT}`)
})