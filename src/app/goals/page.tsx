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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Savings Goals
            </h1>
            <p className="text-gray-400">Track your financial goals and progress</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-6 py-3 hover:bg-purple-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Goal
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal.savedAmount, goal.targetAmount)
            const daysRemaining = getDaysRemaining(goal.targetDate)
            const availableSavings = monthlyIncome - totalExpenses
            const monthlyTarget = Math.ceil((goal.targetAmount - goal.savedAmount) / Math.max(daysRemaining / 30, 1))
            const canAfford = availableSavings >= monthlyTarget

            return (
              <div key={goal.id} className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                    {goal.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{goal.name}</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-purple-400">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Saved:</span>
                    <span className="text-green-400">₹{goal.savedAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target:</span>
                    <span className="text-blue-400">₹{goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Remaining:</span>
                    <span className="text-red-400">₹{(goal.targetAmount - goal.savedAmount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                    </div>
                    <div className={canAfford ? 'text-green-400' : 'text-red-400'}>
                      ₹{monthlyTarget}/month
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Available savings: ₹{availableSavings}/month
                    {!canAfford && <span className="text-red-400 ml-2">⚠️ Insufficient funds</span>}
                  </div>
                </div>

                <button className="w-full mt-4 bg-purple-500/20 border border-purple-500/30 rounded-lg py-2 hover:bg-purple-500/30 transition-all">
                  Add Money
                </button>
              </div>
            )
          })}
        </div>

        {/* Add Goal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black/80 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4 text-purple-400">Add New Goal</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Goal Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-400 focus:outline-none"
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-400 focus:outline-none"
                    placeholder="50000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Date</label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-400 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-500/20 border border-purple-500/30 rounded-lg py-2 hover:bg-purple-500/30 transition-all"
                  >
                    Create Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-500/20 border border-gray-500/30 rounded-lg py-2 hover:bg-gray-500/30 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        <div className="mt-8 bg-black/40 backdrop-blur-lg border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-blue-400 mr-2" />
            <h3 className="text-xl font-bold text-blue-400">AI Goal Suggestions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm">💡 <strong>Income Analysis:</strong> With ₹{monthlyIncome.toLocaleString()} monthly income and ₹{totalExpenses.toLocaleString()} expenses, you have ₹{(monthlyIncome - totalExpenses).toLocaleString()} available for goals.</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-sm">✅ <strong>Smart Tip:</strong> {monthlyIncome - totalExpenses > 5000 ? 'Great! You have good savings potential.' : 'Consider reducing expenses to increase goal savings.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}