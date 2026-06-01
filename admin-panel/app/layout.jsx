import './globals.css'

export const metadata = {
  title: 'Mine Food Resort - Admin Panel',
  description: 'Manage your restaurant menu',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
        {children}
      </body>
    </html>
  )
}
