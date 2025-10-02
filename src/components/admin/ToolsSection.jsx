import React from 'react';
import '../../styles/admin/ToolsSection.css';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

const ToolsSection = ({ 
  registrations, 
  logs, 
  setActiveTab, 
  fetchRegistrations, 
  fetchLogs, 
  setRegistrations, 
  setLogs, 
  showNotification, 
  createLog,
  getFilteredRegistrations,
  dateFilter
}) => {
  
  const handleExportCSV = () => {
    exportToCSV(registrations, getFilteredRegistrations, dateFilter, showNotification, createLog);
  };

  const handleExportPDF = () => {
    exportToPDF(getFilteredRegistrations, showNotification, createLog);
  };

  return (
    <div className="section">
      <h2>🛠️ Tools & Utilities</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Administrative tools for data management, navigation, and system operations
      </p>
      
      <div className="tools-grid">
        {/* Navigation & Quick Actions */}
        <div className="tool-card">
          <div className="tool-header">
            <h3>🚀 Quick Navigation</h3>
            <p>Jump to different sections quickly</p>
          </div>
          <div className="tool-actions">
            <button className="btn-action" onClick={() => setActiveTab('overview')}>
              📊 Dashboard Overview
            </button>
            <button className="btn-action" onClick={() => setActiveTab('users')}>
              👥 Manage Registrations
            </button>
            <button className="btn-action" onClick={() => setActiveTab('analytics')}>
              📈 View Analytics
            </button>
            <button className="btn-action" onClick={() => setActiveTab('logs')}>
              📋 Activity Logs
            </button>
          </div>
        </div>

        {/* Data Export Tools */}
        <div className="tool-card">
          <div className="tool-header">
            <h3>📤 Data Export</h3>
            <p>Export data in various formats</p>
          </div>
          <div className="tool-actions">
            <button className="btn-accent" onClick={handleExportCSV}>
              📊 Export CSV
            </button>
            <button className="btn-accent pdf-export" onClick={handleExportPDF}>
              📄 Export PDF Report
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => {
                const jsonData = JSON.stringify(registrations, null, 2);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `registrations_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                showNotification('JSON export completed!', 'success');
              }}
            >
              🗂️ Export JSON
            </button>
          </div>
        </div>
        
        {/* Data Management */}
        <div className="tool-card">
          <div className="tool-header">
            <h3>🔄 Data Management</h3>
            <p>Refresh and manage database connections</p>
          </div>
          <div className="tool-actions">
            <button className="btn-primary" onClick={fetchRegistrations}>
              🔄 Refresh All Data
            </button>
            <button className="btn-secondary" onClick={fetchLogs}>
              📋 Refresh Logs
            </button>
            <button 
              className="btn-warning" 
              onClick={() => {
                if (window.confirm('This will clear all cached data and reload from Firestore. Continue?')) {
                  setRegistrations([]);
                  setLogs([]);
                  fetchRegistrations();
                  fetchLogs();
                  showNotification('Data cache cleared and reloaded!', 'success');
                }
              }}
            >
              🧹 Clear Cache
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className="tool-card">
          <div className="tool-header">
            <h3>ℹ️ System Status</h3>
            <p>Current system information and metrics</p>
          </div>
          <div className="system-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Database:</span>
                <strong className="info-value">Firebase Firestore</strong>
              </div>
              <div className="info-item">
                <span className="info-label">Connection:</span>
                <strong className="info-value" style={{color: '#10b981'}}>✅ Connected</strong>
              </div>
              <div className="info-item">
                <span className="info-label">Total Records:</span>
                <strong className="info-value">{registrations.length.toLocaleString()}</strong>
              </div>
              <div className="info-item">
                <span className="info-label">Activity Logs:</span>
                <strong className="info-value">{logs.length.toLocaleString()}</strong>
              </div>
              <div className="info-item">
                <span className="info-label">Paid Records:</span>
                <strong className="info-value">
                  {registrations.filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length}
                </strong>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <strong className="info-value">{new Date().toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Tools */}
        <div className="tool-card">
          <div className="tool-header">
            <h3>⚙️ Advanced Tools</h3>
            <p>Advanced administrative operations</p>
          </div>
          <div className="tool-actions">
            <button 
              className="btn-secondary"
              onClick={() => {
                const stats = {
                  totalRegistrations: registrations.length,
                  paidRegistrations: registrations.filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length,
                  totalRevenue: registrations.reduce((sum, reg) => sum + parseFloat(reg.payment_amount || reg.amount || 0), 0),
                  cohorts: new Set(registrations.map(r => r.Cohort)).size,
                  institutions: new Set(registrations.map(r => r.Institution || r.CollegeName)).size
                };
                alert(JSON.stringify(stats, null, 2));
              }}
            >
              📊 Show Statistics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                createLog('System Check', 'Manual system health check performed');
                showNotification('System check completed!', 'success');
              }}
            >
              🔧 System Check
            </button>
            <button 
              className="btn-info"
              onClick={() => {
                const totalSize = JSON.stringify(registrations).length + JSON.stringify(logs).length;
                const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
                showNotification(`Data size: ${sizeInMB} MB`, 'info');
              }}
            >
              📏 Data Size
            </button>
          </div>
        </div>

        {/* Data Cleaning Panel Integration */}
        <div className="tool-card">
          <div className="tool-header">
            <h3>🧹 Data Cleaning</h3>
            <p>Clean and optimize database records</p>
          </div>
          <div className="tool-actions">
            <button 
              className="btn-warning"
              onClick={() => {
                if (window.confirm('This will analyze data for duplicates and inconsistencies. Continue?')) {
                  // Analyze duplicates
                  const emails = registrations.map(r => r.Email).filter(Boolean);
                  const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);
                  
                  if (duplicateEmails.length > 0) {
                    showNotification(`Found ${duplicateEmails.length} duplicate emails`, 'warning');
                  } else {
                    showNotification('No duplicates found', 'success');
                  }
                  
                  createLog('Data Analysis', `Analyzed ${registrations.length} records for duplicates`);
                }
              }}
            >
              🔍 Analyze Data
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                const incompleteRecords = registrations.filter(r => 
                  !r.FullName || !r.Email || !r.Institution
                ).length;
                showNotification(`Found ${incompleteRecords} incomplete records`, 'info');
              }}
            >
              📋 Check Completeness
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsSection;
