const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function createSettingsTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('Creating settings table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY DEFAULT 1,
        hero_title VARCHAR(255) DEFAULT 'Build, test, and discover code.',
        hero_subtitle TEXT,
        accent_color VARCHAR(50) DEFAULT '#3b82f6',
        success_color VARCHAR(50) DEFAULT '#47cf73',
        danger_color VARCHAR(50) DEFAULT '#ef4444',
        copyright_text VARCHAR(255) DEFAULT '© 2025 CodePen Clone. All rights reserved.',
        github_url VARCHAR(255),
        twitter_url VARCHAR(255),
        youtube_url VARCHAR(255)
      )
    `);

    // Insert default row if not exists
    await connection.query('INSERT IGNORE INTO settings (id) VALUES (1)');

    console.log('✅ Settings table initialized!');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createSettingsTable();
