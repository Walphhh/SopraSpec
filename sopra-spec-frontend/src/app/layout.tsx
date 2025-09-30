
import Navbar from "../components/NavBar";
import Breadcrumb from "../components/Breadcrumb";
import "./globals.css";  
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/utils/auth-provider";
import SopraChatbot from "@/components/SopraChatbot";

export const metadata: Metadata = {
  title: "SopraSpec",
  description: "Digital specification tool for SOPREMA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <SopraChatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
