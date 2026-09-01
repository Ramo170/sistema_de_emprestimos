const { Router } = require('express');
const clienteController = require('../controllers/clienteController')

const router = Router();

router.post('/customer-loans', clienteController.analisarEmprestimos);
router.post('/customers', clienteController.criar);
router.get('/customers', clienteController.listarTodos);
router.get('/customers/:id', clienteController.buscarPorId);
router.get('/customers/loans', clienteController.listarComEmprestimos);
router.put('/customers/:id', clienteController.atualizar);
router.delete('/customers/:id', clienteController.deletar);

module.exports = router;