const mongoSanitize = require('express-mongo-sanitize')

const sanitizeInput = mongoSanitize({
  replaceWith: '_',
  allowDots: true,
  dryRun: false,
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized malicious input in field: ${key} from IP: ${req.ip}`)
  }
})

module.exports = sanitizeInput