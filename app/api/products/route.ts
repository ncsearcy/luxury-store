import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    const where: any = { active: true }
    if (category) where.category = category
    if (featured === 'true') where.featured = true

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Always return an array, even if empty
    return NextResponse.json(products || [])
  } catch (error) {
    console.error('Error fetching products:', error)
    // Return empty array instead of error to prevent frontend crashes
    // But you could also return an error status if preferred
    return NextResponse.json([], { status: 200 })
    
    // Alternative: Return error response
    // return NextResponse.json({ error: 'Failed to fetch products', products: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Ensure required fields have proper types
    const productData = {
      ...body,
      price: parseFloat(body.price),
      inventory: parseInt(body.inventory),
      images: body.images || [],
      sizes: body.sizes || [],
      colors: body.colors || [],
      featured: body.featured || false,
      active: body.active !== false, // Default to true
    }
    
    const product = await prisma.product.create({ data: productData })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}