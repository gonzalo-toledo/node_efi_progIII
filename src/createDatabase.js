const mysql = require('mysql2/promise')

const createDataBase = async () =>
{
    try{
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'L4i0n_f4k3007',
            });
        await connection.query('CREATE DATABASE IF NOT EXISTS restaurant_app;')
        console.log('La base de datos se creo o ya existia')
        await connection.end()
    } catch (error) {
        console.error('Error al crear la base de datos:', error.message);
    }
} 

createDataBase();