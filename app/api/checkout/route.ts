import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo } = await request.json()

    // Calculate total
    const lineItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        })

        if (!product) throw new Error(`Product ${item.productId} not found`)

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: `${item.size ? `Size: ${item.size}` : ''} ${item.color ? `Color: ${item.color}` : ''}`.trim(),
              images: product.images,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: item.quantity,
        }
      })
    )

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'FR', 'DE', 'IT', 'ES'],
      },
      metadata: {
        customerInfo: JSON.stringify(customerInfo),
        items: JSON.stringify(items)
      }
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}