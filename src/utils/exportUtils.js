// Export utilities for AdminDashboard

export const exportToCSV = (registrations, getFilteredRegistrations, dateFilter, showNotification, createLog) => {
  if (registrations.length === 0) {
    showNotification('No data to export', 'error');
    return;
  }

  const dataToExport = getFilteredRegistrations();
  if (dataToExport.length === 0) {
    showNotification('No data matches the current filter!', 'error');
    return;
  }

  const headers = ['Full Name', 'Email', 'Phone', 'Institution', 'Institution Type', 'Course', 'Year', 'City', 'State', 'Cohort', 'Track', 'Project Title', 'Problem Statement', 'Context', 'Stakeholders', 'Solution', 'Working Principle', 'Novelty', 'Impact', 'Budget', 'Timeline', 'Team Members', 'Has Mentor', 'Mentor Name', 'Mentor Email', 'Mentor Department', 'Mentor Institution', 'Mentor Phone', 'TMA Member', 'TMA Chapter', 'Payment Status', 'Payment ID', 'Order ID', 'Failure Reason', 'Abandoned At', 'Registration Date'];
  
  const csvContent = [
    headers.join(','),
    ...dataToExport.map(reg => [
      reg.FullName || '',
      reg.Email || '',
      reg.Phone || '',
      reg.Institution || '',
      reg.InstitutionType || '',
      reg.Course || '',
      reg.Year || '',
      reg.City || '',
      reg.State || '',
      reg.Cohort || '',
      reg.Track || '',
      reg.ProjectTitle || '',
      reg.ProblemStatement || '',
      reg.Context || '',
      reg.Stakeholders || '',
      reg.Solution || '',
      reg.WorkingPrinciple || '',
      reg.Novelty || '',
      reg.Impact || '',
      reg.Budget || '',
      reg.Timeline || '',
      reg.TeamMembers || '',
      reg.HasMentor || '',
      reg.MentorName || '',
      reg.MentorEmail || '',
      reg.MentorDepartment || '',
      reg.MentorInstitution || '',
      reg.MentorPhone || '',
      reg.TMAMember || '',
      reg.TMAChapter || '',
      reg.payment_status || 'Pending',
      reg.payment_id || '',
      reg.order_id || '',
      reg.failure_reason || '',
      reg.abandoned_at ? new Date(reg.abandoned_at.seconds * 1000).toLocaleDateString() : '',
      reg.submittedAt ? new Date(reg.submittedAt.seconds * 1000).toLocaleDateString() : ''
    ].map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filterSuffix = dateFilter.enabled ? 
    `_${dateFilter.startDate || 'start'}_to_${dateFilter.endDate || 'end'}` : '';
  link.setAttribute('download', `registrations_${timestamp}${filterSuffix}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showNotification(`CSV file downloaded successfully - ${dataToExport.length} registrations`, 'success');
  createLog('CSV export', `Exported ${dataToExport.length} registrations to CSV`);
};

export const exportToPDF = (getFilteredRegistrations, showNotification, createLog) => {
  try {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    
    // Use filtered data for PDF export
    const dataForPDF = getFilteredRegistrations();
    
    // Calculate comprehensive statistics for PDF
    const totalRegistrations = dataForPDF.length;
    const paidRegistrations = dataForPDF.filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length;
    const activeCohorts = new Set(dataForPDF.map(r => r.Cohort)).size;
    const pendingPayments = dataForPDF.filter(r => (!r.payment_status || r.payment_status === 'pending')).length;
    const completionRate = totalRegistrations > 0 ? Math.round(paidRegistrations / totalRegistrations * 100) : 0;
    const totalRevenue = dataForPDF.reduce((sum, reg) => sum + parseFloat(reg.payment_amount || reg.amount || 0), 0);

    // Generate comprehensive leaderboard data
    const topCohorts = Object.entries(
      dataForPDF.reduce((acc, reg) => {
        const cohort = reg.Cohort || 'Unknown';
        acc[cohort] = (acc[cohort] || 0) + 1;
        return acc;
      }, {})
    ).sort(([,a], [,b]) => b - a);

    const tmaMembers = dataForPDF.reduce((acc, reg) => {
      const isTMAMember = reg.TMAMember && (reg.TMAMember.toString().startsWith("Yes") || reg.TMAMember === true);
      const category = isTMAMember ? 'TMA Members' : 'Non-Members';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const topInstitutions = Object.entries(
      dataForPDF.reduce((acc, reg) => {
        const institution = reg.Institution || reg.CollegeName || 'Unknown Institution';
        acc[institution] = (acc[institution] || 0) + 1;
        return acc;
      }, {})
    ).sort(([,a], [,b]) => b - a);

    const topStates = Object.entries(
      dataForPDF.reduce((acc, reg) => {
        const state = reg.State || 'Unknown State';
        acc[state] = (acc[state] || 0) + 1;
        return acc;
      }, {})
    ).sort(([,a], [,b]) => b - a);

    const institutionTypes = Object.entries(
      dataForPDF.reduce((acc, reg) => {
        const type = reg.InstitutionType || 'Unknown Type';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {})
    ).sort(([,a], [,b]) => b - a);

    const academicYears = Object.entries(
      dataForPDF.reduce((acc, reg) => {
        const year = reg.AcademicYear || reg.Year || reg.CurrentYear || 'Unknown Year';
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {})
    ).sort(([,a], [,b]) => b - a);

    const registrationTimeline = Object.entries(
      dataForPDF.reduce((acc, reg) => {
        if (reg.submittedAt && reg.submittedAt.seconds) {
          const date = new Date(reg.submittedAt.seconds * 1000).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
        } else {
          acc['Unknown Date'] = (acc['Unknown Date'] || 0) + 1;
        }
        return acc;
      }, {})
    ).sort(([,a], [,b]) => b - a);

    // Create comprehensive PDF content
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>TMA Hykon Dashboard Report - ${new Date().toLocaleDateString()}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            color: #333; 
            line-height: 1.6;
            background: #fff;
          }
          .page { 
            max-width: 210mm; 
            margin: 0 auto; 
            background: white; 
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 20px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 3px solid #3f51b5; 
            padding-bottom: 20px; 
          }
          .header h1 { 
            color: #3f51b5; 
            margin: 0; 
            font-size: 2.5rem;
            font-weight: 700;
          }
          .header .subtitle {
            font-size: 1.2rem;
            color: #666;
            margin: 10px 0;
          }
          .header p { 
            margin: 5px 0; 
            color: #888; 
            font-size: 0.9rem;
          }
          
          .overview-section {
            margin-bottom: 40px;
          }
          .section-title {
            color: #3f51b5;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 10px;
          }
          
          .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin-bottom: 40px; 
          }
          .stat-card { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
            padding: 25px; 
            border-radius: 12px; 
            text-align: center; 
            border-left: 5px solid #3f51b5;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .stat-value { 
            font-size: 2.5rem; 
            font-weight: 700; 
            color: #3f51b5; 
            margin: 10px 0; 
          }
          .stat-label { 
            color: #666; 
            font-size: 1rem;
            font-weight: 500;
          }
          
          .leaderboards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .leaderboard { 
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .leaderboard h3 { 
            background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
            color: white; 
            margin: 0;
            padding: 15px 20px;
            font-size: 1.2rem;
            font-weight: 600;
          }
          .leaderboard-content {
            padding: 0;
          }
          .leaderboard-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            padding: 12px 20px; 
            border-bottom: 1px solid #f1f3f4;
            transition: background-color 0.2s;
          }
          .leaderboard-item:last-child {
            border-bottom: none;
          }
          .leaderboard-item:nth-child(even) {
            background-color: #f8f9fa;
          }
          .leaderboard-item:hover {
            background-color: #e3f2fd;
          }
          .rank { 
            font-weight: 700; 
            color: #3f51b5; 
            margin-right: 12px;
            min-width: 25px;
            text-align: center;
          }
          .rank.gold { color: #ffc107; }
          .rank.silver { color: #6c757d; }
          .rank.bronze { color: #fd7e14; }
          
          .item-info {
            display: flex;
            align-items: center;
            flex: 1;
          }
          .item-name {
            font-weight: 500;
            color: #333;
          }
          .item-value {
            color: #3f51b5;
            font-weight: 600;
            font-size: 0.95rem;
          }
          
          .summary-stats {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            padding: 20px;
            border-radius: 12px;
            margin: 30px 0;
            border-left: 5px solid #2196f3;
          }
          .summary-stats h3 {
            color: #1976d2;
            margin: 0 0 15px 0;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1976d2;
          }
          .summary-label {
            font-size: 0.9rem;
            color: #666;
          }
          
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            color: #666; 
            font-size: 0.85rem; 
            border-top: 2px solid #e9ecef; 
            padding-top: 20px; 
          }
          .footer p {
            margin: 5px 0;
          }
          
          @media print { 
            body { margin: 0; padding: 10px; }
            .page { box-shadow: none; }
            .leaderboard { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <h1>TMA Hykon Innovation Challenge</h1>
            <div class="subtitle">Comprehensive Dashboard Report</div>
            <p>Generated on: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>Report Time: ${new Date().toLocaleTimeString()} | Total Data Points: ${totalRegistrations}</p>
          </div>

          <div class="overview-section">
            <h2 class="section-title">📊 Key Performance Metrics</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${totalRegistrations}</div>
                <div class="stat-label">Total Registrations</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${paidRegistrations}</div>
                <div class="stat-label">Paid Registrations</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${completionRate}%</div>
                <div class="stat-label">Completion Rate</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${activeCohorts}</div>
                <div class="stat-label">Active Cohorts</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${pendingPayments}</div>
                <div class="stat-label">Pending Payments</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">₹${totalRevenue.toLocaleString()}</div>
                <div class="stat-label">Total Revenue</div>
              </div>
            </div>
          </div>

          <div class="summary-stats">
            <h3>📈 Quick Summary</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-value">${Object.keys(tmaMembers).length}</div>
                <div class="summary-label">Member Categories</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${topInstitutions.length}</div>
                <div class="summary-label">Participating Institutions</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${topStates.length}</div>
                <div class="summary-label">States/Regions</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${academicYears.length}</div>
                <div class="summary-label">Academic Levels</div>
              </div>
            </div>
          </div>

          <h2 class="section-title">🏆 Detailed Leaderboards</h2>
          <div class="leaderboards-grid">
            
            <div class="leaderboard">
              <h3>🏆 All Cohorts Performance</h3>
              <div class="leaderboard-content">
                ${topCohorts.map(([cohort, count], index) => 
                  `<div class="leaderboard-item">
                    <div class="item-info">
                      <span class="rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">${index + 1}.</span>
                      <span class="item-name">${cohort}</span>
                    </div>
                    <span class="item-value">${count} registrations</span>
                  </div>`
                ).join('')}
              </div>
            </div>

            <div class="leaderboard">
              <h3>👥 TMA Membership Distribution</h3>
              <div class="leaderboard-content">
                ${Object.entries(tmaMembers).map(([category, count], index) => 
                  `<div class="leaderboard-item">
                    <div class="item-info">
                      <span class="rank ${index === 0 ? 'gold' : 'silver'}">${index + 1}.</span>
                      <span class="item-name">${category}</span>
                    </div>
                    <span class="item-value">${count} members</span>
                  </div>`
                ).join('')}
              </div>
            </div>

            <div class="leaderboard">
              <h3>🏛️ All Participating Institutions</h3>
              <div class="leaderboard-content">
                ${topInstitutions.map(([institution, count], index) => 
                  `<div class="leaderboard-item">
                    <div class="item-info">
                      <span class="rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">${index + 1}.</span>
                      <span class="item-name">${institution}</span>
                    </div>
                    <span class="item-value">${count} students</span>
                  </div>`
                ).join('')}
              </div>
            </div>

            <div class="leaderboard">
              <h3>🌍 Geographic Distribution</h3>
              <div class="leaderboard-content">
                ${topStates.map(([state, count], index) => 
                  `<div class="leaderboard-item">
                    <div class="item-info">
                      <span class="rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">${index + 1}.</span>
                      <span class="item-name">${state}</span>
                    </div>
                    <span class="item-value">${count} registrations</span>
                  </div>`
                ).join('')}
              </div>
            </div>

            <div class="leaderboard">
              <h3>🏫 Institution Type Distribution</h3>
              <div class="leaderboard-content">
                ${institutionTypes.map(([type, count], index) => 
                  `<div class="leaderboard-item">
                    <div class="item-info">
                      <span class="rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">${index + 1}.</span>
                      <span class="item-name">${type}</span>
                    </div>
                    <span class="item-value">${count} registrations</span>
                  </div>`
                ).join('')}
              </div>
            </div>

            <div class="leaderboard">
              <h3>🎓 Academic Year Distribution</h3>
              <div class="leaderboard-content">
                ${academicYears.map(([year, count], index) => 
                  `<div class="leaderboard-item">
                    <div class="item-info">
                      <span class="rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">${index + 1}.</span>
                      <span class="item-name">${year}</span>
                    </div>
                    <span class="item-value">${count} students</span>
                  </div>`
                ).join('')}
              </div>
            </div>

            <div class="leaderboard">
              <h3>📅 Registration Timeline</h3>
              <div class="leaderboard-content">
                ${registrationTimeline.slice(0, 10).map(([date, count], index) => 
                  `<div class="leaderboard-item">
                    <div class="item-info">
                      <span class="rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">${index + 1}.</span>
                      <span class="item-name">${date}</span>
                    </div>
                    <span class="item-value">${count} registrations</span>
                  </div>`
                ).join('')}
              </div>
            </div>

          </div>

          <div class="footer">
            <p><strong>TMA Hykon Innovation Challenge - Comprehensive Analytics Report</strong></p>
            <p>This report contains complete leaderboard data and performance metrics</p>
            <p>Generated from Dashboard | © ${new Date().getFullYear()} TMA Hykon - All rights reserved</p>
            <p>For questions about this report, contact the support team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(pdfContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      showNotification('Comprehensive PDF report generated successfully!', 'success');
      createLog('PDF export', `Exported comprehensive dashboard report with all leaderboard data`);
    }, 1000);

  } catch (error) {
    console.error('Error exporting to PDF:', error);
    showNotification('Error exporting to PDF', 'error');
  }
};
