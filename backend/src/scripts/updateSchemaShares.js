const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function updateSchemaShares() {
  try {
    console.log('Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('Adding shares column to pens table...');
    
    const [columns] = await connection.query("SHOW COLUMNS FROM pens LIKE 'shares'");
    
    if (columns.length === 0) {
      await connection.query("ALTER TABLE pens ADD COLUMN shares INT DEFAULT 0 AFTER likes");
      console.log('✅ Shares column added successfully!');
    } else {
      console.log('ℹ️  Shares column already exists.');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    process.exit(1);
  }
}

updateSchemaShares();
