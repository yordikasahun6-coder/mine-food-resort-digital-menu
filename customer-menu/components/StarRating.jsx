'use client'

import { useState } from 'react'

export default function StarRating({ rating, onRate, size = 'normal' }) {
  const [hover, setHover] = useState(0)
  
  const sizes = {
    small: 'text-sm',
    normal: 'text-xl',
    large: 'text-3xl'
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => onRate && setHover(star)}
          onMouseLeave={() => onRate && setHover(0)}
          className={`transition ${onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          disabled={!onRate}
        >
          <span className={`${sizes[size]} ${star <= (hover || rating) ? 'text-[#E8C870] drop-shadow-glow' : 'text-gray-600'}`}>
            ★
          </span>
        </button>
      ))}
    </div>
  )
}