const {
  initializeApp,
  getApps,
  cert,
} = require('firebase-admin/app');

const { getMessaging } = require('firebase-admin/messaging');

const serviceAccount = require('./cashway-3fc94-firebase-adminsdk-fbsvc-b22e70c071.json');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

module.exports = {
  getMessaging,
};