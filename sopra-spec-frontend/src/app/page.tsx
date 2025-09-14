import "./globals.css" // make sure Tailwind is loaded

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Page content goes here */}
        <main>{children}</main>
      </body>
    </html>
  )
}
