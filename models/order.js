const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 1000,
    max: 500000
  },
  serviceFee: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 2000
  },
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: [
      'requested',
      'paid',
      'assigned',
      'en_route',
      'arrived',
      'handed_off',
      'cancelled'
    ],
    default: 'requested'
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'tigopesa', 'airtel', 'halotel', 'card'],
    required: true
  },
  paymentReference: {
    type: String,
    default: null
  },
  handoffOtp: {
    code: String,
    expiresAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: Date,
  deliveredAt: Date
})

// Index for geolocation queries
orderSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Order', orderSchema)