const pool = require('../db/connection');

class clienteService {
    static async criar({name, cpf, age, income, location}) {
        const [result] = await pool.query(
            'INSERT INTO clientes (nome, cpf, idade, renda, estado) VALUES (?, ?, ?, ?, ?)',
            [name, cpf, age, income, location]
        );
        return { id: result.insertId, nome, cpf, idade, renda, estado };
    }

    static async buscarTodos() {
        const [rows] = await pool.query(
            'SELECT id, nome AS name, cpf, idade AS age, renda AS income, estado AS location FROM clientes',
        );
        return rows;
    }

    static async buscarTodos(id) {
        const [rows] = await pool.query(
            'SELECT id, nome AS name, cpf, idade AS age, renda AS income, estado AS location FROM clientes',
            [id]
        );
        return rows[0] || null;
    }

    static async atualizar(id, {name, cpf, age, income, location}) {
        const [result] = await pool.query(
            'UPDATE clientes SET nome = ?, cpf = ?, idade = ?, renda = ?, estado = ? WHERE id = ?',
            [name, cpf, age, income, location, id]
        );
        return result.affectedRows > 0;
    }

    static async deletar(id) {
        const [result] = await pool.query(
            'DELETE FROM clientes WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }
}

module.exports = clienteService;