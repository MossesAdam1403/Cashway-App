const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String
  },
  role: {
    type: String,
    enum: ['customer', 'agent', 'admin'],
    default: 'customer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Encrypt password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

module.exports = mongoose.model('User', userSchema)