'use client'
import { useState, useEffect } from 'react'
import { Send, Bot, User, Brain } from 'lucide-react'
import { getFinanceData } from '@/lib/dataManager'
import { AIFinancialAdvisor } from '@/lib/aiLogic'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function AIAdvice() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI Financial Advisor. I can help you with budgeting, saving tips, expense analysis, and financial planning. What would you like to know about your finances?',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const data = getFinanceData()
      let aiResponse = ''

      if (inputMessage.toLowerCase().includes('budget')) {
        aiResponse = AIFinancialAdvisor.generatePersonalizedAdvice(data.expenses, data.user.monthlyIncome)
      } else if (inputMessage.toLowerCase().includes('save')) {
        aiResponse = AIFinancialAdvisor.getFinancialTip('savings')
      } else if (inputMessage.toLowerCase().includes('emergency')) {
        aiResponse = AIFinancialAdvisor.getFinancialTip('emergency-fund')
      } else if (inputMessage.toLowerCase().includes('debt')) {
        aiResponse = AIFinancialAdvisor.getFinancialTip('debt')
      } else if (inputMessage.toLowerCase().includes('invest')) {
        aiResponse = AIFinancialAdvisor.getFinancialTip('investment')
      } else {
        aiResponse = `Based on your current financial situation with ₹${data.user.monthlyIncome.toLocaleString()} monthly income, here are some personalized suggestions:\n\n• Track your daily expenses to identify spending patterns\n• Aim to save at least 20% of your income\n• Build an emergency fund covering 3-6 months of expenses\n• Consider investing in SIP for long-term wealth building\n• Review and optimize your monthly subscriptions`
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    'How can I save more money?',
    'Analyze my spending patterns',
    'Help me create a budget',
    'Emergency fund advice',
    'Investment suggestions'
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-normal text-gray-900 mb-2">AI Financial Advisor</h1>
          <p className="text-gray-600">Get personalized financial advice and insights</p>
        </div>

        {/* Quick Questions */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-96">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-blue-600' : 'bg-gray-100'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your finances..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Financial Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">💡 Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Save at least 20% of your income</li>
              <li>• Build an emergency fund first</li>
              <li>• Track every expense for better control</li>
              <li>• Invest in SIP for long-term growth</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">📊 What I Can Help With</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Budget planning and optimization</li>
              <li>• Expense analysis and insights</li>
              <li>• Savings and investment advice</li>
              <li>• Debt management strategies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}