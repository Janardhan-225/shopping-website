"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useShoppingCart } from "@/context/shopping-cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function CartPage() {
  const { isAuthenticated } = useAuth()
  const { cart, removeFromCart, updateQuantity, clearCart } = useShoppingCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutProgress, setCheckoutProgress] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isCheckingOut) {
      const interval = setInterval(() => {
        setCheckoutProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 25
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isCheckingOut])

  if (!isAuthenticated) {
    return null
  }

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shippingFee = totalPrice > 50 ? 0 : 10
  const finalTotal = totalPrice + shippingFee

  const handleCheckout = () => {
    setIsCheckingOut(true)
    setCheckoutProgress(0)

    // Simulate checkout process
    setTimeout(() => {
      clearCart()
      setIsCheckingOut(false)

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. Your items will be shipped soon!",
        duration: 4000,
      })

      router.push("/")
    }, 2500)
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Looks like you haven't added any products to your cart yet. Explore our collection and find something you'll
          love!
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Your Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <Card key={item.id} className="overflow-hidden cart-item" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-white to-accent/20 p-4 flex items-center justify-center">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <CardContent className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                      <p className="font-semibold mt-2 text-primary">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center mt-4 sm:mt-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="h-8 w-8 rounded-full"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-3 w-6 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-[90px]">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                {shippingFee > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Add ${(50 - totalPrice).toFixed(2)} more to get free shipping
                  </div>
                )}
                <div className="border-t border-border pt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-xl text-primary">${finalTotal.toFixed(2)}</span>
                </div>

                {isCheckingOut && (
                  <div className="space-y-2 py-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing payment...</span>
                      <span>{checkoutProgress}%</span>
                    </div>
                    <Progress value={checkoutProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full h-12 text-base" onClick={handleCheckout} disabled={isCheckingOut}>
                  {isCheckingOut ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" /> Checkout
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-6 bg-accent/30 rounded-lg p-4 text-sm">
              <h3 className="font-semibold mb-2">We Accept</h3>
              <div className="flex gap-2">
                <div className="bg-background rounded p-1">
                  <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="24" rx="4" fill="white" />
                    <path d="M15 7H11V17H15V7Z" fill="#FF5F00" />
                    <path
                      d="M11.5 12C11.5 10 12.5 8.2 14 7C12.8 6 11.2 5.5 9.5 5.5C5.9 5.5 3 8.4 3 12C3 15.6 5.9 18.5 9.5 18.5C11.2 18.5 12.8 18 14 17C12.5 15.8 11.5 14 11.5 12Z"
                      fill="#EB001B"
                    />
                    <path
                      d="M23 12C23 15.6 20.1 18.5 16.5 18.5C14.8 18.5 13.2 18 12 17C13.5 15.8 14.5 14 14.5 12C14.5 10 13.5 8.2 12 7C13.2 6 14.8 5.5 16.5 5.5C20.1 5.5 23 8.4 23 12Z"
                      fill="#F79E1B"
                    />
                  </svg>
                </div>
                <div className="bg-background rounded p-1">
                  <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="24" rx="4" fill="white" />
                    <path d="M15 7L12 17H9L12 7H15Z" fill="#00579F" />
                    <path
                      d="M21 7C22 7 22.7 7.3 23 7.5L22.5 9.5C22.2 9.3 21.7 9 21 9C20 9 19.5 9.7 19.5 10.5C19.5 11.3 20.1 11.7 21 12C21.9 12.3 22.5 12.7 22.5 13.8C22.5 15.5 21.2 17 19 17C18 17 17.2 16.7 17 16.5L17.5 14.5C17.8 14.7 18.3 15 19 15C20 15 20.5 14.3 20.5 13.5C20.5 12.7 19.9 12.3 19 12C18.1 11.7 17.5 11.3 17.5 10.2C17.5 8.5 18.8 7 21 7Z"
                      fill="#00579F"
                    />
                    <path d="M24 17H27L28.5 7H25.5L24 17Z" fill="#00579F" />
                    <path d="M29 7L26 17H29L32 7H29Z" fill="#00579F" />
                  </svg>
                </div>
                <div className="bg-background rounded p-1">
                  <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="24" rx="4" fill="white" />
                    <path
                      d="M22.2 7H17.8C15.6 7 14 8.6 14 10.8V13.2C14 15.4 15.6 17 17.8 17H22.2C24.4 17 26 15.4 26 13.2V10.8C26 8.6 24.4 7 22.2 7Z"
                      fill="#FFB600"
                    />
                    <path d="M22.2 7H20V17H22.2C24.4 17 26 15.4 26 13.2V10.8C26 8.6 24.4 7 22.2 7Z" fill="#F7981D" />
                    <path
                      d="M22.2 7H17.8C15.6 7 14 8.6 14 10.8V13.2C14 15.4 15.6 17 17.8 17H22.2C24.4 17 26 15.4 26 13.2V10.8C26 8.6 24.4 7 22.2 7Z"
                      stroke="#E79800"
                    />
                  </svg>
                </div>
                <div className="bg-background rounded p-1">
                  <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="40" height="24" rx="4" fill="white" />
                    <path
                      d="M23.5 7H16.5C14.6 7 13 8.6 13 10.5V13.5C13 15.4 14.6 17 16.5 17H23.5C25.4 17 27 15.4 27 13.5V10.5C27 8.6 25.4 7 23.5 7Z"
                      fill="#016FD0"
                    />
                    <path d="M20 9L21 11H19L20 9Z" fill="white" />
                    <path d="M20 15L19 13H21L20 15Z" fill="white" />
                    <path d="M24 12H16V11H24V12Z" fill="white" />
                    <path d="M24 13H16V14H24V13Z" fill="white" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
