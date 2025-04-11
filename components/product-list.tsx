"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types"
import ProductCard from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, ShoppingBag } from "lucide-react"

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products")
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((product: Product) => product.category))]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let result = [...products]

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) => product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
      )
    }

    setFilteredProducts(result)
  }, [selectedCategory, searchQuery, products])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category)
  }

  if (loading) {
    return <ProductListSkeleton />
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Discover Amazing Products
        </h1>
        <p className="text-muted-foreground">Browse our collection of high-quality products at competitive prices</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sticky top-[73px] z-10 bg-background py-4 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("")}
            className="flex items-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-accent/30 rounded-lg">
          <ShoppingBag className="h-16 w-16 text-primary/40 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="text-muted-foreground mt-2">Try changing your search or filter criteria</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("")
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-enter" style={{ animationDelay: `${(product.id % 10) * 50}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProductListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-5 w-full max-w-md mx-auto" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
