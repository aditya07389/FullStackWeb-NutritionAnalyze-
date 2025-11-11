const { Notification } = require('../models');
const { Op } = require('sequelize'); 

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });
    
    const notifications = await Notification.findAll({
      where: { userId: userId },
      order: [['createdAt', 'DESC']], // Show newest first
    });
    res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).send('Server Error');
  }
};


exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });
    
    const count = await Notification.count({
      where: { 
        userId: userId,
        isRead: false // Only count unread
      },
    });
    res.status(200).json({ count: count });
  } catch (err) {
    console.error('Error fetching unread count:', err.message);
    res.status(500).send('Server Error');
  }
};


exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

    const notification = await Notification.findOne({
      where: { id: notificationId, userId: userId }
    });
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();
    res.status(200).json(notification);
  } catch (err) {
    console.error('Error marking as read:', err.message);
    res.status(500).send('Server Error');
  }
};


exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

    await Notification.update(
      { isRead: true }, 
      { 
        where: { 
          userId: userId, 
          isRead: false 
        } 
      } 
    );
    res.status(200).json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error marking all as read:', err.message);
    res.status(500).send('Server Error');
  }
};

