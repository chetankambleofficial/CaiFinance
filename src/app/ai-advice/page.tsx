'use client'
import { useState } from 'react'
import { Bot, MessageCircle, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react'

interface AIMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function AIAdvice() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'नमस्ते! I am your AI Financial Advisor. I can help you understand your spending patterns, suggest ways to save money, and teach you about financial planning. How can I help you today?',
      timestamp: new Date()
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const quickQuestions = [
    'How can I save more money?',
    'Where am I overspending?',
    'Help me create a budget',
    'Explain emergency fund',
    'Tips for reducing expenses'
  ]

  const insights = [
    {
      icon: TrendingUp,
      title: 'Spending Pattern',
      description: 'Your food expenses increased by 23% this month. Consider meal planning to reduce costs.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      icon: AlertTriangle,
      title: 'Budget Alert',
      description: 'You have exceeded your transport budget by ₹400. Try using public transport more often.',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10 border-yellow-500/20'
    },
    {
      icon: Lightbulb,
      title: 'Smart Tip',
      description: 'If you reduce daily tea/snacks by ₹20, you can save ₹600 monthly for your emergency fund.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 border-green-500/20'
    },
    {
      icon: Target,
      title: 'Savings Goal',
      description: 'You are 67% towards your ₹5000 emergency fund goal. Keep going!',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20'
    }
  ]

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(message),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('save') || lowerMessage.includes('money')) {
      return 'Here are 3 simple ways to save money: 1) Cook at home 2 more days per week - save ₹800/month. 2) Use public transport instead of auto twice a week - save ₹400/month. 3) Reduce outside snacks by ₹10/day - save ₹300/month. Total potential savings: ₹1500/month!'
    }
    
    if (lowerMessage.includes('budget')) {
      return 'A good budget follows the 50-30-20 rule: 50% for needs (rent, food, bills), 30% for wants (entertainment, shopping), 20% for savings. Based on your ₹25,000 income: Needs: ₹12,500, Wants: ₹7,500, Savings: ₹5,000. Would you like help setting up your budget?'
    }
    
    if (lowerMessage.includes('emergency')) {
      return 'An emergency fund should cover 3-6 months of expenses. For your family, aim for ₹50,000-₹75,000. Start small: save ₹1,000/month. In 5 years, you will have ₹60,000 plus interest. This protects you from unexpected medical bills, job loss, or repairs.'
    }
    
    if (lowerMessage.includes('overspend')) {
      return 'Based on your data, you are overspending on: 1) Food delivery (₹900/month) - try cooking more. 2) Auto rides (₹600/month) - use bus/metro. 3) Impulse shopping (₹500/month) - make a shopping list. These 3 changes can save you ₹2000/month!'
    }
    
    return 'I understand your concern about finances. Remember, small changes make big differences. Focus on tracking every expense, reducing one unnecessary cost per week, and saving even ₹10 daily. Financial discipline is a habit that grows over time. What specific area would you like to improve first?'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            AI Financial Advisor
          </h1>
          <p className="text-gray-400">Get personalized financial advice powered by AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Insights */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4 text-purple-400">Smart Insights</h2>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className={`${insight.bgColor} border rounded-xl p-4`}>
                  <div className="flex items-start gap-3">
                    <insight.icon className={`w-6 h-6 ${insight.color} mt-1`} />
                    <div>
                      <h3 className={`font-semibold ${insight.color} mb-1`}>{insight.title}</h3>
                      <p className="text-sm text-gray-300">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Quick Questions</h3>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="w-full text-left bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 hover:bg-purple-500/20 transition-all text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Financial Advisor</h3>
                  <p className="text-sm text-gray-400">Always here to help</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-purple-500/20 border border-purple-500/30' 
                        : 'bg-gray-800/50 border border-gray-600/30'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                    placeholder="Ask me about your finances..."
                    className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 focus:border-purple-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendMessage(inputMessage)}
                    disabled={isLoading}
                    className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-6 py-2 hover:bg-purple-500/30 transition-all disabled:opacity-50"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}