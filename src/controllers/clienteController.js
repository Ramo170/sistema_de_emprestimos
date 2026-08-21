const clienteService = require('../services/clienteService');
const emprestimoService = require('../services/emprestimoService');

class clienteController{
    static async analisarEmprestimos(req, res) {
        try{
            const { name, cpf, age, income, location } = req.body;

            if (!name || !cpf || !age === undefined || !income === undefined || !location === undefined) {
                return res.status(400).json({message: 'Todos os campos são obrigatórios.'});
            }

            const loans = emprestimoService.avaliarEmpréstimos({ age, income, location });
            
            return res.status(200).json({ customer: name, loans});
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async criar(req, res) {
        try{
            const { name, cpf, age, income, location } = req.body;

            if (!name || !cpf || !age === undefined || !income === undefined || !location) {
                return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.'});
            }
            const cliente = await clienteService.criar({ name, cpf, age, income, location});
            return res.stats(201).json(cliente);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({message: 'CPF já cadastrado.'});
            }
            return res.status(500).json({ error: error.message});
        }
    }

    static async listarTodos(req, res) {
        try {
            const clientes = await clienteService.buscarTodos();
            return res.status(200).json(clientes);
        } catch (error) {
            return res.status(500).json({ error: error.message});
        }
    }

    static async buscarPorId(req, res) {
        try {
            const cliente = await clienteService.buscarPorId(req.params.id);
            if(!cliente) return res.status(404).json({ message: 'Cliente não encontrado.' });
            return res.status(200).json(cliente);
        } catch (error) {
            return res.status(500).json({ error: error.message});
        }
    }

    static async atualizar(req, res) {
        try {
            const atualizar = await clienteService.atualizar(req.params.id, req.body);
            if(!atualizar) return res.status(404).json({ message: 'Cliente não encontrado.' });
            return res.status(200).json({ message: 'Cliente atualizado com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: error.message});
        }
    }

    static async deletar(req, res) {
        try {
            const deletar = await clienteService.atualizar(req.params.id);
            if(!deletar) return res.status(404).json({ message: 'Cliente não encontrado.' });
            return res.status(200).json({ message: 'Cliente removido com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: error.message});
        }
    }
}

module.exports = clienteController