'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [formData, setFormData] = useState({
    currentUsername: '',
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  })

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
    setLoading(true)
    setMessage({ text: '', type: '' })

    // Validate new passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' })
      setLoading(false)
      return
    }

    // Validate new password length
    if (formData.newPassword && formData.newPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' })
      setLoading(false)
      return
    }

    try {
      // In a real app, this would call an API to update credentials
      // For now, save to localStorage
      if (formData.newUsername) {
        localStorage.setItem('admin_username', formData.newUsername)
      }
      if (formData.newPassword) {
        localStorage.setItem('admin_password', formData.newPassword)
      }

      setMessage({ text: 'Settings updated! Please login again.', type: 'success' })
      
      setTimeout(() => {
        localStorage.removeItem('admin_logged_in')
        router.push('/admin/login')
      }, 2000)
    } catch (error) {
      setMessage({ text: 'Failed to update settings', type: 'error' })
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-[#B3945B]">ADMIN SETTINGS</h1>
          <p className="text-gray-500 mt-1">Update your login credentials</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl border border-[#B3945B]/20 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#B3945B] text-sm mb-2">CURRENT USERNAME *</label>
              <input
                type="email"
                name="currentUsername"
                value={formData.currentUsername}
                onChange={handleChange}
                placeholder="Enter current username"
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2">CURRENT PASSWORD *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white"
                required
              />
            </div>

            <div className="border-t border-[#B3945B]/20 my-4"></div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2">NEW USERNAME (Optional)</label>
              <input
                type="email"
                name="newUsername"
                value={formData.newUsername}
                onChange={handleChange}
                placeholder="Enter new username"
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white"
              />
            </div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2">NEW PASSWORD (Optional)</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white"
              />
            </div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2">CONFIRM NEW PASSWORD</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="accent-[#B3945B]"
              />
              <label htmlFor="showPassword" className="text-gray-400 text-sm cursor-pointer">
                Show passwords
              </label>
            </div>

            {message.text && (
              <div className={`p-3 rounded-lg text-center text-sm ${
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
              className="w-full bg-[#B3945B] text-black font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#B3945B]/20">
            <p className="text-gray-500 text-xs text-center">
              ⚠️ You will be logged out after saving changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}