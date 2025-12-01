'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Home, Wallet, Target, Bot, Settings, Menu, X, LogOut, User, DollarSign, PiggyBank, FileText, TrendingUp, BarChart3, CreditCard, Repeat, Activity, ChevronDown } from 'lucide-react'
import { getCurrentUser, logout } from '@/lib/dataManager'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.dropdown-container')) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = '/auth'
  }
  
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    {
      label: 'Transactions',
      icon: Wallet,
      dropdown: [
        { href: '/income', icon: TrendingUp, label: 'Income' },
        { href: '/expenses', icon: Wallet, label: 'Expenses' }
      ]
    },
    {
      label: 'Investments',
      icon: BarChart3,
      dropdown: [
        { href: '/investments', icon: BarChart3, label: 'Portfolio' },
        { href: '/loans', icon: CreditCard, label: 'Loans & EMIs' },
        { href: '/subscriptions', icon: Repeat, label: 'Subscriptions' }
      ]
    },
    {
      label: 'Planning',
      icon: Target,
      dropdown: [
        { href: '/budget', icon: PiggyBank, label: 'Budget' },
        { href: '/goals', icon: Target, label: 'Goals' }
      ]
    },
    {
      label: 'Analytics',
      icon: Activity,
      dropdown: [
        { href: '/reports', icon: FileText, label: 'Reports' },
        { href: '/analytics', icon: Activity, label: 'Analytics' }
      ]
    },
    { href: '/ai-advice', icon: Bot, label: 'AI Advisor' },
    { href: '/settings', icon: Settings, label: 'Settings' }
  ]
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CAI Finance</h1>
              <p className="text-xs text-gray-500 -mt-1">Smart Money Management</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => {
              if (item.dropdown) {
                const isActive = item.dropdown.some(subItem => pathname === subItem.href)
                return (
                  <div key={index} className="relative dropdown-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveDropdown(activeDropdown === item.label ? null : item.label)
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                              pathname === subItem.href
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <subItem.icon className="w-4 h-4" />
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              } else {
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              }
            })}
          </nav>
          
          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Desktop User Menu */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl">
                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Guest User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-2">
              {navItems.map((item, index) => {
                if (item.dropdown) {
                  return (
                    <div key={index}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {item.label}
                      </div>
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-3 px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                            pathname === subItem.href
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <subItem.icon className="w-5 h-5" />
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )
                } else {
                  return (
                    <Link
                      key={item.href}
                      href={item.href!}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        pathname === item.href
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )
                }
              })}
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center px-4 py-3 mb-2 bg-gray-50 rounded-xl">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">{user?.name || 'Guest User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}