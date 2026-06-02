'use client'

import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      window.location.href = '/admin/login'
      return
    }
    loadItems()
  }, [])

  async function loadItems() {
    try {
      const response = await fetch('/api/admin/menu')
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error loading items:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteItem(id) {
    if (confirm('Delete this item?')) {
      await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' })
      loadItems()
    }
  }

  function logout() {
    localStorage.removeItem('admin_logged_in')
    window.location.href = '/admin/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#B3945B] text-xl">LOADING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#B3945B]">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your menu items</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.href = '/admin/menu/add'} 
            className="bg-[#B3945B] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#C4A25A] transition"
          >
            + Add Item
          </button>
          <button 
            onClick={logout} 
            className="border border-[#B3945B] text-[#B3945B] px-4 py-2 rounded-lg hover:bg-[#B3945B]/10 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#B3945B]/20">
          <p className="text-gray-400 text-sm">Total Items</p>
          <p className="text-2xl font-bold text-[#B3945B]">{items.length}</p>
        </div>
        <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#B3945B]/20">
          <p className="text-gray-400 text-sm">Food Items</p>
          <p className="text-2xl font-bold text-[#B3945B]">{items.filter(i => i.item_type === 'food' || i.item_type === 'both').length}</p>
        </div>
        <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#B3945B]/20">
          <p className="text-gray-400 text-sm">Drink Items</p>
          <p className="text-2xl font-bold text-[#B3945B]">{items.filter(i => i.item_type === 'drinks' || i.item_type === 'both').length}</p>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-[#1A1A1A] rounded-lg border border-[#B3945B]/20 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#B3945B]/20">
              <th className="px-4 py-3 text-left text-[#B3945B]">Name</th>
              <th className="px-4 py-3 text-left text-[#B3945B]">Type</th>
              <th className="px-4 py-3 text-left text-[#B3945B]">Price (BIRR)</th>
              <th className="px-4 py-3 text-left text-[#B3945B]">Status</th>
              <th className="px-4 py-3 text-left text-[#B3945B]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-800 hover:bg-[#B3945B]/5">
                <td className="px-4 py-3 text-white">{item.name}</td>
                <td className="px-4 py-3 text-gray-400 capitalize">{item.item_type}</td>
                <td className="px-4 py-3 text-[#B3945B]">BIRR {item.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.is_available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.is_available ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.location.href = `/admin/menu/edit?id=${item.id}`} 
                      className="text-[#B3945B] hover:text-[#E8C870] text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteItem(item.id)} 
                      className="text-red-500 hover:text-red-400 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}