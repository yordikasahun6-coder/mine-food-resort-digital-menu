'use client'

import { useState } from 'react'

export default function QRPage() {
  const [tableNumber, setTableNumber] = useState('')
  const [qrUrl, setQrUrl] = useState('')

  function generateQR() {
    if (!tableNumber) return
    const customerUrl = `${window.location.origin}?table=${tableNumber}`
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(customerUrl)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-16 h-px bg-[#B3945B] mb-4"></div>
          <h1 className="text-3xl font-bold text-[#B3945B]">QR CODE GENERATOR</h1>
          <p className="text-gray-500 mt-1">Create QR codes for each table</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl border border-[#B3945B]/20 p-6">
          <input
            type="number"
            placeholder="Table Number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white mb-4"
          />
          
          <button
            onClick={generateQR}
            className="w-full bg-[#B3945B] text-[#0A0A0A] font-bold py-3 rounded-lg hover:shadow-lg transition"
          >
            GENERATE QR CODE
          </button>

          {qrUrl && (
            <div className="mt-6 text-center">
              <img src={qrUrl} alt="QR Code" className="mx-auto mb-4" />
              <p className="text-[#B3945B] font-bold">Table #{tableNumber}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => window.location.href = '/admin/dashboard'}
          className="mt-4 w-full border border-[#B3945B]/50 text-[#B3945B] py-2 rounded-lg hover:bg-[#B3945B]/10 transition"
        >
          ← BACK TO DASHBOARD
        </button>
      </div>
    </div>
  )
}