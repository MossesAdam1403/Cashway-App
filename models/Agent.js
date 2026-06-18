const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  profilePhoto: {
  type: String,
  default: null
},
universityRegNumber: {
  type: String,
  required: true
},
campusArea: {
  type: String,
  default: ''
},
  status: {
  type: String,
  enum: ['online', 'offline', 'busy', 'rejected'],
  default: 'offline'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  mobileMoneyNumber: {
    type: String,
    required: true
  },
  mobileMoneyProvider: {
    type: String,
    enum: ['mpesa', 'tigopesa', 'airtel', 'halotel'],
    required: true
  },
  ratingAvg: {
    type: Number,
    default: 0
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  availableFloat: {
    type: Number,
    default:0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Index for geolocation queries
agentSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Agent', agentSchema)