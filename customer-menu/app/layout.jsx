import './globals.css'

export const metadata = {
  title: 'Mine Food Resort',
  description: 'Luxury dining experience',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}