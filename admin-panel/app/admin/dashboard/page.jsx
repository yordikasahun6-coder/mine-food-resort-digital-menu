'use client'

import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (!isLoggedIn) {
      window.location.href = '/admin/login'
      return
    }

    // Test API call
    fetch('/api/admin/menu')
      .then(res => res.json())
      .then(data => {
        console.log('API Response:', data)
        setData(data)
      })
      .catch(err => {
        console.error('API Error:', err)
        setError(err.message)
      })
  }, [])

  if (error) {
    return (
      <div className="p-8 text-red-500">
        <h1>Error loading dashboard</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8 text-white">
        <h1>Loading dashboard...</h1>
        <p>Check console for API response</p>
      </div>
    )
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl mb-4">Dashboard Test</h1>
      <p>API returned {data.length} items!</p>
      <pre className="mt-4 p-4 bg-gray-800 rounded overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}