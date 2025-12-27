const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function syncSchema() {
  try {
    console.log('Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    const columnsToAdd = [
      { name: 'views', type: 'INT DEFAULT 0', after: 'thumbnail' },
      { name: 'likes', type: 'INT DEFAULT 0', after: 'views' },
      { name: 'shares', type: 'INT DEFAULT 0', after: 'likes' }
    ];

    for (const col of columnsToAdd) {
      const [exists] = await connection.query(`SHOW COLUMNS FROM pens LIKE '${col.name}'`);
      if (exists.length === 0) {
        console.log(`Adding missing column: ${col.name}...`);
        // We try to add it at the end if the "after" column is also missing
        try {
          await connection.query(`ALTER TABLE pens ADD COLUMN ${col.name} ${col.type} AFTER ${col.after}`);
        } catch (e) {
          await connection.query(`ALTER TABLE pens ADD COLUMN ${col.name} ${col.type}`);
        }
        console.log(`✅ ${col.name} added.`);
      } else {
        console.log(`ℹ️  ${col.name} already exists.`);
      }
    }

    console.log('🏁 Database schema is now in sync!');
    await connection.end();
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

syncSchema();
