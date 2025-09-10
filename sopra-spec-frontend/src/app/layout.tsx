import Navbar from "../components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* Navbar appears on every page */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}