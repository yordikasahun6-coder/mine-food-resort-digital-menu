'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/admin/login')
  }, [])
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-[#B3945B]">Redirecting to admin panel...</div>
    </div>
  )
}