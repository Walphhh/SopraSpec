import "./globals.css"; // make sure Tailwind is loaded

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {/* Page content goes here */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
