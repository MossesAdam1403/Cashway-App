// Validate registration input
const validateRegister = (req, res, next) => {
  const { firstName, lastName, phone, password } = req.body

  if (!firstName || firstName.trim() === '') {
    return res.status(400).json({ message: 'First name is required' })
  }

  if (!lastName || lastName.trim() === '') {
    return res.status(400).json({ message: 'Last name is required' })
  }

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' })
  }

  if (!phone.startsWith('+255')) {
    return res.status(400).json({ message: 'Phone number must start with +255 for Tanzania' })
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  next()
}

// Validate login input
const validateLogin = (req, res, next) => {
  const { phone, password } = req.body

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' })
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  next()
}

// Validate order input
const validateOrder = (req, res, next) => {
  const { amount, deliveryAddress, coordinates, paymentMethod } = req.body

  if (!amount || amount < 1000) {
    return res.status(400).json({ message: 'Minimum cash request is TSH 1,000' })
  }

  if (amount > 500000) {
    return res.status(400).json({ message: 'Maximum cash request is TSH 500,000' })
  }

  if (!deliveryAddress || deliveryAddress.trim() === '') {
    return res.status(400).json({ message: 'Delivery address is required' })
  }

  if (!coordinates || coordinates.length !== 2) {
    return res.status(400).json({ message: 'Valid coordinates are required' })
  }

  if (!paymentMethod) {
    return res.status(400).json({ message: 'Payment method is required' })
  }

  const validMethods = ['mpesa', 'tigopesa', 'airtel', 'halotel', 'card']
  if (!validMethods.includes(paymentMethod)) {
    return res.status(400).json({ message: 'Invalid payment method' })
  }

  next()
}

module.exports = { validateRegister, validateLogin, validateOrder }