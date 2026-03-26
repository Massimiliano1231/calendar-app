// services/notificationService.js
const Notification = require('../models/Notification');
const User = require('../models/User');

async function sendNotificationToUser(userId, message) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Utente non trovato');
  }

  const notification = new Notification({
    recipient: userId,
    message: message
  });

  await notification.save();
  return notification;
}

module.exports = {
  sendNotificationToUser,
};
