'use client'

import React, { useState } from 'react'
import { Upload, Button, message, Table } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import Papa from 'papaparse'
import type { UploadProps } from 'antd'

export default function CSVUploader() {
  const [csvData, setCsvData] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  const handleFileUpload: UploadProps['customRequest'] = ({ file }) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const text = e.target?.result as string
      Papa.parse(text, {
        header: true,
        complete: (results) => {
          setCsvData(results.data)
          message.success('CSV parsed successfully')
        },
        error: (error: { message: string }) => {
          message.error('Error parsing CSV: ' + error.message)
        }
      })
    }
    
    reader.readAsText(file as Blob)
  }

  const handleUpload = async () => {
    if (csvData.length === 0) {
      message.warning('No data to upload')
      return
    }

    setUploading(true)
    try {
      const response = await fetch('/api/inventory/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: csvData })
      })

      if (response.ok) {
        const result = await response.json()
        message.success(`${result.count} products uploaded successfully`)
        setCsvData([])
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      message.error('Failed to upload products')
    } finally {
      setUploading(false)
    }
  }

  const columns = csvData.length > 0 
    ? Object.keys(csvData[0]).map(key => ({
        title: key,
        dataIndex: key,
        key: key,
        ellipsis: true,
      }))
    : []

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Upload
          accept=".csv"
          customRequest={handleFileUpload}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Select CSV File</Button>
        </Upload>
        
        <Button 
          type="primary" 
          onClick={handleUpload}
          loading={uploading}
          disabled={csvData.length === 0}
        >
          Upload to Database
        </Button>
      </div>

      {csvData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Preview ({csvData.length} products)</h3>
          <Table 
            columns={columns} 
            dataSource={csvData.slice(0, 5)}
            rowKey={(_, index) => index?.toString() || '0'}
            pagination={false}
            scroll={{ x: true }}
            size="small"
          />
        </div>
      )}
    </div>
  )
}