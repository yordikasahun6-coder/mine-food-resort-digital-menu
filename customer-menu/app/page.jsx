'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import StarRating from '@/components/StarRating'
import confetti from 'canvas-confetti'

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
  const [categories, setCategories] = useState([])
  const [hoveredItem, setHoveredItem] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    fetchMenuItems()
    fetchCategories()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuItems.length === 0) return
    const intervals = {}
    menuItems.forEach(item => {
      if (item.images && item.images.length > 1) {
        const randomInterval = Math.floor(Math.random() * 3500) + 2000
        intervals[item.id] = setInterval(() => {
          setAnimatingImage(prev => ({ ...prev, [item.id]: 'image-crossfade' }))
          setTimeout(() => setAnimatingImage(prev => ({ ...prev, [item.id]: '' })), 500)
          setCurrentImageIndex(prev => ({
            ...prev,
            [item.id]: ((prev[item.id] || 0) + 1) % item.images.length
          }))
        }, randomInterval)
      }
    })
    return () => Object.values(intervals).forEach(clearInterval)
  }, [menuItems])

  useEffect(() => {
    if (!loading) {
      fetchRestaurantSettings()
    }
  }, [loading])

  const handleScroll = () => setShowBackToTop(window.scrollY > 500)
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleCardMouseMove = (e, itemId) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
    setMousePosition({ x, y })
    setHoveredItem(itemId)
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
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#B3945B', '#E8C870', '#FFD700', '#D4AF37'] })
    setTimeout(() => {
      confetti({ particleCount: 100, angle: 60, spread: 80, origin: { x: 0, y: 0.7 }, colors: ['#B3945B', '#E8C870'] })
      confetti({ particleCount: 100, angle: 120, spread: 80, origin: { x: 1, y: 0.7 }, colors: ['#B3945B', '#E8C870'] })
    }, 150)
  }

  function getGroupedItems(items, cats) {
    const grouped = {}
    cats.forEach(cat => {
      grouped[cat.id] = { name: cat.name, items: [] }
    })
    grouped['uncategorized'] = { name: 'Other Delights', items: [] }
    
    items.forEach(item => {
      if (item.category_id && grouped[item.category_id]) {
        grouped[item.category_id].items.push(item)
      } else {
        grouped['uncategorized'].items.push(item)
      }
    })
    
    const result = {}
    Object.keys(grouped).forEach(key => {
      if (grouped[key].items.length > 0) {
        result[key] = grouped[key]
      }
    })
    return result
  }

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
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

  async function fetchRestaurantSettings() {
    try {
      const response = await fetch('/api/restaurant')
      const data = await response.json()
      
      if (response.ok && data) {
        const addressEl = document.getElementById('footer-address')
        const phoneEl = document.getElementById('footer-phone')
        const emailEl = document.getElementById('footer-email')
        const hoursEl = document.getElementById('hours-info')
        const aboutEl = document.getElementById('about-text')
        
        if (addressEl) addressEl.textContent = data.address || 'No address provided'
        if (phoneEl) phoneEl.textContent = data.phone || 'No phone provided'
        if (emailEl) emailEl.textContent = data.email || 'No email provided'
        if (hoursEl) hoursEl.innerHTML = `<p class="text-gray-400">${data.opening_hours || 'Hours not specified'}</p>`
        if (aboutEl) aboutEl.textContent = data.about_text || 'Luxury dining experience in the heart of the city.'
        
        const directionsLink = document.getElementById('directions-link')
        if (directionsLink) {
          if (data.latitude && data.longitude) {
            directionsLink.href = `https://maps.google.com/?q=${data.latitude},${data.longitude}`
          } else if (data.address) {
            directionsLink.href = `https://maps.google.com/?q=${encodeURIComponent(data.address)}`
          }
        }
        
        const socialContainer = document.getElementById('social-links')
        if (socialContainer) {
          let socialHtml = ''
          if (data.instagram_url) socialHtml += `<a href="${data.instagram_url}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#B3945B] transition text-2xl ml-3">📷</a>`
          if (data.facebook_url) socialHtml += `<a href="${data.facebook_url}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#B3945B] transition text-2xl ml-3">📘</a>`
          if (data.tiktok_url) socialHtml += `<a href="${data.tiktok_url}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#B3945B] transition text-2xl ml-3">🎵</a>`
          if (!socialHtml) socialHtml = '<span class="text-gray-400">No social links yet</span>'
          socialContainer.innerHTML = socialHtml
        }
        
        const kodexaUrl = data.kodexa_url
        const kodexaContainer = document.getElementById('kodexa-container')
        if (kodexaContainer) {
          if (kodexaUrl && kodexaUrl !== '') {
            kodexaContainer.innerHTML = `<p class="text-gray-500 text-xs mt-2 text-center">Powered by <a href="${kodexaUrl}" target="_blank" rel="noopener noreferrer" class="text-[#B3945B] font-semibold hover:underline transition">KODEXA</a> — Premium Digital Solutions</p>`
          } else {
            kodexaContainer.innerHTML = `<p class="text-gray-500 text-xs mt-2 text-center">Powered by <span class="text-[#B3945B] font-semibold">KODEXA</span> — Premium Digital Solutions</p>`
          }
        }
      }
    } catch (error) {
      console.error('Error fetching restaurant settings:', error)
    }
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
    if (menuType === 'food') {
      return item.item_type === 'food' || item.item_type === 'both'
    } else {
      return item.item_type === 'drinks' || item.item_type === 'both'
    }
  })

  let searchedItems = filteredItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (sortBy === 'price_asc') searchedItems.sort((a, b) => a.price - b.price)
  else if (sortBy === 'price_desc') searchedItems.sort((a, b) => b.price - a.price)
  else if (sortBy === 'name_asc') searchedItems.sort((a, b) => a.name.localeCompare(b.name))

  const groupedItems = categories.length > 0 ? getGroupedItems(searchedItems, categories) : {}

if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8">
        <div className="text-center mb-12">
          <div className="w-24 h-px bg-[#B3945B]/30 mx-auto mb-6"></div>
          <div className="w-64 h-12 bg-[#1A1A1A] rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="w-80 h-6 bg-[#1A1A1A] rounded-lg mx-auto animate-pulse"></div>
          <div className="w-24 h-px bg-[#B3945B]/30 mx-auto mt-6"></div>
        </div>
        <div className="flex justify-center gap-6 mb-8">
          <div className="w-32 h-12 bg-[#1A1A1A] rounded-full animate-pulse"></div>
          <div className="w-32 h-12 bg-[#1A1A1A] rounded-full animate-pulse"></div>
        </div>
        <div className="max-w-md mx-auto mb-8">
          <div className="w-full h-12 bg-[#1A1A1A] rounded-lg animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#1A1A1A] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-[#2A2A2A]"></div>
                <div className="p-4">
                  <div className="h-6 bg-[#2A2A2A] rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-[#2A2A2A] rounded w-full mb-2"></div>
                  <div className="h-4 bg-[#2A2A2A] rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-[#2A2A2A] rounded w-20"></div>
                    <div className="h-8 bg-[#2A2A2A] rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
      
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-1 h-1 bg-[#B3945B] rounded-full animate-ping"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-[#E8C870] rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-[#B3945B] rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-[#E8C870] rounded-full animate-ping"></div>
        </div>
        
        <div className="relative text-center pt-20 pb-16 px-4">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#B3945B] to-transparent mx-auto mb-8 animate-float"></div>
          <h1 className="text-5xl md:text-7xl font-bold gold-shimmer-text mb-6 tracking-wide">
            MINE FOOD RESORT
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide">
            Where culinary excellence meets underground luxury
          </p>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#B3945B] to-transparent mx-auto mt-8 animate-float"></div>
        </div>
      </div>

      {/* Premium Toggle Buttons */}
      <div className="flex justify-center gap-6 mb-10">
        <button
          onClick={() => setMenuType('food')}
          className={`relative px-10 py-3.5 rounded-full font-bold text-lg transition-all duration-500 overflow-hidden group ${
            menuType === 'food'
              ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black shadow-xl scale-105'
              : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30 hover:bg-[#B3945B]/10'
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-xl">🍽️</span> FOOD
          </span>
          {menuType === 'food' && <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>}
        </button>
        <button
          onClick={() => setMenuType('drinks')}
          className={`relative px-10 py-3.5 rounded-full font-bold text-lg transition-all duration-500 overflow-hidden group ${
            menuType === 'drinks'
              ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black shadow-xl scale-105'
              : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30 hover:bg-[#B3945B]/10'
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-xl">🍷</span> DRINKS
          </span>
          {menuType === 'drinks' && <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>}
        </button>
      </div>

      {/* Premium Stats Bar */}
      <div className="max-w-md mx-auto mb-10 px-4">
        <div className="bg-[#1A1A1A]/50 backdrop-blur-sm rounded-full px-6 py-2 border border-[#B3945B]/20 text-center">
          <span className="text-[#B3945B] text-sm tracking-wider">
            ✨ {searchedItems.length} PREMIUM {menuType === 'food' ? 'DISHES' : 'BEVERAGES'} AVAILABLE ✨
          </span>
        </div>
      </div>

      {/* Premium Search Bar */}
      <div className="max-w-md mx-auto mb-8 px-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B3945B] to-[#E8C870] rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
          <input
            type="text"
            placeholder="🔍 SEARCH OUR MENU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full p-4 pl-12 rounded-xl bg-[#1A1A1A] border border-[#B3945B]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition z-10"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B3945B] transition w-8 h-8 flex items-center justify-center z-10"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Premium Sort Options */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 px-4">
        {['default', 'price_asc', 'price_desc', 'name_asc'].map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              sortBy === option
                ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black shadow-lg'
                : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30 hover:bg-[#B3945B]/10'
            }`}
          >
            {option === 'default' ? 'Default' : option === 'price_asc' ? 'Price ↑' : option === 'price_desc' ? 'Price ↓' : 'Name'}
          </button>
        ))}
      </div>

      {/* Premium Menu Grid */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-6 opacity-50 animate-float">🍽️</div>
          <h3 className="text-2xl font-bold text-white mb-2">No items found</h3>
          <p className="text-gray-400">Try changing your search or filters</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 pb-24 space-y-16">
          {Object.keys(groupedItems).map((groupId) => (
            <div key={groupId} className="animate-fade-in-up">
              {/* Premium Category Header */}
              <div className="flex items-center gap-4 mb-8 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B3945B]/20 to-[#E8C870]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🍽️</span>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                    {groupedItems[groupId].name}
                  </h2>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-[#B3945B] to-transparent mt-2 group-hover:w-24 transition-all duration-500"></div>
                </div>
                <div className="flex-1"></div>
                <div className="text-[#B3945B] text-sm bg-[#1A1A1A] px-3 py-1 rounded-full">
                  {groupedItems[groupId].items.length} items
                </div>
              </div>
              
              {/* Premium Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedItems[groupId].items.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => { setSelectedItem(item); setSelectedImageIndex(0); }}
                    onMouseMove={(e) => handleCardMouseMove(e, item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="group relative bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl overflow-hidden border border-[#B3945B]/20 hover:border-[#B3945B]/60 transition-all duration-500 cursor-pointer"
                    style={{
                      transform: hoveredItem === item.id ? `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)` : 'perspective(1000px) rotateX(0) rotateY(0)',
                      transition: 'transform 0.2s ease-out'
                    }}
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#B3945B]/10 via-transparent to-transparent pointer-events-none"></div>
                    
                    {/* Chef's Pick Badge */}
                    {item.avg_rating > 4.5 && (
                      <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-[#B3945B] to-[#E8C870] text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                        👨‍🍳 CHEF'S PICK
                      </div>
                    )}
                    
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <>
                          <img 
                            src={getDisplayImage(item)} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60"></div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#B3945B]/20 to-[#1A1A1A] flex items-center justify-center">
                          <span className="text-6xl animate-float">{menuType === 'food' ? '🍽️' : '🍷'}</span>
                        </div>
                      )}
                      
                      {/* Image Counter */}
                      {item.images && item.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs z-20">
                          {((currentImageIndex[item.id] || 0) + 1)} / {item.images.length}
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-[#B3945B] transition-colors duration-300">
                          {item.name}
                        </h3>
                        {item.is_featured && (
                          <span className="text-[#B3945B] text-sm animate-pulse">✦</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {item.description || 'A premium dish crafted with excellence'}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.spice_level === 'hot' && <span className="text-red-400 text-xs">🌶️ Hot</span>}
                        {item.spice_level === 'medium' && <span className="text-orange-400 text-xs">🌶️ Medium</span>}
                        {item.spice_level === 'mild' && <span className="text-yellow-400 text-xs">🌶️ Mild</span>}
                        {item.estimated_time && (
                          <span className="text-gray-500 text-xs">⏱️ {item.estimated_time} min</span>
                        )}
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <StarRating rating={parseFloat(getAverageRating(item.id))} size="small" />
                        <span className="text-gray-500 text-xs">({getRatingCount(item.id)})</span>
                      </div>
                      
                      {/* Price and Action */}
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#E8C870] to-[#B3945B] bg-clip-text text-transparent">
                          BIRR {item.price}
                        </span>
                        <button className="px-5 py-2 bg-[#B3945B]/20 text-[#B3945B] text-sm rounded-full hover:bg-[#B3945B] transition-all duration-300 hover:scale-105">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Premium Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center group"
        >
          <span className="text-xl group-hover:-translate-y-0.5 transition-transform">↑</span>
        </button>
      )}

      {/* Premium Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedItem(null)}>
          <div className="max-w-3xl w-full bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-3xl border border-[#B3945B]/30 overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Hero Image */}
            <div className="relative h-80 md:h-96">
              {selectedItem.images && selectedItem.images.length > 0 ? (
                <>
                  <img 
                    src={selectedItem.images[selectedImageIndex]} 
                    alt={selectedItem.name} 
                    className={`w-full h-full object-cover transition-all duration-500 ${galleryAnimation}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#B3945B]/20 to-[#1A1A1A] flex items-center justify-center">
                  <span className="text-8xl">{selectedItem.item_type === 'food' ? '🍽️' : '🍷'}</span>
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B3945B] to-transparent"></div>
              
              {selectedItem.images && selectedItem.images.length > 1 && (
                <>
                  <button onClick={prevGalleryImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm hover:bg-[#B3945B] text-white hover:text-black flex items-center justify-center transition-all duration-300 hover:scale-110">←</button>
                  <button onClick={nextGalleryImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm hover:bg-[#B3945B] text-white hover:text-black flex items-center justify-center transition-all duration-300 hover:scale-110">→</button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedItem.images.map((_, idx) => (
                      <button key={idx} onClick={() => setSelectedImageIndex(idx)} className={`transition-all duration-300 ${idx === selectedImageIndex ? 'w-8 h-1.5 bg-[#B3945B] rounded-full' : 'w-3 h-1.5 bg-white/50 rounded-full'}`} />
                    ))}
                  </div>
                </>
              )}
              
              {selectedItem.is_featured && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[#B3945B] to-[#E8C870] text-black text-xs font-bold rounded-full shadow-lg z-20">
                  SIGNATURE
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{selectedItem.name}</h2>
                  <div className="flex items-center gap-3">
                    <StarRating rating={parseFloat(getAverageRating(selectedItem.id))} size="large" />
                    <span className="text-gray-400 text-sm">{getRatingCount(selectedItem.id)} reviews</span>
                  </div>
                </div>
                <button onClick={() => setSelectedItem(null)} className="w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-[#B3945B]/20 text-gray-400 hover:text-[#B3945B] transition-all duration-300 flex items-center justify-center text-xl">✕</button>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-8 text-base">{selectedItem.description || 'A signature dish crafted by our expert chefs using the finest ingredients.'}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#B3945B]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">💰</span>
                    <span className="text-gray-400 text-sm">PRICE</span>
                  </div>
                  <p className="text-3xl font-bold text-[#B3945B]">BIRR {selectedItem.price}</p>
                </div>
                <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#B3945B]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">⏱️</span>
                    <span className="text-gray-400 text-sm">PREP TIME</span>
                  </div>
                  <p className="text-2xl font-semibold text-white">{selectedItem.estimated_time ? `${selectedItem.estimated_time} min` : '—'}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${selectedItem.item_type === 'food' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : selectedItem.item_type === 'drinks' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
                  {selectedItem.item_type === 'food' ? '🍽️ Food' : selectedItem.item_type === 'drinks' ? '🍷 Drinks' : '🍽️🍷 Food & Drink'}
                </span>
                {selectedItem.spice_level && selectedItem.spice_level !== 'none' && (
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">🌶️ {selectedItem.spice_level.toUpperCase()}</span>
                )}
              </div>
              
              <div className="pt-6 border-t border-[#B3945B]/20">
                <p className="text-gray-400 text-sm mb-4">Rate this dish</p>
                <div className="flex items-center gap-4">
                  <StarRating rating={0} onRate={(rating) => submitRating(selectedItem.id, rating)} size="large" />
                  {ratingSubmitting && <span className="text-[#B3945B] text-sm animate-pulse">Submitting...</span>}
                </div>
              </div>
              
              <div className="mt-6 pt-4 text-center">
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">📋 Please inform your waiter to place an order</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Footer */}
      <footer className="bg-[#0A0A0A] border-t border-[#B3945B]/20 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#B3945B]">MINE FOOD RESORT</h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#B3945B] to-transparent mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-[#B3945B] font-bold text-lg mb-4">📞 CONTACT</h3>
              <div>
                <p className="text-gray-400 mb-2">📍 <span id="footer-address">Loading address...</span></p>
                <p className="text-gray-400 mb-2">📞 <span id="footer-phone">Loading phone...</span></p>
                <p className="text-gray-400 mb-2">✉️ <span id="footer-email">Loading email...</span></p>
              </div>
              <div className="mt-4">
                <a id="directions-link" href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#B3945B] text-sm hover:text-[#E8C870] transition">🗺️ GET DIRECTIONS</a>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-[#B3945B] font-bold text-lg mb-4">⏰ HOURS</h3>
              <div id="hours-info"><p className="text-gray-400">Loading hours...</p></div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-[#B3945B] font-bold text-lg mb-4">🌐 FOLLOW US</h3>
              <div className="flex justify-center md:justify-start space-x-4" id="social-links"><span className="text-gray-400">Loading...</span></div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#B3945B]/20 text-center">
            <h3 className="text-[#B3945B] font-bold text-lg mb-3">🏔️ ABOUT US</h3>
            <p id="about-text" className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">Loading...</p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#B3945B]/10 text-center">
            <p className="text-gray-500 text-xs">© 2024 Mine Food Resort. All rights reserved.</p>
          </div>
          <div id="kodexa-container" className="mt-2"></div>
        </div>
      </footer>
    </div>
  )
}