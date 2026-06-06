'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MultiImageUpload from '@/components/admin/MultiImageUpload'

export default function AddItemPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    images: [],
    item_type: 'food',
    category_id: '',
    estimated_time: '',
    is_featured: false,
    is_available: true,
    spice_level: 'none'
  })

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const getDefaultDescription = (type) => {
    if (type === 'food') return 'A signature dish crafted by our expert chefs using the finest ingredients.'
    if (type === 'drinks') return 'A refreshing premium beverage, perfectly crafted for your enjoyment.'
    if (type === 'both') return 'A perfect pairing of exquisite flavors - both food and drink.'
    return ''
  }

  const handleItemTypeChange = (newType) => {
    setFormData({ ...formData, item_type: newType, description: getDefaultDescription(newType) })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    const finalDescription = formData.description || getDefaultDescription(formData.item_type)
    
    const response = await fetch('/api/admin/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        category_id: formData.category_id || null,
        description: finalDescription,
        price: parseFloat(formData.price),
        estimated_time: formData.estimated_time ? parseInt(formData.estimated_time) : 15,
        sort_order: 999
      })
    })
    
    if (response.ok) {
      alert('✅ Item added successfully!')
      router.push('/admin/dashboard')
    } else {
      alert('❌ Error adding item')
    }
    setLoading(false)
  }

  // Beautiful Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] border-b border-[#B3945B]/20 px-6 py-5">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-24 h-5 bg-[#1A1A1A] rounded animate-pulse"></div>
                <div>
                  <div className="w-32 h-7 bg-[#1A1A1A] rounded animate-pulse mb-2"></div>
                  <div className="w-48 h-4 bg-[#1A1A1A] rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-24 h-4 bg-[#1A1A1A] rounded animate-pulse hidden sm:block"></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-6">
            {/* Two Column Layout Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 bg-[#2A2A2A] rounded animate-pulse"></div>
                      <div className="w-24 h-4 bg-[#2A2A2A] rounded animate-pulse"></div>
                      <div className="w-12 h-3 bg-[#2A2A2A] rounded animate-pulse ml-auto"></div>
                    </div>
                    <div className="w-full h-12 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 bg-[#2A2A2A] rounded animate-pulse"></div>
                      <div className="w-24 h-4 bg-[#2A2A2A] rounded animate-pulse"></div>
                      <div className="w-12 h-3 bg-[#2A2A2A] rounded animate-pulse ml-auto"></div>
                    </div>
                    <div className="w-full h-12 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Width Sections Skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-[#2A2A2A] rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-[#2A2A2A] rounded animate-pulse"></div>
                </div>
                <div className="w-full h-24 bg-[#2A2A2A] rounded-xl animate-pulse"></div>
              </div>
            ))}

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
      {/* Header - Not Sticky */}
      <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] border-b border-[#B3945B]/20 px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
             <button 
  onClick={() => router.push('/admin/dashboard')} 
  className="text-[#B3945B] hover:text-[#E8C870] transition p-2 rounded-lg hover:bg-[#B3945B]/10"
>
  ← Back to Dashboard
</button>
              <div>
                <h1 className="text-2xl font-bold text-[#B3945B]">Add New Item</h1>
                <p className="text-gray-500 text-sm">Create a dish or beverage</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-500">Mine Food Resort</div>
              <div className="text-xs text-[#B3945B]">Admin Portal</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 pb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two Column Layout for Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Dish Name Card */}
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5 hover:border-[#B3945B]/40 transition">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🍽️</span>
                  <h3 className="text-[#B3945B] font-semibold">Dish Name</h3>
                  <span className="text-red-400 text-sm ml-auto">Required</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g., Diamond Dust Steak"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:border-[#B3945B] transition"
                  required
                />
              </div>

              {/* Price Card */}
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5 hover:border-[#B3945B]/40 transition">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">💰</span>
                  <h3 className="text-[#B3945B] font-semibold">Price</h3>
                  <span className="text-red-400 text-sm ml-auto">Required</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">BIRR</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full p-3 pl-16 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:border-[#B3945B] transition"
                    required
                  />
                </div>
              </div>

              {/* Item Type Card */}
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5 hover:border-[#B3945B]/40 transition">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🏷️</span>
                  <h3 className="text-[#B3945B] font-semibold">Item Type</h3>
                  <span className="text-red-400 text-sm ml-auto">Required</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: 'food', emoji: '🍽️', label: 'Food' },
                    { type: 'drinks', emoji: '🍷', label: 'Drinks' },
                    { type: 'both', emoji: '🍽️🍷', label: 'Both' }
                  ].map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => handleItemTypeChange(item.type)}
                      className={`py-3 rounded-xl font-semibold transition-all duration-300 ${
                        formData.item_type === item.type
                          ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black shadow-lg'
                          : 'bg-[#0A0A0A] text-gray-400 border border-gray-700 hover:border-[#B3945B]/50'
                      }`}
                    >
                      {item.emoji} {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Category Card */}
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5 hover:border-[#B3945B]/40 transition">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">📂</span>
                  <h3 className="text-[#B3945B] font-semibold">Category</h3>
                  <span className="text-gray-500 text-sm ml-auto">Optional</span>
                </div>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                >
                  <option value="">-- Select a category --</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
              </div>

              {/* Preparation Time Card */}
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5 hover:border-[#B3945B]/40 transition">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">⏱️</span>
                  <h3 className="text-[#B3945B] font-semibold">Preparation Time</h3>
                  <span className="text-gray-500 text-sm ml-auto">Optional</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Minutes"
                    value={formData.estimated_time}
                    onChange={(e) => setFormData({...formData, estimated_time: e.target.value})}
                    className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:border-[#B3945B] transition"
                    min="1"
                    max="60"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">min</span>
                </div>
              </div>

              {/* Spice Level Card (Food only) */}
              {formData.item_type === 'food' && (
                <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5 hover:border-[#B3945B]/40 transition">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🌶️</span>
                    <h3 className="text-[#B3945B] font-semibold">Spice Level</h3>
                    <span className="text-gray-500 text-sm ml-auto">Optional</span>
                  </div>
                  <select
                    value={formData.spice_level}
                    onChange={(e) => setFormData({...formData, spice_level: e.target.value})}
                    className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white focus:border-[#B3945B] transition"
                  >
                    <option value="none">None</option>
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="hot">Hot 🔥</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Full Width Sections */}
          
          {/* Images Card */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5 hover:border-[#B3945B]/40 transition">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🖼️</span>
              <h3 className="text-[#B3945B] font-semibold">Images</h3>
              <span className="text-gray-500 text-sm ml-auto">Upload photos of your dish</span>
            </div>
            <MultiImageUpload 
              onImagesChange={(images) => setFormData({...formData, images: images})}
              currentImages={formData.images}
            />
          </div>

          {/* Description Card */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5 hover:border-[#B3945B]/40 transition">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📝</span>
              <h3 className="text-[#B3945B] font-semibold">Description</h3>
              <span className="text-gray-500 text-sm ml-auto">Tell customers about your dish</span>
            </div>
            <textarea
              placeholder={getDefaultDescription(formData.item_type)}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:border-[#B3945B] transition"
              rows="4"
            />
          </div>

          {/* Options Card */}
          <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚙️</span>
              <h3 className="text-[#B3945B] font-semibold">Options</h3>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="w-4 h-4 accent-[#B3945B]" />
                <span className="text-white group-hover:text-[#B3945B] transition">⭐ Featured Item</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={formData.is_available} onChange={(e) => setFormData({...formData, is_available: e.target.checked})} className="w-4 h-4 accent-[#B3945B]" />
                <span className="text-white group-hover:text-[#B3945B] transition">✓ Available for orders</span>
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">👀</span>
                <h3 className="text-[#B3945B] font-semibold">Preview</h3>
                <span className="text-gray-500 text-sm ml-auto">{formData.images.length} image(s)</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {formData.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded-xl border border-[#B3945B]/30" />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons - Fixed at bottom of form, not floating */}
          <div className="flex gap-4 pt-6 border-t border-[#B3945B]/20 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#B3945B]/25 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'SAVING...' : '✨ SAVE ITEM'}
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