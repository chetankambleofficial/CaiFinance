'use client'
import { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import { getFinanceData, updateUserProfile } from '@/lib/dataManager'

interface Investment {
  id: string
  name: string
  type: 'stocks' | 'mutual_funds' | 'crypto' | 'bonds' | 'fd'
  amount: number
  currentValue: number
  purchaseDate: string
  quantity: number
  symbol: string
}

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks' as const,
    amount: '',
    quantity: '',
    symbol: ''
  })

  const investmentTypes = [
    { value: 'stocks', label: 'Stocks', icon: '📈' },
    { value: 'mutual_funds', label: 'Mutual Funds', icon: '📊' },
    { value: 'crypto', label: 'Cryptocurrency', icon: '₿' },
    { value: 'bonds', label: 'Bonds', icon: '🏛️' },
    { value: 'fd', label: 'Fixed Deposit', icon: '🏦' }
  ]

  useEffect(() => {
    const data = getFinanceData()
    const mockInvestments = data.user.investments || [
      {
        id: '1',
        name: 'Reliance Industries',
        type: 'stocks' as const,
        amount: 50000,
        currentValue: 55000,
        purchaseDate: '2024-01-15',
        quantity: 20,
        symbol: 'RELIANCE'
      }
    ]
    setInvestments(mockInvestments)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newInvestment: Investment = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      amount: parseFloat(formData.amount),
      currentValue: parseFloat(formData.amount) * (1 + Math.random() * 0.2 - 0.1),
      purchaseDate: new Date().toISOString().split('T')[0],
      quantity: parseFloat(formData.quantity),
      symbol: formData.symbol
    }
    
    const updatedInvestments = [newInvestment, ...investments]
    setInvestments(updatedInvestments)
    updateUserProfile({ investments: updatedInvestments })
    
    setFormData({ name: '', type: 'stocks', amount: '', quantity: '', symbol: '' })
    setShowForm(false)
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalGainLoss = totalCurrentValue - totalInvested

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-normal text-gray-900 mb-2">Investments</h1>
            <p className="text-gray-600">Track your investment portfolio</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Investment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-full mr-4">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Invested</p>
                <p className="text-2xl font-normal text-gray-900">₹{totalInvested.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-50 p-3 rounded-full mr-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Current Value</p>
                <p className="text-2xl font-normal text-gray-900">₹{totalCurrentValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${totalGainLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                {totalGainLoss >= 0 ? 
                  <TrendingUp className="w-6 h-6 text-green-600" /> : 
                  <TrendingDown className="w-6 h-6 text-red-600" />
                }
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">P&L</p>
                <p className={`text-2xl font-normal ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(totalGainLoss).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Investment</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Investment Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Reliance Industries"
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
                      {investmentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Invested (₹)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Number of units/shares"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Add Investment
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

        <div className="space-y-4">
          {investments.map((investment) => {
            const gainLoss = investment.currentValue - investment.amount
            const gainLossPercent = ((gainLoss / investment.amount) * 100)
            const typeInfo = investmentTypes.find(t => t.value === investment.type)
            
            return (
              <div key={investment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{typeInfo?.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">{investment.name}</h3>
                      <p className="text-sm text-gray-600">{typeInfo?.label} • {investment.symbol}</p>
                      <p className="text-sm text-gray-500">{investment.quantity} units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">₹{investment.currentValue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Invested: ₹{investment.amount.toLocaleString()}</p>
                    <p className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {gainLoss >= 0 ? '+' : ''}₹{gainLoss.toLocaleString()} ({gainLossPercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {investments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No investments yet</h3>
            <p className="text-gray-600">Start building your investment portfolio</p>
          </div>
        )}
      </div>
    </div>
  )
}