const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
// const AfricasTalking = require('africastalking')

// const africastalking = AfricasTalking({
//   username: process.env.AFRICASTALKING_USERNAME,
//   apiKey: process.env.AFRICASTALKING_API_KEY
// })

// const sms = africastalking.SMS

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Register new user
const register = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { phone },
        ...(email ? [{ email }] : [])
      ]
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this phone or email'
      })
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      phone,
      email,
      password,
      role: role || 'customer'
    })
    // Generate OTP
    const otp = generateOTP()
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    }

    await user.save()

    
    try {
      await sms.send({
        to: [phone],
        message: 'CashWay verification code is: ${otp}. valid for the 5 minutes.Do not share this code with anyone'
      })
    } catch (smsError) {
      console.log('SMS failed, OTP:', otp)
      //continue even if the sms fails-OTP is still saved in the mongo DB
    }


    res.status(201).json({
      message: 'Registration successful. OTP sent to your phone.',
      userId: user._id
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}


// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if OTP is expired
    if (user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' })
    }

    // Check if OTP is correct
    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    // Mark user as verified
    user.isVerified = true
    user.otp = undefined
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      message: 'Phone verified successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/// Login user
const login = async (req, res) => {
  try {
    const { phone, password, deviceToken } = req.body

    // Find user by phone
    const user = await User.findOne({ phone })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your phone first' })
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    //For device token
    if (deviceToken && user.deviceToken !== deviceToken) {
      user.deviceToken = deviceToken;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { register, verifyOTP, login }