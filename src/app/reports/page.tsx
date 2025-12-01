'use client'
import { useState } from 'react'
import { Download, FileText, Calendar, TrendingUp, PieChart } from 'lucide-react'
import { getFinanceData } from '@/lib/dataManager'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts'

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  
  const data = getFinanceData()
  
  // Filter expenses by selected month/year
  const filteredExpenses = data.expenses.filter((expense: any) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear
  })

  // Calculate category-wise spending
  const categoryData = filteredExpenses.reduce((acc: any, expense: any) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const chartData = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount: amount as number
  }))

  const pieData = chartData.map((item, index) => ({
    ...item,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6]
  }))

  const totalExpenses = filteredExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0)
  const avgDaily = totalExpenses / new Date(selectedYear, selectedMonth + 1, 0).getDate()

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const generatePDF = () => {
    const reportContent = `
CAI Finance - Monthly Report
${months[selectedMonth]} ${selectedYear}

SUMMARY
Total Expenses: ₹${totalExpenses.toLocaleString()}
Average Daily Spending: ₹${avgDaily.toFixed(0)}
Number of Transactions: ${filteredExpenses.length}

CATEGORY BREAKDOWN
${chartData.map(item => `${item.category}: ₹${item.amount.toLocaleString()}`).join('\n')}

RECENT TRANSACTIONS
${filteredExpenses.slice(0, 10).map((expense: any) => 
  `${expense.date} - ${expense.category} - ₹${expense.amount} - ${expense.note || 'No description'}`
).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `CAI-Finance-Report-${months[selectedMonth]}-${selectedYear}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-normal text-gray-900 mb-2">Reports</h1>
            <p className="text-gray-600">Analyze your spending patterns</p>
          </div>
          <button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div className="flex gap-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[2023, 2024, 2025].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-full mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Expenses</p>
                <p className="text-2xl font-normal text-gray-900">₹{totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-50 p-3 rounded-full mr-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Daily Average</p>
                <p className="text-2xl font-normal text-gray-900">₹{avgDaily.toFixed(0)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-50 p-3 rounded-full mr-4">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Transactions</p>
                <p className="text-2xl font-normal text-gray-900">{filteredExpenses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Spending</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                  <RechartsPieChart data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="amount">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {filteredExpenses.slice(0, 10).map((expense: any) => (
              <div key={expense.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">₹{expense.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{expense.category} • {expense.note || 'No description'}</p>
                </div>
                <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}