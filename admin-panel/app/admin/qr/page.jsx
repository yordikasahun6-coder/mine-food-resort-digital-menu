'use client'

import { useState } from 'react'

export default function QRPage() {
  const [tableNumber, setTableNumber] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [qrType, setQrType] = useState('table') // 'table' or 'admin'

  function generateTableQR() {
    if (!tableNumber) return
    
    const customerUrl = `https://mine-food-customer-menu.vercel.app?table=${tableNumber}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(customerUrl)}`
    
    setQrUrl(qrCodeUrl)
  }

  function generateAdminQR() {
    const adminUrl = `https://mine-food-resort-digital-menu-01.vercel.app/admin/login`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(adminUrl)}`
    
    setQrUrl(qrCodeUrl)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-16 h-px bg-[#B3945B] mb-4"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#E8C870] to-[#B3945B] bg-clip-text text-transparent">
            QR CODE GENERATOR
          </h1>
          <p className="text-gray-500 mt-1">Create QR codes for tables or admin access</p>
        </div>

        {/* QR Type Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setQrType('table')
              setQrUrl('')
              setTableNumber('')
            }}
            className={`flex-1 py-3 rounded-lg font-bold transition ${
              qrType === 'table'
                ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-[#0A0A0A] shadow-lg'
                : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'
            }`}
          >
            🍽️ TABLE QR
          </button>
          <button
            onClick={() => {
              setQrType('admin')
              setQrUrl('')
              generateAdminQR()
            }}
            className={`flex-1 py-3 rounded-lg font-bold transition ${
              qrType === 'admin'
                ? 'bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-[#0A0A0A] shadow-lg'
                : 'bg-[#1A1A1A] text-gray-400 border border-[#B3945B]/30'
            }`}
          >
            👑 MASTER QR
          </button>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl border border-[#B3945B]/20 p-6">
          {qrType === 'table' ? (
            <>
              <input
                type="number"
                placeholder="Enter Table Number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white mb-4"
              />
              
              <button
                onClick={generateTableQR}
                className="w-full bg-[#B3945B] text-[#0A0A0A] font-bold py-3 rounded-lg hover:shadow-lg transition"
              >
                GENERATE TABLE QR CODE
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-300 mb-4">
                Master QR Code for quick admin access from your office.
                <br />
                <span className="text-[#B3945B] text-sm">Scan to access admin panel instantly!</span>
              </p>
              <button
                onClick={generateAdminQR}
                className="w-full bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-[#0A0A0A] font-bold py-3 rounded-lg hover:shadow-lg transition"
              >
                REGENERATE MASTER QR
              </button>
            </div>
          )}

          {qrUrl && (
            <div className="mt-6 text-center">
              <img src={qrUrl} alt="QR Code" className="mx-auto mb-4" />
              {qrType === 'table' ? (
                <>
                  <p className="text-[#B3945B] font-bold text-lg">TABLE #{tableNumber}</p>
                  <p className="text-gray-400 text-xs mt-2">Scan to view menu</p>
                </>
              ) : (
                <>
                  <p className="text-[#B3945B] font-bold text-lg">👑 MASTER ADMIN QR</p>
                  <p className="text-gray-400 text-xs mt-2">Scan to access admin panel</p>
                  <p className="text-[#B3945B] text-xs mt-1">Keep in your office for quick access</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => window.location.href = '/admin/dashboard'}
            className="flex-1 border border-[#B3945B]/50 text-[#B3945B] py-2 rounded-lg hover:bg-[#B3945B]/10 transition"
          >
            ← BACK
          </button>
          {qrType === 'admin' && qrUrl && (
            <button
              onClick={() => {
                const link = document.createElement('a')
                link.href = qrUrl
                link.download = 'master-admin-qr.png'
                link.click()
              }}
              className="flex-1 bg-[#B3945B] text-[#0A0A0A] font-bold py-2 rounded-lg hover:shadow-lg transition"
            >
              DOWNLOAD MASTER QR
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-[#1A1A1A] rounded-xl border border-[#B3945B]/20 p-4">
          <p className="text-[#B3945B] text-sm font-bold mb-2">📋 INSTRUCTIONS:</p>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• <strong>TABLE QR:</strong> Generate QR codes for each table. Guests scan to view menu.</li>
            <li>• <strong>MASTER QR:</strong> Keep one in your office. Scan to instantly access admin panel.</li>
            <li>• Print and laminate QR codes for durability.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}