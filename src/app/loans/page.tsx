'use client'
import { useState, useEffect } from 'react'
import { Plus, CreditCard, Calendar, AlertCircle, Calculator } from 'lucide-react'
import { getFinanceData, updateUserProfile } from '@/lib/dataManager'

interface Loan {
  id: string
  name: string
  type: 'home' | 'car' | 'personal' | 'education' | 'credit_card'
  principal: number
  currentBalance: number
  interestRate: number
  emi: number
  startDate: string
  endDate: string
  nextDueDate: string
}

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'personal' as const,
    principal: '',
    interestRate: '',
    tenure: '',
    startDate: new Date().toISOString().split('T')[0]
  })

  const loanTypes = [
    { value: 'home', label: 'Home Loan', icon: '🏠' },
    { value: 'car', label: 'Car Loan', icon: '🚗' },
    { value: 'personal', label: 'Personal Loan', icon: '💳' },
    { value: 'education', label: 'Education Loan', icon: '🎓' },
    { value: 'credit_card', label: 'Credit Card', icon: '💳' }
  ]

  useEffect(() => {
    const data = getFinanceData()
    const mockLoans = data.user.loans || [
      {
        id: '1',
        name: 'Home Loan - SBI',
        type: 'home' as const,
        principal: 2500000,
        currentBalance: 2200000,
        interestRate: 8.5,
        emi: 23000,
        startDate: '2023-01-01',
        endDate: '2043-01-01',
        nextDueDate: '2024-12-05'
      }
    ]
    setLoans(mockLoans)
  }, [])

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / (12 * 100)
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                 (Math.pow(1 + monthlyRate, tenure) - 1)
    return Math.round(emi)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const principal = parseFloat(formData.principal)
    const rate = parseFloat(formData.interestRate)
    const tenure = parseInt(formData.tenure) * 12 // Convert years to months
    const emi = calculateEMI(principal, rate, tenure)
    
    const endDate = new Date(formData.startDate)
    endDate.setMonth(endDate.getMonth() + tenure)
    
    const nextDue = new Date()
    nextDue.setMonth(nextDue.getMonth() + 1)
    nextDue.setDate(5) // Assume 5th of every month
    
    const newLoan: Loan = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      principal,
      currentBalance: principal,
      interestRate: rate,
      emi,
      startDate: formData.startDate,
      endDate: endDate.toISOString().split('T')[0],
      nextDueDate: nextDue.toISOString().split('T')[0]
    }
    
    const updatedLoans = [newLoan, ...loans]
    setLoans(updatedLoans)
    updateUserProfile({ loans: updatedLoans })
    
    setFormData({
      name: '',
      type: 'personal',
      principal: '',
      interestRate: '',
      tenure: '',
      startDate: new Date().toISOString().split('T')[0]
    })
    setShowForm(false)
  }

  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.currentBalance, 0)
  const totalEMI = loans.reduce((sum, loan) => sum + loan.emi, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-normal text-gray-900 mb-2">Loans & EMIs</h1>
            <p className="text-gray-600">Manage your loans and track payments</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCalculator(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              EMI Calculator
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Loan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-red-50 p-3 rounded-full mr-4">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Outstanding</p>
                <p className="text-2xl font-normal text-gray-900">₹{totalOutstanding.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-orange-50 p-3 rounded-full mr-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Monthly EMI</p>
                <p className="text-2xl font-normal text-gray-900">₹{totalEMI.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Loan</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loan Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Home Loan - SBI"
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
                      {loanTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Principal Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.principal}
                      onChange={(e) => setFormData({...formData, principal: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter loan amount"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 8.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (Years)</label>
                    <input
                      type="number"
                      value={formData.tenure}
                      onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 20"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Add Loan
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
          {loans.map((loan) => {
            const typeInfo = loanTypes.find(t => t.value === loan.type)
            const paidAmount = loan.principal - loan.currentBalance
            const progressPercent = (paidAmount / loan.principal) * 100
            const isOverdue = new Date(loan.nextDueDate) < new Date()
            
            return (
              <div key={loan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{typeInfo?.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">{loan.name}</h3>
                      <p className="text-sm text-gray-600">{typeInfo?.label} • {loan.interestRate}% p.a.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">₹{loan.emi.toLocaleString()}/month</p>
                    <p className={`text-sm flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                      <Calendar className="w-4 h-4" />
                      Next: {new Date(loan.nextDueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Outstanding: ₹{loan.currentBalance.toLocaleString()}</span>
                    <span>Paid: {progressPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
                
                {isOverdue && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Payment overdue! Please make your EMI payment.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {loans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No loans tracked</h3>
            <p className="text-gray-600">Add your loans to track EMIs and payments</p>
          </div>
        )}
      </div>
    </div>
  )
}