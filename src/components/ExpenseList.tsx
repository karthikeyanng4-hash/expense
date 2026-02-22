import React from 'react';
import { Expense } from '../api';
import ExpenseItem from './ExpenseItem';
import { Inbox } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
          <Inbox size={32} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No expenses yet</h3>
        <p className="text-gray-500 max-w-xs mt-1">
          Start tracking your spending by adding your first expense.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
