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

  let touchStartY = 0

  useEffect(() => {
    fetchMenuItems()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

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
  const handleTouchStart = (e) => touchStartY = e.touches[0].clientY
  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && e.touches[0].clientY > touchStartY + 50) fetchMenuItems()
  }

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
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#B3945B', '#E8C870', '#FFD700', '#D4AF37'] })
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
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(100)
    } else alert('Failed to submit rating')
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
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#B3945B] animate-pulse">LOADING MENU...</div>
      </div>
    )
  }

  return (
    <>
      <ThemeToggle />
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
        <div className="relative overflow-hidden h-[60vh] min-h-[500px]">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-gold-sparkles-falling-on-black-background-32901-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0A0A0A]"></div>
          <div className="relative h-full flex flex-col items-center justify-center text-center z-10">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#B3945B] to-transparent mx-auto mb-6 animate-float"></div>
            <h1 className="text-5xl md:text-7xl font-bold gold-shimmer-text px-4">MINE FOOD RESORT</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-4 px-4">Where culinary excellence meets underground luxury</p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#B3945B] to-transparent mx-auto mt-6 animate-float"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mb-6 -mt-8 relative z-20">
          <div className="flex justify-center gap-4">
            <button onClick={() => setMenuType('food')} className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 btn-shine ${menuType === 'food' ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black shadow-lg scale-105 animate-glow-pulse' : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30 hover:bg-[#B3945B]/10'}`}>🍽️ FOOD</button>
            <button onClick={() => setMenuType('drinks')} className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 btn-shine ${menuType === 'drinks' ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black shadow-lg scale-105 animate-glow-pulse' : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30 hover:bg-[#B3945B]/10'}`}>🍷 DRINKS</button>
          </div>
          <div className="text-center mt-3"><span className="text-[#B3945B] text-sm">{searchedItems.length} {menuType === 'food' ? 'food items' : 'drinks'} available</span></div>
        </div>

        <div className="max-w-md mx-auto mb-6 px-4">
          <div className="relative">
            <input type="text" placeholder="🔍 Search menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-3 pl-10 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white placeholder-gray-500 focus:border-[#B3945B] focus:outline-none transition" />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-400 hover:text-[#B3945B] transition">✕</button>}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mb-6">
          <div className="flex justify-end gap-3">
            <button onClick={() => setSortBy('default')} className={`text-xs px-3 py-1 rounded-full transition ${sortBy === 'default' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Default</button>
            <button onClick={() => setSortBy('price_asc')} className={`text-xs px-3 py-1 rounded-full transition ${sortBy === 'price_asc' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Price ↑</button>
            <button onClick={() => setSortBy('price_desc')} className={`text-xs px-3 py-1 rounded-full transition ${sortBy === 'price_desc' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Price ↓</button>
            <button onClick={() => setSortBy('name_asc')} className={`text-xs px-3 py-1 rounded-full transition ${sortBy === 'name_asc' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Name</button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20">
          {searchedItems.length === 0 ? (
            <div className="text-center py-20"><div className="text-8xl mb-6 opacity-50">🍽️</div><h3 className="text-2xl font-bold text-white mb-2">No items found</h3><p className="text-gray-400">{searchQuery ? `No results for "${searchQuery}"` : `No ${menuType} items available`}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchedItems.map((item, index) => (
                <div key={item.id} onClick={() => { setSelectedItem(item); setSelectedImageIndex(0); if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50) }} className="group bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] rounded-2xl overflow-hidden border border-[#B3945B]/20 hover:border-[#B3945B]/60 transition-all duration-500 cursor-pointer card-3d" style={{ animationDelay: `${index * 0.05}s` }}>
                  {item.images && item.images.length > 0 ? (
                    <div className="image-zoom h-56 relative overflow-hidden bg-[#0A0A0A]">
                      <img key={`${item.id}-${currentImageIndex[item.id] || 0}`} src={getDisplayImage(item)} alt={item.name} className={`w-full h-full object-cover transition-all duration-500 ${animatingImage[item.id] || ''}`} style={{ transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }} />
                      {item.images.length > 1 && <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">{((currentImageIndex[item.id] || 0) + 1)} / {item.images.length}</div>}
                      {item.images.length > 1 && <div className="absolute bottom-2 left-2 flex gap-0.5"><div className="w-1.5 h-1.5 bg-[#B3945B] rounded-full animate-pulse"></div><div className="w-1.5 h-1.5 bg-[#B3945B]/50 rounded-full"></div><div className="w-1.5 h-1.5 bg-[#B3945B]/30 rounded-full"></div></div>}
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-[#B3945B]/10 to-transparent flex items-center justify-center"><span className="text-6xl">{menuType === 'food' ? '🍽️' : '🍷'}</span></div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2"><h2 className="text-xl font-bold text-white group-hover:text-[#B3945B] transition">{item.name}</h2>{item.is_featured && <span className="px-2 py-1 bg-[#B3945B]/20 text-[#B3945B] text-xs rounded-full animate-pulse">⭐</span>}</div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description || 'Delicious prepared with premium ingredients'}</p>
                    <div className="flex items-center gap-1 mb-3"><span className="text-xs text-[#B3945B]">⏱️</span><span className="text-xs text-gray-400">{item.estimated_time || 15} min</span></div>
                    <div className="flex items-center gap-2 mb-3"><StarRating rating={parseFloat(getAverageRating(item.id))} size="small" /><span className="text-gray-500 text-xs">({getRatingCount(item.id)})</span></div>
                    <div className="flex justify-between items-center"><span className="text-2xl font-bold text-[#B3945B]">BIRR {item.price}</span><button className="px-3 py-1 bg-[#B3945B]/20 text-[#B3945B] text-xs rounded-full hover:bg-[#B3945B]/40 transition btn-shine">View</button></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showBackToTop && <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-[#B3945B] text-black w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50">↑</button>}

        {selectedItem && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
            <div className="max-w-2xl w-full bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/30 overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative bg-[#0A0A0A]">
                <img key={selectedImageIndex} src={selectedItem.images?.[selectedImageIndex] || selectedItem.image_url} alt={selectedItem.name} className={`w-full h-72 object-cover transition-all duration-400 ${galleryAnimation}`} />
                {selectedItem.images?.length > 1 && (
                  <>
                    <button onClick={prevGalleryImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full transition-all duration-300 hover:scale-110">◀</button>
                    <button onClick={nextGalleryImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full transition-all duration-300 hover:scale-110">▶</button>
                  </>
                )}
                {selectedItem.images?.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {selectedItem.images.map((_, idx) => (
                      <button key={idx} onClick={(e) => { e.stopPropagation(); setGalleryAnimation('image-crossfade'); setTimeout(() => setGalleryAnimation(''), 400); setSelectedImageIndex(idx) }} className={`transition-all duration-300 ${idx === selectedImageIndex ? 'w-6 h-2 bg-[#B3945B] rounded-full' : 'w-2 h-2 bg-gray-500 rounded-full hover:bg-gray-400'}`} />
                    ))}
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4"><div><h2 className="text-3xl font-bold text-white">{selectedItem.name}</h2><div className="flex items-center gap-1 mt-2"><span className="text-sm text-[#B3945B]">⏱️ Estimated time:</span><span className="text-sm text-white font-semibold">{selectedItem.estimated_time || 15} minutes</span></div></div><button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-[#B3945B] text-2xl transition-transform hover:scale-110">✕</button></div>
                <div className="flex items-center gap-3 mb-4"><StarRating rating={parseFloat(getAverageRating(selectedItem.id))} size="large" /><span className="text-gray-400 text-sm">{getRatingCount(selectedItem.id)} {getRatingCount(selectedItem.id) === 1 ? 'review' : 'reviews'}</span></div>
                <p className="text-gray-300 leading-relaxed mb-6">{selectedItem.description || 'A signature dish crafted by our expert chefs using the finest ingredients.'}</p>
                <div className="flex justify-between items-center"><span className="text-4xl font-bold text-[#B3945B]">BIRR {selectedItem.price}</span></div>
                {selectedItem.spice_level && selectedItem.spice_level !== 'none' && <div className="mt-4 pt-4 border-t border-[#B3945B]/20"><p className="text-[#B3945B] text-sm">🌶️ Spice Level: {selectedItem.spice_level.toUpperCase()}</p></div>}
                <div className="mt-6 pt-4 border-t border-[#B3945B]/20"><p className="text-gray-400 text-sm mb-3">Rate this dish:</p><StarRating rating={0} onRate={(rating) => submitRating(selectedItem.id, rating)} size="large" />{ratingSubmitting && <p className="text-[#B3945B] text-xs mt-2 animate-pulse">Submitting...</p>}</div>
                <div className="mt-6 pt-4 border-t border-[#B3945B]/20"><p className="text-center text-gray-500 text-sm">📋 Please inform your waiter to place an order</p></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}