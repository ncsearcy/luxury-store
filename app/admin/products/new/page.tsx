'use client'

import React, { useState } from 'react'
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Switch, 
  Button, 
  Card, 
  Upload, 
  message,
  Row,
  Col,
  Space
} from 'antd'
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const { TextArea } = Input
const { Option } = Select

interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  inventory: number
  imageUrl: string
  featured: boolean
}

export default function NewProduct() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const categories = [
    'Electronics',
    'Jewelry',
    'Watches',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Art',
    'Collectibles',
    'Other'
  ]

  const handleSubmit = async (values: ProductFormData) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success('Product created successfully!')
        router.push('/admin/products')
      } else {
        const error = await response.json()
        message.error(error.message || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      message.error('Error creating product')
    } finally {
      setLoading(false)
    }
  }

  const uploadProps = {
    name: 'file',
    action: '/api/upload', // You'll need to implement this endpoint
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
        // Set the image URL in the form
        form.setFieldsValue({ imageUrl: info.file.response.url })
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/products">
          <Button icon={<ArrowLeftOutlined />}>
            Back to Products
          </Button>
        </Link>
      </div>

      <Card>
        <h1 style={{ marginBottom: '24px' }}>Add New Product</h1>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            featured: false,
            inventory: 0,
            price: 0
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[
                  { required: true, message: 'Please enter product name' },
                  { min: 2, message: 'Product name must be at least 2 characters' }
                ]}
              >
                <Input placeholder="Enter product name" size="large" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select placeholder="Select category" size="large">
                  {categories.map(category => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Please enter product description' },
              { min: 10, message: 'Description must be at least 10 characters' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter product description"
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Price ($)"
                rules={[
                  { required: true, message: 'Please enter price' },
                  { type: 'number', min: 0.01, message: 'Price must be greater than 0' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  precision={2}
                  min={0}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="inventory"
                label="Inventory Quantity"
                rules={[
                  { required: true, message: 'Please enter inventory quantity' },
                  { type: 'number', min: 0, message: 'Inventory cannot be negative' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0"
                  min={0}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="featured"
                label="Featured Product"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="Yes" 
                  unCheckedChildren="No"
                  size="default"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="imageUrl"
            label="Product Image URL"
            rules={[
              { required: true, message: 'Please enter image URL' },
              { type: 'url', message: 'Please enter a valid URL' }
            ]}
          >
            <Input placeholder="https://example.com/image.jpg" size="large" />
          </Form.Item>

          <div style={{ marginTop: '24px' }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
              >
                Create Product
              </Button>
              <Link href="/admin/products">
                <Button size="large">Cancel</Button>
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  )
}