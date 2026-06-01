'use client'

import { useState } from 'react'

export default function ImageUpload({ onUploadComplete, currentImage }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || '')
  const [imageUrl, setImageUrl] = useState(currentImage || '')
  const [useUrl, setUseUrl] = useState(!!currentImage && !currentImage.startsWith('blob:'))

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
        setPreview(data.url)
        setImageUrl(data.url)
        onUploadComplete(data.url)
      } else {
        alert('Upload failed: ' + data.error)
      }
    } catch (error) {
      alert('Upload failed: ' + error.message)
    }
    
    setUploading(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      uploadImage(file)
    }
  }

  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (file) uploadImage(file)
  }

  function handleUrlChange(e) {
    const url = e.target.value
    setImageUrl(url)
    setPreview(url)
    onUploadComplete(url)
  }

  return (
    <div className="space-y-4">
      {/* Toggle buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setUseUrl(false)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
            !useUrl
              ? 'bg-[#B3945B] text-[#0A0A0A]'
              : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'
          }`}
        >
          📸 Upload Image
        </button>
        <button
          type="button"
          onClick={() => setUseUrl(true)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
            useUrl
              ? 'bg-[#B3945B] text-[#0A0A0A]'
              : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'
          }`}
        >
          🔗 Image URL
        </button>
      </div>

      {/* Upload option */}
      {!useUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-[#B3945B]/30 rounded-lg p-6 text-center hover:border-[#B3945B] transition cursor-pointer"
        >
          {preview && !useUrl ? (
            <div>
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto mb-3" />
              <button
                type="button"
                onClick={() => {
                  setPreview('')
                  setImageUrl('')
                  onUploadComplete('')
                }}
                className="text-red-500 text-sm hover:text-red-400 transition"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 mb-2">📸 Drag & drop image here</p>
              <p className="text-gray-500 text-sm mb-3">or</p>
              <label className="cursor-pointer bg-[#B3945B] text-[#0A0A0A] px-4 py-2 rounded-lg hover:shadow-lg transition">
                Browse Files
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>
              {uploading && <p className="text-[#B3945B] mt-3">Uploading...</p>}
            </div>
          )}
        </div>
      ) : (
        /* URL option */
        <div>
          <input
            type="url"
            placeholder="https://example.com/food-image.jpg"
            value={imageUrl}
            onChange={handleUrlChange}
            className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white focus:border-[#B3945B] transition"
          />
          {preview && useUrl && (
            <div className="mt-3">
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}