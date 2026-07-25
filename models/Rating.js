const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true // one rating per order only
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  tags: {
    type: [String],
    default: []
  },
  comment: {
    type: String,
    default: ''
  }
}, { timestamps: true })

module.exports = mongoose.model('Rating', ratingSchema)