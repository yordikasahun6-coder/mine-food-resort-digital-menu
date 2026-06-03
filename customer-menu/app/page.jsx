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
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#B3945B', '#E8C870'] })
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
        <div className="text-[#B3945B] text-xl animate-pulse text-center">LOADING MENU...</div>
      </div>
    )
  }

  return (
    <>
      <ThemeToggle />
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
        {/* Hero Section */}
        <div className="relative text-center py-16 px-4">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#B3945B] to-transparent mx-auto mb-6"></div>
          <h1 className="text-5xl md:text-6xl font-bold gold-shimmer-text">MINE FOOD RESORT</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-4">Where culinary excellence meets underground luxury</p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#B3945B] to-transparent mx-auto mt-6"></div>
        </div>

        {/* FOOD/DRINKS Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMenuType('food')}
            className={`px-8 py-3 rounded-full font-bold text-lg transition ${
              menuType === 'food'
                ? 'bg-[#B3945B] text-black shadow-lg'
                : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'
            }`}
          >
            🍽️ FOOD
          </button>
          <button
            onClick={() => setMenuType('drinks')}
            className={`px-8 py-3 rounded-full font-bold text-lg transition ${
              menuType === 'drinks'
                ? 'bg-[#B3945B] text-black shadow-lg'
                : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'
            }`}
          >
            🍷 DRINKS
          </button>
        </div>

        {/* Item Count */}
        <div className="text-center mb-4">
          <span className="text-[#B3945B] text-sm">{searchedItems.length} {menuType === 'food' ? 'food items' : 'drinks'} available</span>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6 px-4">
          <input
            type="text"
            placeholder=" Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 px-4 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B]"
          />
        </div>

        {/* Sort Options */}
        <div className="flex justify-center gap-3 mb-8">
          <button onClick={() => setSortBy('default')} className={`text-xs px-3 py-1 rounded-full ${sortBy === 'default' ? 'bg-[#B3945B] text-black' : 'text-gray-400'}`}>Default</button>
          <button onClick={() => setSortBy('price_asc')} className={`text-xs px-3 py-1 rounded-full ${sortBy === 'price_asc' ? 'bg-[#B3945B] text-black' : 'text-gray-400'}`}>Price ↑</button>
          <button onClick={() => setSortBy('price_desc')} className={`text-xs px-3 py-1 rounded-full ${sortBy === 'price_desc' ? 'bg-[#B3945B] text-black' : 'text-gray-400'}`}>Price ↓</button>
          <button onClick={() => setSortBy('name_asc')} className={`text-xs px-3 py-1 rounded-full ${sortBy === 'name_asc' ? 'bg-[#B3945B] text-black' : 'text-gray-400'}`}>Name</button>
        </div>

        {/* Menu Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          {searchedItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl text-white mb-2">No items found</h3>
              <p className="text-gray-400">{searchQuery ? `No results for "${searchQuery}"` : `No ${menuType} items available`}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { setSelectedItem(item); setSelectedImageIndex(0); }}
                  className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#B3945B]/20 hover:border-[#B3945B]/60 transition cursor-pointer"
                >
                  {item.images && item.images.length > 0 ? (
                    <div className="h-48 overflow-hidden">
                      <img src={getDisplayImage(item)} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-[#B3945B]/10 to-transparent flex items-center justify-center">
                      <span className="text-5xl">{menuType === 'food' ? '🍽️' : '🍷'}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      {item.is_featured && <span className="text-[#B3945B] text-xs">⭐</span>}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{item.description?.substring(0, 80)}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-xs text-[#B3945B]">⏱️</span>
                      <span className="text-xs text-gray-400">{item.estimated_time || 15} min</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl font-bold text-[#B3945B]">BIRR {item.price}</span>
                      <button className="px-3 py-1 bg-[#B3945B]/20 text-[#B3945B] text-xs rounded-full">View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Top */}
        {showBackToTop && (
          <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-[#B3945B] text-black w-10 h-10 rounded-full shadow-lg hover:scale-110 transition z-50">
            ↑
          </button>
        )}

        {/* Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
            <div className="max-w-2xl w-full bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/30 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              {selectedItem.images?.[0] && <img src={selectedItem.images[selectedImageIndex]} alt={selectedItem.name} className="w-full h-64 object-cover" />}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.name}</h2>
                <p className="text-gray-400 mb-4">{selectedItem.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-[#B3945B]">BIRR {selectedItem.price}</span>
                  <span className="text-sm text-gray-400">⏱️ {selectedItem.estimated_time || 15} min</span>
                </div>
                <div className="border-t border-[#B3945B]/20 pt-4">
                  <p className="text-gray-400 text-sm mb-2">Rate this dish:</p>
                  <StarRating rating={0} onRate={(rating) => submitRating(selectedItem.id, rating)} size="large" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}