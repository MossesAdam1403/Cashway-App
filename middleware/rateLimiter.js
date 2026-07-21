// const rateLimit = require('express-rate-limit')

// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 500,
//   standardHeaders: true,
//   legacyHeaders: false,
//   keyGenerator: (req) => req.ip,
//   message: {
//     message: 'Too many requests. Please try again in 15 minutes.'
//   },
// })

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 50,
//   standardHeaders: true,
//   legacyHeaders: false,
//   keyGenerator: (req) => req.ip,
//   message: {
//     message: 'Too many login attempts. Please try again in 15 minutes.'
//   },
// })

// const registerLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 50,
//   standardHeaders: true,
//   legacyHeaders: false,
//   keyGenerator: (req) => req.ip,
//   message: {
//     message: 'Too many registration attempts. Please try again in 1 hour.'
//   },
// })

// const otpLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: 30,
//   standardHeaders: true,
//   legacyHeaders: false,
//   keyGenerator: (req) => req.ip,
//   message: {
//     message: 'Too many OTP requests. Please wait 10 minutes before trying again.'
//   },
// })

// const requestLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 50,
//   standardHeaders: true,
//   legacyHeaders: false,
//   keyGenerator: (req) => req.ip,
//   message: {
//     message: 'Too many cash requests. Please slow down.'
//   },
// })

// module.exports = {
//   generalLimiter,
//   loginLimiter,
//   registerLimiter,
//   otpLimiter,
//   requestLimiter,
// }