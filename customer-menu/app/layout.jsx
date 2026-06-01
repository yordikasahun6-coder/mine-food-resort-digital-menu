import './globals.css'

export const metadata = {
  title: 'Mine Food Resort',
  description: 'Luxury dining experience',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] min-h-screen">
        {children}
      </body>
    </html>
  )
}
