import { NextRequest, NextResponse } from 'next/server'
import { AIFinancialAdvisor } from '@/lib/aiLogic'

export async function POST(request: NextRequest) {
  try {
    const { expenses, budget, monthlyIncome, question } = await request.json()
    
    if (question) {
      let response = ''
      const lowerQuestion = question.toLowerCase()
      
      if (lowerQuestion.includes('save') || lowerQuestion.includes('money')) {
        response = AIFinancialAdvisor.generatePersonalizedAdvice(expenses, monthlyIncome)
      } else if (lowerQuestion.includes('budget')) {
        response = AIFinancialAdvisor.getFinancialTip('budgeting')
      } else if (lowerQuestion.includes('emergency')) {
        response = AIFinancialAdvisor.getFinancialTip('emergency-fund')
      } else {
        response = 'I can help you with budgeting, saving money, emergency funds, and debt management. What would you like to know?'
      }
      
      return NextResponse.json({ response })
    }
    
    const insights = AIFinancialAdvisor.analyzeSpending(expenses, budget, monthlyIncome)
    const personalizedAdvice = AIFinancialAdvisor.generatePersonalizedAdvice(expenses, monthlyIncome)
    
    return NextResponse.json({
      insights,
      personalizedAdvice,
      success: true
    })
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate AI advice' }, { status: 500 })
  }
}