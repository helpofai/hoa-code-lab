const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function updateSchema() {
  try {
    console.log('Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('Adding role column to users table...');
    
    // Check if column exists to avoid errors on re-run
    const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'role'");
    
    if (columns.length === 0) {
      await connection.query("ALTER TABLE users ADD COLUMN role ENUM('user', 'paid-user', 'admin') DEFAULT 'user' AFTER email");
      console.log('✅ Role column added successfully!');
    } else {
      console.log('ℹ️  Role column already exists.');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    process.exit(1);
  }
}

updateSchema();
