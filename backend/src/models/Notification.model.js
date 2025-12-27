const db = require('../config/db');

const Notification = {
  create: async (userId, title, message, type = 'info') => {
    const [result] = await db.execute(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [userId, title, message, type]
    );
    return result.insertId;
  },

  findByUserId: async (userId) => {
    const [rows] = await db.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    return rows;
  },

  markAsRead: async (id, userId) => {
    await db.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  },

  markAllAsRead: async (userId) => {
    await db.execute(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
      [userId]
    );
  },

  delete: async (id, userId) => {
    await db.execute(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  }
};

module.exports = Notification;
