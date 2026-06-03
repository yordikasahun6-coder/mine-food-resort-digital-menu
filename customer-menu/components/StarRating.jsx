'use client'

import { useState } from 'react'

export default function StarRating({ rating, onRate, size = 'normal' }) {
  const [hover, setHover] = useState(0)
  
  const sizeMap = {
    small: '16px',
    normal: '24px',
    large: '32px'
  }

  const starSize = sizeMap[size] || '24px'
  const currentRating = parseFloat(rating) || 0

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hover || currentRating)
        return (
          <button
            key={star}
            onClick={() => onRate && onRate(star)}
            onMouseEnter={() => onRate && setHover(star)}
            onMouseLeave={() => onRate && setHover(0)}
            style={{
              background: 'none',
              border: 'none',
              cursor: onRate ? 'pointer' : 'default',
              padding: '0',
              fontSize: starSize,
              transition: 'transform 0.2s',
              color: isActive ? '#FBBF24' : '#4B5563',
              textShadow: isActive ? '0 0 2px rgba(0,0,0,0.3)' : 'none',
              transform: onRate && hover === star ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}