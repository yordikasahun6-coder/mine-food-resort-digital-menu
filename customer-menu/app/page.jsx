'use client'

import { useState, useEffect } from 'react'
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
        const randomInterval = Math.floor(Math.random() * 3000) + 2000
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

  function getGroupedItems(items, cats) {
    const grouped = {}
    cats.forEach(cat => {
      grouped[cat.id] = { name: cat.name, items: [] }
    })
    grouped['uncategorized'] = { name: 'Other Items', items: [] }
    
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
            kodexaContainer.innerHTML = `<p class="text-gray-600 text-xs mt-2 text-center">Powered by <a href="${kodexaUrl}" target="_blank" rel="noopener noreferrer" class="text-[#B3945B] font-semibold hover:underline transition">KODEXA</a> — Premium Digital Solutions</p>`
          } else {
            kodexaContainer.innerHTML = `<p class="text-gray-600 text-xs mt-2 text-center">Powered by <span class="text-[#B3945B] font-semibold">KODEXA</span> — Premium Digital Solutions</p>`
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
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] particle-bg">
      
      <div style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '40px' }}>
        <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #B3945B, transparent)', margin: '0 auto 20px auto', animation: 'float 3s ease-in-out infinite' }}></div>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#B3945B', marginBottom: '16px', letterSpacing: '2px' }}>MINE FOOD RESORT</h1>
        <p style={{ fontSize: '1rem', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto' }}>Where culinary excellence meets underground luxury</p>
        <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #B3945B, transparent)', margin: '20px auto 0 auto', animation: 'float 3s ease-in-out infinite' }}></div>
      </div>

      <div className="flex justify-center gap-4 md:gap-6 mb-8">
        <button onClick={() => setMenuType('food')} className={`px-6 py-3 md:px-8 md:py-3.5 min-h-[44px] min-w-[44px] rounded-full font-bold text-base md:text-lg transition-all duration-300 btn-shine ${menuType === 'food' ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-white shadow-lg scale-105 animate-glow-pulse' : 'bg-[#2A2A2A] text-white border border-[#B3945B]/40 hover:bg-[#B3945B]/20 hover:text-[#B3945B]'}`}>🍽️ FOOD</button>
        <button onClick={() => setMenuType('drinks')} className={`px-6 py-3 md:px-8 md:py-3.5 min-h-[44px] min-w-[44px] rounded-full font-bold text-base md:text-lg transition-all duration-300 btn-shine ${menuType === 'drinks' ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-white shadow-lg scale-105 animate-glow-pulse' : 'bg-[#2A2A2A] text-white border border-[#B3945B]/40 hover:bg-[#B3945B]/20 hover:text-[#B3945B]'}`}>🍷 DRINKS</button>
      </div>

      <div className="text-center mb-6 animate-slide-up">
        <span className="text-[#B3945B] text-sm tracking-wider">{searchedItems.length} PREMIUM ITEMS AVAILABLE</span>
      </div>

      <div className="max-w-md mx-auto mb-6 px-4 animate-slide-up">
        <div className="relative">
          <input type="text" placeholder="SEARCH MENU..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-3 pl-12 min-h-[44px] rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#B3945B] transition" />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B3945B] transition w-8 h-8 flex items-center justify-center">✕</button>}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 animate-slide-up">
        <button onClick={() => setSortBy('default')} className={`text-xs md:text-sm px-4 py-2 md:px-5 md:py-2.5 min-h-[44px] rounded-full transition-all ${sortBy === 'default' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Default</button>
        <button onClick={() => setSortBy('price_asc')} className={`text-xs md:text-sm px-4 py-2 md:px-5 md:py-2.5 min-h-[44px] rounded-full transition-all ${sortBy === 'price_asc' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Price ↑</button>
        <button onClick={() => setSortBy('price_desc')} className={`text-xs md:text-sm px-4 py-2 md:px-5 md:py-2.5 min-h-[44px] rounded-full transition-all ${sortBy === 'price_desc' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Price ↓</button>
        <button onClick={() => setSortBy('name_asc')} className={`text-xs md:text-sm px-4 py-2 md:px-5 md:py-2.5 min-h-[44px] rounded-full transition-all ${sortBy === 'name_asc' ? 'bg-[#B3945B] text-black' : 'text-gray-400 hover:text-[#B3945B]'}`}>Name</button>
      </div>

      {Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-50 animate-float">🍽️</div>
          <h3 className="text-2xl font-bold text-white mb-2">No items found</h3>
          <p className="text-gray-400">Try changing your search or filters</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 pb-20 space-y-12">
          {Object.keys(groupedItems).map((groupId) => (
            <div key={groupId}>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#B3945B] inline-block border-b-2 border-[#B3945B] pb-2">{groupedItems[groupId].name === 'Other Items' ? '🍽️' : '🍽️'} {groupedItems[groupId].name}</h2>
                <p className="text-gray-500 text-sm mt-1">{groupedItems[groupId].items.length} {groupedItems[groupId].items.length === 1 ? 'item' : 'items'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedItems[groupId].items.map((item, index) => (
                  <div key={item.id} onClick={() => { setSelectedItem(item); setSelectedImageIndex(0); }} className="group bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] rounded-2xl overflow-hidden border border-[#B3945B]/20 hover:border-[#B3945B]/60 transition-all duration-500 cursor-pointer card-hover-effect relative" style={{ animationDelay: `${index * 0.05}s` }}>
                    
                    {/* Chef's Pick Badge */}
                    {item.avg_rating > 4.5 && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-[#B3945B] to-[#E8C870] text-black text-xs px-2 py-1 rounded-full z-10 font-bold shadow-md">
                        👨‍🍳 CHEF'S PICK
                      </span>
                    )}
                    
                    {item.images && item.images.length > 0 ? (
                      <div className="h-48 overflow-hidden image-zoom relative">
                        <img src={getDisplayImage(item)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        {item.images.length > 1 && <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">{((currentImageIndex[item.id] || 0) + 1)} / {item.images.length}</div>}
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-[#B3945B]/10 to-transparent flex items-center justify-center">
                        <span className="text-5xl animate-float">{menuType === 'food' ? '🍽️' : '🍷'}</span>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#B3945B] transition">{item.name}</h3>
                        {item.is_featured && <span className="text-[#B3945B] text-xs animate-pulse">⭐</span>}
                      </div>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.description || 'Premium dish crafted with excellence'}</p>
                      
                      {/* Dietary Icons */}
                      <div className="flex gap-2 mt-1 mb-2">
                        {item.spice_level === 'hot' && (
                          <span className="text-red-500 text-sm" title="Very Spicy">🌶️🔥</span>
                        )}
                        {item.spice_level === 'medium' && (
                          <span className="text-orange-500 text-sm" title="Medium Spicy">🌶️</span>
                        )}
                        {item.spice_level === 'mild' && (
                          <span className="text-yellow-500 text-sm" title="Mild Spicy">🌶️</span>
                        )}
                        {item.spice_level === 'none' && item.item_type === 'food' && (
                          <span className="text-green-500 text-sm" title="Not Spicy">⚪</span>
                        )}
                        {item.item_type === 'drinks' && (
                          <span className="text-blue-400 text-sm" title="Beverage">🥤</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-xs text-[#B3945B]">⏱️</span>
                        <span className="text-xs text-gray-400">{item.estimated_time || 15} min</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <StarRating rating={parseFloat(getAverageRating(item.id))} size="small" />
                        <span className="text-gray-500 text-xs">({getRatingCount(item.id)})</span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xl font-bold bg-gradient-to-r from-[#E8C870] to-[#B3945B] bg-clip-text text-transparent">BIRR {item.price}</span>
                        <button className="px-4 py-2 min-h-[44px] min-w-[44px] bg-[#B3945B]/20 text-[#B3945B] text-sm rounded-full hover:bg-[#B3945B]/40 transition btn-shine">View</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showBackToTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-[#B3945B] text-black w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center">↑</button>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedItem(null)}>
          <div className="max-w-2xl w-full bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/30 overflow-hidden animate-bounce-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {selectedItem.images && selectedItem.images.length > 0 && (
              <div className="relative">
                <img src={selectedItem.images[selectedImageIndex]} alt={selectedItem.name} className={`w-full h-72 object-cover transition-all duration-400 ${galleryAnimation}`} />
                {selectedItem.images.length > 1 && (
                  <>
                    <button onClick={prevGalleryImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full transition hover:scale-110 text-xl flex items-center justify-center">◀</button>
                    <button onClick={nextGalleryImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full transition hover:scale-110 text-xl flex items-center justify-center">▶</button>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {selectedItem.images.map((_, idx) => (
                        <button key={idx} onClick={(e) => { e.stopPropagation(); setGalleryAnimation('image-crossfade'); setTimeout(() => setGalleryAnimation(''), 400); setSelectedImageIndex(idx); }} className={`transition-all duration-300 w-8 h-8 flex items-center justify-center ${idx === selectedImageIndex ? 'w-6 h-2 bg-[#B3945B] rounded-full' : 'w-2 h-2 bg-gray-500 rounded-full hover:bg-gray-400'}`} />
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
                <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-[#B3945B] text-3xl transition-transform hover:scale-110 w-10 h-10 flex items-center justify-center">✕</button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={parseFloat(getAverageRating(selectedItem.id))} size="large" />
                <span className="text-gray-400 text-sm">{getRatingCount(selectedItem.id)} reviews</span>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">{selectedItem.description || 'A signature dish crafted by our expert chefs using the finest ingredients.'}</p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-[#E8C870] to-[#B3945B] bg-clip-text text-transparent">BIRR {selectedItem.price}</span>
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