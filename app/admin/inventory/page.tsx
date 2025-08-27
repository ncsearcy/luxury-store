'use client'

import React, { useState } from 'react'
import { Tabs, Card } from 'antd'
import CSVUploader from '../../components/admin/CSVUploader'
import ProductForm from '../../components/admin/ProductForm'
import InventoryTable from '../../components/admin/InventoryTable'

const { TabPane } = Tabs

export default function InventoryPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="View Inventory" key="1">
            <InventoryTable />
          </TabPane>
          <TabPane tab="Add Product" key="2">
            <ProductForm />
          </TabPane>
          <TabPane tab="CSV Upload" key="3">
            <CSVUploader />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}