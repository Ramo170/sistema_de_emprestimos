class emprestimoService {
    static avaliarEmprestimos({ age, income, location }) {
        const loans = [];
        const emSP = location && location.toUpperCase() === 'SP';

        // Regra Pessoal e Garantido
        const elegivelParaPessoalOuGarantido = 
            income <= 3000 || (income > 3000 && income <= 5000 && age < 30 && emSP);

        if (elegivelParaPessoalOuGarantido) {
            loans.push({ type: 'PERSONAL', interest_rate: 4 });
            loans.push({ type: 'GUARANTEED', interest_rate: 3 });
        }

        // Regra Consignado
        if (income >= 5000) {
            loans.push({ type: 'CONSIGNMENT', interest_rate: 2 });
        }

        return loans;
    }
}

module.exports = emprestimoService;