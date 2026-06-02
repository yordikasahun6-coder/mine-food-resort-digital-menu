'use client'

import { useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'

export default function AddItemPage() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('lunch')

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabaseAdmin.from('menu_items').insert([{
      name, price: parseFloat(price), category, sort_order: 999, description: ''
    }])
    if (!error) {
      alert('Item added!')
      window.location.href = '/admin/dashboard'
    } else {
      alert('Error: ' + error.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111', padding: '2rem' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>Add Menu Item</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '1rem', borderRadius: '4px' }}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '1rem', borderRadius: '4px' }}
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '1rem', borderRadius: '4px' }}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="drinks">Drinks</option>
            <option value="desserts">Desserts</option>
          </select>
          <button type="submit" style={{ background: '#22c55e', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
            Save Item
          </button>
        </form>
      </div>
    </div>
  )
}
