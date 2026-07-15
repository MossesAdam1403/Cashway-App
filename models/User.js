const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({

  // ─── Basic Info ───────────────────────────────
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },

  // ─── Contact ──────────────────────────────────
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },

  // ─── Auth ─────────────────────────────────────
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['customer', 'agent', 'admin'],
    default: 'customer',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    code: String,
    expiresAt: Date,
  },

  // ─── Device & Notifications ───────────────────
  deviceToken: {
    type: String,
    default: null,
  },

  // ─── Daily Request Tracking ───────────────────
  dailyRequestCount: {
    type: Number,
    default: 0,
  },
  dailyRequestAmount: {
    type: Number,
    default: 0,
  },
  dailyCancellationCount: {
    type: Number,
    default: 0,
  },
  dailyOtpAbandonCount: {
    type: Number,
    default: 0,
  },
  lastRequestDate: {
    type: Date,
    default: null,
  },
  lastCompletedAt: {
    type: Date,
    default: null,
  },
  lastCancelledAt: {
    type: Date,
    default: null,
  },

  // ─── Suspension ───────────────────────────────
  suspendedUntil: {
    type: Date,
    default: null,
  },
  suspensionReason: {
    type: String,
    default: null,
  },

  // ─── Timestamps ───────────────────────────────
  createdAt: {
    type: Date,
    default: Date.now,
  },

})

// ─── Encrypt password before saving ───────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

module.exports = mongoose.model('User', userSchema)