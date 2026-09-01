const pool = require('../database/connection');

class clienteService {
    static async criar({ name, cpf, age, income, location }) {
        const [result] = await pool.query(
            'INSERT INTO clientes (nome, cpf, idade, renda, estado) VALUES (?, ?, ?, ?, ?)',
            [name, cpf, age, income, location]
        );
        return { id: result.insertId, name, cpf, age, income, location };
    }

    static async buscarTodos() {
        const [rows] = await pool.query(
            'SELECT id, nome AS name, cpf, idade AS age, renda AS income, estado AS location FROM clientes'
        );
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query(
            'SELECT id, nome AS name, cpf, idade AS age, renda AS income, estado AS location FROM clientes WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    static async atualizar(id, { name, cpf, age, income, location }) {
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
        return result.affectedRows > 0;
    }

    static async buscarClientesComEmprestimos() {
    const [rows] = await pool.query(`
        SELECT 
            c.id AS cliente_id,
            c.nome AS name,
            c.cpf,
            c.idade AS age,
            c.renda AS income,
            c.estado AS location,
            e.id AS emprestimo_id,
            e.tipo AS loan_type,
            e.taxa_de_juros AS interest_rate,
            ce.analise_data
        FROM clientes c
        LEFT JOIN cliente_emprestimos ce ON c.id = ce.cliente_id
        LEFT JOIN emprestimos e ON ce.emprestimo_id = e.id
        ORDER BY c.id
    `);

    // Agrupa os empréstimos dentro do cliente correspondente
    const clientesMap = new Map();

    rows.forEach(row => {
        if (!clientesMap.has(row.cliente_id)) {
            clientesMap.set(row.cliente_id, {
                id: row.cliente_id,
                name: row.name,
                cpf: row.cpf,
                age: row.age,
                income: Number(row.income),
                location: row.location,
                loans: []
            });
        }

        if (row.emprestimo_id) {
            clientesMap.get(row.cliente_id).loans.push({
                id: row.emprestimo_id,
                type: row.loan_type,
                interest_rate: row.interest_rate,
                analysis_date: row.analise_data
            });
        }
    });

    return Array.from(clientesMap.values());
    }
}

module.exports = clienteService;