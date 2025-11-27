'use client'
import { useState } from 'react'
import { User, Mail, Lock } from 'lucide-react'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password)
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user))
        window.location.href = '/dashboard'
      } else {
        alert('Invalid credentials')
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userExists = users.find((u: any) => u.email === formData.email)
      
      if (userExists) {
        alert('User already exists')
        return
      }
      
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password
      }
      
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      
      const userData = {
        user: { monthlyIncome: 25000, monthlyRent: 8000, language: 'English', notifications: true },
        expenses: [],
        goals: []
      }
      localStorage.setItem(`financeData_${newUser.id}`, JSON.stringify(userData))
      
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            CAI Finance
          </h1>
          <p className="text-gray-400">Your Personal Finance Manager</p>
        </div>

        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-6">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                isLogin ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-400'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                !isLogin ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:border-green-400 focus:outline-none"
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:border-green-400 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:border-green-400 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500/20 border border-green-500/30 rounded-lg py-3 hover:bg-green-500/30 transition-all font-semibold"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}