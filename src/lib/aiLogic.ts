import { Expense, Budget, AIInsight } from '@/types'

// New functions for dashboard AI analysis
export function analyzeSpending(expenses: Expense[], monthlyIncome: number, monthlyRent: number) {
  const categoryTotals = expenses.reduce((acc: any, exp: any) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {})
  
  const totalExpenses = Object.values(categoryTotals).reduce((sum: any, amount: any) => sum + amount, 0) + monthlyRent
  const savings = monthlyIncome - totalExpenses
  const savingsRate = Math.round((savings / monthlyIncome) * 100)
  
  const highestCategory = Object.entries(categoryTotals)
    .sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || 'Rent'
  
  let healthScore = 0
  
  // Savings rate scoring (0-5 points)
  if (savingsRate >= 20) healthScore += 5
  else if (savingsRate >= 15) healthScore += 4
  else if (savingsRate >= 10) healthScore += 3
  else if (savingsRate >= 5) healthScore += 2
  else if (savingsRate >= 0) healthScore += 1
  
  // Food spending control (0-3 points)
  const foodPercentage = (categoryTotals['Food'] || 0) / monthlyIncome * 100
  if (foodPercentage <= 20) healthScore += 3
  else if (foodPercentage <= 25) healthScore += 2
  else if (foodPercentage <= 30) healthScore += 1
  
  // Overall expense control (0-2 points)
  const expenseRatio = totalExpenses / monthlyIncome
  if (expenseRatio <= 0.7) healthScore += 2
  else if (expenseRatio <= 0.8) healthScore += 1
  
  // Ensure minimum score of 1
  healthScore = Math.max(healthScore, 1)
  
  return {
    savingsRate,
    highestCategory,
    healthScore: Math.min(healthScore, 10),
    totalExpenses,
    savings
  }
}

export function generateAdvice(analysis: any): string[] {
  const advice = []
  
  if (analysis.savingsRate < 0) {
    advice.push('⚠️ You are spending more than you earn! Cut expenses immediately.')
  } else if (analysis.savingsRate < 5) {
    advice.push('Your savings rate is very low. Try to save at least 5% of income.')
  } else if (analysis.savingsRate < 10) {
    advice.push('Try to save at least 10% of your income. Start by reducing one small expense daily.')
  } else if (analysis.savingsRate >= 20) {
    advice.push('Excellent savings rate! Consider investing your surplus in SIP or fixed deposits.')
  }
  
  if (analysis.highestCategory === 'Food') {
    advice.push('Food is your biggest expense. Try cooking at home 2 more days per week to save money.')
  }
  
  if (analysis.healthScore <= 4) {
    advice.push('🚨 Your financial health needs urgent attention. Focus on cutting expenses.')
  } else if (analysis.healthScore <= 6) {
    advice.push('Your finances need improvement. Focus on increasing savings rate.')
  }
  
  advice.push('Track daily expenses to identify small spending leaks in your budget.')
  advice.push('Set up automatic savings to build wealth consistently over time.')
  
  return advice
}

export class AIFinancialAdvisor {
  
  // Analyze spending patterns and generate insights
  static analyzeSpending(expenses: Expense[], budget: Budget[], monthlyIncome: number): AIInsight[] {
    const insights: AIInsight[] = []
    
    // Calculate category-wise spending
    const categorySpending = this.getCategorySpending(expenses)
    
    // Check budget overruns
    budget.forEach(budgetItem => {
      const spent = categorySpending[budgetItem.category] || 0
      if (spent > budgetItem.limit) {
        insights.push({
          id: `budget-${budgetItem.category}`,
          userId: expenses[0]?.userId || '',
          type: 'warning',
          title: `Budget Exceeded: ${budgetItem.category}`,
          description: `You have spent ₹${spent} against budget of ₹${budgetItem.limit} in ${budgetItem.category}. Consider reducing expenses in this category.`,
          priority: 'high',
          createdAt: new Date()
        })
      }
    })
    
    // Analyze food spending patterns
    const foodSpending = categorySpending['Food'] || 0
    if (foodSpending > monthlyIncome * 0.3) {
      insights.push({
        id: 'food-advice',
        userId: expenses[0]?.userId || '',
        type: 'advice',
        title: 'High Food Expenses',
        description: `Your food expenses are ${((foodSpending/monthlyIncome)*100).toFixed(0)}% of income. Try cooking at home more often to save ₹${Math.round(foodSpending * 0.2)} monthly.`,
        priority: 'medium',
        createdAt: new Date()
      })
    }
    
    // Transport optimization
    const transportSpending = categorySpending['Transport'] || 0
    if (transportSpending > 2000) {
      insights.push({
        id: 'transport-tip',
        userId: expenses[0]?.userId || '',
        type: 'tip',
        title: 'Transport Savings Opportunity',
        description: `Consider using public transport 2-3 times per week. You could save approximately ₹${Math.round(transportSpending * 0.3)} monthly.`,
        priority: 'low',
        createdAt: new Date()
      })
    }
    
    // Savings achievement
    const totalExpenses = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0)
    const savings = monthlyIncome - totalExpenses
    const savingsRate = (savings / monthlyIncome) * 100
    
    if (savingsRate > 20) {
      insights.push({
        id: 'savings-achievement',
        userId: expenses[0]?.userId || '',
        type: 'achievement',
        title: 'Great Savings Rate!',
        description: `Excellent! You're saving ${savingsRate.toFixed(0)}% of your income. Keep up the good work!`,
        priority: 'low',
        createdAt: new Date()
      })
    }
    
    return insights
  }
  
  // Generate personalized advice based on spending patterns
  static generatePersonalizedAdvice(expenses: Expense[], monthlyIncome: number): string {
    const categorySpending = this.getCategorySpending(expenses)
    const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0)
    const savingsRate = ((monthlyIncome - totalSpending) / monthlyIncome) * 100
    
    let advice = `Based on your spending analysis:\n\n`
    
    // Savings rate feedback
    if (savingsRate < 10) {
      advice += `🚨 Your savings rate is ${savingsRate.toFixed(0)}%. Aim for at least 20% savings.\n\n`
    } else if (savingsRate > 20) {
      advice += `✅ Excellent! You're saving ${savingsRate.toFixed(0)}% of your income.\n\n`
    }
    
    // Category-specific advice
    const sortedCategories = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
    
    advice += `Your top spending categories:\n`
    sortedCategories.forEach(([category, amount], index) => {
      const percentage = ((amount / totalSpending) * 100).toFixed(0)
      advice += `${index + 1}. ${category}: ₹${amount} (${percentage}%)\n`
    })
    
    // Specific recommendations
    advice += `\n💡 Recommendations:\n`
    
    if (categorySpending['Food'] > monthlyIncome * 0.25) {
      advice += `• Reduce food expenses by cooking at home 2 more days per week\n`
    }
    
    if (categorySpending['Transport'] > 1500) {
      advice += `• Use public transport or carpooling to reduce transport costs\n`
    }
    
    if (categorySpending['Entertainment'] > monthlyIncome * 0.1) {
      advice += `• Look for free entertainment options like parks, libraries\n`
    }
    
    advice += `• Set up automatic savings of ₹${Math.round(monthlyIncome * 0.1)} monthly\n`
    advice += `• Track daily expenses to identify small leaks in your budget`
    
    return advice
  }
  
  // Predict future expenses based on patterns
  static predictFutureExpenses(expenses: Expense[]): Record<string, number> {
    const categorySpending = this.getCategorySpending(expenses)
    const predictions: Record<string, number> = {}
    
    // Simple prediction: increase by 5% for inflation
    Object.entries(categorySpending).forEach(([category, amount]) => {
      predictions[category] = Math.round(amount * 1.05)
    })
    
    return predictions
  }
  
  // Create a simple savings plan
  static createSavingsPlan(monthlyIncome: number, currentExpenses: number, goalAmount: number): {
    monthlySavingsNeeded: number
    timeToGoal: number
    suggestions: string[]
  } {
    const currentSavings = monthlyIncome - currentExpenses
    const monthlySavingsNeeded = goalAmount / 12 // Assume 1 year goal
    const additionalSavingsNeeded = monthlySavingsNeeded - currentSavings
    
    const suggestions: string[] = []
    
    if (additionalSavingsNeeded > 0) {
      suggestions.push(`You need to save an additional ₹${Math.round(additionalSavingsNeeded)} monthly`)
      suggestions.push(`Reduce daily expenses by ₹${Math.round(additionalSavingsNeeded / 30)} per day`)
      suggestions.push(`Consider a side income of ₹${Math.round(additionalSavingsNeeded / 2)} monthly`)
    } else {
      suggestions.push(`Great! You can already achieve this goal with current savings rate`)
    }
    
    return {
      monthlySavingsNeeded: Math.round(monthlySavingsNeeded),
      timeToGoal: Math.ceil(goalAmount / Math.max(currentSavings, monthlySavingsNeeded)),
      suggestions
    }
  }
  
  // Helper method to calculate category-wise spending
  private static getCategorySpending(expenses: Expense[]): Record<string, number> {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)
  }
  
  // Generate simple financial literacy content
  static getFinancialTip(topic: string): string {
    const tips: Record<string, string> = {
      'emergency-fund': 'An emergency fund should cover 3-6 months of expenses. Start with ₹1000 and add ₹500 monthly. This protects you from unexpected costs like medical bills or job loss.',
      'budgeting': 'Follow the 50-30-20 rule: 50% for needs (rent, food), 30% for wants (entertainment), 20% for savings. This helps balance your spending and saving.',
      'debt': 'Pay off high-interest debt first (credit cards, personal loans). Make minimum payments on all debts, then put extra money toward the highest interest rate debt.',
      'savings': 'Start small - even ₹10 daily adds up to ₹3,650 yearly. Automate your savings so money is saved before you can spend it.',
      'investment': 'Start investing early, even with small amounts. SIP in mutual funds with ₹500 monthly can grow significantly over 10-20 years due to compound interest.'
    }
    
    return tips[topic] || 'Focus on tracking expenses, reducing unnecessary spending, and saving regularly. Small consistent actions lead to big financial improvements.'
  }
}