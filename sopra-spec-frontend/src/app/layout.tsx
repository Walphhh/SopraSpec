import NavBar from "@/components/NavBar"
import "./globals.css"
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/utils/auth-provider";

export const metadata: Metadata = {
  title: "SopraSpec",
  description: "Digital specification tool for SOPREMA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}