'use client'

import React, { useState } from 'react'
import { Form, Input, InputNumber, Select, Switch, Button, Upload, message, Space, Tag } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'

const { Option } = Select

interface ProductFormData {
  name: string
  description?: string
  price: number
  sku: string
  category: string
  brand?: string
  inventory: number
  sizes: string[]
  colors: string[]
  images: string[]
  material?: string
  featured: boolean
  active: boolean
}

const categories = [
  'Outerwear',
  'Dresses',
  'Suits',
  'Knitwear',
  'Shirts',
  'Trousers',
  'Shoes',
  'Accessories',
  'Bags',
  'Jewelry'
]

const availableSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const availableColors = [
  'Black', 'White', 'Gray', 'Navy', 'Brown', 'Beige', 
  'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple',
  'Gold', 'Silver', 'Burgundy', 'Cream'
]

export default function ProductForm() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')

  const handleSubmit = async (values: ProductFormData) => {
    setLoading(true)
    try {
      const productData = {
        ...values,
        images: imageUrls,
        price: parseFloat(values.price.toString()),
        inventory: parseInt(values.inventory.toString())
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        message.success('Product created successfully!')
        form.resetFields()
        setImageUrls([])
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create product')
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const addImageUrl = () => {
    if (newImageUrl && newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          featured: false,
          active: true,
          inventory: 0,
          price: 0
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="e.g., Classic Leather Jacket" />
          </Form.Item>

          <Form.Item
            label="SKU"
            name="sku"
            rules={[
              { required: true, message: 'Please enter SKU' },
              { pattern: /^[A-Z0-9-]+$/, message: 'SKU must be uppercase letters, numbers, and hyphens only' }
            ]}
          >
            <Input placeholder="e.g., LJ001" className="uppercase" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category">
              {categories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Brand"
            name="brand"
          >
            <Input placeholder="e.g., LuxBrand" />
          </Form.Item>

          <Form.Item
            label="Price ($)"
            name="price"
            rules={[
              { required: true, message: 'Please enter price' },
              { type: 'number', min: 0, message: 'Price must be positive' }
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="0.00"
              precision={2}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label="Inventory"
            name="inventory"
            rules={[
              { required: true, message: 'Please enter inventory count' },
              { type: 'number', min: 0, message: 'Inventory must be non-negative' }
            ]}
          >
            <InputNumber className="w-full" min={0} placeholder="0" />
          </Form.Item>

          <Form.Item
            label="Material"
            name="material"
          >
            <Input placeholder="e.g., 100% Italian Leather" />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item
              label="Featured"
              name="featured"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Active"
              name="active"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          label="Description"
          name="description"
        >
          <TextArea 
            rows={4} 
            placeholder="Enter product description..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="Available Sizes"
          name="sizes"
          rules={[{ required: true, message: 'Please select at least one size' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select available sizes"
          >
            {availableSizes.map(size => (
              <Option key={size} value={size}>{size}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Available Colors"
          name="colors"
          rules={[{ required: true, message: 'Please select at least one color' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select available colors"
          >
            {availableColors.map(color => (
              <Option key={color} value={color}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ 
                      backgroundColor: color.toLowerCase() === 'white' ? '#fff' : 
                                     color.toLowerCase() === 'black' ? '#000' :
                                     color.toLowerCase() === 'navy' ? '#001f3f' :
                                     color.toLowerCase() === 'burgundy' ? '#800020' :
                                     color.toLowerCase() === 'cream' ? '#fffdd0' :
                                     color.toLowerCase()
                    }}
                  />
                  {color}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Product Images">
          <Space.Compact className="w-full mb-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL"
              onPressEnter={addImageUrl}
            />
            <Button onClick={addImageUrl} icon={<PlusOutlined />}>
              Add
            </Button>
          </Space.Compact>
          
          <div className="flex flex-wrap gap-2">
            {imageUrls.map((url, index) => (
              <Tag
                key={index}
                closable
                onClose={() => removeImage(index)}
                className="flex items-center gap-1 px-2 py-1"
              >
                <img src={url} alt="" className="w-8 h-8 object-cover rounded" />
                Image {index + 1}
              </Tag>
            ))}
          </div>
          {imageUrls.length === 0 && (
            <p className="text-gray-400 text-sm mt-2">No images added yet</p>
          )}
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            className="min-w-32"
          >
            Create Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}