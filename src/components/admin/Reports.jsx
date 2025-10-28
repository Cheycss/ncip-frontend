import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar, 
  Download, 
  Filter,
  PieChart,
  Clock,
  MapPin,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle
} from 'lucide-react'

const Reports = () => {
  const [reportData, setReportData] = useState({
    applications: [],
    users: [],
    registrations: []
  })
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year ago
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year ahead
  })
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReportData()
  }, [dateRange])

  const loadReportData = async () => {
    setLoading(true)
    
    try {
      const token = localStorage.getItem('ncip_token')
      
      // Dynamic API URL helper
      const getApiUrl = () => {
        const currentHost = window.location.hostname;
        if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
          return `http://${currentHost}:3001`;
        }
        return 'http://localhost:3001';
      };

      // Fetch applications from API
      const appsResponse = await fetch(`${getApiUrl()}/api/applications/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const appsData = await appsResponse.json()
      const applications = appsData.success ? appsData.applications : []
      
      // Fetch users from API
      const usersResponse = await fetch(`${getApiUrl()}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const usersData = await usersResponse.json()
      const users = usersData.success ? usersData.users : []
      
      // Fetch ALL registrations (not just pending) to get tribe data
      const allRegsResponse = await fetch(`${getApiUrl()}/api/registrations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const allRegsData = await allRegsResponse.json()
      const allRegistrations = allRegsData.success ? allRegsData.registrations : []
      
      // Fetch pending registrations
      const regsResponse = await fetch(`${getApiUrl()}/api/registrations/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const regsData = await regsResponse.json()
      const pendingRegistrations = regsData.success ? regsData.registrations : []
      
      // Filter applications by date range
      const filteredApplications = applications.filter(app => {
        const appDate = new Date(app.submitted_at || app.created_at)
        const startDate = new Date(dateRange.startDate)
        const endDate = new Date(dateRange.endDate)
        return appDate >= startDate && appDate <= endDate
      })

      setReportData({
        applications: filteredApplications,
        users: users,
        registrations: pendingRegistrations,
        allRegistrations: allRegistrations // Include all registrations for tribe data
      })
    } catch (error) {
      console.error('Error loading report data:', error)
      setReportData({
        applications: [],
        users: [],
        registrations: [],
        allRegistrations: []
      })
    } finally {
      setLoading(false)
    }
  }

  const getApplicationStats = () => {
    const { applications } = reportData
    return {
      total: applications.length,
      pending: applications.filter(app => app.application_status === 'submitted').length,
      approved: applications.filter(app => app.application_status === 'approved').length,
      rejected: applications.filter(app => app.application_status === 'rejected').length,
      inReview: applications.filter(app => app.application_status === 'under_review').length
    }
  }

  const getPurposeBreakdown = () => {
    const { applications } = reportData
    const purposes = {}
    applications.forEach(app => {
      const purpose = app.purpose || 'Unknown'
      purposes[purpose] = (purposes[purpose] || 0) + 1
    })
    return purposes
  }

  const getEthnicityBreakdown = () => {
    const { allRegistrations } = reportData
    const ethnicities = {}
    
    // Only count APPROVED registrations (registered users)
    if (allRegistrations && allRegistrations.length > 0) {
      allRegistrations.forEach(reg => {
        // Only count if registration is approved
        if (reg.registration_status === 'approved') {
          const ethnicity = reg.ethnicity || 'Not Specified'
          ethnicities[ethnicity] = (ethnicities[ethnicity] || 0) + 1
        }
      })
    }
    
    return ethnicities
  }

  const getMonthlyTrends = () => {
    const { applications } = reportData
    const monthlyData = {}
    
    applications.forEach(app => {
      const date = new Date(app.submitted_at || app.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
    })
    
    return monthlyData
  }

  const getProcessingTimeStats = () => {
    const { applications } = reportData
    const processedApps = applications.filter(app => 
      app.application_status !== 'submitted' && app.updated_at && app.submitted_at
    )
    
    if (processedApps.length === 0) return { average: 0, fastest: 0, slowest: 0 }
    
    const processingTimes = processedApps.map(app => {
      const submitted = new Date(app.submitted_at)
      const updated = new Date(app.updated_at)
      return Math.ceil((updated - submitted) / (1000 * 60 * 60 * 24)) // days
    })
    
    return {
      average: Math.round(processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length),
      fastest: Math.min(...processingTimes),
      slowest: Math.max(...processingTimes)
    }
  }

  const exportReport = (format) => {
    const stats = getApplicationStats()
    const purposes = getPurposeBreakdown()
    const ethnicities = getEthnicityBreakdown()
    const processingTime = getProcessingTimeStats()
    const monthlyData = getMonthlyTrends()
    
    const reportContent = {
      generatedAt: new Date().toISOString(),
      dateRange: dateRange,
      applicationStats: stats,
      purposeBreakdown: purposes,
      ethnicityBreakdown: ethnicities,
      processingTimeStats: processingTime,
      monthlyTrends: monthlyData,
      totalUsers: reportData.users.length,
      totalRegistrations: reportData.registrations.length
    }
    
    if (format === 'print') {
      generatePDFReport(reportContent, 'print')
    } else if (format === 'download') {
      generatePDFReport(reportContent, 'download')
    }
  }

  const generatePDFReport = (data, mode = 'print') => {
    // Generate filename with current date
    const currentDate = new Date()
    const dateString = currentDate.toISOString().split('T')[0] // YYYY-MM-DD format
    const timeString = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-') // HH-MM-SS format
    const filename = `NCIP-Analytics-Report_${dateString}_${timeString}.pdf`
    
    if (mode === 'download') {
      // Direct download using HTML to PDF conversion
      downloadPDFDirectly(data, filename)
      return
    }
    
    // Create a new window for PDF generation (print mode)
    const printWindow = window.open('', '_blank')
    printWindow.document.title = filename
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>NCIP Analytics Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: white;
            color: #1f2937;
            line-height: 1.5;
            font-size: 14px;
          }
          
          .page {
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm;
            min-height: 297mm;
          }
          
          .header {
            text-align: center;
            border-bottom: 4px solid #1f2937;
            padding-bottom: 25px;
            margin-bottom: 35px;
            position: relative;
          }
          
          .ncip-logo {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
            display: block;
            border-radius: 50%;
            border: 3px solid #1f2937;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .republic-header {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 3px;
            letter-spacing: 0.5px;
          }
          
          .office-header {
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 2px;
          }
          
          .ncip-header {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin: 8px 0 5px 0;
            letter-spacing: 0.3px;
          }
          
          .regional-office {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 20px;
          }
          
          .report-title {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin: 15px 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .date-range {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            padding: 12px 24px;
            border-radius: 12px;
            display: inline-block;
            margin-top: 15px;
            border: 2px solid #d1d5db;
            font-weight: 600;
            color: #374151;
          }
          .section {
            margin-bottom: 45px;
            page-break-inside: avoid;
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }
          
          .section-title {
            color: #1f2937;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 3px solid #3b82f6;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 25px;
            margin-bottom: 35px;
          }
          
          .stat-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 25px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          }
          
          .stat-number {
            font-size: 36px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .stat-label {
            color: #6b7280;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .chart-section {
            background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
            border: 2px solid #e5e7eb;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 25px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          
          .chart-title {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          
          .bar-chart {
            margin: 25px 0;
          }
          
          .bar-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 8px 0;
          }
          
          .bar-label {
            width: 140px;
            font-size: 13px;
            font-weight: 600;
            color: #374151;
            text-transform: capitalize;
          }
          
          .bar-container {
            flex: 1;
            height: 24px;
            background: #f3f4f6;
            border-radius: 12px;
            margin: 0 15px;
            position: relative;
            overflow: hidden;
            border: 1px solid #e5e7eb;
          }
          
          .bar-fill {
            height: 100%;
            border-radius: 12px;
            background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3);
            transition: width 0.3s ease;
          }
          
          .bar-value {
            font-size: 13px;
            font-weight: 700;
            color: #1f2937;
            min-width: 80px;
            text-align: right;
          }
          
          .summary-box {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 2px solid #3b82f6;
            border-radius: 16px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
          }
          
          .summary-title {
            font-size: 20px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          
          .summary-text {
            font-size: 16px;
            color: #374151;
            line-height: 1.6;
          }
          
          .footer {
            margin-top: 60px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 3px solid #1f2937;
            padding-top: 25px;
            background: #f9fafb;
            border-radius: 12px;
            padding: 25px;
          }
          
          .footer-title {
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
          }
          
          @media print {
            body { margin: 0; }
            .page { margin: 0; padding: 10mm; }
            .section { page-break-inside: avoid; box-shadow: none; }
            .stat-card { box-shadow: none; }
            .chart-section { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <img src="/NCIPLogo.png" alt="NCIP Logo" class="ncip-logo" />
            <div class="republic-header">REPUBLIC OF THE PHILIPPINES</div>
            <div class="office-header">OFFICE OF THE PRESIDENT</div>
            <div class="ncip-header">NATIONAL COMMISSION ON INDIGENOUS PEOPLES</div>
            <div class="regional-office">SARANGANI PROVINCIAL OFFICE</div>
            <div class="report-title">ANALYTICS REPORT</div>
            <div class="date-range">
              Report Period: ${new Date(data.dateRange.startDate).toLocaleDateString()} - ${new Date(data.dateRange.endDate).toLocaleDateString()}
            </div>
          </div>

          <div class="summary-box">
            <div class="summary-title">Executive Summary</div>
            <div class="summary-text">
              This comprehensive analytics report provides insights into the NCIP system performance, 
              application processing efficiency, and demographic trends for the specified reporting period.
            </div>
          </div>

        <div class="section">
          <h2 class="section-title">Key Performance Indicators</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${data.applicationStats.total}</div>
              <div class="stat-label">Total Applications</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${data.applicationStats.pending}</div>
              <div class="stat-label">Pending Review</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${data.applicationStats.approved}</div>
              <div class="stat-label">Approved</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${data.processingTimeStats.average}</div>
              <div class="stat-label">Avg. Processing Days</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Application Status Distribution</h2>
          <div class="chart-section">
            <div class="chart-title">Applications by Status</div>
            <div class="bar-chart">
              ${Object.entries(data.applicationStats).filter(([key]) => key !== 'total').map(([status, count]) => {
                const percentage = data.applicationStats.total > 0 ? Math.round((count / data.applicationStats.total) * 100) : 0
                return `
                  <div class="bar-item">
                    <div class="bar-label">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
                    <div class="bar-container">
                      <div class="bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="bar-value">${count} (${percentage}%)</div>
                  </div>
                `
              }).join('')}
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Application Purposes</h2>
          <div class="chart-section">
            <div class="chart-title">Certificate of Confirmation by Purpose</div>
            <div class="bar-chart">
              ${Object.entries(data.purposeBreakdown).map(([purpose, count]) => {
                const percentage = data.applicationStats.total > 0 ? Math.round((count / data.applicationStats.total) * 100) : 0
                return `
                  <div class="bar-item">
                    <div class="bar-label">${purpose}</div>
                    <div class="bar-container">
                      <div class="bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="bar-value">${count} (${percentage}%)</div>
                  </div>
                `
              }).join('')}
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">User Demographics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${data.totalUsers}</div>
              <div class="stat-label">Active Users</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${data.totalRegistrations}</div>
              <div class="stat-label">Pending Registrations</div>
            </div>
          </div>
          
          <div class="chart-section">
            <div class="chart-title">Ethnicity Distribution</div>
            <div class="bar-chart">
              ${Object.entries(data.ethnicityBreakdown).map(([ethnicity, count]) => {
                const total = data.totalUsers + data.totalRegistrations
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                return `
                  <div class="bar-item">
                    <div class="bar-label">${ethnicity}</div>
                    <div class="bar-container">
                      <div class="bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="bar-value">${count} (${percentage}%)</div>
                  </div>
                `
              }).join('')}
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Processing Performance</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${data.processingTimeStats.fastest}</div>
              <div class="stat-label">Fastest Processing (Days)</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${data.processingTimeStats.average}</div>
              <div class="stat-label">Average Processing (Days)</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${data.processingTimeStats.slowest}</div>
              <div class="stat-label">Slowest Processing (Days)</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Monthly Trends</h2>
          <div class="chart-section">
            <div class="chart-title">Applications Submitted by Month</div>
            <div class="bar-chart">
              ${Object.entries(data.monthlyTrends).map(([month, count]) => {
                const maxCount = Math.max(...Object.values(data.monthlyTrends))
                const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
                return `
                  <div class="bar-item">
                    <div class="bar-label">${month}</div>
                    <div class="bar-container">
                      <div class="bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="bar-value">${count}</div>
                  </div>
                `
              }).join('')}
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="footer-title">CONFIDENTIAL DOCUMENT</div>
          <p><strong>Generated:</strong> ${new Date(data.generatedAt).toLocaleString()}</p>
          <p><strong>Authority:</strong> National Commission on Indigenous Peoples</p>
          <p><strong>Office:</strong> Sarangani Provincial Office</p>
          <p style="margin-top: 15px; font-style: italic;">
            This report contains confidential information and is intended for authorized NCIP personnel only. 
            Unauthorized distribution is strictly prohibited under Republic Act No. 8371.
          </p>
        </div>
        </div>
      </body>
      </html>
    `
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Wait for content to load then trigger print with download option
    printWindow.onload = () => {
      setTimeout(() => {
        // Add download functionality
        const style = printWindow.document.createElement('style')
        style.textContent = `
          @media print {
            @page {
              size: A4;
              margin: 0.5in;
            }
          }
          .download-info {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #3b82f6;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
          }
          @media print {
            .download-info { display: none; }
          }
        `
        printWindow.document.head.appendChild(style)
        
        // Add download info banner
        const downloadInfo = printWindow.document.createElement('div')
        downloadInfo.className = 'download-info'
        downloadInfo.innerHTML = `📄 Suggested filename: ${filename}`
        printWindow.document.body.appendChild(downloadInfo)
        
        // Trigger print dialog
        printWindow.print()
        
        // Remove the info banner after printing
        setTimeout(() => {
          if (downloadInfo.parentNode) {
            downloadInfo.parentNode.removeChild(downloadInfo)
          }
        }, 1000)
      }, 500)
    }
  }

  const downloadPDFDirectly = async (data, filename) => {
    try {
      // Load jsPDF from CDN using script tag
      if (!window.jsPDF) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }
      
      const { jsPDF } = window
      
      // Create new PDF document
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20
      
      // Add NCIP Logo (placeholder - you can replace with actual logo data)
      doc.setFillColor(59, 130, 246)
      doc.circle(pageWidth / 2, yPosition + 10, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.text('NCIP', pageWidth / 2, yPosition + 12, { align: 'center' })
      yPosition += 25
      
      // Header
      doc.setTextColor(31, 41, 55)
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('REPUBLIC OF THE PHILIPPINES', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text('OFFICE OF THE PRESIDENT', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
      
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('NATIONAL COMMISSION ON INDIGENOUS PEOPLES', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
      
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      doc.text('SARANGANI PROVINCIAL OFFICE', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 10
      
      doc.setFontSize(18)
      doc.setFont(undefined, 'bold')
      doc.text('ANALYTICS REPORT', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 10
      
      // Date range
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      const dateText = `Report Period: ${new Date(data.dateRange.startDate).toLocaleDateString()} - ${new Date(data.dateRange.endDate).toLocaleDateString()}`
      doc.text(dateText, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15
      
      // Line separator
      doc.setDrawColor(31, 41, 55)
      doc.setLineWidth(0.5)
      doc.line(20, yPosition, pageWidth - 20, yPosition)
      yPosition += 10
      
      // Executive Summary
      doc.setFontSize(14)
      doc.setFont(undefined, 'bold')
      doc.text('EXECUTIVE SUMMARY', 20, yPosition)
      yPosition += 8
      
      doc.setFontSize(9)
      doc.setFont(undefined, 'normal')
      const summaryText = 'This comprehensive analytics report provides insights into the NCIP system performance, application processing efficiency, and demographic trends for the specified reporting period.'
      const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 40)
      doc.text(splitSummary, 20, yPosition)
      yPosition += splitSummary.length * 4 + 10
      
      // Key Performance Indicators
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('KEY PERFORMANCE INDICATORS', 20, yPosition)
      yPosition += 10
      
      // Stats in a grid
      const stats = [
        { label: 'Total Applications', value: data.applicationStats.total },
        { label: 'Pending Review', value: data.applicationStats.pending },
        { label: 'Approved', value: data.applicationStats.approved },
        { label: 'Avg. Processing Days', value: data.processingTimeStats.average }
      ]
      
      const colWidth = (pageWidth - 40) / 2
      let col = 0
      
      stats.forEach((stat, index) => {
        const xPos = 20 + (col * colWidth)
        
        // Draw stat box
        doc.setFillColor(248, 250, 252)
        doc.setDrawColor(226, 232, 240)
        doc.roundedRect(xPos, yPosition, colWidth - 5, 20, 2, 2, 'FD')
        
        // Stat number
        doc.setTextColor(59, 130, 246)
        doc.setFontSize(16)
        doc.setFont(undefined, 'bold')
        doc.text(stat.value.toString(), xPos + (colWidth - 5) / 2, yPosition + 8, { align: 'center' })
        
        // Stat label
        doc.setTextColor(107, 114, 128)
        doc.setFontSize(8)
        doc.setFont(undefined, 'normal')
        doc.text(stat.label, xPos + (colWidth - 5) / 2, yPosition + 15, { align: 'center' })
        
        col++
        if (col >= 2) {
          col = 0
          yPosition += 25
        }
      })
      
      if (col > 0) yPosition += 25
      yPosition += 10
      
      // Application Status Distribution
      doc.setTextColor(31, 41, 55)
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('APPLICATION STATUS DISTRIBUTION', 20, yPosition)
      yPosition += 10
      
      // Status breakdown
      const statusEntries = Object.entries(data.applicationStats).filter(([key]) => key !== 'total')
      statusEntries.forEach(([status, count]) => {
        const percentage = data.applicationStats.total > 0 ? Math.round((count / data.applicationStats.total) * 100) : 0
        
        doc.setFontSize(9)
        doc.setFont(undefined, 'normal')
        doc.text(`${status.charAt(0).toUpperCase() + status.slice(1)}:`, 25, yPosition)
        doc.text(`${count} (${percentage}%)`, pageWidth - 40, yPosition, { align: 'right' })
        
        // Progress bar
        const barWidth = 100
        const barHeight = 3
        const fillWidth = (percentage / 100) * barWidth
        
        doc.setFillColor(243, 244, 246)
        doc.rect(25, yPosition + 2, barWidth, barHeight, 'F')
        doc.setFillColor(59, 130, 246)
        doc.rect(25, yPosition + 2, fillWidth, barHeight, 'F')
        
        yPosition += 10
      })
      
      yPosition += 10
      
      // Footer
      if (yPosition > pageHeight - 40) {
        doc.addPage()
        yPosition = 20
      }
      
      doc.setDrawColor(31, 41, 55)
      doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30)
      
      doc.setFontSize(8)
      doc.setFont(undefined, 'bold')
      doc.text('CONFIDENTIAL DOCUMENT', pageWidth / 2, pageHeight - 25, { align: 'center' })
      
      doc.setFont(undefined, 'normal')
      doc.text(`Generated: ${new Date(data.generatedAt).toLocaleString()}`, pageWidth / 2, pageHeight - 20, { align: 'center' })
      doc.text('National Commission on Indigenous Peoples - Sarangani Provincial Office', pageWidth / 2, pageHeight - 15, { align: 'center' })
      
      const disclaimer = 'This report contains confidential information and is intended for authorized NCIP personnel only.'
      doc.setFontSize(7)
      doc.text(disclaimer, pageWidth / 2, pageHeight - 8, { align: 'center' })
      
      // Save the PDF
      doc.save(filename)
      
    } catch (error) {
      console.error('PDF generation failed:', error)
      
      // Alternative approach using browser's print-to-PDF
      const printWindow = window.open('', '_blank')
      const htmlContent = generateHTMLContent(data)
      
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.document.title = filename
      
      // Add auto-download functionality
      printWindow.onload = () => {
        setTimeout(() => {
          // Show instructions for PDF download
          const instructions = printWindow.document.createElement('div')
          instructions.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; background: #3b82f6; color: white; padding: 15px; border-radius: 8px; font-family: Arial; font-size: 12px; z-index: 9999; max-width: 300px;">
              <strong>📄 Save as PDF:</strong><br>
              1. Press Ctrl+P (or Cmd+P on Mac)<br>
              2. Select "Save as PDF"<br>
              3. Use filename: ${filename}<br>
              <button onclick="this.parentElement.remove()" style="background: white; color: #3b82f6; border: none; padding: 5px 10px; border-radius: 4px; margin-top: 10px; cursor: pointer;">Got it!</button>
            </div>
          `
          printWindow.document.body.appendChild(instructions)
          
          // Auto-trigger print dialog after a short delay
          setTimeout(() => {
            printWindow.print()
          }, 1000)
        }, 500)
      }
    }
  }

  const generateHTMLContent = (data) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>NCIP Analytics Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: white;
            color: #1f2937;
            line-height: 1.5;
            font-size: 14px;
          }
          
          .page {
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm;
            min-height: 297mm;
          }
          
          .header {
            text-align: center;
            border-bottom: 4px solid #1f2937;
            padding-bottom: 25px;
            margin-bottom: 35px;
            position: relative;
          }
          
          .ncip-logo {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
            display: block;
            border-radius: 50%;
            border: 3px solid #1f2937;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .republic-header {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 3px;
            letter-spacing: 0.5px;
          }
          
          .office-header {
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 2px;
          }
          
          .ncip-header {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin: 8px 0 5px 0;
            letter-spacing: 0.3px;
          }
          
          .regional-office {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 20px;
          }
          
          .report-title {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin: 15px 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .date-range {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            padding: 12px 24px;
            border-radius: 12px;
            display: inline-block;
            margin-top: 15px;
            border: 2px solid #d1d5db;
            font-weight: 600;
            color: #374151;
          }
          
          .section {
            margin-bottom: 45px;
            page-break-inside: avoid;
            background: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }
          
          .section-title {
            color: #1f2937;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 3px solid #3b82f6;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 25px;
            margin-bottom: 35px;
          }
          
          .stat-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 25px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          }
          
          .stat-number {
            font-size: 36px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .stat-label {
            color: #6b7280;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .chart-section {
            background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
            border: 2px solid #e5e7eb;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 25px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          
          .chart-title {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          
          .bar-chart {
            margin: 25px 0;
          }
          
          .bar-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 8px 0;
          }
          
          .bar-label {
            width: 140px;
            font-size: 13px;
            font-weight: 600;
            color: #374151;
            text-transform: capitalize;
          }
          
          .bar-container {
            flex: 1;
            height: 24px;
            background: #f3f4f6;
            border-radius: 12px;
            margin: 0 15px;
            position: relative;
            overflow: hidden;
            border: 1px solid #e5e7eb;
          }
          
          .bar-fill {
            height: 100%;
            border-radius: 12px;
            background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.3);
            transition: width 0.3s ease;
          }
          
          .bar-value {
            font-size: 13px;
            font-weight: 700;
            color: #1f2937;
            min-width: 80px;
            text-align: right;
          }
          
          .summary-box {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 2px solid #3b82f6;
            border-radius: 16px;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
          }
          
          .summary-title {
            font-size: 20px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          
          .summary-text {
            font-size: 16px;
            color: #374151;
            line-height: 1.6;
          }
          
          .footer {
            margin-top: 60px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 3px solid #1f2937;
            padding-top: 25px;
            background: #f9fafb;
            border-radius: 12px;
            padding: 25px;
          }
          
          .footer-title {
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
          }
          
          @media print {
            body { margin: 0; }
            .page { margin: 0; padding: 10mm; }
            .section { page-break-inside: avoid; box-shadow: none; }
            .stat-card { box-shadow: none; }
            .chart-section { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ4IiBmaWxsPSIjMzMzIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNCIvPgo8dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5DSVAgTG9nbzwvdGV4dD4KPC9zdmc+" alt="NCIP Logo" class="ncip-logo" />
            <div class="republic-header">REPUBLIC OF THE PHILIPPINES</div>
            <div class="office-header">OFFICE OF THE PRESIDENT</div>
            <div class="ncip-header">NATIONAL COMMISSION ON INDIGENOUS PEOPLES</div>
            <div class="regional-office">SARANGANI PROVINCIAL OFFICE</div>
            <div class="report-title">ANALYTICS REPORT</div>
            <div class="date-range">
              Report Period: ${new Date(data.dateRange.startDate).toLocaleDateString()} - ${new Date(data.dateRange.endDate).toLocaleDateString()}
            </div>
          </div>

          <div class="summary-box">
            <div class="summary-title">Executive Summary</div>
            <div class="summary-text">
              This comprehensive analytics report provides insights into the NCIP system performance, 
              application processing efficiency, and demographic trends for the specified reporting period.
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Key Performance Indicators</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${data.applicationStats.total}</div>
                <div class="stat-label">Total Applications</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${data.applicationStats.pending}</div>
                <div class="stat-label">Pending Review</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${data.applicationStats.approved}</div>
                <div class="stat-label">Approved</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${data.processingTimeStats.average}</div>
                <div class="stat-label">Avg. Processing Days</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Application Status Distribution</h2>
            <div class="chart-section">
              <div class="chart-title">Applications by Status</div>
              <div class="bar-chart">
                ${Object.entries(data.applicationStats).filter(([key]) => key !== 'total').map(([status, count]) => {
                  const percentage = data.applicationStats.total > 0 ? Math.round((count / data.applicationStats.total) * 100) : 0
                  return `
                    <div class="bar-item">
                      <div class="bar-label">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
                      <div class="bar-container">
                        <div class="bar-fill" style="width: ${percentage}%"></div>
                      </div>
                      <div class="bar-value">${count} (${percentage}%)</div>
                    </div>
                  `
                }).join('')}
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="footer-title">CONFIDENTIAL DOCUMENT</div>
            <p><strong>Generated:</strong> ${new Date(data.generatedAt).toLocaleString()}</p>
            <p><strong>Authority:</strong> National Commission on Indigenous Peoples</p>
            <p><strong>Office:</strong> Sarangani Provincial Office</p>
            <p style="margin-top: 15px; font-style: italic;">
              This report contains confidential information and is intended for authorized NCIP personnel only. 
              Unauthorized distribution is strictly prohibited under Republic Act No. 8371.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'pipeline', name: 'Application Pipeline', icon: FileText },
    { id: 'compliance', name: 'Compliance & Monitoring', icon: AlertCircle },
    { id: 'demographics', name: 'Community Insights', icon: Users },
    { id: 'audit', name: 'Audit & Activity', icon: Activity }
  ]

  const renderOverview = () => {
    const stats = getApplicationStats()
    const processingTime = getProcessingTimeStats()
    
    return (
      <div className="space-y-6">
        {/* Key Metrics - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">Total Applications</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">Pending</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">Approved</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{processingTime.average}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">Avg. Processing Days</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
            {stats.total === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No applications data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats).map(([status, count]) => {
                  if (status === 'total') return null
                  const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                  const colors = {
                    pending: 'bg-yellow-500',
                    approved: 'bg-green-500',
                    rejected: 'bg-red-500',
                    inReview: 'bg-blue-500'
                  }
                  
                  return (
                    <div key={status} className="flex items-center">
                      <div className="w-24 text-sm font-medium text-gray-600 capitalize">
                        {status.replace('_', ' ').replace('inReview', 'In Review')}
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colors[status] || 'bg-gray-400'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-16 text-sm font-semibold text-gray-900">
                        {count} ({percentage}%)
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Purpose Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Purpose</h3>
            {Object.keys(getPurposeBreakdown()).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No purpose data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(getPurposeBreakdown()).map(([purpose, count]) => {
                  const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                  
                  return (
                    <div key={purpose} className="flex items-center">
                      <div className="w-32 text-sm font-medium text-gray-600 truncate">
                        {purpose}
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-16 text-sm font-semibold text-gray-900">
                        {count} ({percentage}%)
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderApplications = () => {
    const stats = getApplicationStats()
    const purposes = getPurposeBreakdown()
    const processingTime = getProcessingTimeStats()
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{processingTime.average}</div>
              <div className="text-sm text-gray-600">Average Processing Days</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{processingTime.fastest}</div>
              <div className="text-sm text-gray-600">Fastest Processing</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{processingTime.slowest}</div>
              <div className="text-sm text-gray-600">Slowest Processing</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Purpose</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Count</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(purposes).map(([purpose, count]) => {
                  const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
                  return (
                    <tr key={purpose}>
                      <td className="px-4 py-3 text-sm text-gray-900">{purpose}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{count}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{percentage}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderUsers = () => {
    const ethnicities = getEthnicityBreakdown()
    // Only count approved registrations
    const approvedRegistrations = reportData.allRegistrations?.filter(reg => reg.registration_status === 'approved').length || 0
    const totalUsers = reportData.users.length + approvedRegistrations
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.registrations.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Demographics - Ethnicity Distribution</h3>
          <div className="space-y-3">
            {Object.entries(ethnicities).map(([ethnicity, count]) => {
              const percentage = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
              
              return (
                <div key={ethnicity} className="flex items-center">
                  <div className="w-32 text-sm font-medium text-gray-600">
                    {ethnicity}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-purple-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-sm font-semibold text-gray-900">
                    {count} ({percentage}%)
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderTrends = () => {
    const monthlyData = getMonthlyTrends()
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Application Trends</h3>
          <div className="space-y-4">
            {Object.entries(monthlyData).map(([month, count]) => (
              <div key={month} className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-600">
                  {month}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-green-500"
                      style={{ width: `${Math.min((count / Math.max(...Object.values(monthlyData))) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm font-semibold text-gray-900">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderPipeline = () => {
    const stats = getApplicationStats()
    const { applications } = reportData
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Application Pipeline Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-sm text-gray-600 font-medium">Total Received</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <p className="text-3xl font-bold text-green-900">{stats.approved}</p>
              <p className="text-sm text-gray-600 font-medium">Approved</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
              <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              <p className="text-sm text-gray-600 font-medium">Pending</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="text-3xl font-bold text-red-900">{stats.rejected}</p>
              <p className="text-sm text-gray-600 font-medium">Rejected</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <p className="text-3xl font-bold text-purple-900">{getProcessingTimeStats().average}</p>
              <p className="text-sm text-gray-600 font-medium">Avg. Days</p>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-700 mb-2">No Applications Found</h3>
              <p>No applications in the selected date range</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Applicant</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Application ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Purpose</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Submitted</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Days Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.application_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{app.applicant_name || `User ${app.user_id}`}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{app.application_number}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{app.purpose}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(app.submitted_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          app.application_status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.application_status === 'rejected' ? 'bg-red-100 text-red-800' :
                          app.application_status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.application_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`font-bold ${
                          app.days_remaining < 7 ? 'text-red-600' :
                          app.days_remaining < 14 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {app.days_remaining > 0 ? `${app.days_remaining} days` : 'Overdue'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderCompliance = () => {
    const { applications } = reportData
    const urgentApps = applications.filter(app => app.days_remaining < 7 && app.days_remaining > 0)
    const overdueApps = applications.filter(app => app.days_remaining <= 0)
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-6">
            <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Urgent Applications (&lt; 7 Days)
            </h3>
            <p className="text-4xl font-bold text-red-600 mb-4">{urgentApps.length}</p>
            <div className="space-y-2">
              {urgentApps.slice(0, 5).map(app => (
                <div key={app.application_id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-bold text-gray-900">{app.applicant_name || `User ${app.user_id}`}</p>
                  <p className="text-sm text-gray-600">#{app.application_number} - {app.days_remaining} days left</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-6">
            <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              Overdue Applications
            </h3>
            <p className="text-4xl font-bold text-orange-600 mb-4">{overdueApps.length}</p>
            <div className="space-y-2">
              {overdueApps.slice(0, 5).map(app => (
                <div key={app.application_id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="font-bold text-gray-900">{app.applicant_name || `User ${app.user_id}`}</p>
                  <p className="text-sm text-gray-600">#{app.application_number} - Overdue</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderDemographics = () => {
    const ethnicities = getEthnicityBreakdown()
    const purposes = getPurposeBreakdown()
    const { users, allRegistrations } = reportData
    // Only count approved registrations
    const approvedRegistrations = allRegistrations?.filter(reg => reg.registration_status === 'approved').length || 0
    const totalRegisteredUsers = users.length + approvedRegistrations
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Indigenous Groups Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(ethnicities).map(([ethnicity, count]) => {
                const total = Object.values(ethnicities).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={ethnicity} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-bold text-gray-900">{ethnicity}</div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-3">
                        <div className="h-3 rounded-full bg-blue-600" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                    <div className="w-20 text-sm font-bold text-gray-900 text-right">{count} ({percentage}%)</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Application Purposes
            </h3>
            <div className="space-y-3">
              {Object.entries(purposes).map(([purpose, count]) => {
                const total = Object.values(purposes).reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={purpose} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-bold text-gray-900">{purpose}</div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-3">
                        <div className="h-3 rounded-full bg-green-600" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                    <div className="w-20 text-sm font-bold text-gray-900 text-right">{count} ({percentage}%)</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Community Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
              <p className="text-4xl font-bold text-blue-900">{totalRegisteredUsers}</p>
              <p className="text-sm text-gray-600 font-medium mt-2">Total Registered Users</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
              <p className="text-4xl font-bold text-green-900">{Object.keys(ethnicities).length}</p>
              <p className="text-sm text-gray-600 font-medium mt-2">Indigenous Groups</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
              <p className="text-4xl font-bold text-purple-900">{Object.keys(purposes).length}</p>
              <p className="text-sm text-gray-600 font-medium mt-2">Service Types</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAudit = () => {
    const { applications } = reportData
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Recent Application Activity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Application</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Applicant</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.slice(0, 20).map((app) => (
                  <tr key={app.application_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(app.updated_at || app.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{app.application_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{app.applicant_name || `User ${app.user_id}`}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Status Update</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        app.application_status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.application_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.application_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'pipeline':
        return renderPipeline()
      case 'compliance':
        return renderCompliance()
      case 'demographics':
        return renderDemographics()
      case 'audit':
        return renderAudit()
      default:
        return renderOverview()
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
      {/* Header - Enhanced */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 className="w-10 h-10" />
              Reports & Analytics
            </h1>
            <p className="text-blue-100 text-lg">Comprehensive insights into NCIP system usage and compliance monitoring</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            {/* Date Range Filter */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
              <Calendar className="w-4 h-4 text-white" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="px-3 py-2 border-0 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-white"
              />
              <span className="text-white">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="px-3 py-2 border-0 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-white"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => exportReport('print')}
                className="inline-flex items-center px-4 py-2 text-sm font-bold rounded-lg bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-9a2 2 0 00-2-2H9a2 2 0 00-2 2v9a2 2 0 002 2z" />
                </svg>
                Print
              </button>
              <button
                onClick={() => exportReport('download')}
                className="inline-flex items-center px-6 py-3 text-sm font-bold rounded-lg bg-white text-blue-600 hover:bg-blue-50 shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default Reports
