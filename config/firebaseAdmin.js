const { initializeApp, cert } = require('firebase-admin/app')
const { getMessaging } = require('firebase-admin/messaging')

let serviceAccount

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
} else {
  serviceAccount = require('./cashway-3fc94-firebase-adminsdk-fbsvc-b22e70c071.json')
}

initializeApp({
  credential: cert(serviceAccount)
})

module.exports = {
  messaging: getMessaging()
}