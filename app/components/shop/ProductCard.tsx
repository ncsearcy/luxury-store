'use client'

import React from 'react'
import { Card, Button, Tag } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  return (
    <Card
      hoverable
      cover={
        <Link href={`/products/${product.id}`}>
          <div className="relative h-96 overflow-hidden bg-gray-100">
            <Image
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
            />
            {product.featured && (
              <Tag color="gold" className="absolute top-4 left-4">
                Featured
              </Tag>
            )}
          </div>
        </Link>
      }
      className="shadow-lg"
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{product.name}</h3>
        {product.brand && (
          <p className="text-sm text-gray-500">{product.brand}</p>
        )}
        <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-gray-500">
            {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
          </span>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => addItem(product, 1)}
            disabled={product.inventory === 0}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  )
}