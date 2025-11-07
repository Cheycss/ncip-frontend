import React, { useState, useEffect } from 'react'
import { Download, Calendar } from 'lucide-react'
import { getApiUrl } from '../../config/api'

const Reports = () => {
  const [cocIssuances, setCocIssuances] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    loadCOCIssuances()
  }, [selectedMonth, selectedYear])

  const loadCOCIssuances = async () => {
    setLoading(true)
    
    try {
      const token = localStorage.getItem('ncip_token')
      
      // Fetch certificates from backend
      const response = await fetch(`${getApiUrl()}/api/applications/certificates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      
      if (data.success) {
        // Filter by month and year
        const filtered = data.certificates
          .filter(cert => {
            const issueDate = new Date(cert.issued_date)
            return issueDate.getMonth() + 1 === selectedMonth && issueDate.getFullYear() === selectedYear
          })
          .sort((a, b) => new Date(a.issued_date) - new Date(b.issued_date))
        
        setCocIssuances(filtered)
      }
    } catch (error) {
      console.error('Error loading COC issuances:', error)
      setCocIssuances([])
    } finally {
      setLoading(false)
    }
  }

  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[month - 1]
  }

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank')
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>COC Issuances Report - ${getMonthName(selectedMonth)} ${selectedYear}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #000;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          h1 {
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
          }
          .subtitle {
            font-size: 14px;
            margin: 10px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-size: 11px;
          }
          th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
          }
          td:first-child {
            text-align: center;
            width: 40px;
          }
          @media print {
            body { padding: 10mm; }
            @page { margin: 15mm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CONSOLIDATED LIST OF COC ISSUANCES</h1>
          <div class="subtitle">For the month of ${getMonthName(selectedMonth)} ${selectedYear}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th></th>
              <th>COC NO.</th>
              <th>NAME</th>
              <th>PLACE OF ORIGIN</th>
              <th>PURPOSE</th>
              <th>DATE ISSUED</th>
            </tr>
          </thead>
          <tbody>
            ${cocIssuances.map((coc, index) => `
              <tr>
                <td>${index + 1}.</td>
                <td>${coc.certificate_number || 'N/A'}</td>
                <td>${coc.applicant_name || 'N/A'}</td>
                <td>${coc.place_of_origin || 'N/A'}</td>
                <td>${coc.purpose || 'IP Identification'}</td>
                <td>${new Date(coc.issued_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              Consolidated List of COC Issuances
            </h1>
            <p className="mt-2 text-blue-100">
              Monthly report of all issued Certificates of Confirmation
            </p>
          </div>
          <button
            onClick={exportToPDF}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
              <option key={month} value={month}>{getMonthName(month)}</option>
            ))}
          </select>
          
          <label className="text-sm font-medium text-gray-700 ml-4">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {[2024, 2025, 2026, 2027].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <div className="ml-auto text-sm font-semibold text-gray-700">
            Total COCs Issued: <span className="text-blue-600 text-lg">{cocIssuances.length}</span>
          </div>
        </div>
      </div>

      {/* COC Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">COC NO.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">NAME</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">PLACE OF ORIGIN</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">PURPOSE</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">DATE ISSUED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cocIssuances.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No COCs issued in {getMonthName(selectedMonth)} {selectedYear}
                  </td>
                </tr>
              ) : (
                cocIssuances.map((coc, index) => (
                  <tr key={coc.certificate_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center text-sm text-gray-900">{index + 1}.</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{coc.certificate_number || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{coc.applicant_name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{coc.place_of_origin || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{coc.purpose || 'IP Identification/Scholarship'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(coc.issued_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reports