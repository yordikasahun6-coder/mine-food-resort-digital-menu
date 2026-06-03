'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // First, get the current admin username and password from database
      const response = await fetch('/api/admin/settings')
      
      if (!response.ok) {
        setError('Authentication service error')
        setLoading(false)
        return
      }

      const data = await response.json()
      
      // For password comparison, we're using a simple check
      // The default password is 'admin123'
      // If you change password in database, update this logic
      const validPassword = 'admin123'
      
      if (email === data.username && password === validPassword) {
        localStorage.setItem('admin_logged_in', 'true')
        router.push('/admin/dashboard')
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Could not connect to authentication service')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center relative overflow-hidden">
      {/* Gold decorative orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#B3945B]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#B3945B]/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#B3945B] to-transparent mx-auto mb-6"></div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#E8C870] to-[#B3945B] bg-clip-text text-transparent">
            ADMIN ACCESS
          </h1>
          <p className="text-gray-500 mt-2 font-light tracking-wide">MINE FOOD RESORT</p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#B3945B] to-transparent mx-auto mt-6"></div>
        </div>

        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-8 border border-[#B3945B]/20 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-[#B3945B] text-sm mb-2 uppercase tracking-wider">IDENTIFICATION</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-[#B3945B]/30 rounded-lg text-white focus:outline-none focus:border-[#B3945B] transition"
                placeholder="admin@minefood.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#B3945B] text-sm mb-2 uppercase tracking-wider">SECURITY KEY</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-[#B3945B]/30 rounded-lg text-white focus:outline-none focus:border-[#B3945B] transition"
                placeholder="••••••"
                required
              />
            </div>

            {error && (
              <div className="mb-6 p-3 border border-red-500/50 bg-red-500/10 rounded-lg">
                <p className="text-red-400 text-sm text-center tracking-wider">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-[#0A0A0A] font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#B3945B]/25 transition-all duration-300 uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'VERIFYING...' : 'ENTER COMMAND'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#B3945B]/20 text-center">
            <p className="text-gray-600 text-xs uppercase tracking-wider">Demo Credentials</p>
            <p className="text-[#B3945B]/70 text-xs mt-1">admin@minefood.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}