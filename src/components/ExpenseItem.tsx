import React from 'react';
import { Expense } from '../api';
import { Pencil, Trash2, Utensils, Car, ShoppingBag, Film, FileText, HeartPulse, Plane, MoreHorizontal } from 'lucide-react';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Food & Dining': return <Utensils size={18} />;
    case 'Transport': return <Car size={18} />;
    case 'Shopping': return <ShoppingBag size={18} />;
    case 'Entertainment': return <Film size={18} />;
    case 'Bills & Utilities': return <FileText size={18} />;
    case 'Health': return <HeartPulse size={18} />;
    case 'Travel': return <Plane size={18} />;
    default: return <MoreHorizontal size={18} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Food & Dining': return 'bg-orange-100 text-orange-600';
    case 'Transport': return 'bg-blue-100 text-blue-600';
    case 'Shopping': return 'bg-pink-100 text-pink-600';
    case 'Entertainment': return 'bg-purple-100 text-purple-600';
    case 'Bills & Utilities': return 'bg-cyan-100 text-cyan-600';
    case 'Health': return 'bg-red-100 text-red-600';
    case 'Travel': return 'bg-emerald-100 text-emerald-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  return (
    <div className="group bg-white p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${getCategoryColor(expense.category)}`}>
          {getCategoryIcon(expense.category)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{expense.description || expense.category}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{expense.category}</span>
            <span>•</span>
            <span>{new Date(expense.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-lg font-bold text-gray-900">
          ${expense.amount.toFixed(2)}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => expense.id && onDelete(expense.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
