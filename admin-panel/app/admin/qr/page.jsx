'use client'

import { useState } from 'react'

export default function QRPage() {
  const [tableNumber, setTableNumber] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [qrType, setQrType] = useState('table')
  const [isGenerating, setIsGenerating] = useState(false)

  const CUSTOMER_URL = 'https://mine-food-customer-menu.vercel.app'

  function generateTableQR() {
    if (!tableNumber) {
      alert('Please enter a table number')
      return
    }
    setIsGenerating(true)
    setTimeout(() => {
      const customerUrl = `${CUSTOMER_URL}?table=${tableNumber}`
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(customerUrl)}`
      setQrUrl(qrCodeUrl)
      setIsGenerating(false)
    }, 500)
  }

  function generateAdminQR() {
    setIsGenerating(true)
    setTimeout(() => {
      const adminUrl = `${window.location.origin}/admin/login`
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(adminUrl)}`
      setQrUrl(qrCodeUrl)
      setIsGenerating(false)
    }, 500)
  }

  function downloadQR() {
    if (qrUrl) {
      const link = document.createElement('a')
      link.href = qrUrl
      link.download = qrType === 'table' ? `table-${tableNumber}-qr.png` : 'master-admin-qr.png'
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] border-b border-[#B3945B]/20 px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => window.location.href = '/admin/dashboard'} className="text-[#B3945B] hover:text-[#E8C870] transition p-2 rounded-lg hover:bg-[#B3945B]/10">
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#B3945B]">QR Code Generator</h1>
                <p className="text-gray-500 text-sm">Create QR codes for tables and admin access</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - QR Type Selection */}
          <div className="space-y-6">
            {/* QR Type Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Table QR Card */}
              <button
                onClick={() => {
                  setQrType('table')
                  setQrUrl('')
                  setTableNumber('')
                }}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  qrType === 'table'
                    ? 'bg-gradient-to-br from-[#B3945B]/20 to-[#C4A25A]/10 border-[#B3945B] shadow-lg shadow-[#B3945B]/10'
                    : 'bg-[#1A1A1A] border-[#B3945B]/20 hover:border-[#B3945B]/40'
                }`}
              >
                <div className="text-4xl mb-3">🍽️</div>
                <h3 className="text-white font-bold text-lg">Table QR</h3>
                <p className="text-gray-400 text-sm mt-1">For customers to view menu</p>
                {qrType === 'table' && <div className="mt-3 text-xs text-[#B3945B]">✓ Selected</div>}
              </button>

              {/* Master QR Card */}
              <button
                onClick={() => {
                  setQrType('admin')
                  setQrUrl('')
                  generateAdminQR()
                }}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  qrType === 'admin'
                    ? 'bg-gradient-to-br from-[#B3945B]/20 to-[#C4A25A]/10 border-[#B3945B] shadow-lg shadow-[#B3945B]/10'
                    : 'bg-[#1A1A1A] border-[#B3945B]/20 hover:border-[#B3945B]/40'
                }`}
              >
                <div className="text-4xl mb-3">👑</div>
                <h3 className="text-white font-bold text-lg">Master QR</h3>
                <p className="text-gray-400 text-sm mt-1">For admin quick access</p>
                {qrType === 'admin' && <div className="mt-3 text-xs text-[#B3945B]">✓ Selected</div>}
              </button>
            </div>

            {/* Input Section - Vertical Layout */}
            {qrType === 'table' && (
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-6">
                <label className="block text-[#B3945B] text-sm mb-2 font-medium">TABLE NUMBER</label>
                <input
                  type="number"
                  placeholder="Enter table number"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-gray-700 text-white placeholder-gray-500 focus:border-[#B3945B] transition mb-4"
                  min="1"
                />
                <button
                  onClick={generateTableQR}
                  disabled={isGenerating}
                  className="w-full py-3 bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
                >
                  {isGenerating ? 'GENERATING...' : 'GENERATE QR CODE'}
                </button>
              </div>
            )}

            {qrType === 'admin' && (
              <div className="bg-[#1A1A1A] rounded-2xl border border-[#B3945B]/20 p-6">
                <div className="text-center">
                  <p className="text-gray-300 mb-4">
                    Master QR code for quick admin access from your office.
                  </p>
                  <button
                    onClick={generateAdminQR}
                    disabled={isGenerating}
                    className="w-full py-3 bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-black font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
                  >
                    {isGenerating ? 'GENERATING...' : 'REGENERATE MASTER QR'}
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-[#1A1A1A]/50 rounded-2xl border border-[#B3945B]/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📋</span>
                <h3 className="text-[#B3945B] font-semibold">Instructions</h3>
              </div>
              <ul className="text-gray-400 text-sm space-y-2">
                <li className="flex items-center gap-2">• <span className="text-[#B3945B]">Table QR:</span> Print and place on each table</li>
                <li className="flex items-center gap-2">• <span className="text-[#B3945B]">Master QR:</span> Keep in office for quick access</li>
                <li className="flex items-center gap-2">• Scan with phone camera to open menu/admin panel</li>
              </ul>
            </div>
          </div>

          {/* Right Panel - QR Code Display */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl border border-[#B3945B]/20 p-6 flex flex-col items-center justify-center min-h-[400px]">
            {qrUrl ? (
              <div className="text-center w-full">
                <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-xl">
                  <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
                </div>
                <h3 className="text-xl font-bold text-[#B3945B] mb-2">
                  {qrType === 'table' ? `TABLE ${tableNumber}` : 'MASTER ADMIN QR'}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {qrType === 'table' ? 'Scan to view menu' : 'Scan for admin access'}
                </p>
                <button
                  onClick={downloadQR}
                  className="px-6 py-2 border border-[#B3945B]/50 text-[#B3945B] rounded-xl hover:bg-[#B3945B]/10 transition inline-flex items-center gap-2"
                >
                  📥 Download QR Code
                </button>
                {qrType === 'table' && (
                  <p className="text-gray-500 text-xs mt-4 break-all">
                    {CUSTOMER_URL}?table={tableNumber}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 opacity-50">📱</div>
                <p className="text-gray-400">Select QR type and generate</p>
                <p className="text-gray-500 text-sm mt-2">Your QR code will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}