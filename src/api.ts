import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export interface Expense {
  id?: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export const getExpenses = () => api.get<Expense[]>('/expenses');
export const addExpense = (expense: Expense) => api.post<Expense>('/expenses', expense);
export const updateExpense = (id: number, expense: Expense) => api.put<Expense>(`/expenses/${id}`, expense);
export const deleteExpense = (id: number) => api.delete(`/expenses/${id}`);

export default api;
