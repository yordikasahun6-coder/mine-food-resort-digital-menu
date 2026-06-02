'use client'

import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    window.location.href = '/admin/login'
  }, [])
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-[#B3945B]">Redirecting to admin panel...</div>
    </div>
  )
}