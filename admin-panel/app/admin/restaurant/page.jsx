'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RestaurantSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    restaurant_name: 'Mine Food Resort',
    address: '',
    phone: '',
    email: '',
    opening_hours: '',
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    about_text: '',
    latitude: '',
    longitude: '',
    kodexa_url: ''
  })
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      router.push('/admin/login')
      return
    }
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const response = await fetch('/api/admin/restaurant')
      const data = await response.json()
      if (response.ok) {
        setFormData({
          restaurant_name: data.restaurant_name || 'Mine Food Resort',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          opening_hours: data.opening_hours || '',
          facebook_url: data.facebook_url || '',
          instagram_url: data.instagram_url || '',
          tiktok_url: data.tiktok_url || '',
          about_text: data.about_text || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          kodexa_url: data.kodexa_url || ''
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage({ text: '', type: '' })

    const submitData = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null
    }

    try {
      const response = await fetch('/api/admin/restaurant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        setMessage({ text: '✅ Settings saved successfully!', type: 'success' })
        setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      } else {
        const error = await response.json()
        setMessage({ text: '❌ ' + (error.error || 'Failed to save'), type: 'error' })
      }
    } catch (error) {
      setMessage({ text: '❌ Error saving settings', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // Beautiful Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] border-b border-[#B3945B]/20 px-6 py-5">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-20 h-5 bg-[#1A1A1A] rounded animate-pulse"></div>
              <div>
                <div className="w-32 h-7 bg-[#1A1A1A] rounded animate-pulse mb-2"></div>
                <div className="w-48 h-4 bg-[#1A1A1A] rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-6">
            {/* Basic Info Section Skeleton */}
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-[#B3945B]/20 rounded-full"></div>
                <div className="w-32 h-4 bg-[#2A2A2A] rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="w-24 h-3 bg-[#2A2A2A] rounded animate-pulse mb-2"></div>
                  <div className="w-full h-12 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
                </div>
                <div>
                  <div className="w-24 h-3 bg-[#2A2A2A] rounded animate-pulse mb-2"></div>
                  <div className="w-full h-20 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="w-16 h-3 bg-[#2A2A2A] rounded animate-pulse mb-2"></div>
                    <div className="w-full h-12 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
                  </div>
                  <div>
                    <div className="w-16 h-3 bg-[#2A2A2A] rounded animate-pulse mb-2"></div>
                    <div className="w-full h-12 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <div className="w-24 h-3 bg-[#2A2A2A] rounded animate-pulse mb-2"></div>
                  <div className="w-full h-12 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Social Media Section Skeleton */}
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-[#B3945B]/20 rounded-full"></div>
                <div className="w-32 h-4 bg-[#2A2A2A] rounded animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="w-20 h-3 bg-[#2A2A2A] rounded animate-pulse mb-2"></div>
                    <div className="w-full h-12 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section Skeleton */}
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-[#B3945B]/20 rounded-full"></div>
                <div className="w-32 h-4 bg-[#2A2A2A] rounded animate-pulse"></div>
              </div>
              <div className="w-full h-28 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
            </div>

            {/* Location Section Skeleton */}
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-[#B3945B]/20 rounded-full"></div>
                <div className="w-32 h-4 bg-[#2A2A2A] rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="w-16 h-3 bg-[#2A2A2A] rounded animate-pulse mb-2"></div>
                  <div className="w-full h-12 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
                </div>
                <div>
                  <div className="w-16 h-3 bg-[#2A2A2A] rounded animate-pulse mb-2"></div>
                  <div className="w-full h-12 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* KODEXA Section Skeleton */}
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-[#B3945B]/20 rounded-full"></div>
                <div className="w-32 h-4 bg-[#2A2A2A] rounded animate-pulse"></div>
              </div>
              <div>
                <div className="w-24 h-3 bg-[#2A2A2A] rounded animate-pulse mb-2"></div>
                <div className="w-full h-12 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex gap-4 pt-4">
              <div className="flex-1 h-12 bg-[#1A1A1A] rounded-xl animate-pulse"></div>
              <div className="flex-1 h-12 bg-[#1A1A1A] rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] border-b border-[#B3945B]/20 px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-[#B3945B] hover:text-[#E8C870] transition p-2 rounded-lg hover:bg-[#B3945B]/10">
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#B3945B]">Restaurant Settings</h1>
              <p className="text-gray-500 text-sm">Manage your restaurant information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/20 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-[#B3945B] rounded-full"></div>
              <h2 className="text-[#B3945B] font-semibold text-sm uppercase tracking-wider">Basic Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Restaurant Name</label>
                <input
                  type="text"
                  value={formData.restaurant_name}
                  onChange={(e) => setFormData({...formData, restaurant_name: e.target.value})}
                  className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                  rows="2"
                  placeholder="Street, City, Country"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                    placeholder="+251 XX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                    placeholder="info@minefood.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Opening Hours</label>
                <input
                  type="text"
                  value={formData.opening_hours}
                  onChange={(e) => setFormData({...formData, opening_hours: e.target.value})}
                  className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                  placeholder="Mon-Sun: 10:00 AM - 10:00 PM"
                />
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/20 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-[#B3945B] rounded-full"></div>
              <h2 className="text-[#B3945B] font-semibold text-sm uppercase tracking-wider">Social Media</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Instagram</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">📷</span>
                  <input
                    type="url"
                    value={formData.instagram_url}
                    onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                    className="w-full p-3 pl-10 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Facebook</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">📘</span>
                  <input
                    type="url"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({...formData, facebook_url: e.target.value})}
                    className="w-full p-3 pl-10 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">TikTok</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🎵</span>
                  <input
                    type="url"
                    value={formData.tiktok_url}
                    onChange={(e) => setFormData({...formData, tiktok_url: e.target.value})}
                    className="w-full p-3 pl-10 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                    placeholder="https://tiktok.com/@yourpage"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/20 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-[#B3945B] rounded-full"></div>
              <h2 className="text-[#B3945B] font-semibold text-sm uppercase tracking-wider">About</h2>
            </div>
            
            <textarea
              value={formData.about_text}
              onChange={(e) => setFormData({...formData, about_text: e.target.value})}
              className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
              rows="4"
              placeholder="Tell customers about your restaurant..."
            />
          </div>

          {/* Location Section */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/20 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-[#B3945B] rounded-full"></div>
              <h2 className="text-[#B3945B] font-semibold text-sm uppercase tracking-wider">Location (Google Maps)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Latitude</label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                  className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                  placeholder="e.g., 9.0300"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">Longitude</label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                  className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                  placeholder="e.g., 38.7400"
                />
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">Get coordinates from Google Maps by right-clicking on your location</p>
          </div>

          {/* KODEXA Section */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/20 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-[#B3945B] rounded-full"></div>
              <h2 className="text-[#B3945B] font-semibold text-sm uppercase tracking-wider">KODEXA Brand</h2>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">KODEXA Website URL</label>
              <input
                type="url"
                value={formData.kodexa_url}
                onChange={(e) => setFormData({...formData, kodexa_url: e.target.value})}
                className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                placeholder="https://kodexa.com"
              />
              <p className="text-gray-500 text-xs mt-1">Leave empty to show only text without link</p>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-xl text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
              {message.text}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#B3945B]/25 transition-all duration-300 disabled:opacity-50"
            >
              {saving ? 'SAVING...' : '💾 SAVE SETTINGS'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 border border-[#B3945B]/50 text-[#B3945B] rounded-xl hover:bg-[#B3945B]/10 transition-all duration-300"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}