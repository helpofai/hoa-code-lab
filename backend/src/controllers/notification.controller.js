const Notification = require('../models/Notification.model');
const User = require('../models/User.model');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findByUserId(req.user.id);
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.markAsRead(req.params.id, req.user.id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Send notification to all users
exports.sendGlobalNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const users = await User.findAll(); 

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found to notify' });
    }

    const promises = users.map(user => 
      Notification.create(user.id, title, message, type)
    );

    await Promise.all(promises);

    res.json({ message: `Notification sent to ${users.length} users` });
  } catch (error) {
    console.error("Broadcast Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
