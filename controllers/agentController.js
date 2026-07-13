const Agent = require('../models/Agent')
const Order = require('../models/Order')
const WaitingCustomer = require('../models/WaitingCustomer')
const { notifyCustomer } = require('./notificationController')


const goOnline = async (req, res) => {
  try {
    const { coordinates } = req.body

    const agent = await Agent.findOneAndUpdate(
      { user: req.user.userId },
      {
        status: 'online',
        location: { type: 'Point', coordinates }
      },
      { new: true }
    )

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' })
    }

    const waitingCustomers = await WaitingCustomer.find({
      status: 'waiting',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: agent.location.coordinates
          },
          $maxDistance: 5000
        }
      }
    })
      .limit(5)
      .populate('customer')


    //WE HAVE TO DELETE THIS AFTER TESTING THE NOTIFICATION HOW IT WORKS
    console.log('Waiting customers found:', waitingCustomers.length)

    for (const waiting of waitingCustomers) {
      if (waiting.customer) {

        console.log('Sending notification to customer:', waiting.customer._id)

        await notifyCustomer(
          waiting.customer._id,
          'Agent Nearby',
          'A CashWay agent is available near you. Request cash now.'
        )

        waiting.status = 'notified'
        await waiting.save()

        console.log('Customer marked as notified')
      }
    }

    res.status(200).json({
      message: 'You are now online',
      agent
    })

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}

const goOffline = async (req, res) => {
  try {
    const agent = await Agent.findOneAndUpdate(
      { user: req.user.userId },
      { status: 'offline' },
      { new: true }
    )
    res.status(200).json({ message: 'You are now offline', agent })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        agent: req.user.userId,
        status: 'assigned'
      },
      { new: true }
    )
    await Agent.findOneAndUpdate(
      { user: req.user.userId },
      { status: 'busy' }
    )
    res.status(200).json({ message: 'Order accepted', order })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    res.status(200).json({ message: 'Status updated', order })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const findNearbyAgents = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query

    const agents = await Agent.find({
      status: 'online',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance
        }
      }
    }).populate('user', 'firstName lastName phone')

    res.status(200).json({ agents })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body

    await Agent.findOneAndUpdate(
      { user: req.user.userId },
      {
        location: {
          type: 'Point',
          coordinates
        }
      },
      { new: true }
    )

    res.status(200).json({ message: 'Location updated' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { goOnline, goOffline, acceptOrder, updateOrderStatus, findNearbyAgents, updateLocation }