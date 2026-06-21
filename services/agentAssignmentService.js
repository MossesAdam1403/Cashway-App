const Agent = require('../models/Agent')

const DELIVERY_FEE = 1000
const AGENT_SHARE_RATE = 0.8
const DEBT_CEILING = 5000

const calculateFees = (amount) => {
  const serviceFee = Math.round(amount * 0.03)
  const deliveryFee = DELIVERY_FEE
  const agentShare = Math.round(deliveryFee * AGENT_SHARE_RATE)
  const cashwayShare = serviceFee + (deliveryFee - agentShare)
  const total = amount + serviceFee + deliveryFee
  return { serviceFee, deliveryFee, agentShare, cashwayShare, total }
}

const findAndLockAgent = async (amount, coordinates, cashwayShare) => {
  try {
    const candidates = await Agent.find({
      status: 'online',
      isVerified: true,
      isAvailable: true,
      availableFloat: { $gte: amount },
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates },
          $maxDistance: 5000
        }
      }
    }).populate('user', 'firstName lastName phone')

    for (const candidate of candidates) {
      if (candidate.currentDebt + cashwayShare > DEBT_CEILING) {
        continue
      }

      const locked = await Agent.findOneAndUpdate(
        { _id: candidate._id, isAvailable: true },
        { isAvailable: false },
        { new: true }
      ).populate('user', 'firstName lastName phone')

      if (locked) {
        return locked
      }
    }

    return null

  } catch (error) {
    console.log('Agent matching error:', error.message)
    return null
  }
}

const releaseAgent = async (agentId) => {
  try {
    await Agent.findByIdAndUpdate(agentId, { isAvailable: true })
  } catch (error) {
    console.log('Agent release error:', error.message)
  }
}

module.exports = { calculateFees, findAndLockAgent, releaseAgent }