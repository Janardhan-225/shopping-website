"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useShoppingCart } from "@/context/shopping-cart-context"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Heart, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)
  const { isAuthenticated } = useAuth()
  const { addToCart } = useShoppingCart()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`)
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const handleAddToCart = () => {
    addToCart(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const toggleWishlist = () => {
    setInWishlist(!inWishlist)
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center bg-gradient-to-br from-white to-accent/20 p-8 rounded-lg">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="max-h-[400px] object-contain product-image"
          />
        </div>
        <div className="flex flex-col space-y-6">
          <div>
            <span className="category-badge mb-2 inline-block">{product.category}</span>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(product.rating.rate) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-600">
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-accent/20 p-6 rounded-lg">
            <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
            <p className="text-sm text-green-600 mt-1">In Stock - Free Shipping</p>
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button onClick={handleAddToCart} className="flex-1 h-12 text-base btn-add-to-cart" disabled={addedToCart}>
              {addedToCart ? (
                <>
                  <Check className="mr-2 h-5 w-5" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </>
              )}
            </Button>
            <Button
              onClick={toggleWishlist}
              variant={inWishlist ? "default" : "outline"}
              className="flex-1 h-12 text-base"
            >
              <Heart className={`mr-2 h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
              {inWishlist ? "In Wishlist" : "Add to Wishlist"}
            </Button>
          </div>

          <div className="border-t border-border pt-6 mt-4">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium">Category:</span> {product.category}
              </li>
              <li>
                <span className="font-medium">Rating:</span> {product.rating.rate}/5
              </li>
              <li>
                <span className="font-medium">Reviews:</span> {product.rating.count}
              </li>
              <li>
                <span className="font-medium">SKU:</span> PROD-{product.id.toString().padStart(5, "0")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-6 w-32 mb-6" />

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-8">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <div className="flex flex-col space-y-6">
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-4" />
          </div>

          <Skeleton className="h-20 w-full rounded-lg" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>

          <div className="border-t border-border pt-6 mt-4">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
