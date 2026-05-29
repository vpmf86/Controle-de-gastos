import React, { useState, useEffect } from 'react';
import { Trash2, Plus, TrendingDown } from 'lucide-react';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('alimentação');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = [
    { name: 'alimentação', color: '#FF6B6B', icon: '🍔' },
    { name: 'transporte', color: '#4ECDC4', icon: '🚗' },
    { name: 'entertainment', color: '#95E1D3', icon: '🎬' },
    { name: 'saúde', color: '#FFD93D', icon: '💊' },
    { name: 'utilidades', color: '#6C5CE7', icon: '💡' },
    { name: 'outro', color: '#A29BFE', icon: '📌' },
  ];

  // Carregar despesas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  // Salvar despesas no localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = () => {
    if (!description || !amount) {
      alert('Por favor, preenchha todos os campos');
      return;
    }

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date,
    };

    setExpenses([newExpense, ...expenses]);
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const getCategoryColor = (cat) => {
    return categories.find(c => c.name === cat)?.color || '#A29BFE';
  };

  const getCategoryIcon = (cat) => {
    return categories.find(c => c.name === cat)?.icon || '📌';
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = categories.map(cat => ({
    name: cat.name,
    total: expenses
      .filter(exp => exp.category === cat.name)
      .reduce((sum, exp) => sum + exp.amount, 0),
    color: cat.color,
    icon: cat.icon,
  }));

  const todayExpenses = expenses
    .filter(exp => exp.date === new Date().toISOString().split('T')[0])
    .reduce((sum, exp) => sum + exp.amount, 0);

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/70 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Rastreador de Despesas</h1>
          </div>
          <p className="text-slate-400">Controle suas despesas diárias e economize mais</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Resumo Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm text-blue-100 mb-1">Total de Hoje</p>
            <p className="text-3xl font-bold">R$ {todayExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm text-purple-100 mb-1">Número de Despesas</p>
            <p className="text-3xl font-bold">{expenses.length}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm text-emerald-100 mb-1">Gasto Total</p>
            <p className="text-3xl font-bold">R$ {totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-xl sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Nova Despesa
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Café com amigos"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400 transition"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>
                        {cat.icon} {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>

                <button
                  onClick={handleAddExpense}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Adicionar Despesa
                </button>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gráfico de Categorias */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Despesas por Categoria</h2>
              <div className="space-y-3">
                {categoryTotals.map(cat => {
                  const percentage = totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0;
                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-slate-300">
                          {cat.icon} {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                        </span>
                        <span className="text-sm font-bold text-white">
                          R$ {cat.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lista de Despesas */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Histórico de Despesas</h2>
              {sortedExpenses.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Nenhuma despesa registrada ainda</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sortedExpenses.map(expense => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">
                            {getCategoryIcon(expense.category)}
                          </span>
                          <div>
                            <p className="text-white font-medium">{expense.description}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(expense.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-emerald-400 font-bold text-lg">
                          R$ {expense.amount.toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
