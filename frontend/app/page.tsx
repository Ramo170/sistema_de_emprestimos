'use client';

import { useState, useEffect, ChangeEvent } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sistema-de-emprestimos.onrender.com';

interface Loan {
  type: string;
  interest_rate: number;
}

interface AnalysisResult {
  customer: string;
  loans: Loan[];
}

interface Customer {
  id: number;
  name: string;
  cpf: string;
  age: number;
  income: number;
  location: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    age: '',
    income: '',
    location: ''
  });

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const getPayload = () => ({
    ...formData,
    age: Number(formData.age),
    income: Number(formData.income),
    location: formData.location.toUpperCase()
  });

  const analisarEmprestimos = async () => {
    const payload = getPayload();
    if (!payload.name || !payload.cpf || !payload.age || !payload.income || !payload.location) {
      alert('Preencha todos os campos do formulário!');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/customer-loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao analisar empréstimos');
      setAnalysisResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      alert(message);
    }
  };

  const cadastrarCliente = async () => {
    const payload = getPayload();
    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao cadastrar cliente');
      
      alert('Cliente cadastrado com sucesso!');
      carregarClientes();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      alert(message);
    }
  };

  const carregarClientes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/customers`);
      const data = await res.json();
      if (Array.isArray(data)) setCustomers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar lista de clientes';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const deletarCliente = async (id: number) => {
    if (!confirm('Deseja realmente remover este cliente?')) return;
    try {
      const res = await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao remover cliente');
      carregarClientes();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover cliente';
      alert(message);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">Análise de Empréstimos</h1>
          <p className="text-gray-600 mt-1">Consulte modalidades disponíveis e gerencie seus clientes</p>
        </header>

        {/* Formulário */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Dados do Cliente</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo</label>
              <input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: João da Silva" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPF</label>
              <input type="text" id="cpf" value={formData.cpf} onChange={handleChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123.456.789-00" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Idade</label>
              <input type="number" id="age" value={formData.age} onChange={handleChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: 28" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Renda Mensal (R$)</label>
              <input type="number" step="0.01" id="income" value={formData.income} onChange={handleChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: 3500.00" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Estado (UF)</label>
              <input type="text" id="location" maxLength={2} value={formData.location} onChange={handleChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none uppercase" placeholder="Ex: SP" />
            </div>

            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="button" onClick={analisarEmprestimos} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">
                Analisar Empréstimos
              </button>
              <button type="button" onClick={cadastrarCliente} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition">
                Cadastrar Cliente
              </button>
            </div>
          </form>
        </div>

        {/* Resultados */}
        {analysisResult && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Resultado para: <span className="text-blue-600">{analysisResult.customer}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {analysisResult.loans.length === 0 ? (
                <p className="text-gray-500 col-span-3">Nenhuma modalidade disponível para este perfil.</p>
              ) : (
                analysisResult.loans.map((loan: Loan, idx: number) => (
                  <div key={idx} className="border rounded-lg p-4 text-center border-blue-200 bg-blue-50">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Modalidade</span>
                    <h3 className="text-lg font-bold text-gray-800 mt-1">{loan.type}</h3>
                    <p className="text-2xl font-black text-blue-700 mt-2">{loan.interest_rate}% <span className="text-xs font-normal text-gray-500">/mês</span></p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tabela de Clientes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Clientes Cadastrados</h2>
            <button onClick={carregarClientes} className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold py-1 px-3 rounded transition">
              {loading ? 'Carregando...' : 'Atualizar Lista'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-2">ID</th>
                  <th className="p-2">Nome</th>
                  <th className="p-2">CPF</th>
                  <th className="p-2">Idade</th>
                  <th className="p-2">Renda</th>
                  <th className="p-2">UF</th>
                  <th className="p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">Nenhum cliente cadastrado.</td>
                  </tr>
                ) : (
                  customers.map((c: Customer) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{c.id}</td>
                      <td className="p-2 font-medium">{c.name}</td>
                      <td className="p-2">{c.cpf}</td>
                      <td className="p-2">{c.age}</td>
                      <td className="p-2">R$ {Number(c.income).toFixed(2)}</td>
                      <td className="p-2">{c.location}</td>
                      <td className="p-2">
                        <button onClick={() => deletarCliente(c.id)} className="text-red-600 hover:text-red-800 text-sm font-semibold">Excluir</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}