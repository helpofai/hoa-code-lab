const db = require('../config/db');

const User = {
  create: async (username, email, passwordHash) => {
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return result.insertId;
  },

  findByEmail: async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  findAll: async () => {
    const [rows] = await db.execute('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    return rows;
  },

  delete: async (id) => {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
  }
};

module.exports = User;
