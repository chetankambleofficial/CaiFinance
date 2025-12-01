'use client'
import { useState, useEffect } from 'react'
import { Plus, TrendingUp, Calendar, Edit, Trash2, DollarSign } from 'lucide-react'
import { getFinanceData, updateUserProfile } from '@/lib/dataManager'

interface IncomeEntry {
  id: string
  amount: number
  source: string
  date: string
  type: 'salary' | 'freelance' | 'business' | 'investment' | 'other'
}

export default function Income() {
  const [incomes, setIncomes] = useState<IncomeEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    type: 'salary' as const,
    date: new Date().toISOString().split('T')[0]
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const incomeTypes = [
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'business', label: 'Business' },
    { value: 'investment', label: 'Investment' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    const data = getFinanceData()
    setIncomes(data.user.incomes || [])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      const updatedIncomes = incomes.map(income =>
        income.id === editingId
          ? { ...income, ...formData, amount: parseFloat(formData.amount) }
          : income
      )
      setIncomes(updatedIncomes)
      updateUserProfile({ incomes: updatedIncomes })
      setEditingId(null)
    } else {
      const newIncome: IncomeEntry = {
        id: Date.now().toString(),
        amount: parseFloat(formData.amount),
        source: formData.source,
        date: formData.date,
        type: formData.type
      }
      const updatedIncomes = [newIncome, ...incomes]
      setIncomes(updatedIncomes)
      updateUserProfile({ incomes: updatedIncomes })
    }
    
    setFormData({
      amount: '',
      source: '',
      type: 'salary',
      date: new Date().toISOString().split('T')[0]
    })
    setShowForm(false)
  }

  const handleEdit = (income: IncomeEntry) => {
    setFormData({
      amount: income.amount.toString(),
      source: income.source,
      type: income.type,
      date: income.date
    })
    setEditingId(income.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    const updatedIncomes = incomes.filter(income => income.id !== id)
    setIncomes(updatedIncomes)
    updateUserProfile({ incomes: updatedIncomes })
  }

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  const thisMonthIncome = incomes
    .filter(income => new Date(income.date).getMonth() === new Date().getMonth())
    .reduce((sum, income) => sum + income.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-normal text-gray-900 mb-2">Income</h1>
            <p className="text-gray-600">Track your income sources</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-50 p-3 rounded-full mr-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Income</p>
                <p className="text-2xl font-normal text-gray-900">₹{totalIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-full mr-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">This Month</p>
                <p className="text-2xl font-normal text-gray-900">₹{thisMonthIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingId ? 'Edit Income' : 'Add New Income'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <input
                      type="text"
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Company Name, Client Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {incomeTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      {editingId ? 'Update Income' : 'Add Income'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingId(null)
                        setFormData({
                          amount: '',
                          source: '',
                          type: 'salary',
                          date: new Date().toISOString().split('T')[0]
                        })
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

        <div className="space-y-4">
          {incomes.map((income) => (
            <div key={income.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">₹{income.amount.toLocaleString()}</h3>
                    <p className="text-sm text-gray-600">{income.source} • {incomeTypes.find(t => t.value === income.type)?.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-4">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(income.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleEdit(income)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(income.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {incomes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No income entries yet</h3>
            <p className="text-gray-600">Start tracking your income sources</p>
          </div>
        )}
      </div>
    </div>
  )
}