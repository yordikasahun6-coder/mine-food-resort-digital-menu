'use client'

import { useState } from 'react'

export default function QRPage() {
  const [tableNumber, setTableNumber] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [printAll, setPrintAll] = useState(false)

  function generateQR() {
    if (!tableNumber) return
    const customerUrl = `${window.location.origin}?table=${tableNumber}`
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(customerUrl)}`)
  }

  function printAllTables() {
    setPrintAll(true)
    setTimeout(() => {
      const tables = []
      for (let i = 1; i <= 20; i++) {
        const url = `${window.location.origin}?table=${i}`
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
        tables.push({ number: i, qrUrl })
      }
      
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head>
            <title>Mine Food Resort - All Table QR Codes</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Segoe UI', Arial, sans-serif; 
                padding: 20px; 
                background: white;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #B3945B;
              }
              .header h1 { 
                color: #B3945B; 
                font-size: 28px;
                margin-bottom: 5px;
              }
              .header p { 
                color: #666; 
                font-size: 14px;
              }
              .grid { 
                display: grid; 
                grid-template-columns: repeat(4, 1fr); 
                gap: 20px; 
              }
              .qr-card { 
                text-align: center; 
                border: 1px solid #ddd; 
                padding: 15px; 
                border-radius: 12px;
                break-inside: avoid;
                background: white;
              }
              .qr-card img { 
                width: 150px; 
                height: 150px; 
                margin: 10px auto; 
              }
              .qr-card p { 
                margin: 10px 0 0; 
                font-weight: bold; 
                color: #B3945B;
                font-size: 16px;
              }
              .qr-card .instruction {
                font-size: 10px;
                color: #999;
                font-weight: normal;
                margin-top: 5px;
              }
              @media print {
                .grid { grid-template-columns: repeat(4, 1fr); }
                .qr-card { break-inside: avoid; }
                .header { margin-bottom: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🏨 MINE FOOD RESORT</h1>
              <p>Table QR Codes - Print, Cut & Place on Tables</p>
              <p style="font-size: 12px; margin-top: 5px;">Guests scan to view menu</p>
            </div>
            <div class="grid">
              ${tables.map(t => `
                <div class="qr-card">
                  <img src="${t.qrUrl}" alt="Table ${t.number}" />
                  <p>TABLE ${t.number}</p>
                  <p class="instruction">Scan to view menu</p>
                </div>
              `).join('')}
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 1000);
              }
            </script>
          </body>
        </html>
      `)
      setPrintAll(false)
    }, 100)
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
          {/* Single QR Code */}
          <div>
            <label className="block text-[#B3945B] text-sm mb-2">TABLE NUMBER</label>
            <input
              type="number"
              placeholder="Enter table number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#B3945B]/30 text-white mb-4"
              min="1"
              max="99"
            />
            
            <button
              onClick={generateQR}
              className="w-full bg-[#B3945B] text-[#0A0A0A] font-bold py-3 rounded-lg hover:shadow-lg transition"
            >
              GENERATE QR CODE
            </button>

            {qrUrl && (
              <div className="mt-6 text-center">
                <img src={qrUrl} alt={`QR Code for Table ${tableNumber}`} className="mx-auto mb-4" />
                <p className="text-[#B3945B] font-bold">TABLE #{tableNumber}</p>
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = qrUrl
                    link.download = `table-${tableNumber}-qr.png`
                    link.click()
                  }}
                  className="mt-4 text-sm text-[#B3945B] underline hover:no-underline"
                >
                  Download QR Code
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#B3945B]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1A1A1A] text-gray-500">OR</span>
            </div>
          </div>

          {/* Batch Print */}
          <div>
            <button
              onClick={printAllTables}
              disabled={printAll}
              className="w-full bg-gradient-to-r from-[#B3945B] to-[#C4A25A] text-[#0A0A0A] font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {printAll ? '🖨️ PREPARING...' : '🖨️ PRINT ALL TABLES (1-20)'}
            </button>
            <p className="text-gray-500 text-xs text-center mt-3">
              Prints QR codes for tables 1-20<br />
              Cut and place on each table
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-[#1A1A1A] rounded-xl border border-[#B3945B]/20 p-4">
          <p className="text-[#B3945B] text-sm font-bold mb-2">📋 INSTRUCTIONS:</p>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>1. Print QR codes on sticker paper or regular paper</li>
            <li>2. Cut each QR code individually</li>
            <li>3. Place on corresponding table number</li>
            <li>4. Guests scan with phone camera to view menu</li>
          </ul>
        </div>

        <button
          onClick={() => window.location.href = '/admin/dashboard'}
          className="mt-6 w-full border border-[#B3945B]/50 text-[#B3945B] py-2 rounded-lg hover:bg-[#B3945B]/10 transition"
        >
          ← BACK TO DASHBOARD
        </button>
      </div>
    </div>
  )
}