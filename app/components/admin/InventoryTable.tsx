'use client'

import React, { useState, useEffect } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select,
  Switch,
  message, 
  Tag,
  Popconfirm,
  Image
} from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

const { Option } = Select

export default function InventoryTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form] = Form.useForm()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      message.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleEdit = (record: Product) => {
    setEditingProduct(record)
    form.setFieldsValue({
      ...record,
      sizes: record.sizes || [],
      colors: record.colors || []
    })
    setEditModalVisible(true)
  }

  const handleUpdate = async (values: any) => {
    if (!editingProduct) return

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        message.success('Product updated successfully')
        setEditModalVisible(false)
        fetchProducts()
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      message.error('Failed to update product')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        message.success('Product deleted successfully')
        fetchProducts()
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      message.error('Failed to delete product')
    }
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (images: string[]) => (
        images && images.length > 0 ? (
          <Image
            src={images[0]}
            alt="Product"
            width={60}
            height={60}
            className="object-cover rounded"
            preview={{
              mask: <EyeOutlined />
            }}
          />
        ) : (
          <div className="w-[60px] h-[60px] bg-gray-200 rounded flex items-center justify-center text-gray-400">
            No image
          </div>
        )
      )
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 100,
      render: (sku: string) => <span className="font-mono">{sku}</span>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name: string, record: Product) => (
        <div>
          <div className="font-semibold">{name}</div>
          {record.brand && <div className="text-xs text-gray-500">{record.brand}</div>}
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      filters: [
        { text: 'Outerwear', value: 'Outerwear' },
        { text: 'Dresses', value: 'Dresses' },
        { text: 'Suits', value: 'Suits' },
        { text: 'Knitwear', value: 'Knitwear' },
        { text: 'Shirts', value: 'Shirts' },
        { text: 'Trousers', value: 'Trousers' },
        { text: 'Shoes', value: 'Shoes' },
        { text: 'Accessories', value: 'Accessories' },
        { text: 'Bags', value: 'Bags' },
        { text: 'Jewelry', value: 'Jewelry' }
      ],
      onFilter: (value: any, record: Product) => record.category === value
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      sorter: (a: Product, b: Product) => a.price - b.price,
      render: (price: number) => <span className="font-semibold">{formatPrice(price)}</span>
    },
    {
      title: 'Inventory',
      dataIndex: 'inventory',
      key: 'inventory',
      width: 100,
      sorter: (a: Product, b: Product) => a.inventory - b.inventory,
      render: (inventory: number) => (
        <Tag color={inventory > 10 ? 'green' : inventory > 0 ? 'orange' : 'red'}>
          {inventory} units
        </Tag>
      )
    },
    {
      title: 'Sizes',
      dataIndex: 'sizes',
      key: 'sizes',
      width: 150,
      render: (sizes: string[]) => (
        <div className="flex flex-wrap gap-1">
          {sizes?.slice(0, 3).map(size => (
            <Tag key={size} className="text-xs">{size}</Tag>
          ))}
          {sizes?.length > 3 && <Tag className="text-xs">+{sizes.length - 3}</Tag>}
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      width: 140,
      render: (_: any, record: Product) => (
        <Space size="small">
          {record.featured && <Tag color="gold">Featured</Tag>}
          <Tag color={record.active ? 'green' : 'default'}>
            {record.active ? 'Active' : 'Inactive'}
          </Tag>
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Products ({products.length})
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => message.info('Use the "Add Product" tab to create new products')}
        >
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`
        }}
      />

      <Modal
        title="Edit Product"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Product Name"
              name="name"
              rules={[{ required: true, message: 'Please enter product name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="SKU"
              name="sku"
              rules={[{ required: true, message: 'Please enter SKU' }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Price ($)"
              name="price"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber className="w-full" min={0} precision={2} />
            </Form.Item>

            <Form.Item
              label="Inventory"
              name="inventory"
              rules={[{ required: true, message: 'Please enter inventory' }]}
            >
              <InputNumber className="w-full" min={0} />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select>
                <Option value="Outerwear">Outerwear</Option>
                <Option value="Dresses">Dresses</Option>
                <Option value="Suits">Suits</Option>
                <Option value="Knitwear">Knitwear</Option>
                <Option value="Shirts">Shirts</Option>
                <Option value="Trousers">Trousers</Option>
                <Option value="Shoes">Shoes</Option>
                <Option value="Accessories">Accessories</Option>
                <Option value="Bags">Bags</Option>
                <Option value="Jewelry">Jewelry</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Brand" name="brand">
              <Input />
            </Form.Item>

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

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Available Sizes" name="sizes">
            <Select mode="multiple">
              {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                <Option key={size} value={size}>{size}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Available Colors" name="colors">
            <Select mode="multiple">
              {['Black', 'White', 'Gray', 'Navy', 'Brown', 'Beige', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Gold', 'Silver', 'Burgundy', 'Cream'].map(color => (
                <Option key={color} value={color}>{color}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Material" name="material">
            <Input />
          </Form.Item>

          <Form.Item className="mt-6">
            <Space>
              <Button type="primary" htmlType="submit">
                Update Product
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}