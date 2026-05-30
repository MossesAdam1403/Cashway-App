const Order = require('../models/Order')

// Initiate payment
const initiatePayment = async (req, res) => {
  try {
    const { orderId, phoneNumber, provider } = req.body

    // Find the order
    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check order belongs to this customer
    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // TODO: Integrate Selcom USSD Push here
    // When Selcom API credentials are ready replace this section
    console.log(`Payment initiated for order ${orderId}`)
    console.log(`Amount: ${order.totalAmount} TSH`)
    console.log(`Phone: ${phoneNumber}`)
    console.log(`Provider: ${provider}`)

    // Update order payment reference
    await Order.findByIdAndUpdate(orderId, {
      paymentReference: `PAY-${Date.now()}`
    })

    res.status(200).json({
      message: 'Payment initiated. Check your phone for payment prompt.',
      orderId,
      amount: order.totalAmount,
      phone: phoneNumber,
      provider
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Payment webhook - Selcom calls this after payment
const paymentWebhook = async (req, res) => {
  try {
    const { orderId, status, transactionId } = req.body

    if (status === 'SUCCESS') {
      await Order.findByIdAndUpdate(orderId, {
        status: 'paid',
        paymentReference: transactionId,
        paidAt: new Date()
      })
    }

    res.status(200).json({ message: 'Webhook received' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Check payment status
const checkPaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.status(200).json({
      orderId: order._id,
      status: order.status,
      paymentReference: order.paymentReference,
      amount: order.totalAmount
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { initiatePayment, paymentWebhook, checkPaymentStatus }