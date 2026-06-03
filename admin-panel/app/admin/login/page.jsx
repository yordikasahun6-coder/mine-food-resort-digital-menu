'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (email === 'owner@food.com' && password === 'owner@1212') {
      localStorage.setItem('admin_logged_in', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Invalid credentials')
    }
    setLoading(false)
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
              <label className="block text-[#B3945B] text-sm mb-2 uppercase tracking-wider">USERNAME</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-[#B3945B]/30 rounded-lg text-white focus:outline-none focus:border-[#B3945B] transition"
                placeholder="owner@food.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-[#B3945B] text-sm mb-2 uppercase tracking-wider">PASSWORD</label>
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
              className="w-full bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-300 uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'VERIFYING...' : 'ENTER COMMAND'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#B3945B]/20 text-center">
            <p className="text-gray-600 text-xs uppercase tracking-wider">Credentials</p>
            <p className="text-[#B3945B]/70 text-xs mt-1">owner@food.com / owner@1212</p>
          </div>
        </div>
      </div>
    </div>
  )
}