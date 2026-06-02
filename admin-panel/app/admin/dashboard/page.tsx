'use client'

import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'

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
    const { data } = await supabaseAdmin.from('menu_items').select('*')
    setItems(data || [])
    setLoading(false)
  }

  async function deleteItem(id) {
    if (confirm('Delete this item?')) {
      await supabaseAdmin.from('menu_items').delete().eq('id', id)
      loadItems()
    }
  }

  function logout() {
    localStorage.removeItem('admin_logged_in')
    window.location.href = '/admin/login'
  }

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#111', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ color: 'white' }}> Admin Dashboard</h1>
        <div>
          <button onClick={() => window.location.href = '/admin/menu/add'} style={{ background: '#22c55e', padding: '8px 16px', border: 'none', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>
            + Add Item
          </button>
          <button onClick={logout} style={{ background: '#ef4444', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {items.map(item => (
          <div key={item.id} style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'white', margin: 0 }}>{item.name}</h3>
              <p style={{ color: '#888', margin: 0 }}> - {item.category}</p>
            </div>
            <button onClick={() => deleteItem(item.id)} style={{ background: '#dc2626', padding: '4px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
