const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function updateSchemaV2() {
  try {
    console.log('Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('Updating pens table schema...');
    
    // Add 'structure' column for virtual folder system (JSON)
    const [cols1] = await connection.query("SHOW COLUMNS FROM pens LIKE 'structure'");
    if (cols1.length === 0) {
      await connection.query("ALTER TABLE pens ADD COLUMN structure JSON DEFAULT NULL AFTER js");
      console.log('✅ Added "structure" column (JSON).');
    }

    // Add 'thumbnail' column for saving a snapshot URL or Base64 string
    const [cols2] = await connection.query("SHOW COLUMNS FROM pens LIKE 'thumbnail'");
    if (cols2.length === 0) {
      await connection.query("ALTER TABLE pens ADD COLUMN thumbnail LONGTEXT DEFAULT NULL AFTER structure");
      console.log('✅ Added "thumbnail" column (LONGTEXT).');
    }

    console.log('Schema update complete.');
    await connection.end();
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    process.exit(1);
  }
}

updateSchemaV2();
