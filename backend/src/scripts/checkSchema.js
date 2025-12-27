const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function checkSchema() {
  try {
    console.log('Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('Checking columns in "pens" table...');
    const [rows] = await connection.query("SHOW COLUMNS FROM pens");
    console.log(rows.map(row => row.Field));

    await connection.end();
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkSchema();
