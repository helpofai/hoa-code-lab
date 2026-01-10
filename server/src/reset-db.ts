import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function reset() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "hoa-code-lab",
    password: process.env.DB_PASSWORD || "hoa-code-lab",
    database: process.env.DB_NAME || "hoa-code-lab",
  });

  await connection.query("DROP TABLE IF EXISTS projects");
  await connection.query("DROP TABLE IF EXISTS users");
  await connection.query("DROP TABLE IF EXISTS __drizzle_migrations");

  console.log("Database reset complete.");
  await connection.end();
}

reset().catch(console.error);
