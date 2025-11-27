'use client'
import { useState, useEffect } from 'react'
import { User, DollarSign, Globe, Bell, Shield } from 'lucide-react'
import { getFinanceData, updateFinanceData } from '@/lib/dataManager'

export default function Settings() {
  const [salary, setSalary] = useState('25000')
  const [rent, setRent] = useState('8000')
  const [language, setLanguage] = useState('English')
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    const data = getFinanceData()
    setSalary(data.user.monthlyIncome.toString())
    setRent(data.user.monthlyRent.toString())
    setLanguage(data.user.language)
    setNotifications(data.user.notifications)
  }, [])

  const handleSalaryUpdate = () => {
    updateFinanceData({ 
      user: { 
        ...getFinanceData().user, 
        monthlyIncome: parseInt(salary) 
      } 
    })
    alert('Salary updated successfully!')
  }

  const handleRentUpdate = () => {
    updateFinanceData({ 
      user: { 
        ...getFinanceData().user, 
        monthlyRent: parseInt(rent) 
      } 
    })
    alert('Rent updated successfully!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Settings
        </h1>

        {/* Salary Setting */}
        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 text-green-400 mr-3" />
            <h2 className="text-xl font-bold text-green-400">Monthly Salary</h2>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Enter your monthly income (₹)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-lg focus:border-green-400 focus:outline-none"
                placeholder="25000"
              />
            </div>
            <button
              onClick={handleSalaryUpdate}
              className="bg-green-500/20 border border-green-500/30 rounded-lg px-6 py-3 hover:bg-green-500/30 transition-all"
            >
              Update
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">This helps AI provide better financial advice</p>
        </div>

        {/* Rent Setting */}
        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <User className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-xl font-bold text-purple-400">Monthly Rent</h2>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Enter your monthly rent/PG (₹)</label>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-lg focus:border-purple-400 focus:outline-none"
                placeholder="8000"
              />
            </div>
            <button
              onClick={handleRentUpdate}
              className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-6 py-3 hover:bg-purple-500/30 transition-all"
            >
              Update
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">Helps calculate your housing expense ratio</p>
        </div>

        {/* Language Setting */}
        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <Globe className="w-6 h-6 text-blue-400 mr-3" />
            <h2 className="text-xl font-bold text-blue-400">Language</h2>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 focus:border-blue-400 focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी</option>
            <option value="Marathi">मराठी</option>
            <option value="Tamil">தமிழ்</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-6 h-6 text-yellow-400 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-yellow-400">Budget Alerts</h2>
                <p className="text-sm text-gray-400">Get notified when you exceed budget limits</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-all ${
                notifications ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                notifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}