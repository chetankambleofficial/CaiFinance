'use client'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calendar, Wallet, Tag } from 'lucide-react'

interface Expense {
  id: string
  amount: number
  category: string
  date: string
  note: string
  paymentType: string
}

import { getFinanceData, addExpense, updateExpense, deleteExpense } from '@/lib/dataManager'

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const data = getFinanceData()
    setExpenses(data.expenses as Expense[])
  }, [])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    note: '',
    paymentType: 'UPI'
  })

  const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Medicine', 'Education', 'Entertainment', 'Others']
  const paymentTypes = ['Cash', 'UPI', 'Card', 'Online Banking']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      const updatedData = updateExpense(editingId, {
        amount: parseFloat(formData.amount),
        category: formData.category,
        note: formData.note,
        paymentType: formData.paymentType
      })
      setExpenses(updatedData.expenses as Expense[])
      setEditingId(null)
    } else {
      const newExpense = {
        id: Date.now().toString(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: new Date().toISOString().split('T')[0],
        note: formData.note,
        paymentType: formData.paymentType
      }
      const updatedData = addExpense(newExpense)
      setExpenses(updatedData.expenses as Expense[])
    }
    setFormData({ amount: '', category: 'Food', note: '', paymentType: 'UPI' })
    setShowForm(false)
  }

  const handleEdit = (expense: Expense) => {
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      note: expense.note,
      paymentType: expense.paymentType
    })
    setEditingId(expense.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    const updatedData = deleteExpense(id)
    setExpenses(updatedData.expenses as Expense[])
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Daily Expenses
            </h1>
            <p className="text-gray-400">Track your daily spending</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500/20 border border-green-500/30 rounded-lg px-6 py-3 hover:bg-green-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total This Month</p>
              <p className="text-3xl font-bold text-red-400">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <Wallet className="w-12 h-12 text-red-400" />
          </div>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black/80 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4 text-green-400">{editingId ? 'Edit Expense' : 'Add New Expense'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 focus:border-green-400 focus:outline-none"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 focus:border-green-400 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Type</label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 focus:border-green-400 focus:outline-none"
                  >
                    {paymentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Note</label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 focus:border-green-400 focus:outline-none"
                    placeholder="What did you buy?"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500/20 border border-green-500/30 rounded-lg py-2 hover:bg-green-500/30 transition-all"
                  >
                    {editingId ? 'Update Expense' : 'Add Expense'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      setFormData({ amount: '', category: 'Food', note: '', paymentType: 'UPI' })
                    }}
                    className="flex-1 bg-gray-500/20 border border-gray-500/30 rounded-lg py-2 hover:bg-gray-500/30 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">₹{expense.amount}</h3>
                    <p className="text-gray-400 text-sm">{expense.category} • {expense.paymentType}</p>
                    <p className="text-gray-500 text-xs">{expense.note}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleEdit(expense)}
                    className="p-2 hover:bg-blue-500/20 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4 text-blue-400" />
                  </button>
                  <button 
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}