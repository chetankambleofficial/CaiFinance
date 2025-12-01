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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-normal text-gray-900 mb-2">Expenses</h1>
            <p className="text-gray-600">Track your daily spending</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-red-50 p-3 rounded-full mr-4">
              <Wallet className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total This Month</p>
              <p className="text-2xl font-normal text-gray-900">₹{totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingId ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={formData.paymentType}
                      onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {paymentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={formData.note}
                      onChange={(e) => setFormData({...formData, note: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="What did you buy?"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
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
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Tag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">₹{expense.amount.toLocaleString()}</h3>
                    <p className="text-sm text-gray-600">{expense.category} • {expense.paymentType}</p>
                    <p className="text-sm text-gray-500">{expense.note || 'No description'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-4">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleEdit(expense)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      
        {expenses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
            <p className="text-gray-600">Start tracking your expenses by adding your first entry</p>
          </div>
        )}
      </div>
    </div>
  )
}