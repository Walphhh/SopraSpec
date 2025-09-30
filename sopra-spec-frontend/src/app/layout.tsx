import Navbar from "../components/NavBar"
import Breadcrumb from "../components/Breadcrumb"
import "./globals.css"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/features/common/components/NavBar";
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