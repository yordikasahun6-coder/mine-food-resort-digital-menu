'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme')
    if (savedTheme === 'light') {
      setIsDark(false)
      document.documentElement.classList.add('light-mode')
    } else {
      setIsDark(true)
      document.documentElement.classList.remove('light-mode')
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.add('light-mode')
      localStorage.setItem('adminTheme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.remove('light-mode')
      localStorage.setItem('adminTheme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      style={{
        backgroundColor: 'var(--bg-card, #1A1A1A)',
        color: 'var(--gold, #B3945B)',
        border: '1px solid var(--border-color, rgba(179, 148, 91, 0.3))'
      }}
    >
      {isDark ? '🌞' : '🌙'}
    </button>
  )
}