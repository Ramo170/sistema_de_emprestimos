const mysql = require('mysql2/promise');

require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.db_host,
    port: Number(process.env.db_port),
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testarBanco() {
    try {
        const [rows] = await pool.query('SELECT 1 AS teste');
        console.log('✅ Banco conectado:', rows);
    } catch (error) {
        console.error('❌ Erro ao conectar:', error);
    }
}

testarBanco();

module.exports = pool;