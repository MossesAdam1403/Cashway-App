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
  requestedAmount: {
    type: Number,
    required: true,
    min: 5000,
    max: 100000
  },
  serviceFee: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  agentShare: {
    type: Number,
    required: true
  },
  cashwayShare: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
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
  favour: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['searching', 'matched', 'confirmed', 'completed', 'expired', 'cancelled'],
    default: 'searching'
  },
  handoffOtp: {
    code: String,
    expiresAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  completedAt: Date,
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000)
  }
})

orderSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Order', orderSchema)