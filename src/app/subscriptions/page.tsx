'use client'
import { useState, useEffect } from 'react'
import { Plus, Calendar, AlertTriangle, Repeat, X } from 'lucide-react'
import { getFinanceData, updateUserProfile } from '@/lib/dataManager'

interface Subscription {
  id: string
  name: string
  amount: number
  billingCycle: 'monthly' | 'yearly' | 'weekly'
  nextBilling: string
  category: string
  isActive: boolean
  autoRenew: boolean
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    billingCycle: 'monthly' as const,
    category: 'Entertainment',
    nextBilling: new Date().toISOString().split('T')[0]
  })

  const categories = ['Entertainment', 'Software', 'News', 'Music', 'Fitness', 'Cloud Storage', 'Other']
  const billingCycles = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ]

  useEffect(() => {
    const data = getFinanceData()
    const mockSubscriptions = data.user.subscriptions || [
      {
        id: '1',
        name: 'Netflix',
        amount: 649,
        billingCycle: 'monthly' as const,
        nextBilling: '2024-12-15',
        category: 'Entertainment',
        isActive: true,
        autoRenew: true
      },
      {
        id: '2',
        name: 'Spotify Premium',
        amount: 119,
        billingCycle: 'monthly' as const,
        nextBilling: '2024-12-20',
        category: 'Music',
        isActive: true,
        autoRenew: true
      }
    ]
    setSubscriptions(mockSubscriptions)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      name: formData.name,
      amount: parseFloat(formData.amount),
      billingCycle: formData.billingCycle,
      nextBilling: formData.nextBilling,
      category: formData.category,
      isActive: true,
      autoRenew: true
    }
    
    const updatedSubscriptions = [newSubscription, ...subscriptions]
    setSubscriptions(updatedSubscriptions)
    updateUserProfile({ subscriptions: updatedSubscriptions })
    
    setFormData({
      name: '',
      amount: '',
      billingCycle: 'monthly',
      category: 'Entertainment',
      nextBilling: new Date().toISOString().split('T')[0]
    })
    setShowForm(false)
  }

  const toggleSubscription = (id: string) => {
    const updatedSubscriptions = subscriptions.map(sub =>
      sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
    )
    setSubscriptions(updatedSubscriptions)
    updateUserProfile({ subscriptions: updatedSubscriptions })
  }

  const deleteSubscription = (id: string) => {
    const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id)
    setSubscriptions(updatedSubscriptions)
    updateUserProfile({ subscriptions: updatedSubscriptions })
  }

  const getMonthlyTotal = () => {
    return subscriptions
      .filter(sub => sub.isActive)
      .reduce((total, sub) => {
        switch (sub.billingCycle) {
          case 'weekly': return total + (sub.amount * 4.33)
          case 'monthly': return total + sub.amount
          case 'yearly': return total + (sub.amount / 12)
          default: return total
        }
      }, 0)
  }

  const getYearlyTotal = () => {
    return subscriptions
      .filter(sub => sub.isActive)
      .reduce((total, sub) => {
        switch (sub.billingCycle) {
          case 'weekly': return total + (sub.amount * 52)
          case 'monthly': return total + (sub.amount * 12)
          case 'yearly': return total + sub.amount
          default: return total
        }
      }, 0)
  }

  const getUpcomingRenewals = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return subscriptions.filter(sub => {
      const renewalDate = new Date(sub.nextBilling)
      return sub.isActive && renewalDate >= today && renewalDate <= nextWeek
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-normal text-gray-900 mb-2">Subscriptions</h1>
            <p className="text-gray-600">Manage your recurring subscriptions</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-full mr-4">
                <Repeat className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Monthly Total</p>
                <p className="text-2xl font-normal text-gray-900">₹{getMonthlyTotal().toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-50 p-3 rounded-full mr-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Yearly Total</p>
                <p className="text-2xl font-normal text-gray-900">₹{getYearlyTotal().toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-50 p-3 rounded-full mr-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Upcoming Renewals</p>
                <p className="text-2xl font-normal text-gray-900">{getUpcomingRenewals().length}</p>
              </div>
            </div>
          </div>
        </div>

        {getUpcomingRenewals().length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-medium text-orange-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Upcoming Renewals (Next 7 Days)
            </h3>
            <div className="space-y-2">
              {getUpcomingRenewals().map(sub => (
                <div key={sub.id} className="flex justify-between items-center text-sm">
                  <span className="text-orange-700">{sub.name}</span>
                  <span className="text-orange-600">₹{sub.amount} on {new Date(sub.nextBilling).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Subscription</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Netflix, Spotify"
                      required
                    />
                  </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({...formData, billingCycle: e.target.value as any})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {billingCycles.map(cycle => (
                        <option key={cycle.value} value={cycle.value}>{cycle.label}</option>
                      ))}
                    </select>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Billing Date</label>
                    <input
                      type="date"
                      value={formData.nextBilling}
                      onChange={(e) => setFormData({...formData, nextBilling: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Add Subscription
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
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${!subscription.isActive ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${subscription.isActive ? 'bg-blue-50' : 'bg-gray-100'}`}>
                    <Repeat className={`w-6 h-6 ${subscription.isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{subscription.name}</h3>
                    <p className="text-sm text-gray-600">{subscription.category} • {subscription.billingCycle}</p>
                    <p className="text-sm text-gray-500">Next: {new Date(subscription.nextBilling).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">₹{subscription.amount}</p>
                    <p className="text-sm text-gray-600">per {subscription.billingCycle.slice(0, -2)}</p>
                  </div>
                  <button
                    onClick={() => toggleSubscription(subscription.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      subscription.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {subscription.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => deleteSubscription(subscription.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions tracked</h3>
            <p className="text-gray-600">Add your recurring subscriptions to track spending</p>
          </div>
        )}
      </div>
    </div>
  )
}