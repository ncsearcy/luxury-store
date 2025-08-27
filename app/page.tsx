'use client'

import React, { useEffect, useState } from 'react'
import { Carousel, Button, Row, Col, Spin, Empty, message } from 'antd'
import ProductCard from '../app/components/shop/ProductCard'
import { Product } from '@/types'
import Link from 'next/link'
import { ShoppingOutlined } from '@ant-design/icons'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/products?featured=true')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Ensure we have an array
        if (Array.isArray(data)) {
          setFeaturedProducts(data)
        } else if (data.error) {
          throw new Error(data.error)
        } else {
          console.warn('Unexpected response format:', data)
          setFeaturedProducts([])
        }
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
        setFeaturedProducts([])
        message.error('Failed to load featured products')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <Carousel autoplay className="h-full" effect="fade" autoplaySpeed={5000}>
          <div>
            <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="text-center text-white space-y-6 z-10 px-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-wider">
                  LUXURY REDEFINED
                </h1>
                <p className="text-xl md:text-2xl font-light tracking-wide">
                  Discover our exclusive collection
                </p>
                <Link href="/products">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="mt-8 h-12 px-8 text-lg"
                    icon={<ShoppingOutlined />}
                  >
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div>
            <div className="h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="text-center text-white space-y-6 z-10 px-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-wider">
                  NEW ARRIVALS
                </h1>
                <p className="text-xl md:text-2xl font-light tracking-wide">
                  Be the first to explore
                </p>
                <Link href="/products">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="mt-8 h-12 px-8 text-lg"
                    icon={<ShoppingOutlined />}
                  >
                    Explore Collection
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-black flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="text-center text-white space-y-6 z-10 px-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-wider">
                  TIMELESS ELEGANCE
                </h1>
                <p className="text-xl md:text-2xl font-light tracking-wide">
                  Crafted for perfection
                </p>
                <Link href="/products">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="mt-8 h-12 px-8 text-lg"
                    icon={<ShoppingOutlined />}
                  >
                    Discover More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Carousel>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Collection</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading products..." />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <Empty 
              description={
                <span className="text-gray-500">
                  Unable to load products. Please try again later.
                </span>
              }
            >
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </Empty>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Empty 
              description={
                <span className="text-gray-500">
                  No featured products available at the moment.
                </span>
              }
            >
              <Link href="/products">
                <Button type="primary">Browse All Products</Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {featuredProducts.slice(0, 8).map(product => (
              <Col key={product.id} xs={24} sm={12} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}

        {featuredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/products">
              <Button type="default" size="large">
                View All Products
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Additional Sections */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">✨</div>
              <h3 className="text-xl font-semibold">Premium Quality</h3>
              <p className="text-gray-600">
                Handcrafted with the finest materials and attention to detail
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl">🚚</div>
              <h3 className="text-xl font-semibold">Free Shipping</h3>
              <p className="text-gray-600">
                Complimentary shipping on all orders over $500
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl">🔒</div>
              <h3 className="text-xl font-semibold">Secure Payment</h3>
              <p className="text-gray-600">
                Your transactions are protected with industry-leading security
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}