'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import StarRating from '@/components/StarRating'
import confetti from 'canvas-confetti'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [menuType, setMenuType] = useState('food')
  const [searchQuery, setSearchQuery] = useState('')
  const [ratings, setRatings] = useState({})
  const [ratingSubmitting, setRatingSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  const [animatingImage, setAnimatingImage] = useState({})
  const [galleryAnimation, setGalleryAnimation] = useState('')

  useEffect(() => {
    fetchMenuItems()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-cycle images every 3 seconds
  useEffect(() => {
    if (menuItems.length === 0) return
    const intervals = {}
    menuItems.forEach(item => {
      if (item.images && item.images.length > 1) {
        intervals[item.id] = setInterval(() => {
          setAnimatingImage(prev => ({ ...prev, [item.id]: 'image-crossfade' }))
          setTimeout(() => setAnimatingImage(prev => ({ ...prev, [item.id]: '' })), 500)
          setCurrentImageIndex(prev => ({
            ...prev,
            [item.id]: ((prev[item.id] || 0) + 1) % item.images.length
          }))
        }, 3000)
      }
    })
    return () => Object.values(intervals).forEach(clearInterval)
  }, [menuItems])

  const handleScroll = () => setShowBackToTop(window.scrollY > 500)
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const getDisplayImage = (item) => {
    if (item.images && item.images.length > 0) {
      const index = currentImageIndex[item.id] || 0
      return item.images[index]
    }
    return item.image_url || null
  }

  const nextGalleryImage = (e) => {
    e.stopPropagation()
    setGalleryAnimation('image-slide-right')
    setTimeout(() => setGalleryAnimation(''), 400)
    setSelectedImageIndex(prev => prev === selectedItem.images.length - 1 ? 0 : prev + 1)
  }

  const prevGalleryImage = (e) => {
    e.stopPropagation()
    setGalleryAnimation('image-slide-left')
    setTimeout(() => setGalleryAnimation(''), 400)
    setSelectedImageIndex(prev => prev === 0 ? selectedItem.images.length - 1 : prev - 1)
  }

  const triggerConfetti = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#B3945B', '#E8C870', '#FFD700'] })
    setTimeout(() => {
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ['#B3945B', '#E8C870'] })
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ['#B3945B', '#E8C870'] })
    }, 150)
  }

  async function fetchMenuItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('sort_order')
    if (!error && data) {
      setMenuItems(data)
      for (const item of data) {
        const itemRatings = await fetchRatings(item.id)
        setRatings(prev => ({ ...prev, [item.id]: itemRatings }))
      }
    }
    setLoading(false)
  }

  async function fetchRatings(itemId) {
    const response = await fetch(`/api/ratings?menu_item_id=${itemId}`)
    return await response.json()
  }

  async function submitRating(itemId, rating) {
    setRatingSubmitting(true)
    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menu_item_id: itemId, rating })
    })
    if (response.ok) {
      if (rating === 5) triggerConfetti()
      alert('⭐ Thank you for your feedback!')
      const newRatings = await fetchRatings(itemId)
      setRatings(prev => ({ ...prev, [itemId]: newRatings }))
    }
    setRatingSubmitting(false)
  }

  function getAverageRating(itemId) {
    const itemRatings = ratings[itemId] || []
    if (itemRatings.length === 0) return 0
    const sum = itemRatings.reduce((acc, r) => acc + r.rating, 0)
    return (sum / itemRatings.length).toFixed(1)
  }

  function getRatingCount(itemId) {
    return (ratings[itemId] || []).length
  }

  let filteredItems = menuItems.filter(item => {
    if (menuType === 'food') return item.item_type === 'food' || item.item_type === 'both'
    else return item.item_type === 'drinks' || item.item_type === 'both'
  })

  let searchedItems = filteredItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (sortBy === 'price_asc') searchedItems.sort((a, b) => a.price - b.price)
  else if (sortBy === 'price_desc') searchedItems.sort((a, b) => b.price - a.price)
  else if (sortBy === 'name_asc') searchedItems.sort((a, b) => a.name.localeCompare(b.name))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#B3945B] text-xl animate-pulse">LOADING MENU...</div>
      </div>
    )
  }

  return (
    <>
      <ThemeToggle />
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] particle-bg">
        
       {/* ===== HERO SECTION WITH FLOATING ANIMATIONS ===== */}
<div style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '40px' }}>
  
  {/* Top gold line - ANIMATED */}
  <div style={{ 
    width: '60px', 
    height: '2px', 
    background: 'linear-gradient(90deg, transparent, #B3945B, transparent)',
    margin: '0 auto 20px auto',
    animation: 'float 3s ease-in-out infinite'
  }}></div>
  
  {/* Main Title */}
  <h1 style={{ 
    fontSize: '3rem', 
    fontWeight: 'bold', 
    color: '#B3945B',
    marginBottom: '16px',
    letterSpacing: '2px'
  }}>
    MINE FOOD RESORT
  </h1>
  
  {/* Subtitle */}
  <p style={{ 
    fontSize: '1rem', 
    color: '#9CA3AF',
    maxWidth: '600px',
    margin: '0 auto'
  }}>
    Where culinary excellence meets underground luxury
  </p>
  
  {/* Bottom gold line - ANIMATED */}
  <div style={{ 
    width: '60px', 
    height: '2px', 
    background: 'linear-gradient(90deg, transparent, #B3945B, transparent)',
    margin: '20px auto 0 auto',
    animation: 'float 3s ease-in-out infinite'
  }}></div>
</div>
       {/* FOOD/DRINKS Toggle - Fixed Text Color */}
<div className="flex justify-center gap-6 mb-8">
  <button
    onClick={() => setMenuType('food')}
    className={`px-10 py-3 rounded-full font-bold text-lg transition-all duration-300 btn-shine ${
      menuType === 'food'
        ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-white shadow-lg scale-105 animate-glow-pulse'
        : 'bg-[#2A2A2A] text-white border border-[#B3945B]/40 hover:bg-[#B3945B]/20 hover:text-[#B3945B]'
    }`}
  >
    🍽️ FOOD
  </button>
  <button
    onClick={() => setMenuType('drinks')}
    className={`px-10 py-3 rounded-full font-bold text-lg transition-all duration-300 btn-shine ${
      menuType === 'drinks'
        ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-white shadow-lg scale-105 animate-glow-pulse'
        : 'bg-[#2A2A2A] text-white border border-[#B3945B]/40 hover:bg-[#B3945B]/20 hover:text-[#B3945B]'
    }`}
  >
    🍷 DRINKS
  </button>
</div>

        {/* Item Count */}
        <div className="text-center mb-6 animate-slide-up">
          <span className="text-[#B3945B] text-sm tracking-wider">{searchedItems.length} PREMIUM ITEMS AVAILABLE</span>
        </div>

        {/* Search Bar with Icon */}
        <div className="max-w-md mx-auto mb-6 px-4 animate-slide-up">
          <div className="relative">
            <input
              type="text"
              placeholder="SEARCH MENU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-12 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition"
            />
            <span className="absolute left-4 top-3 text-gray-400 text-lg">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3 text-gray-400 hover:text-[#B3945B] transition"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex justify-center gap-3 mb-10 animate-slide-up">
          <button onClick={() => setSortBy('default')} className={`text-xs px-4 py-1.5 rounded-full transition-all ${sortBy === 'default' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Default</button>
          <button onClick={() => setSortBy('price_asc')} className={`text-xs px-4 py-1.5 rounded-full transition-all ${sortBy === 'price_asc' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Price ↑</button>
          <button onClick={() => setSortBy('price_desc')} className={`text-xs px-4 py-1.5 rounded-full transition-all ${sortBy === 'price_desc' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Price ↓</button>
          <button onClick={() => setSortBy('name_asc')} className={`text-xs px-4 py-1.5 rounded-full transition-all ${sortBy === 'name_asc' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Name</button>
        </div>

        {/* Premium Menu Grid with Stagger Animation */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          {searchedItems.length === 0 ? (
            <div className="text-center py-20 animate-scale-fade">
              <div className="text-7xl mb-4 opacity-50 animate-float">🍽️</div>
              <h3 className="text-2xl font-bold text-white mb-2">No items found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
              {searchedItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => { setSelectedItem(item); setSelectedImageIndex(0); }}
                  className="group bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] rounded-2xl overflow-hidden border border-[#B3945B]/20 hover:border-[#B3945B]/60 transition-all duration-500 cursor-pointer card-hover-effect"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.images && item.images.length > 0 ? (
                    <div className="h-56 overflow-hidden image-zoom relative">
                      <img src={getDisplayImage(item)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      {item.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          {((currentImageIndex[item.id] || 0) + 1)} / {item.images.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-[#B3945B]/10 to-transparent flex items-center justify-center">
                      <span className="text-6xl animate-float">{menuType === 'food' ? '🍽️' : '🍷'}</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#B3945B] transition">{item.name}</h3>
                      {item.is_featured && <span className="text-[#B3945B] text-xs animate-pulse">⭐ SIGNATURE</span>}
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description || 'Premium dish crafted with excellence'}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-xs text-[#B3945B]">⏱️</span>
                      <span className="text-xs text-gray-400">{item.estimated_time || 15} min</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <StarRating rating={parseFloat(getAverageRating(item.id))} size="small" />
                      <span className="text-gray-500 text-xs">({getRatingCount(item.id)})</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-2xl font-bold text-[#B3945B]">BIRR {item.price}</span>
                      <button className="px-4 py-1.5 bg-[#B3945B]/20 text-[#B3945B] text-sm rounded-full hover:bg-[#B3945B]/40 transition btn-shine">View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-[#B3945B] text-black w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 animate-bounce-in">↑</button>
        )}

        {/* Premium Modal with Gallery */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedItem(null)}>
            <div className="max-w-2xl w-full bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/30 overflow-hidden animate-bounce-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {selectedItem.images && selectedItem.images.length > 0 && (
                <div className="relative">
                  <img src={selectedItem.images[selectedImageIndex]} alt={selectedItem.name} className={`w-full h-72 object-cover transition-all duration-400 ${galleryAnimation}`} />
                  {selectedItem.images.length > 1 && (
                    <>
                      <button onClick={prevGalleryImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full transition hover:scale-110 text-xl">◀</button>
                      <button onClick={nextGalleryImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full transition hover:scale-110 text-xl">▶</button>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {selectedItem.images.map((_, idx) => (
                          <button key={idx} onClick={(e) => { e.stopPropagation(); setGalleryAnimation('image-crossfade'); setTimeout(() => setGalleryAnimation(''), 400); setSelectedImageIndex(idx); }} className={`transition-all duration-300 ${idx === selectedImageIndex ? 'w-6 h-2 bg-[#B3945B] rounded-full' : 'w-2 h-2 bg-gray-500 rounded-full hover:bg-gray-400'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedItem.name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-[#B3945B]">⏱️ Estimated preparation time:</span>
                      <span className="text-sm text-white font-semibold">{selectedItem.estimated_time || 15} minutes</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-[#B3945B] text-3xl transition-transform hover:scale-110">✕</button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={parseFloat(getAverageRating(selectedItem.id))} size="large" />
                  <span className="text-gray-400 text-sm">{getRatingCount(selectedItem.id)} {getRatingCount(selectedItem.id) === 1 ? 'review' : 'reviews'}</span>
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">{selectedItem.description || 'A signature dish crafted by our expert chefs using the finest ingredients.'}</p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-4xl font-bold text-[#B3945B] gold-shimmer-text">BIRR {selectedItem.price}</span>
                  {selectedItem.spice_level && selectedItem.spice_level !== 'none' && (
                    <div className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                      <span className="text-red-400 text-sm">🌶️ {selectedItem.spice_level.toUpperCase()} SPICE</span>
                    </div>
                  )}
                </div>

                {selectedItem.item_type === 'both' && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#B3945B]/20 text-[#B3945B] text-sm rounded-full">🍽️ Food & 🍷 Drink</span>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-[#B3945B]/20">
                  <p className="text-gray-400 text-sm mb-3">Rate this dish:</p>
                  <StarRating rating={0} onRate={(rating) => submitRating(selectedItem.id, rating)} size="large" />
                  {ratingSubmitting && <p className="text-[#B3945B] text-xs mt-2 animate-pulse">Submitting...</p>}
                </div>

                <div className="mt-6 pt-4 border-t border-[#B3945B]/20">
                  <p className="text-center text-gray-500 text-sm">📋 Please inform your waiter to place an order</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}