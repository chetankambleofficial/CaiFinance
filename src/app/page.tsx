'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      router.push('/dashboard')
    } else {
      router.push('/auth')
    }
  }, [router])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          CAI Finance
        </h1>
        <p className="text-gray-400">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}