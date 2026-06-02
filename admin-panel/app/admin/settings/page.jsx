'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      router.push('/admin/login')
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setMessage({ text: '', type: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' })
      return
    }
    
    if (formData.newPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' })
      return
    }
    
    setLoading(true)
    
    // Simulate password change (in production, this would call an API)
    setTimeout(() => {
      // Store new password in localStorage (temporary solution)
      localStorage.setItem('admin_password', formData.newPassword)
      setMessage({ text: 'Password changed successfully! Please login again.', type: 'success' })
      
      setTimeout(() => {
        localStorage.removeItem('admin_logged_in')
        router.push('/admin/login')
      }, 2000)
    }, 1000)
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="text-[#B3945B] hover:text-[#E8C870] transition"
            >
              ← BACK
            </button>
            <div className="w-16 h-px bg-[#B3945B] flex-1"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#E8C870] to-[#B3945B] bg-clip-text text-transparent">
            CHANGE PASSWORD
          </h1>
          <p className="text-gray-500 mt-1">Update your admin credentials</p>
        </div>

        {/* Change Password Form */}
        <div className="bg-[#1A1A1A] rounded-xl border border-[#B3945B]/20 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#B3945B] text-sm mb-2">CURRENT PASSWORD</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
                required
              />
            </div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2">NEW PASSWORD</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
                required
              />
              <p className="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2">CONFIRM NEW PASSWORD</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
                required
              />
            </div>

            {message.text && (
              <div className={`p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500 text-green-400'
                  : 'bg-red-500/20 border border-red-500 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-[#0A0A0A] font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#B3945B]/20">
            <p className="text-gray-500 text-xs text-center">
              For security, you will be logged out after changing your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}