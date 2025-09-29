import "./globals.css" // make sure Tailwind is loaded

export default function HomePage({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>{children}</main>
    </div>
  )
}
