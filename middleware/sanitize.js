const mongoSanitize = require('express-mongo-sanitize')

const sanitizeInput = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized potentially malicious input in field: ${key} from IP: ${req.ip}`)
  }
})

module.exports = sanitizeInput