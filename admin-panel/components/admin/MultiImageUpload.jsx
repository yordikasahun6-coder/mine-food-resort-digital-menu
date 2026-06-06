'use client'

import { useState } from 'react'

export default function MultiImageUpload({ onImagesChange, currentImages = [] }) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState(currentImages)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  async function uploadImage(file) {
    if (!file) return
    
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        const newImages = [...images, data.url]
        setImages(newImages)
        onImagesChange(newImages)
      } else {
        alert('Upload failed: ' + data.error)
      }
    } catch (error) {
      alert('Upload failed: ' + error.message)
    }
    
    setUploading(false)
  }

  function addImageByUrl() {
    if (urlInput && !images.includes(urlInput)) {
      const newImages = [...images, urlInput]
      setImages(newImages)
      onImagesChange(newImages)
      setUrlInput('')
      setShowUrlInput(false)
    } else if (images.includes(urlInput)) {
      alert('Image already added')
    }
  }

  function removeImage(index) {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  function handleDrop(e) {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        uploadImage(file)
      }
    })
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        uploadImage(file)
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-[#B3945B]/30 rounded-xl p-8 text-center hover:border-[#B3945B] transition cursor-pointer bg-[#0A0A0A]/50"
      >
        <div className="text-5xl mb-3">📸</div>
        <p className="text-gray-400 mb-2">Drag & drop images here</p>
        <p className="text-gray-500 text-sm mb-3">or</p>
        <label className="inline-block cursor-pointer bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black font-medium px-6 py-2 rounded-xl hover:shadow-lg transition">
          Browse Files (Multiple)
          <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
        </label>
        {uploading && <p className="text-[#B3945B] mt-3 text-sm">Uploading...</p>}
      </div>

  {/* URL Input Toggle */}
<div className="flex gap-3">
  {!showUrlInput ? (
    <button
      type="button"
      onClick={() => setShowUrlInput(true)}
      className="w-full py-2.5 border border-[#B3945B]/30 text-[#B3945B] rounded-xl hover:bg-[#B3945B]/10 transition text-sm font-medium"
    >
      + Add Image URL
    </button>
  ) : (
    <div className="w-full space-y-3">
      <input
        type="url"
        placeholder="Paste image URL here..."
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        className="w-full p-2.5 rounded-xl bg-[#0A0A0A] border border-[#B3945B]/30 text-white text-sm focus:outline-none focus:border-[#B3945B] transition"
        onKeyPress={(e) => e.key === 'Enter' && addImageByUrl()}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={addImageByUrl}
          className="flex-1 py-2.5 bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black rounded-xl font-medium text-sm hover:shadow-lg transition"
        >
          Add URL
        </button>
        <button
          type="button"
          onClick={() => {
            setShowUrlInput(false)
            setUrlInput('')
          }}
          className="flex-1 py-2.5 border border-[#B3945B]/30 text-[#B3945B] rounded-xl text-sm hover:bg-[#B3945B]/10 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>
      {/* Images Gallery */}
      {images.length > 0 && (
        <div>
          <p className="text-[#B3945B] text-sm mb-3">{images.length} image(s) uploaded</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={img} 
                  alt={`Image ${idx + 1}`} 
                  className="w-full h-24 object-cover rounded-lg border border-[#B3945B]/30 group-hover:border-[#B3945B] transition"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600 transition flex items-center justify-center shadow-lg"
                >
                  ✕
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-[#B3945B] text-black text-[10px] px-1.5 py-0.5 rounded">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-2">💡 First image is the main display. Click ✕ to remove.</p>
        </div>
      )}
    </div>
  )
}