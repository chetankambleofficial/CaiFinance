import financeData from '@/data/financeData.json'

export interface FinanceData {
  user: {
    monthlyIncome: number
    monthlyRent: number
    language: string
    notifications: boolean
  }
  expenses: Array<{
    id: string
    amount: number
    category: string
    date: string
    note: string
    paymentType: string
  }>
  goals: Array<{
    id: string
    name: string
    targetAmount: number
    savedAmount: number
    targetDate: string
    category: string
  }>
}

let data: FinanceData = financeData

export const getFinanceData = (): FinanceData => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  if (!currentUser) return data
  
  const userDataKey = `financeData_${currentUser.id}`
  const localData = localStorage.getItem(userDataKey)
  if (localData) {
    data = JSON.parse(localData)
  }
  return data
}

const saveUserData = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  if (currentUser) {
    const userDataKey = `financeData_${currentUser.id}`
    localStorage.setItem(userDataKey, JSON.stringify(data))
  }
}

export const updateFinanceData = (newData: Partial<FinanceData>) => {
  data = { ...data, ...newData }
  saveUserData()
  return data
}

export const addExpense = (expense: any) => {
  data.expenses.unshift(expense)
  saveUserData()
  return data
}

export const updateExpense = (id: string, updatedExpense: any) => {
  data.expenses = data.expenses.map(exp => 
    exp.id === id ? { ...exp, ...updatedExpense } : exp
  )
  saveUserData()
  return data
}

export const deleteExpense = (id: string) => {
  data.expenses = data.expenses.filter(exp => exp.id !== id)
  saveUserData()
  return data
}