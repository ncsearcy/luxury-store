import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const includeInactive = searchParams.get('includeInactive') // For admin panel

    const where: any = {}
    
    // For admin panel, include inactive products if requested
    if (includeInactive !== 'true') {
      where.active = true
    }
    
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
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, description, price, category, inventory } = body
    
    if (!name || !description || price === undefined || !category || inventory === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Ensure required fields have proper types
    const productData = {
      name: String(name),
      description: String(description),
      price: parseFloat(price),
      category: String(category),
      inventory: parseInt(inventory),
      imageUrl: body.imageUrl || '', // Handle single imageUrl
      images: body.images || [], // Handle multiple images
      sizes: body.sizes || [],
      colors: body.colors || [],
      featured: Boolean(body.featured || false),
      active: body.active !== false, // Default to true
      sku: body.sku ? String(body.sku) : crypto.randomUUID(), // Ensure SKU is provided or generated
    }

    // Validate data types
    if (isNaN(productData.price) || productData.price <= 0) {
      return NextResponse.json(
        { error: 'Invalid price' }, 
        { status: 400 }
      )
    }

    if (isNaN(productData.inventory) || productData.inventory < 0) {
      return NextResponse.json(
        { error: 'Invalid inventory quantity' }, 
        { status: 400 }
      )
    }
    
    const product = await prisma.product.create({ data: productData })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}