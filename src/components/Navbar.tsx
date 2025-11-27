'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Home, Wallet, Target, Bot, FileText, Settings, Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/expenses', icon: Wallet, label: 'Expenses' },
    { href: '/goals', icon: Target, label: 'Goals' },
    { href: '/ai-advice', icon: Bot, label: 'AI Advice' },
    { href: '/reports', icon: FileText, label: 'Reports' },
    { href: '/settings', icon: Settings, label: 'Settings' }
  ]
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            CAI Finance
          </Link>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  pathname === href
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                localStorage.removeItem('currentUser')
                window.location.href = '/auth'
              }}
              className="hidden md:block px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all text-red-400 text-sm"
            >
              Logout
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="block md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="block md:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    pathname === href
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'hover:bg-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={() => {
                  localStorage.removeItem('currentUser')
                  window.location.href = '/auth'
                }}
                className="flex items-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all text-red-400"
              >
                <Settings className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}