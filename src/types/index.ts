export interface User {
  id: string
  name: string
  email: string
  language: string
  monthlyIncome: number
  createdAt: Date
}

export interface Expense {
  id: string
  userId: string
  amount: number
  category: string
  date: string
  note: string
  paymentType: 'Cash' | 'UPI' | 'Card' | 'Online Banking'
  isSynced: boolean
  createdAt: Date
}

export interface Budget {
  id: string
  userId: string
  month: string
  category: string
  limit: number
  spent: number
  createdAt: Date
}

export interface Goal {
  id: string
  userId: string
  goalName: string
  targetAmount: number
  savedAmount: number
  targetDate: string
  createdAt: Date
}

export interface AIInsight {
  id: string
  userId: string
  type: 'advice' | 'warning' | 'achievement' | 'tip'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
}

export interface MonthlyReport {
  id: string
  userId: string
  month: string
  totalIncome: number
  totalExpenses: number
  totalSavings: number
  categoryBreakdown: Record<string, number>
  insights: AIInsight[]
  pdfUrl?: string
  createdAt: Date
}

export type ExpenseCategory = 
  | 'Food' 
  | 'Transport' 
  | 'Bills' 
  | 'Shopping' 
  | 'Medicine' 
  | 'Education' 
  | 'Entertainment' 
  | 'Others'

export type PaymentType = 'Cash' | 'UPI' | 'Card' | 'Online Banking'