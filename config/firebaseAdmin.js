
const { initializeApp, cert } = require("firebase-admin/app");
const admin = require("firebase-admin");

const serviceAccount = require("./cashway-3fc94-firebase-adminsdk-fbsvc-b22e70c071.json");

initializeApp({
  credential: cert(serviceAccount),
});

module.exports = admin;