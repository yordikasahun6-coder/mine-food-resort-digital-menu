'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import MultiImageUpload from '@/components/admin/MultiImageUpload'

// Inner component that uses useSearchParams
function EditItemForm() {
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
        description: data.description || '',
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
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => router.back()} className="text-[#B3945B] hover:text-[#E8C870] transition">← BACK</button>
            <div className="w-16 h-px bg-[#B3945B] flex-1"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#E8C870] to-[#B3945B] bg-clip-text text-transparent">
            EDIT MENU ITEM
          </h1>
          <p className="text-gray-500 mt-1">Modify dish details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#B3945B] text-sm mb-2">DISH NAME *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white" required />
          </div>

          <div>
            <label className="block text-[#B3945B] text-sm mb-2">PRICE (BIRR) *</label>
            <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white" required />
          </div>

          <div>
            <label className="block text-[#B3945B] text-sm mb-2">ITEM TYPE *</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => handleItemTypeChange('food')} className={`flex-1 py-3 rounded-lg font-bold transition ${formData.item_type === 'food' ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black shadow-lg' : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'}`}>🍽️ FOOD</button>
              <button type="button" onClick={() => handleItemTypeChange('drinks')} className={`flex-1 py-3 rounded-lg font-bold transition ${formData.item_type === 'drinks' ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black shadow-lg' : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'}`}>🍷 DRINKS</button>
              <button type="button" onClick={() => handleItemTypeChange('both')} className={`flex-1 py-3 rounded-lg font-bold transition ${formData.item_type === 'both' ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black shadow-lg' : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'}`}>🍽️🍷 BOTH</button>
            </div>
          </div>

          <div>
            <label className="block text-[#B3945B] text-sm mb-2">⏱️ PREPARATION TIME (minutes)</label>
            <input type="number" value={formData.estimated_time || 15} onChange={(e) => setFormData({...formData, estimated_time: parseInt(e.target.value) || 15})} className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white" min="1" max="60" />
          </div>

          {formData.item_type === 'food' && (
            <div>
              <label className="block text-[#B3945B] text-sm mb-2">🌶️ SPICE LEVEL</label>
              <select value={formData.spice_level} onChange={(e) => setFormData({...formData, spice_level: e.target.value})} className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white">
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="hot">Hot</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[#B3945B] text-sm mb-2">📸 DISH IMAGES</label>
            <MultiImageUpload onImagesChange={(images) => setFormData({...formData, images: images})} currentImages={formData.images} />
          </div>

          <div>
            <label className="block text-[#B3945B] text-sm mb-2">DESCRIPTION</label>
            <textarea placeholder={getDefaultDescription(formData.item_type)} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white" rows="4" />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center"><input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="mr-2" /><span className="text-white">⭐ Featured Item</span></label>
            <label className="flex items-center"><input type="checkbox" checked={formData.is_available} onChange={(e) => setFormData({...formData, is_available: e.target.checked})} className="mr-2" /><span className="text-white">✓ Available</span></label>
          </div>

          {formData.images.length > 0 && (
            <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#B3945B]/20">
              <p className="text-[#B3945B] text-sm mb-2">📷 IMAGES ({formData.images.length}):</p>
              <div className="flex gap-2 overflow-x-auto">
                {formData.images.map((img, idx) => <img key={idx} src={img} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />)}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={saving} className="bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black font-bold px-8 py-3 rounded-lg">{saving ? 'SAVING...' : 'UPDATE ITEM'}</button>
            <button type="button" onClick={() => router.back()} className="border border-[#B3945B]/50 text-[#B3945B] px-8 py-3 rounded-lg">CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main export with Suspense to handle useSearchParams
export default function EditItemPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><div className="text-[#B3945B]">Loading...</div></div>}>
      <EditItemForm />
    </Suspense>
  )
}