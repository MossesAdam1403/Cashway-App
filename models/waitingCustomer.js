const mongoose = require('mongoose')

const waitingCustomerSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  status: {
    type: String,
    enum: ['waiting', 'notified'],
    default: 'waiting'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

waitingCustomerSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('WaitingCustomer', waitingCustomerSchema)