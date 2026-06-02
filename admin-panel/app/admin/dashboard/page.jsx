'use client'

import { useEffect, useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function DashboardPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      window.location.href = '/admin/login'
      return
    }
    loadItems()
  }, [])

  async function loadItems() {
    const response = await fetch('/api/admin/menu')
    const data = await response.json()
    setItems(data)
    setLoading(false)
  }

  async function deleteItem(id) {
    if (confirm('Delete this item?')) {
      await fetch(`/api/admin/menu?id=BIRR {id}`, { method: 'DELETE' })
      loadItems()
    }
  }

  function logout() {
    localStorage.removeItem('admin_logged_in')
    window.location.href = '/admin/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center">
        <div className="text-[var(--gold)]">LOADING...</div>
      </div>
    )
  }

  return (
    <>
      <ThemeToggle />
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#E8C870] to-[var(--gold)] bg-clip-text text-transparent">
              ⚡ ADMIN COMMAND
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">Master Control System</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.href = '/admin/menu/add'} 
              className="bg-gradient-to-r from-[var(--gold)] to-[#C4A25A] text-[var(--bg-primary)] font-bold px-6 py-2 rounded-lg hover:shadow-lg transition"
            >
              ✦ ADD NEW ITEM ✦
            </button>
            <button 
              onClick={() => window.location.href = '/admin/qr'} 
              className="border border-[var(--border-color)] text-[var(--gold)] px-6 py-2 rounded-lg hover:bg-[var(--gold)]/10 transition"
            >
              📱 QR CODES
            </button>
            <button 
              onClick={logout} 
              className="border border-[var(--border-color)] text-[var(--gold)] px-6 py-2 rounded-lg hover:bg-[var(--gold)]/10 transition"
            >
              EXIT
            </button>
	    <button 
  onClick={() => window.location.href = '/admin/settings'} 
  className="border border-[#B3945B]/50 text-[#B3945B] px-6 py-2 rounded-lg hover:bg-[#B3945B]/10 transition"
>
  ⚙️ SETTINGS
</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)]">
            <p className="text-[var(--text-secondary)] text-sm">Total Items</p>
            <p className="text-3xl font-bold text-[var(--gold)]">{items.length}</p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)]">
            <p className="text-[var(--text-secondary)] text-sm">Available</p>
            <p className="text-3xl font-bold text-[var(--gold)]">{items.filter(i => i.is_available).length}</p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)]">
            <p className="text-[var(--text-secondary)] text-sm">Featured</p>
            <p className="text-3xl font-bold text-[var(--gold)]">{items.filter(i => i.is_featured).length}</p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-color)]">
            <p className="text-[var(--text-secondary)] text-sm">Categories</p>
            <p className="text-3xl font-bold text-[var(--gold)]">{new Set(items.map(i => i.category)).size}</p>
          </div>
        </div>

        {/* Menu Items Table */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="px-6 py-4 text-left text-[var(--gold)] text-sm">Item</th>
                  <th className="px-6 py-4 text-left text-[var(--gold)] text-sm">Category</th>
                  <th className="px-6 py-4 text-left text-[var(--gold)] text-sm">Price</th>
                  <th className="px-6 py-4 text-left text-[var(--gold)] text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-[var(--gold)] text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--border-color)] hover:bg-[var(--gold)]/5">
                    <td className="px-6 py-4">
                      <p className="text-[var(--text-primary)]">{item.name}</p>
                      {item.is_featured && <p className="text-[var(--gold)] text-xs">✦ SIGNATURE ✦</p>}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] capitalize">{item.category}</td>
                    <td className="px-6 py-4 text-[var(--gold)] font-bold">BIRR {item.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs BIRR {
                        item.is_available ? 'bg-[var(--gold)]/20 text-[var(--gold)]' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {item.is_available ? 'ACTIVE' : 'OFFLINE'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => window.location.href = `/admin/menu/edit?id=BIRR {item.id}`} 
                          className="text-[var(--gold)] hover:text-[var(--gold-light)] transition text-sm"
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
    </>
  )
}
