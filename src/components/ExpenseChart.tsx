import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense } from '../api';

interface ExpenseChartProps {
  expenses: Expense[];
}

const COLORS = [
  '#6366f1', // indigo-500
  '#f97316', // orange-500
  '#3b82f6', // blue-500
  '#ec4899', // pink-500
  '#a855f7', // purple-500
  '#06b6d4', // cyan-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
];

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const data = expenses.reduce((acc: any[], expense) => {
    const existing = acc.find((item) => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []);

  if (expenses.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[400px]">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
