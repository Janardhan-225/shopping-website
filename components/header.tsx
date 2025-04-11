"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useShoppingCart } from "@/context/shopping-cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, LogOut, Home, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()
  const { cart } = useShoppingCart()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  if (pathname === "/auth/login") {
    return (
      <header className="border-b bg-gradient-to-r from-primary/90 to-secondary/90 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            ShopVibe
          </Link>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white hover:text-white hover:bg-white/20"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </header>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <header className="border-b sticky top-0 bg-background z-10 shadow-sm">
      <div className="bg-gradient-to-r from-primary to-secondary h-1"></div>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary group-hover:scale-110 transition-transform"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          ShopVibe
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className={cn(
              "flex items-center text-sm transition-colors hover:text-primary",
              pathname === "/" ? "font-medium text-primary" : "text-muted-foreground",
            )}
          >
            <Home className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            href="/cart"
            className={cn(
              "flex items-center text-sm relative transition-colors hover:text-primary",
              pathname === "/cart" ? "font-medium text-primary" : "text-muted-foreground",
            )}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-primary hover:bg-primary/5"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
