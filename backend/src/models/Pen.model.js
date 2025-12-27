const db = require('../config/db');

const Pen = {
  create: async (userId, title, html, css, js) => {
    // Create virtual folder structure
    const structure = {
      name: 'root',
      type: 'folder',
      children: [
        { name: 'index.html', type: 'file', content: html, language: 'html' },
        { name: 'style.css', type: 'file', content: css, language: 'css' },
        { name: 'script.js', type: 'file', content: js, language: 'javascript' }
      ]
    };

    const [result] = await db.execute(
      'INSERT INTO pens (user_id, title, html, css, js, structure) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, html, css, js, JSON.stringify(structure)]
    );
    return result.insertId;
  },

  update: async (penId, title, html, css, js) => {
    const structure = {
      name: 'root',
      type: 'folder',
      children: [
        { name: 'index.html', type: 'file', content: html, language: 'html' },
        { name: 'style.css', type: 'file', content: css, language: 'css' },
        { name: 'script.js', type: 'file', content: js, language: 'javascript' }
      ]
    };

    await db.execute(
      'UPDATE pens SET title = ?, html = ?, css = ?, js = ?, structure = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, html, css, js, JSON.stringify(structure), penId]
    );
  },

  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM pens WHERE id = ?', [id]);
    return rows[0];
  },

  findByUserId: async (userId) => {
    const [rows] = await db.execute('SELECT * FROM pens WHERE user_id = ? ORDER BY updated_at DESC', [userId]);
    return rows;
  },

  findAllPublic: async () => {
    const [rows] = await db.execute(`
      SELECT p.*, u.username 
      FROM pens p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY p.updated_at DESC 
      LIMIT 12
    `);
    return rows;
  },

  findAllTopRated: async () => {
    const [rows] = await db.execute(`
      SELECT p.*, u.username 
      FROM pens p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY (p.views + p.likes * 10) DESC 
      LIMIT 12
    `);
    return rows;
  },

  delete: async (id) => {
    await db.execute('DELETE FROM pens WHERE id = ?', [id]);
  },

  incrementViews: async (id) => {
    await db.execute('UPDATE pens SET views = views + 1 WHERE id = ?', [id]);
  },

  toggleLike: async (id) => {
    await db.execute('UPDATE pens SET likes = likes + 1 WHERE id = ?', [id]);
  },

  incrementShares: async (id) => {
    await db.execute('UPDATE pens SET shares = shares + 1 WHERE id = ?', [id]);
  }
};

module.exports = Pen;
