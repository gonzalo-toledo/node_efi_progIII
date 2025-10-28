// scripts/create-db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQLDATABASE}\`;`);
    console.log(`Base de datos "${process.env.MYSQLDATABASE}" creada o ya existía.`);
    await connection.end();
  } catch (error) {
    console.error('Error al crear la base de datos:', error.message);
    process.exit(1);
  }
})();
