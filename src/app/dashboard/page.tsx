'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Wallet, Plus, Target, Download, TrendingUp, Brain, CheckCircle } from 'lucide-react'
import { getFinanceData } from '@/lib/dataManager'
import { analyzeSpending, generateAdvice } from '@/lib/aiLogic'

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [expenses, setExpenses] = useState([
    { name: 'Food', value: 3400, color: '#4285f4' },
    { name: 'Transport', value: 1200, color: '#34a853' },
    { name: 'Bills', value: 2800, color: '#fbbc04' },
    { name: 'Rent', value: 8000, color: '#ea4335' }
  ])

  const [monthlyIncome, setMonthlyIncome] = useState(25000)
  const [monthlyRent, setMonthlyRent] = useState(8000)
  const [aiInsights, setAiInsights] = useState<any>(null)

  const loadData = () => {
    const data = getFinanceData()
    setMonthlyIncome(data.user.monthlyIncome)
    setMonthlyRent(data.user.monthlyRent)
    
    const categoryTotals = data.expenses.reduce((acc: any, exp: any) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {})
    
    const chartData = Object.entries(categoryTotals).map(([name, value], index) => ({
      name,
      value: value as number,
      color: ['#4285f4', '#34a853', '#fbbc04', '#ea4335'][index % 4]
    }))
    
    chartData.push({ name: 'Rent', value: data.user.monthlyRent, color: '#ea4335' })
    setExpenses(chartData)
    
    // Generate AI insights
    const analysis = analyzeSpending(data.expenses, data.user.monthlyIncome, data.user.monthlyRent)
    const advice = generateAdvice(analysis)
    setAiInsights({ analysis, advice })
  }

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0)
  const savings = monthlyIncome - totalExpenses

  const downloadReport = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('CAI Finance Report', 20, 30)
    doc.setFontSize(12)
    doc.text(`Income: Rs.${monthlyIncome.toLocaleString()}`, 20, 50)
    doc.text(`Expenses: Rs.${totalExpenses.toLocaleString()}`, 20, 60)
    doc.text(`Savings: Rs.${savings.toLocaleString()}`, 20, 70)
    doc.save(`finance-report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-normal text-gray-900 mb-2">Finance Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your money with AI insights</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-50 p-3 rounded-full mr-4">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Monthly Income</p>
                <p className="text-2xl font-normal text-gray-900">₹{monthlyIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-red-50 p-3 rounded-full mr-4">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Expenses</p>
                <p className="text-2xl font-normal text-gray-900">₹{totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-full mr-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Net Savings</p>
                <p className="text-2xl font-normal text-gray-900">₹{savings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Chart & AI Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-medium text-gray-900 mb-6">Monthly Expense Breakdown</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenses} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                    labelStyle={{ color: '#333' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Tips */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-50 p-2 rounded-lg mr-3">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">AI Money Tips</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <h4 className="font-medium text-green-800 mb-1">💡 Smart Saving</h4>
                <p className="text-sm text-green-700">Try the 50-30-20 rule: 50% needs, 30% wants, 20% savings</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-medium text-blue-800 mb-1">📊 Expense Insight</h4>
                <p className="text-sm text-blue-700">Your highest expense is {expenses.length > 0 ? expenses.reduce((max, exp) => exp.value > max.value ? exp : max).name : 'N/A'}. Consider optimizing this category.</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <h4 className="font-medium text-purple-800 mb-1">🎯 Goal Setting</h4>
                <p className="text-sm text-purple-700">Set up automatic transfers to savings accounts to build wealth consistently</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-medium text-orange-800 mb-1">⚠️ Budget Alert</h4>
                <p className="text-sm text-orange-700">Track daily expenses to identify small spending leaks in your budget</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Financial Insights */}
        {aiInsights && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <Brain className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-medium text-gray-900">AI Financial Analysis</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Spending Analysis */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Spending Insights</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💰</span>
                      <div>
                        <p className="font-medium text-gray-900">Savings Rate</p>
                        <p className="text-sm text-gray-600">{aiInsights.analysis.savingsRate}% of income</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📈</span>
                      <div>
                        <p className="font-medium text-gray-900">Top Expense Category</p>
                        <p className="text-sm text-gray-600">{aiInsights.analysis.highestCategory}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Recommendations */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h4>
                <div className="space-y-3">
                  {aiInsights.advice.slice(0, 3).map((tip: string, index: number) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Financial Health Score */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Financial Health Score</h4>
                  <p className="text-sm text-gray-600">Based on your spending and savings patterns</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-medium text-blue-600">{aiInsights.analysis.healthScore}/10</div>
                  <p className="text-sm text-gray-600">
                    {aiInsights.analysis.healthScore >= 7 ? '🟢 Excellent' : 
                     aiInsights.analysis.healthScore >= 5 ? '🟡 Good' : '🔴 Needs Improvement'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <a href="/expenses" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow group">
            <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-100 transition-colors">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <span className="font-medium text-gray-900">Add Expense</span>
          </a>
          
          <a href="/goals" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow group">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Set Goals</span>
          </a>
          
          <a href="/ai-advice" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow group">
            <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-100 transition-colors">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <span className="font-medium text-gray-900">AI Advisor</span>
          </a>
          
          <button onClick={downloadReport} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow group">
            <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-100 transition-colors">
              <Download className="w-6 h-6 text-orange-600" />
            </div>
            <span className="font-medium text-gray-900">Download Report</span>
          </button>
        </div>
      </div>
    </div>
  )
}