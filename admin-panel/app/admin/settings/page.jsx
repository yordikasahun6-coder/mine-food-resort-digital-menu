'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentUsernameDisplay, setCurrentUsernameDisplay] = useState('')
  const [formData, setFormData] = useState({
    currentUsername: '',
    newUsername: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    setMounted(true)
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      router.push('/admin/login')
    }
    
    const savedUsername = localStorage.getItem('admin_username')
    if (savedUsername) {
      setCurrentUsernameDisplay(savedUsername)
      setFormData(prev => ({ ...prev, newUsername: savedUsername }))
    } else {
      setCurrentUsernameDisplay('admin@minefood.com')
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setMessage({ text: '', type: '' })
  }

  const verifyCurrentCredentials = () => {
    const storedUsername = localStorage.getItem('admin_username') || 'admin@minefood.com'
    const storedPassword = localStorage.getItem('admin_password') || 'admin123'
    
    if (formData.currentUsername !== storedUsername) {
      setMessage({ text: 'Current username is incorrect', type: 'error' })
      return false
    }
    
    if (formData.currentPassword !== storedPassword) {
      setMessage({ text: 'Current password is incorrect', type: 'error' })
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!verifyCurrentCredentials()) {
      return
    }
    
    const hasUsernameChange = formData.newUsername && 
      formData.newUsername !== (localStorage.getItem('admin_username') || 'admin@minefood.com')
    
    const hasPasswordChange = formData.newPassword && formData.newPassword.length > 0
    
    if (!hasUsernameChange && !hasPasswordChange) {
      setMessage({ text: 'No changes to save', type: 'error' })
      return
    }
    
    if (hasPasswordChange) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ text: 'New passwords do not match', type: 'error' })
        return
      }
      
      if (formData.newPassword.length < 6) {
        setMessage({ text: 'Password must be at least 6 characters', type: 'error' })
        return
      }
    }
    
    setLoading(true)
    
    setTimeout(() => {
      if (hasUsernameChange) {
        localStorage.setItem('admin_username', formData.newUsername)
      }
      
      if (hasPasswordChange) {
        localStorage.setItem('admin_password', formData.newPassword)
      }
      
      setMessage({ 
        text: 'Settings updated successfully! Please login again.', 
        type: 'success' 
      })
      
      setTimeout(() => {
        localStorage.removeItem('admin_logged_in')
        router.push('/admin/login')
      }, 2000)
    }, 1000)
    
    setLoading(false)
  }

  // Don't render anything during server-side rendering
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#B3945B]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8">
      <div className="max-w-md mx-auto">
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
            ADMIN SETTINGS
          </h1>
          <p className="text-gray-500 mt-1">Update your profile credentials</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl border border-[#B3945B]/20 p-4 mb-6">
          <p className="text-gray-400 text-sm">Current Username:</p>
          <p className="text-[#B3945B] font-semibold">{currentUsernameDisplay}</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl border border-[#B3945B]/20 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#B3945B]/20"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#1A1A1A] text-[#B3945B]">VERIFY IDENTITY</span>
              </div>
            </div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2">
                CURRENT USERNAME <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="currentUsername"
                value={formData.currentUsername}
                onChange={handleChange}
                placeholder="Enter current username"
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
                required
              />
            </div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2">
                CURRENT PASSWORD <span className="text-red-400">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#B3945B]/20"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#1A1A1A] text-[#B3945B]">NEW CREDENTIALS</span>
              </div>
            </div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2">NEW USERNAME (Optional)</label>
              <input
                type="email"
                name="newUsername"
                value={formData.newUsername}
                onChange={handleChange}
                placeholder="Enter new username"
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
              />
              <p className="text-gray-500 text-xs mt-1">Leave empty to keep current</p>
            </div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2">NEW PASSWORD (Optional)</label>
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
              />
              <p className="text-gray-500 text-xs mt-1">Minimum 6 characters. Leave empty to keep current</p>
            </div>

            <div>
              <label className="block text-[#B3945B] text-sm mb-2">CONFIRM NEW PASSWORD</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
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
              {loading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#B3945B]/20">
            <p className="text-gray-500 text-xs text-center">
              ⚠️ You will be logged out after saving changes.<br/>
              You must login with your new credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}