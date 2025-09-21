const mysql = require('mysql2/promise')

const createDataBase = async () =>
{
    try{
        const connection = await mysql.createConnection({
            host:'localhost',
            user:'root',
            password:'L4i0n_f4k3007'
        })
        await connection.query('CREATE DATABASE IF NOT EXISTS restaurant_app;')
        console.log('La base de datos se creo o ya existia')
        await connection.end()
    } catch (error) {
        console.error('Error al crear la base de datos:', error.message);
    }
} 

createDataBase();