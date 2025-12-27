const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from root .env
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const usernameToPromote = process.argv[2];

if (!usernameToPromote) {
  console.error('❌ Please provide a username to promote.');
  console.log('Usage: node src/scripts/promoteAdmin.js <username>');
  process.exit(1);
}

async function promoteUser() {
  try {
    console.log('Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log(`Promoting user "${usernameToPromote}" to admin...`);
    
    const [result] = await connection.execute(
      'UPDATE users SET role = "admin" WHERE username = ?',
      [usernameToPromote]
    );

    if (result.affectedRows === 0) {
      console.log('❌ User not found.');
    } else {
      console.log(`✅ Successfully promoted "${usernameToPromote}" to admin!`);
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error promoting user:', error);
    process.exit(1);
  }
}

promoteUser();
