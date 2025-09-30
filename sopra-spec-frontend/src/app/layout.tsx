import Navbar from "../components/NavBar"
import Breadcrumb from "../components/Breadcrumb"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* Navbar appears on every page */}
        {children}
      </body>
    </html>
  )
}