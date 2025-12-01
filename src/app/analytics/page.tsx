'use client'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, Target, AlertCircle, Award } from 'lucide-react'
import { getFinanceData } from '@/lib/dataManager'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('6months')
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const financeData = getFinanceData()
    
    // Generate mock trend data
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const trendData = months.map((month, index) => ({
      month,
      income: 25000 + Math.random() * 5000,
      expenses: 18000 + Math.random() * 4000,
      savings: 7000 + Math.random() * 2000,
      investments: 5000 + Math.random() * 3000
    }))

    // Calculate financial health metrics
    const totalIncome = financeData.user.monthlyIncome * 6
    const totalExpenses = financeData.expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100
    const expenseGrowth = -2.5 // Mock data
    const investmentGrowth = 12.8 // Mock data

    setData({
      trendData,
      metrics: {
        savingsRate,
        expenseGrowth,
        investmentGrowth,
        financialScore: Math.min(100, Math.max(0, 60 + savingsRate))
      }
    })
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  if (!data) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-normal text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Advanced financial insights and predictions</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>

        {/* Financial Health Score */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Financial Health Score</h3>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600">Updated daily</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(data.metrics.financialScore / 100) * 314} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(data.metrics.financialScore)}`}>
                    {Math.round(data.metrics.financialScore)}
                  </div>
                  <div className="text-xs text-gray-500">out of 100</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className={`text-xl font-medium mb-2 ${getScoreColor(data.metrics.financialScore)}`}>
                {getScoreLabel(data.metrics.financialScore)} Financial Health
              </h4>
              <p className="text-gray-600 mb-4">
                Your financial health is based on savings rate, expense management, and investment growth.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Savings Rate: {data.metrics.savingsRate.toFixed(1)}%</span>
                  <span className={data.metrics.savingsRate > 20 ? 'text-green-600' : 'text-yellow-600'}>
                    {data.metrics.savingsRate > 20 ? 'Good' : 'Improve'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expense Control: {Math.abs(data.metrics.expenseGrowth)}% reduction</span>
                  <span className="text-green-600">Excellent</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Investment Growth: {data.metrics.investmentGrowth}%</span>
                  <span className="text-green-600">Strong</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-50 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +{data.metrics.savingsRate.toFixed(1)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{data.metrics.savingsRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Savings Rate</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                -{Math.abs(data.metrics.expenseGrowth)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{Math.abs(data.metrics.expenseGrowth)}%</p>
            <p className="text-sm text-gray-600">Expense Reduction</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-50 p-2 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +{data.metrics.investmentGrowth}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{data.metrics.investmentGrowth}%</p>
            <p className="text-sm text-gray-600">Investment Returns</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-orange-50 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                Stable
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">3.2</p>
            <p className="text-sm text-gray-600">Risk Score</p>
          </div>
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Income vs Expenses Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value?.toLocaleString()}`, '']} />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Savings & Investment Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value?.toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="savings" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="investments" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">AI-Powered Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Positive Trend</h4>
                    <p className="text-sm text-green-700">Your savings rate has improved by 15% over the last 3 months. Keep up the excellent work!</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Goal Progress</h4>
                    <p className="text-sm text-blue-700">You're on track to reach your emergency fund goal 2 months ahead of schedule.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Optimization Opportunity</h4>
                    <p className="text-sm text-yellow-700">Consider increasing your SIP investment by ₹2,000 to maximize tax benefits.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">Spending Pattern</h4>
                    <p className="text-sm text-purple-700">Your weekend spending is 40% higher than weekdays. Consider setting weekend budgets.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}