'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme')
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
      // Switch to light mode
      document.documentElement.classList.add('light-mode')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      // Switch to dark mode
      document.documentElement.classList.remove('light-mode')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 left-4 z-50 bg-[var(--bg-card)] text-[var(--gold)] w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-[var(--border-color)]"
      aria-label="Toggle theme"
    >
      {isDark ? '🌞' : '🌙'}
    </button>
  )
}