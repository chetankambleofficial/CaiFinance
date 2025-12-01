'use client'
import { useState, useEffect } from 'react'
import { PiggyBank, AlertTriangle, CheckCircle, Plus, Edit, Trash2 } from 'lucide-react'
import { getFinanceData, updateBudget } from '@/lib/dataManager'

interface BudgetItem {
  category: string
  limit: number
  spent: number
  percentage: number
}

export default function Budget() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ category: 'Food', limit: '' })
  const [editingCategory, setEditingCategory] = useState<string | null>(null)

  const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Other']

  useEffect(() => {
    const data = getFinanceData()
    const expensesByCategory = data.expenses.reduce((acc: any, expense: any) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})

    const budgetData = categories.map(category => {
      const limit = data.user.budgets?.[category] || 0
      const spent = expensesByCategory[category] || 0
      return {
        category,
        limit,
        spent,
        percentage: limit > 0 ? Math.round((spent / limit) * 100) : 0
      }
    }).filter(item => item.limit > 0)

    setBudgets(budgetData)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = getFinanceData()
    const updatedBudgets = { ...data.user.budgets, [formData.category]: parseFloat(formData.limit) }
    updateBudget(updatedBudgets)
    
    // Refresh budgets
    const expensesByCategory = data.expenses.reduce((acc: any, expense: any) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})

    const newBudgetData = categories.map(category => {
      const limit = updatedBudgets[category] || 0
      const spent = expensesByCategory[category] || 0
      return {
        category,
        limit,
        spent,
        percentage: limit > 0 ? Math.round((spent / limit) * 100) : 0
      }
    }).filter(item => item.limit > 0)

    setBudgets(newBudgetData)
    setFormData({ category: 'Food', limit: '' })
    setShowForm(false)
    setEditingCategory(null)
  }

  const handleEdit = (budget: BudgetItem) => {
    setFormData({ category: budget.category, limit: budget.limit.toString() })
    setEditingCategory(budget.category)
    setShowForm(true)
  }

  const handleDelete = (category: string) => {
    const data = getFinanceData()
    const updatedBudgets = { ...data.user.budgets }
    delete updatedBudgets[category]
    updateBudget(updatedBudgets)
    setBudgets(budgets.filter(b => b.category !== category))
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-normal text-gray-900 mb-2">Budget</h1>
            <p className="text-gray-600">Set spending limits for each category</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Set Budget
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-full mr-4">
                <PiggyBank className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Budget</p>
                <p className="text-2xl font-normal text-gray-900">₹{totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-red-50 p-3 rounded-full mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Spent</p>
                <p className="text-2xl font-normal text-gray-900">₹{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-50 p-3 rounded-full mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Remaining</p>
                <p className="text-2xl font-normal text-gray-900">₹{(totalBudget - totalSpent).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingCategory ? 'Edit Budget' : 'Set Budget Limit'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!!editingCategory}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit (₹)</label>
                    <input
                      type="number"
                      value={formData.limit}
                      onChange={(e) => setFormData({...formData, limit: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter budget limit"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      {editingCategory ? 'Update Budget' : 'Set Budget'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingCategory(null)
                        setFormData({ category: 'Food', limit: '' })
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

        {/* Budget List */}
        <div className="space-y-4">
          {budgets.map((budget) => (
            <div key={budget.category} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{budget.category}</h3>
                  <p className="text-sm text-gray-600">
                    ₹{budget.spent.toLocaleString()} of ₹{budget.limit.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    budget.percentage > 100 ? 'bg-red-100 text-red-800' :
                    budget.percentage > 80 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {budget.percentage}%
                  </span>
                  <button 
                    onClick={() => handleEdit(budget)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(budget.category)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    budget.percentage > 100 ? 'bg-red-500' :
                    budget.percentage > 80 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                ></div>
              </div>
              
              {budget.percentage > 100 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Budget exceeded by ₹{(budget.spent - budget.limit).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {budgets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets set</h3>
            <p className="text-gray-600">Create your first budget to start tracking spending limits</p>
          </div>
        )}
      </div>
    </div>
  )
}