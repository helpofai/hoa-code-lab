const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function updateSchemaLikes() {
  try {
    console.log('Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('Adding likes column to pens table...');
    
    const [columns] = await connection.query("SHOW COLUMNS FROM pens LIKE 'likes'");
    
    if (columns.length === 0) {
      await connection.query("ALTER TABLE pens ADD COLUMN likes INT DEFAULT 0 AFTER views");
      console.log('✅ Likes column added successfully!');
    } else {
      console.log('ℹ️  Likes column already exists.');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    process.exit(1);
  }
}

updateSchemaLikes();
