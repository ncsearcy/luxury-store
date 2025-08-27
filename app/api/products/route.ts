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
    console.log('Received product data:', body) // Debug log
    
    // Validate required fields according to your schema
    const { name, price, category, inventory } = body
    
    if (!name || price === undefined || !category || inventory === undefined) {
      console.error('Missing required fields:', { name, price, category, inventory })
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category, inventory' }, 
        { status: 400 }
      )
    }

    // Parse and validate numeric fields
    const parsedPrice = parseFloat(price)
    const parsedInventory = parseInt(inventory)

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: 'Invalid price: must be a positive number' }, 
        { status: 400 }
      )
    }

    if (isNaN(parsedInventory) || parsedInventory < 0) {
      return NextResponse.json(
        { error: 'Invalid inventory: must be a non-negative integer' }, 
        { status: 400 }
      )
    }

    // Generate a unique SKU if not provided
    const generateSKU = () => {
      const timestamp = Date.now().toString(36)
      const random = Math.random().toString(36).substring(2, 8)
      return `${category.toUpperCase().substring(0, 3)}-${timestamp}-${random}`.toUpperCase()
    }

    // Prepare product data according to your schema
    const productData = {
      name: String(name).trim(),
      description: body.description ? String(body.description).trim() : null,
      price: parsedPrice,
      category: String(category).trim(),
      inventory: parsedInventory,
      sku: body.sku || generateSKU(), // Generate SKU if not provided
      brand: body.brand ? String(body.brand).trim() : null,
      material: body.material ? String(body.material).trim() : null,
      featured: Boolean(body.featured),
      active: body.active !== false, // Default to true
      // Handle array fields from your schema
      images: Array.isArray(body.images) ? body.images : (body.imageUrl ? [body.imageUrl] : []),
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
    }

    console.log('Processed product data:', productData) // Debug log

    const product = await prisma.product.create({ 
      data: productData 
    })
    
    console.log('Created product:', product) // Debug log
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Detailed error creating product:', error)
    
    // Handle Prisma-specific errors
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const err = error as { code?: string; message?: string }
      if (err.code === 'P2002') {
        return NextResponse.json(
          { error: 'A product with this SKU already exists' }, 
          { status: 409 }
        )
      }
      if (err.code === 'P2025') {
        return NextResponse.json(
          { error: 'Related record not found' }, 
          { status: 404 }
        )
      }
      // Handle validation errors
      if (err.message?.includes('Invalid') || err.message?.includes('required')) {
        return NextResponse.json(
          { error: err.message }, 
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create product', 
        details: typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : String(error) 
      }, 
      { status: 500 }
    )
  }
}