'use client'

import React, { useEffect, useState } from 'react'
import { Row, Col, Spin, Empty, Select, Input, Button, Card } from 'antd'
import ProductCard from '../components/shop/ProductCard'
import { Product } from '@/types'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'

const { Search } = Input
const { Option } = Select

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        console.error('Failed to fetch products')
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  const categories = [...new Set(products.map(product => product.category))]

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-lg text-gray-600">
            Discover our exclusive collection of luxury items
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Search
              placeholder="Search products..."
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: '400px', flex: 1 }}
            />
            
            <Select
              placeholder="All Categories"
              allowClear
              size="large"
              style={{ minWidth: '200px' }}
              onChange={(value) => setSelectedCategory(value || '')}
              suffixIcon={<FilterOutlined />}
            >
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
            
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCategory('')
            }}>
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Empty 
              description="No products found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
              }}>
                Clear Filters
              </Button>
            </Empty>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
            
            <Row gutter={[24, 24]}>
              {filteredProducts.map(product => (
                <Col key={product.id} xs={24} sm={12} lg={8} xl={6}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  )
}