import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { products } = data

    const results = await Promise.all(
      products.map(async (product: any) => {
        const { sku, ...productData } = product
        
        // Parse arrays from CSV strings
        if (typeof productData.images === 'string') {
          productData.images = productData.images.split(',').map((s: string) => s.trim())
        }
        if (typeof productData.sizes === 'string') {
          productData.sizes = productData.sizes.split(',').map((s: string) => s.trim())
        }
        if (typeof productData.colors === 'string') {
          productData.colors = productData.colors.split(',').map((s: string) => s.trim())
        }
        
        // Convert price and inventory to numbers
        productData.price = parseFloat(productData.price)
        productData.inventory = parseInt(productData.inventory)
        productData.featured = productData.featured === 'true'
        productData.active = productData.active !== 'false'

        return prisma.product.upsert({
          where: { sku },
          update: productData,
          create: { sku, ...productData }
        })
      })
    )

    return NextResponse.json({ 
      message: 'Products uploaded successfully', 
      count: results.length 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload products' }, { status: 500 })
  }
}