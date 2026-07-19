const Order = require('../models/Order')
const User = require('../models/User')

const DAILY_REQUEST_LIMIT = 5
const DAILY_AMOUNT_LIMIT = 200000
const COMPLETED_COOLDOWN_MS = 15 * 60 * 1000  // 15 minutes
const CANCELLED_COOLDOWN_MS = 30 * 60 * 1000  // 30 minutes

const isSameDay = (date1, date2) => {
  if (!date1) return false
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

const requestGuard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const now = new Date()

    // Rule 1 — Check suspension
    if (user.suspendedUntil && user.suspendedUntil > now) {
      const minutesLeft = Math.ceil((user.suspendedUntil - now) / 60000)
      return res.status(403).json({
        message: `Your account is temporarily suspended. Try again in ${minutesLeft} minutes.`,
        reason: user.suspensionReason,
        suspendedUntil: user.suspendedUntil
      })
    }

    // Rule 2 — Reset daily counters if new day
    if (!isSameDay(user.lastRequestDate, now)) {
      user.dailyRequestCount = 0
      user.dailyRequestAmount = 0
      user.dailyCancellationCount = 0
      user.dailyOtpAbandonCount = 0
    }

    // Rule 3 — Check for existing active request
    const tenMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    const activeRequest = await Order.findOne({
      customer: req.user.userId,
      status: { $in: ['searching', 'matched', 'confirmed', 'arrived'] },
      createdAt: { $gt: fiveMinutesAgo }
    })
    if (activeRequest) {
      return res.status(400).json({
        message: 'You already have an active cash request. Please wait for it to complete before making a new one.',
        activeRequestId: activeRequest._id,
        status: activeRequest.status
      })
    }

    // Rule 4 — Daily request limit
    if (user.dailyRequestCount >= DAILY_REQUEST_LIMIT) {
      return res.status(429).json({
        message: `You have reached your daily limit of ${DAILY_REQUEST_LIMIT} requests. Please try again tomorrow.`
      })
    }

    // Rule 5 — Daily amount limit
    const requestedAmount = Number(req.body.amount) || 0
    if (user.dailyRequestAmount + requestedAmount > DAILY_AMOUNT_LIMIT) {
      const remaining = DAILY_AMOUNT_LIMIT - user.dailyRequestAmount
      return res.status(429).json({
        message: `You have TSH ${remaining.toLocaleString()} remaining in your daily limit of TSH ${DAILY_AMOUNT_LIMIT.toLocaleString()}.`
      })
    }

    // Rule 6 — Cooldown after completed request
    if (user.lastCompletedAt) {
      const timeSinceCompleted = now - new Date(user.lastCompletedAt)
      if (timeSinceCompleted < COMPLETED_COOLDOWN_MS) {
        const minutesLeft = Math.ceil((COMPLETED_COOLDOWN_MS - timeSinceCompleted) / 60000)
        return res.status(429).json({
          message: `Please wait ${minutesLeft} more minute${minutesLeft === 1 ? '' : 's'} before making another request.`
        })
      }
    }

    // Rule 7 — Cooldown after cancelled request
    if (user.lastCancelledAt) {
      const timeSinceCancelled = now - new Date(user.lastCancelledAt)
      if (timeSinceCancelled < CANCELLED_COOLDOWN_MS) {
        const minutesLeft = Math.ceil((CANCELLED_COOLDOWN_MS - timeSinceCancelled) / 60000)
        return res.status(429).json({
          message: `You recently cancelled a request. Please wait ${minutesLeft} more minute${minutesLeft === 1 ? '' : 's'} before trying again.`
        })
      }
    }

    // All rules passed — update counters and proceed
    user.dailyRequestCount += 1
    user.dailyRequestAmount += requestedAmount
    user.lastRequestDate = now
    await user.save()

    next()

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = requestGuard