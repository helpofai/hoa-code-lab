const db = require('../config/db');

const Settings = {
  get: async () => {
    const [rows] = await db.execute('SELECT * FROM settings WHERE id = 1');
    return rows[0];
  },
  update: async (data) => {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    await db.execute(`UPDATE settings SET ${fields} WHERE id = 1`, values);
  }
};

module.exports = Settings;
