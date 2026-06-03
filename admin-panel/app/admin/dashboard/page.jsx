'use client'

import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      window.location.href = '/admin/login'
      return
    }
    fetchItems()
  }, [])

  async function fetchItems() {
    const res = await fetch('/api/admin/menu')
    const data = await res.json()
    setItems(data)
    setLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#B3945B] text-xl">LOADING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#B3945B]">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your menu items</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.href = '/admin/menu/add'} 
            className="bg-[#B3945B] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#C4A25A] transition"
          >
            + Add Item
          </button>
          <button 
            onClick={() => window.location.href = '/admin/qr'} 
            className="border border-[#B3945B]/50 text-[#B3945B] px-4 py-2 rounded-lg hover:bg-[#B3945B]/10 transition"
          >
            📱 QR Codes
          </button>
          <button 
            onClick={() => window.location.href = '/admin/settings'} 
            className="border border-[#B3945B]/50 text-[#B3945B] px-4 py-2 rounded-lg hover:bg-[#B3945B]/10 transition"
          >
            ⚙️ Settings
          </button>
          <button 
            onClick={logout} 
            className="border border-[#B3945B]/50 text-[#B3945B] px-4 py-2 rounded-lg hover:bg-[#B3945B]/10 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#B3945B]/20">
          <p className="text-gray-500 text-sm">Total Items</p>
          <p className="text-3xl font-bold text-[#B3945B]">{items.length}</p>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#B3945B]/20">
          <p className="text-gray-500 text-sm">Available</p>
          <p className="text-3xl font-bold text-[#B3945B]">{items.filter(i => i.is_available).length}</p>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#B3945B]/20">
          <p className="text-gray-500 text-sm">Featured</p>
          <p className="text-3xl font-bold text-[#B3945B]">{items.filter(i => i.is_featured).length}</p>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#B3945B]/20">
          <p className="text-gray-500 text-sm">Categories</p>
          <p className="text-3xl font-bold text-[#B3945B]">{new Set(items.map(i => i.item_type)).size}</p>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-[#1A1A1A] rounded-xl border border-[#B3945B]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#B3945B]/20">
                <th className="px-6 py-4 text-left text-[#B3945B] text-sm">Name</th>
                <th className="px-6 py-4 text-left text-[#B3945B] text-sm">Type</th>
                <th className="px-6 py-4 text-left text-[#B3945B] text-sm">Price (BIRR)</th>
                <th className="px-6 py-4 text-left text-[#B3945B] text-sm">Status</th>
                <th className="px-6 py-4 text-left text-[#B3945B] text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-800 hover:bg-[#B3945B]/5">
                  <td className="px-6 py-4">
                    <p className="text-white">{item.name}</p>
                    {item.is_featured && <p className="text-[#B3945B] text-xs">✦ SIGNATURE ✦</p>}
                  </td>
                  <td className="px-6 py-4 text-gray-400 capitalize">{item.item_type}</td>
                  <td className="px-6 py-4 text-[#B3945B] font-bold">{item.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      item.is_available ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {item.is_available ? 'ACTIVE' : 'OFFLINE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => window.location.href = `/admin/menu/edit?id=${item.id}`} 
                        className="text-[#B3945B] hover:text-[#E8C870] transition text-sm"
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)} 
                        className="text-red-500 hover:text-red-400 transition text-sm"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}