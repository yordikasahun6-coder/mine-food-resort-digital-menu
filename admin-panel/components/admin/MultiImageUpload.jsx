'use client'

import { useState } from 'react'

export default function MultiImageUpload({ onImagesChange, currentImages = [] }) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState(currentImages)
  const [urlInput, setUrlInput] = useState('')

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
    } else if (images.includes(urlInput)) {
      alert('Image already added')
    }
  }

  function removeImage(index) {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  function reorderImages(startIndex, endIndex) {
    const result = Array.from(images)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    setImages(result)
    onImagesChange(result)
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
        className="border-2 border-dashed border-[#B3945B]/30 rounded-lg p-6 text-center hover:border-[#B3945B] transition cursor-pointer"
      >
        <p className="text-gray-400 mb-2">📸 Drag & drop images here</p>
        <p className="text-gray-500 text-sm mb-3">or</p>
        <label className="cursor-pointer bg-[#B3945B] text-[#0A0A0A] px-4 py-2 rounded-lg hover:shadow-lg transition">
          Browse Files (Multiple)
          <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
        </label>
        {uploading && <p className="text-[#B3945B] mt-3">Uploading...</p>}
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Or paste image URL..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white"
        />
        <button
          type="button"
          onClick={addImageByUrl}
          className="px-4 py-2 bg-[#B3945B] text-[#0A0A0A] rounded-lg font-bold"
        >
          Add URL
        </button>
      </div>

      {/* Images Gallery */}
      {images.length > 0 && (
        <div>
          <p className="text-[#B3945B] text-sm mb-2">{images.length} image(s) - Drag to reorder</p>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={img} 
                  alt={`Image ${idx + 1}`} 
                  className="w-full h-24 object-cover rounded-lg border border-[#B3945B]/30"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs hover:bg-red-600"
                >
                  ✕
                </button>
                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-2">💡 Tip: First image will be the main display</p>
        </div>
      )}
    </div>
  )
}