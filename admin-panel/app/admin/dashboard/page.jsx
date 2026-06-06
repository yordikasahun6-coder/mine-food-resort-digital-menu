'use client'

import { useEffect, useState } from 'react'


export default function DashboardPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      window.location.href = '/admin/login'
      return
    }
    loadItems()
    loadCategories()
  }, [])

  async function loadItems() {
    const res = await fetch('/api/admin/menu')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  async function loadCategories() {
    const res = await fetch('/api/admin/categories')
    const data = await res.json()
    setCategories(data)
  }

  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    const res = await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' })
    const result = await res.json()
    
    if (result.success) {
      setItems(items.filter(item => item.id !== id))
      alert('✅ Item deleted successfully!')
    } else {
      alert('❌ Delete failed')
    }
  }

  function logout() {
    localStorage.removeItem('admin_logged_in')
    window.location.href = '/admin/login'
  }

  function getCategoryName(categoryId) {
    const cat = categories.find(c => c.id === categoryId)
    return cat ? cat.name : 'Uncategorized'
  }

  const filteredItems = items.filter(item => {
    if (typeFilter !== 'all' && item.item_type !== typeFilter) return false
    if (categoryFilter !== 'all' && item.category_id !== categoryFilter) return false
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] border-b border-[#B3945B]/20 px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="w-48 h-8 bg-[#1A1A1A] rounded-lg animate-pulse mb-2"></div>
            <div className="w-64 h-4 bg-[#1A1A1A] rounded-lg animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="w-24 h-10 bg-[#1A1A1A] rounded-xl animate-pulse"></div>
            <div className="w-24 h-10 bg-[#1A1A1A] rounded-xl animate-pulse"></div>
            <div className="w-24 h-10 bg-[#1A1A1A] rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#B3945B]/20 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-[#2A2A2A] rounded-xl"></div>
                <div className="w-12 h-6 bg-[#2A2A2A] rounded"></div>
              </div>
              <div className="w-16 h-3 bg-[#2A2A2A] rounded"></div>
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-6 mb-8 animate-pulse">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-[#2A2A2A] rounded-full"></div>
            <div className="w-32 h-4 bg-[#2A2A2A] rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-12 bg-[#2A2A2A] rounded-xl"></div>
            <div className="h-12 bg-[#2A2A2A] rounded-xl"></div>
            <div className="h-12 bg-[#2A2A2A] rounded-xl"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 overflow-hidden animate-pulse">
          <div className="p-4 border-b border-gray-800">
            <div className="flex gap-4">
              <div className="w-1/4 h-4 bg-[#2A2A2A] rounded"></div>
              <div className="w-1/4 h-4 bg-[#2A2A2A] rounded"></div>
              <div className="w-1/4 h-4 bg-[#2A2A2A] rounded"></div>
              <div className="w-1/4 h-4 bg-[#2A2A2A] rounded"></div>
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-gray-800">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-[#2A2A2A] rounded-lg"></div>
                <div className="flex-1">
                  <div className="w-32 h-4 bg-[#2A2A2A] rounded mb-2"></div>
                  <div className="w-20 h-3 bg-[#2A2A2A] rounded"></div>
                </div>
                <div className="w-16 h-6 bg-[#2A2A2A] rounded-full"></div>
                <div className="w-20 h-8 bg-[#2A2A2A] rounded-lg"></div>
                <div className="w-20 h-8 bg-[#2A2A2A] rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] border-b border-[#B3945B]/20">
        <div className="relative px-4 py-5 md:px-8 md:py-6">
          <div className="flex flex-col gap-4">
            {/* Title Section */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold gold-shimmer-text">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your restaurant's digital menu</p>
            </div>
            
            {/* Mobile Action Menu */}
            <div className="md:hidden">
              <div className="relative">
                <button
                  onClick={() => {
                    const menu = document.getElementById('mobile-menu')
                    menu.classList.toggle('hidden')
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black font-bold rounded-xl flex items-center justify-center gap-2 text-sm"
                >
                  ☰ MENU ACTIONS
                </button>
                <div id="mobile-menu" className="hidden absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] rounded-xl border border-[#B3945B]/20 z-50 overflow-hidden shadow-xl">
                  <button onClick={() => window.location.href = '/admin/menu/add'} className="w-full px-4 py-3 text-left text-white hover:bg-[#B3945B]/10 transition flex items-center gap-2 border-b border-gray-800 text-sm">
                    <span className="text-[#B3945B]">+</span> Add New Item
                  </button>
                  <button onClick={() => window.location.href = '/admin/qr'} className="w-full px-4 py-3 text-left text-white hover:bg-[#B3945B]/10 transition flex items-center gap-2 border-b border-gray-800 text-sm">
                    📱 QR Codes
                  </button>
                  <button onClick={() => window.location.href = '/admin/categories'} className="w-full px-4 py-3 text-left text-white hover:bg-[#B3945B]/10 transition flex items-center gap-2 border-b border-gray-800 text-sm">
                    📂 Categories
                  </button>
                  <button onClick={() => window.location.href = '/admin/restaurant'} className="w-full px-4 py-3 text-left text-white hover:bg-[#B3945B]/10 transition flex items-center gap-2 border-b border-gray-800 text-sm">
                    🏪 Settings
                  </button>
                  <button onClick={logout} className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition flex items-center gap-2 text-sm">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex flex-wrap gap-3 justify-center md:justify-end">
              <button onClick={() => window.location.href = '/admin/menu/add'} className="px-5 py-2.5 bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#B3945B]/25 transition-all duration-300 flex items-center gap-2 text-sm">
                + Add Item
              </button>
              <button onClick={() => window.location.href = '/admin/qr'} className="px-5 py-2.5 border border-[#B3945B]/50 text-[#B3945B] rounded-xl hover:bg-[#B3945B]/10 transition-all duration-300 flex items-center gap-2 text-sm">
                📱 QR Codes
              </button>
              <button onClick={() => window.location.href = '/admin/categories'} className="px-5 py-2.5 border border-[#B3945B]/50 text-[#B3945B] rounded-xl hover:bg-[#B3945B]/10 transition-all duration-300 flex items-center gap-2 text-sm">
                📂 Categories
              </button>
              <button onClick={() => window.location.href = '/admin/restaurant'} className="px-5 py-2.5 border border-[#B3945B]/50 text-[#B3945B] rounded-xl hover:bg-[#B3945B]/10 transition-all duration-300 flex items-center gap-2 text-sm">
                🏪 Settings
              </button>
              <button onClick={logout} className="px-5 py-2.5 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-300 flex items-center gap-2 text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-5 border border-[#B3945B]/20 hover:border-[#B3945B]/40 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-[#B3945B]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                <span className="text-xl">🍽️</span>
              </div>
              <span className="text-2xl font-bold text-[#B3945B]">{items.length}</span>
            </div>
            <p className="text-gray-400 text-xs">Total Items</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-5 border border-[#B3945B]/20 hover:border-[#B3945B]/40 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                <span className="text-xl">✅</span>
              </div>
              <span className="text-2xl font-bold text-green-400">{items.filter(i => i.is_available).length}</span>
            </div>
            <p className="text-gray-400 text-xs">Available</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-5 border border-[#B3945B]/20 hover:border-[#B3945B]/40 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                <span className="text-xl">⭐</span>
              </div>
              <span className="text-2xl font-bold text-yellow-400">{items.filter(i => i.is_featured).length}</span>
            </div>
            <p className="text-gray-400 text-xs">Featured</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-5 border border-[#B3945B]/20 hover:border-[#B3945B]/40 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-[#B3945B]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                <span className="text-xl">📁</span>
              </div>
              <span className="text-2xl font-bold text-[#B3945B]">{categories.length}</span>
            </div>
            <p className="text-gray-400 text-xs">Categories</p>
          </div>
        </div>

        {/* Premium Filters Section */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/20 p-6 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-[#B3945B] rounded-full"></div>
            <h3 className="text-[#B3945B] font-semibold text-sm uppercase tracking-wider">Filter Menu Items</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Type Filter - Modern Toggle */}
            <div>
              <label className="block text-gray-400 text-xs mb-2 font-medium">Item Type</label>
              <div className="flex bg-[#0A0A0A] rounded-xl p-1 border border-[#B3945B]/20">
                {['all', 'food', 'drinks', 'both'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                      typeFilter === type
                        ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black shadow-lg'
                        : 'text-gray-400 hover:text-[#B3945B]'
                    }`}
                  >
                    {type === 'all' ? 'All' : type === 'food' ? '🍽️ Food' : type === 'drinks' ? '🍷 Drinks' : '🍽️🍷 Both'}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter - Clean Dropdown */}
            <div>
              <label className="block text-gray-400 text-xs mb-2 font-medium">Category</label>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-[#B3945B]/30 text-white appearance-none cursor-pointer focus:outline-none focus:border-[#B3945B] transition pr-10"
                >
                  <option value="all">📂 All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>📁 {cat.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B3945B] pointer-events-none">
                  ▼
                </div>
              </div>
            </div>

            {/* Search Bar - With Icon */}
            <div>
              <label className="block text-gray-400 text-xs mb-2 font-medium">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by dish name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 rounded-xl bg-[#0A0A0A] border border-[#B3945B]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B3945B] transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(typeFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#B3945B]/20">
              <span className="text-gray-500 text-xs">Active filters:</span>
              {typeFilter !== 'all' && (
                <span className="px-2 py-1 bg-[#B3945B]/20 text-[#B3945B] text-xs rounded-full flex items-center gap-1">
                  {typeFilter} {typeFilter === 'food' ? '🍽️' : typeFilter === 'drinks' ? '🍷' : ''}
                  <button onClick={() => setTypeFilter('all')} className="ml-1 hover:text-white">✕</button>
                </span>
              )}
              {categoryFilter !== 'all' && (
                <span className="px-2 py-1 bg-[#B3945B]/20 text-[#B3945B] text-xs rounded-full flex items-center gap-1">
                  {categories.find(c => c.id === categoryFilter)?.name}
                  <button onClick={() => setCategoryFilter('all')} className="ml-1 hover:text-white">✕</button>
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-[#B3945B]/20 text-[#B3945B] text-xs rounded-full flex items-center gap-1">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-white">✕</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Menu Items Display - Card View on Mobile, Table on Desktop */}
        <div className="bg-[#1A1A1A]/50 rounded-2xl border border-[#B3945B]/20 overflow-hidden">
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#B3945B]/20 bg-[#0A0A0A]/50">
                  <th className="px-4 py-3 text-left text-[#B3945B] text-xs font-semibold uppercase tracking-wider">Item</th>
                  <th className="px-4 py-3 text-left text-[#B3945B] text-xs font-semibold uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-[#B3945B] text-xs font-semibold uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-[#B3945B] text-xs font-semibold uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-[#B3945B] text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[#B3945B] text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800 hover:bg-[#B3945B]/5 transition-all duration-300 group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.images?.[0] && <img src={item.images[0]} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />}
                        <div>
                          <p className="text-white text-sm font-medium">{item.name}</p>
                          {item.is_featured && <p className="text-[#B3945B] text-[10px]">✦ SIGNATURE ✦</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${item.item_type === 'food' ? 'bg-green-500/20 text-green-400' : item.item_type === 'drinks' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {item.item_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{getCategoryName(item.category_id)}</td>
                    <td className="px-4 py-3 text-[#B3945B] font-bold text-sm">BIRR {item.price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${item.is_available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {item.is_available ? 'ACTIVE' : 'OFFLINE'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => window.location.href = `/admin/menu/edit?id=${item.id}`} className="px-3 py-1.5 bg-[#B3945B]/20 text-[#B3945B] rounded-lg text-xs hover:bg-[#B3945B]/40 transition-all duration-300">Edit</button>
                        <button onClick={() => deleteItem(item.id)} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/40 transition-all duration-300">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Visible only on mobile */}
          <div className="md:hidden divide-y divide-gray-800">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 hover:bg-[#B3945B]/5 transition-all duration-300">
                <div className="flex items-start gap-3">
                  {/* Image */}
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#B3945B]/10 flex items-center justify-center">
                      <span className="text-2xl">{item.item_type === 'food' ? '🍽️' : '🍷'}</span>
                    </div>
                  )}
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-semibold text-base">{item.name}</h4>
                        {item.is_featured && <span className="text-[#B3945B] text-[10px]">✦ SIGNATURE ✦</span>}
                      </div>
                      <span className="text-[#B3945B] font-bold">BIRR {item.price}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${item.item_type === 'food' ? 'bg-green-500/20 text-green-400' : item.item_type === 'drinks' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {item.item_type.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-700/50 text-gray-300">
                        {getCategoryName(item.category_id)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${item.is_available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {item.is_available ? 'ACTIVE' : 'OFFLINE'}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => window.location.href = `/admin/menu/edit?id=${item.id}`} className="flex-1 px-3 py-1.5 bg-[#B3945B]/20 text-[#B3945B] rounded-lg text-xs font-medium hover:bg-[#B3945B]/40 transition-all duration-300">
                        Edit
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="flex-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/40 transition-all duration-300">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-3 opacity-50">🍽️</div>
              <p className="text-gray-400 text-sm">No items found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}