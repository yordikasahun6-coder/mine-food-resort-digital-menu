'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SkeletonLoader from '@/components/SkeletonLoader'

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      router.push('/admin/login')
      return
    }
    loadCategories()
  }, [])

  async function loadCategories() {
    const response = await fetch('/api/admin/categories')
    const data = await response.json()
    setCategories(data)
    setLoading(false)
  }

  async function addCategory() {
    if (!newCategoryName.trim()) {
      setMessage({ text: 'Please enter a category name', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
      return
    }

    setIsAdding(true)
    const response = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName.trim() })
    })

    if (response.ok) {
      setMessage({ text: '✅ Category added successfully!', type: 'success' })
      setNewCategoryName('')
      loadCategories()
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } else {
      const error = await response.json()
      setMessage({ text: '❌ ' + error.error, type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    }
    setIsAdding(false)
  }

  async function deleteCategory(id, name) {
    if (!confirm(`Delete "${name}"? Items in this category will become uncategorized.`)) return

    const response = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' })

    if (response.ok) {
      setMessage({ text: '✅ Category deleted successfully!', type: 'success' })
      loadCategories()
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    } else {
      const error = await response.json()
      setMessage({ text: '❌ ' + error.error, type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 2000)
    }
  }

if (loading) {
  return <SkeletonLoader />
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] border-b border-[#B3945B]/20 px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/admin/dashboard')} 
                className="text-[#B3945B] hover:text-[#E8C870] transition p-2 rounded-lg hover:bg-[#B3945B]/10 flex items-center gap-2"
              >
                <span>←</span> Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#B3945B]">Category Manager</h1>
                <p className="text-gray-500 text-sm">Manage your menu categories</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-500">Mine Food Resort</div>
              <div className="text-xs text-[#B3945B]">{categories.length} Categories</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Add Category */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/20 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-[#B3945B] rounded-full"></div>
                <h2 className="text-[#B3945B] font-semibold text-sm uppercase tracking-wider">Add New Category</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">Category Name</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Breakfast, Lunch, Cocktails"
                    className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:border-[#B3945B] transition"
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  />
                </div>
                
                <button
                  onClick={addCategory}
                  disabled={isAdding}
                  className="w-full py-3 bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
                >
                  {isAdding ? 'Adding...' : '+ Add Category'}
                </button>

                {message.text && (
                  <div className={`p-3 rounded-xl text-center text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                    {message.text}
                  </div>
                )}

                <div className="pt-4 border-t border-[#B3945B]/20">
                  <p className="text-gray-500 text-xs text-center">
                    💡 Categories help customers find items faster
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Categories List */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#B3945B]/20 bg-[#0A0A0A]/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📁</span>
                    <h2 className="text-[#B3945B] font-semibold">Your Categories</h2>
                  </div>
                  <div className="text-sm text-gray-500">{categories.length} total</div>
                </div>
              </div>

              {categories.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4 opacity-50">📂</div>
                  <p className="text-gray-400">No categories yet</p>
                  <p className="text-gray-500 text-sm mt-1">Add your first category using the form</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {categories.map((cat, index) => (
                    <div key={cat.id} className="px-6 py-4 hover:bg-[#B3945B]/5 transition group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-[#B3945B]/20 flex items-center justify-center text-[#B3945B] font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{cat.name}</h3>
                            <p className="text-gray-500 text-xs">Created {new Date(cat.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCategory(cat.id, cat.name)}
                          className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}