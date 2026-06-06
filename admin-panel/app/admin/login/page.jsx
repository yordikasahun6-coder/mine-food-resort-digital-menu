'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-[#B3945B]/20 to-[#C4A25A]/20 mb-4">
            <span className="text-3xl">⛏️</span>
          </div>
          <h1 className="text-3xl font-bold text-[#B3945B]">MINE FOOD RESORT</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Access Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/20 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#B3945B] text-sm mb-2 font-medium">USERNAME</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:border-[#B3945B] transition"
                placeholder="owner@food.com"
                required
              />
            </div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2 font-medium">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:border-[#B3945B] transition"
                placeholder="••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#B3945B]/25 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'VERIFYING...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#B3945B]/20 text-center">
            <p className="text-gray-500 text-xs">Secure Admin Access Only</p>
            <p className="text-[#B3945B]/60 text-xs mt-1">owner@food.com / owner@1212</p>
          </div>
        </div>

        {/* KODEXA Brand */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-xs">
            Powered by <span className="text-[#B3945B] font-semibold">KODEXA</span> — Premium Digital Solutions
          </p>
        </div>
      </div>
    </div>
  )
}