import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with actual database
let expenses = [
  { id: '1', amount: 250, category: 'Food', date: '2024-01-15', note: 'Lunch', paymentType: 'UPI' },
  { id: '2', amount: 50, category: 'Transport', date: '2024-01-15', note: 'Auto fare', paymentType: 'Cash' }
]

export async function GET() {
  return NextResponse.json({ expenses })
}

export async function POST(request: NextRequest) {
  try {
    const { amount, category, note, paymentType } = await request.json()
    
    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
      note,
      paymentType
    }
    
    expenses.unshift(newExpense)
    
    return NextResponse.json({ expense: newExpense, success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    expenses = expenses.filter(expense => expense.id !== id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 })
  }
}