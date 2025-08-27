'use client'

import React, { useEffect, useState } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Tag, 
  Button, 
  Space,
  Spin
} from 'antd'
import { 
  ShoppingOutlined, 
  UserOutlined, 
  DollarOutlined, 
  ShoppingCartOutlined,
  WarningOutlined
} from '@ant-design/icons'
import Link from 'next/link'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
}

interface RecentOrder {
  id: string
  customerName: string
  total: number
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Mock data - replace with actual API calls
        setStats({
          totalProducts: 127,
          totalOrders: 1,
          totalUsers: 4,
          totalRevenue: 15420.50
        })
        
        setRecentOrders([
          {
            id: '1',
            customerName: 'John Doe',
            total: 1299.99,
            status: 'completed',
            createdAt: '2025-01-15'
          }
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => `#${id.slice(-6).toUpperCase()}`
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          pending: 'orange',
          processing: 'blue',
          completed: 'green',
          cancelled: 'red'
        }
        return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    }
  ]

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="Quick Actions" style={{ marginBottom: '24px' }}>
        <Space size="middle" wrap>
          <Link href="/admin/products/new">
            <Button type="primary" icon={<ShoppingOutlined />}>
              Add New Product
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button icon={<ShoppingCartOutlined />}>
              View All Orders
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button icon={<UserOutlined />}>
              Manage Users
            </Button>
          </Link>
          <Button icon={<WarningOutlined />}>
            View Analytics
          </Button>
        </Space>
      </Card>

      {/* Recent Orders */}
      <Card 
        title="Recent Orders" 
        extra={
          <Link href="/admin/orders">
            <Button type="link">View All</Button>
          </Link>
        }
      >
        <Table 
          dataSource={recentOrders}
          columns={orderColumns}
          rowKey="id"
          pagination={false}
          locale={{ 
            emptyText: 'No recent orders' 
          }}
        />
      </Card>
    </div>
  )
}