'use client'
import { useState, useEffect } from 'react'
import { Save, User, DollarSign, Home, Bell, Globe } from 'lucide-react'
import { getFinanceData, updateFinanceData } from '@/lib/dataManager'

export default function Settings() {
  const [formData, setFormData] = useState({
    monthlyIncome: 25000,
    monthlyRent: 8000,
    language: 'English',
    notifications: true
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    const data = getFinanceData()
    setFormData({
      monthlyIncome: data.user.monthlyIncome,
      monthlyRent: data.user.monthlyRent,
      language: data.user.language,
      notifications: data.user.notifications
    })
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      updateFinanceData({
        user: {
          ...formData
        }
      })
      
      setIsSaving(false)
      setSaveMessage('Settings saved successfully!')
      
      setTimeout(() => setSaveMessage(''), 3000)
    }, 1000)
  }

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi']

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-normal text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            {/* Financial Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({...formData, monthlyIncome: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Rent (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({...formData, monthlyRent: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="8000"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-yellow-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Notifications
                      </label>
                      <p className="text-xs text-gray-500">
                        Receive alerts for budget limits and savings goals
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications}
                      onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Account Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">User Account</p>
                    <p className="text-xs text-gray-500">Logged in as Guest User</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data & Privacy</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Export Data</span>
                    <span className="text-xs text-gray-500">Download your financial data</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Clear Data</span>
                    <span className="text-xs text-gray-500">Reset all financial records</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              {saveMessage && (
                <p className="text-sm text-green-600">{saveMessage}</p>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="ml-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">About CAI Finance</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Version 1.0.0</p>
            <p>AI-powered personal finance management for everyone</p>
            <div className="flex gap-4 mt-4">
              <button className="text-blue-600 hover:text-blue-700">Privacy Policy</button>
              <button className="text-blue-600 hover:text-blue-700">Terms of Service</button>
              <button className="text-blue-600 hover:text-blue-700">Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}