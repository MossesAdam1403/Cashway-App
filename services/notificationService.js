const { sendNotification } = require('../controllers/notificationController');
const Notification = require('../models/Notification');

const notifyCustomer = async (customerId, title, body, type = 'order') => {
  try {
    await Notification.create({
      user: customerId,
      title,
      body,
      type
    });

    await sendNotification(customerId, title, body);

  } catch (error) {
    console.error('Customer notification failed:', error.message);
  }
};

const notifyAgent = async (agentUserId, title, body, type = 'order') => {
  try {
    await Notification.create({
      user: agentUserId,
      title,
      body,
      type
    });

    await sendNotification(agentUserId, title, body);

  } catch (error) {
    console.error('Agent notification failed:', error.message);
  }
};

const notifyAdmin = async (adminUserId, title, body, type = 'system') => {
  try {
    await Notification.create({
      user: adminUserId,
      title,
      body,
      type
    });

    await sendNotification(adminUserId, title, body);

  } catch (error) {
    console.error('Admin notification failed:', error.message);
  }
};

module.exports = {
  notifyCustomer,
  notifyAgent,
  notifyAdmin,
};