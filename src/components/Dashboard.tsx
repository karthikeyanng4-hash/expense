import React, { useState, useEffect } from 'react';
import { Plus, Wallet, TrendingUp, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { Expense, getExpenses, addExpense, updateExpense, deleteExpense } from '../api';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import ExpenseChart from './ExpenseChart';

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await getExpenses();
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load expenses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (expenseData: Expense) => {
    try {
      if (editingExpense?.id) {
        await updateExpense(editingExpense.id, expenseData);
      } else {
        await addExpense(expenseData);
      }
      setIsFormOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      setError('Failed to save expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      setError('Failed to delete expense.');
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const thisMonthSpent = expenses
    .filter(exp => new Date(exp.date).getMonth() === new Date().getMonth())
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Wallet className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">SpendWise</h1>
          </div>
          <button
            onClick={() => {
              setEditingExpense(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={20} />
            <span>Add Expense</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top duration-300">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-gray-500 mb-2">
              <Wallet size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">Total Spent</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">${totalSpent.toFixed(2)}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <TrendingUp size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">This Month</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">${thisMonthSpent.toFixed(2)}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-600 mb-2">
              <Calendar size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">Transactions</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{expenses.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Loading your expenses...</p>
              </div>
            ) : (
              <ExpenseList
                expenses={expenses}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            )}
          </div>

          {/* Chart Section */}
          <div className="space-y-6">
            <ExpenseChart expenses={expenses} />
          </div>
        </div>
      </main>

      {isFormOpen && (
        <ExpenseForm
          onSubmit={handleAddExpense}
          onClose={() => {
            setIsFormOpen(false);
            setEditingExpense(null);
          }}
          initialData={editingExpense}
        />
      )}
    </div>
  );
}
