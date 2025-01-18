'use client'

import { Download } from 'lucide-react'

interface ExportButtonProps {
  data: any[]
  filename: string
}

export function ExportButton({ data, filename }: ExportButtonProps) {
  const exportToCSV = () => {
    const headers = Object.keys(data[0]).join(',')
    const csvData = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    ).join('\n')
    
    const csv = `${headers}\n${csvData}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  )
} 