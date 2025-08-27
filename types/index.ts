export interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  images: string[]
  category: string
  brand?: string | null
  sku: string
  inventory: number
  sizes: string[]
  colors: string[]
  material?: string | null
  featured: boolean
  active: boolean
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  size?: string
  color?: string
}

export interface CheckoutFormData {
  email: string
  shippingAddress: {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  billingAddress: {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}