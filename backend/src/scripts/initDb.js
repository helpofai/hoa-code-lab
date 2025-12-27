const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function initDb() {
  try {
    console.log('Connecting to MySQL...');
    // Connect without database selected first to create it if needed
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      multipleStatements: true // Allow executing multiple SQL statements
    });

    console.log('Reading init.sql...');
    const sqlPath = path.join(__dirname, '../../../init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing SQL schema...');
    await connection.query(sql);

    console.log('✅ Database and tables initialized successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDb();
