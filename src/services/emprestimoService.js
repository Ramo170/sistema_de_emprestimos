class emprestimoService{
    static avaliarEmpréstimos({idade, renda, estado}){
        const emprestimos = [];
        const emSP = estado && estado.toUpperCase() === 'SP';

        const elegivelParaPessoalOuGarantido = renda <= 3000 || (renda > 3000 && renda <= 5000 && idade < 30 && emSP);

        if (elegivelParaPessoalOuGarantido) {
            emprestimos.push({tipo: 'Pessoal', taxa_de_juros: 4});
            emprestimos.push({tipo: 'Garantido', taxa_de_juros: 3});
        }

        if (renda >= 5000) {
            emprestimos.push({tipo: 'Consignado', taxa_de_juros: 2});
        }

        return emprestimos;
    }
}

module.exports = emprestimoService;