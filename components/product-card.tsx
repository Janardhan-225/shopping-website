"use client"

import type React from "react"

import Link from "next/link"
import type { Product } from "@/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye } from "lucide-react"
import { useShoppingCart } from "@/context/shopping-cart-context"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useShoppingCart()
  const [isHovering, setIsHovering] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <Card
      className="overflow-hidden h-full flex flex-col product-card"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
        <div className="aspect-square product-image-container p-6 flex items-center justify-center relative">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="max-h-full max-w-full object-contain product-image"
          />
          {isHovering && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-fade-in">
              <Button variant="secondary" size="sm" className="gap-2">
                <Eye className="h-4 w-4" /> Quick View
              </Button>
            </div>
          )}
        </div>
        <CardContent className="flex-1 p-4">
          <span className="category-badge mb-2 inline-block">{product.category}</span>
          <h3 className="font-medium line-clamp-2 mb-1 h-12">{product.title}</h3>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating.rate) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-xs text-gray-600">({product.rating.count})</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="price-tag">${product.price.toFixed(2)}</span>
          <Button size="sm" onClick={handleAddToCart} className="btn-add-to-cart">
            <ShoppingCart className="h-4 w-4 mr-1" /> Add
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
