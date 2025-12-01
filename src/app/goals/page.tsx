'use client'
import { useState, useEffect } from 'react'
import { Target, Plus, Calendar, TrendingUp } from 'lucide-react'
import { getFinanceData, updateFinanceData } from '@/lib/dataManager'

interface Goal {
  id: string
  name: string
  targetAmount: number
  savedAmount: number
  targetDate: string
  category: string
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [monthlyIncome, setMonthlyIncome] = useState(25000)
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    const data = getFinanceData()
    setGoals(data.goals as Goal[])
    setMonthlyIncome(data.user.monthlyIncome)
    
    const expenseTotal = data.expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)
    setTotalExpenses(expenseTotal + data.user.monthlyRent)
  }, [])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    category: 'Emergency'
  })

  const categories = ['Emergency', 'Electronics', 'Travel', 'Education', 'Health', 'Home', 'Others']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      savedAmount: 0,
      targetDate: formData.targetDate,
      category: formData.category
    }
    setGoals([...goals, newGoal])
    setFormData({ name: '', targetAmount: '', targetDate: '', category: 'Emergency' })
    setShowForm(false)
  }

  const getProgressPercentage = (saved: number, target: number) => {
    return Math.min((saved / target) * 100, 100)
  }

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-normal text-gray-900 mb-2">Savings Goals</h1>
            <p className="text-gray-600">Track your financial goals and progress</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal.savedAmount, goal.targetAmount)
            const daysRemaining = getDaysRemaining(goal.targetDate)
            const availableSavings = monthlyIncome - totalExpenses
            const monthlyTarget = Math.ceil((goal.targetAmount - goal.savedAmount) / Math.max(daysRemaining / 30, 1))
            const canAfford = availableSavings >= monthlyTarget

            return (
              <div key={goal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {goal.category}
                  </span>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-4">{goal.name}</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-blue-600 font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saved:</span>
                    <span className="text-green-600 font-medium">₹{goal.savedAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target:</span>
                    <span className="text-blue-600 font-medium">₹{goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="text-gray-900 font-medium">₹{(goal.targetAmount - goal.savedAmount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                    </div>
                    <div className={canAfford ? 'text-green-600' : 'text-red-600'}>
                      ₹{monthlyTarget}/month
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Available: ₹{availableSavings}/month
                    {!canAfford && <span className="text-red-600 ml-2">⚠️ Insufficient funds</span>}
                  </div>
                </div>

                <button className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg transition-colors">
                  Add Money
                </button>
              </div>
            )
          })}
        </div>

        {/* Add Goal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Goal</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Emergency Fund"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Create Goal
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
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

        {/* AI Suggestions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">AI Goal Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Income Analysis:</strong> With ₹{monthlyIncome.toLocaleString()} monthly income and ₹{totalExpenses.toLocaleString()} expenses, you have ₹{(monthlyIncome - totalExpenses).toLocaleString()} available for goals.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Smart Tip:</strong> {monthlyIncome - totalExpenses > 5000 ? 'Great! You have good savings potential.' : 'Consider reducing expenses to increase goal savings.'}
              </p>
            </div>
          </div>
        </div>

        {goals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set yet</h3>
            <p className="text-gray-600">Start your financial journey by creating your first savings goal</p>
          </div>
        )}
      </div>
    </div>
  )
}