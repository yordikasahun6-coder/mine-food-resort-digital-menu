'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import MultiImageUpload from '@/components/admin/MultiImageUpload'

export default function EditItemPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    images: [],
    item_type: 'food',
    estimated_time: 15,
    is_featured: false,
    is_available: true,
    spice_level: 'none'
  })

  useEffect(() => {
    if (id) {
      loadItem()
    } else {
      router.push('/admin/dashboard')
    }
  }, [id])

  // Function to get dynamic default description based on item type
  const getDefaultDescription = (type) => {
    if (type === 'food') {
      return 'A signature dish crafted by our expert chefs using the finest ingredients.'
    } else if (type === 'drinks') {
      return 'A refreshing premium beverage, perfectly crafted for your enjoyment.'
    } else if (type === 'both') {
      return 'A perfect pairing of exquisite flavors - both food and drink.'
    }
    return ''
  }

  
// When item_type changes, smoothly update description
const handleItemTypeChange = (newType) => {
  const newDescription = getDefaultDescription(newType)
  setFormData({
    ...formData,
    item_type: newType,
    description: newDescription
  })
}

  async function loadItem() {
    try {
      const response = await fetch(`/api/admin/menu/item?id=${id}`)
      if (!response.ok) throw new Error('Failed to load')
      const data = await response.json()
      setFormData({
        name: data.name || '',
        price: data.price || '',
        description: data.description || getDefaultDescription(data.item_type || 'food'),
        images: data.images || (data.image_url ? [data.image_url] : []),
        item_type: data.item_type || 'food',
        estimated_time: data.estimated_time || 15,
        is_featured: data.is_featured || false,
        is_available: data.is_available !== false,
        spice_level: data.spice_level || 'none'
      })
    } catch (error) {
      console.error('Error loading item:', error)
      alert('Failed to load item')
      router.push('/admin/dashboard')
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    
    // If description is empty, set the appropriate default
    let finalDescription = formData.description
    if (!finalDescription || finalDescription.trim() === '') {
      finalDescription = getDefaultDescription(formData.item_type)
    }
    
    try {
      const response = await fetch(`/api/admin/menu/item?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          description: finalDescription,
          images: formData.images,
          item_type: formData.item_type,
          estimated_time: formData.estimated_time,
          is_featured: formData.is_featured,
          is_available: formData.is_available,
          spice_level: formData.spice_level
        })
      })
      
      if (response.ok) {
        alert('✅ Item updated successfully!')
        router.push('/admin/dashboard')
      } else {
        const error = await response.json()
        alert('Error: ' + (error.error || 'Failed to update'))
      }
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Error updating item')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#B3945B]">LOADING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="w-16 h-px bg-[#B3945B] mb-4"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#E8C870] to-[#B3945B] bg-clip-text text-transparent">
            EDIT MENU ITEM
          </h1>
          <p className="text-gray-500 mt-1">Modify dish details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dish Name */}
          <div>
            <label className="block text-[#B3945B] text-sm mb-2">DISH NAME *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-[#B3945B] text-sm mb-2">PRICE ($) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
              required
            />
          </div>

          {/* Item Type - FOOD/DRINKS/BOTH Buttons */}
          <div>
            <label className="block text-[#B3945B] text-sm mb-2">ITEM TYPE *</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleItemTypeChange('food')}
                className={`flex-1 py-3 rounded-lg font-bold transition ${
                  formData.item_type === 'food'
                    ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-[#0A0A0A] shadow-lg'
                    : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'
                }`}
              >
                🍽️ FOOD
              </button>
              <button
                type="button"
                onClick={() => handleItemTypeChange('drinks')}
                className={`flex-1 py-3 rounded-lg font-bold transition ${
                  formData.item_type === 'drinks'
                    ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-[#0A0A0A] shadow-lg'
                    : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'
                }`}
              >
                🍷 DRINKS
              </button>
              <button
                type="button"
                onClick={() => handleItemTypeChange('both')}
                className={`flex-1 py-3 rounded-lg font-bold transition ${
                  formData.item_type === 'both'
                    ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-[#0A0A0A] shadow-lg'
                    : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'
                }`}
              >
                🍽️🍷 BOTH
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2">FOOD = appears in food tab | DRINKS = appears in drinks tab | BOTH = appears in both</p>
          </div>

          {/* Estimated Preparation Time */}
          <div>
            <label className="block text-[#B3945B] text-sm mb-2">⏱️ PREPARATION TIME (minutes)</label>
            <input
              type="number"
              value={formData.estimated_time}
              onChange={(e) => setFormData({...formData, estimated_time: parseInt(e.target.value)})}
              className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
              min="1"
              max="60"
            />
            <p className="text-gray-500 text-xs mt-1">How long it takes to prepare this item (1-60 minutes)</p>
          </div>

          {/* Spice Level - Only show for FOOD items */}
          {formData.item_type === 'food' && (
            <div>
              <label className="block text-[#B3945B] text-sm mb-2">🌶️ SPICE LEVEL</label>
              <select
                value={formData.spice_level}
                onChange={(e) => setFormData({...formData, spice_level: e.target.value})}
                className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
              >
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="hot">Hot</option>
              </select>
            </div>
          )}

          {/* Multi-Image Upload */}
          <div>
            <label className="block text-[#B3945B] text-sm mb-2">📸 DISH IMAGES</label>
            <MultiImageUpload 
              onImagesChange={(images) => setFormData({...formData, images: images})}
              currentImages={formData.images}
            />
            <p className="text-gray-500 text-xs mt-1">Upload multiple images or add URLs. First image will be the main display.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#B3945B] text-sm mb-2">DESCRIPTION</label>
            <textarea
              placeholder={getDefaultDescription(formData.item_type)}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
              rows="4"
            />
            <p className="text-gray-500 text-xs mt-1">Custom description (leave empty for default based on item type)</p>
          </div>

          {/* Featured & Available */}
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                className="mr-2 accent-[#B3945B]"
              />
              <span className="text-white">⭐ Featured Item</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                className="mr-2 accent-[#B3945B]"
              />
              <span className="text-white">✓ Available for orders</span>
            </label>
          </div>

          {/* Images Preview Gallery */}
          {formData.images.length > 0 && (
            <div className="mt-4 p-4 bg-[#1A1A1A] rounded-lg border border-[#B3945B]/20">
              <p className="text-[#B3945B] text-sm mb-2">📷 IMAGES PREVIEW ({formData.images.length} images):</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {formData.images.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt={`Preview ${idx + 1}`} 
                    className="w-20 h-20 object-cover rounded-lg border border-[#B3945B]/30"
                  />
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-2">💡 First image will be the main display. Images auto-cycle every 3 seconds.</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-[#0A0A0A] font-bold px-8 py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {saving ? 'SAVING...' : 'UPDATE ITEM'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-[#B3945B]/50 text-[#B3945B] px-8 py-3 rounded-lg hover:bg-[#B3945B]/10 transition"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}