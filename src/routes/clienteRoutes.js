const { Router } = require('express');
const clienteController = require('../controllers/clienteContoller')

const router = Router();

router.post('cliente_emprestimos', clienteController.analisarEmprestimos);
router.post('/clientes', clienteController.criar);
router.get('/clientes', clienteController.listarTodos);
router.get('/clientes/:id', clienteController.buscarPorId);
router.put('/clientes/:id', clienteController.atualizar);
router.delete('/clientes/:id', clienteController.deletar);

module.exports = router;