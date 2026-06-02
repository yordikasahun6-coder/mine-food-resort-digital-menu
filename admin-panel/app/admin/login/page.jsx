'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

 const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  try {
    const response = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password: password })
    })
    
    const data = await response.json()
    
    if (response.ok && data.valid) {
      localStorage.setItem('admin_logged_in', 'true')
      router.push('/admin/dashboard')
    } else {
      setError(data.error || 'Invalid credentials')
    }
  } catch (err) {
    console.error('Login error:', err)
    setError('Could not connect to authentication service')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center relative overflow-hidden">
      {/* ... (your existing JSX remains exactly the same) ... */}
    </div>
  )
}