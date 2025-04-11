import type React from "react"
import { Inter } from "next/font/google"
import { ShoppingCartProvider } from "@/context/shopping-cart-context"
import { AuthProvider } from "@/context/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ShopVibe | Modern Shopping Experience",
  description: "A vibrant shopping website built with React.js and Fake Store API",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <ShoppingCartProvider>
              <Header />
              <main className="container mx-auto px-4 py-8 page-container">{children}</main>
            </ShoppingCartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'