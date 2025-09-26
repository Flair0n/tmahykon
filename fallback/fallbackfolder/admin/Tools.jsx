import React from 'react';

const Tools = ({ 
  setActiveTab, 
  exportToCSV, 
  exportToPDF, 
  showNotification 
}) => {
  
  const toolCategories = [
    {
      title: 'Navigation & Quick Access',
      description: 'Navigate between dashboard sections efficiently',
      icon: '🚀',
      color: '#667eea',
      tools: [
        { name: 'Dashboard Overview', icon: '📊', action: () => setActiveTab('dashboard'), available: true },
        { name: 'User Management', icon: '👥', action: () => setActiveTab('users'), available: true },
        { name: 'Analytics Center', icon: '📈', action: () => setActiveTab('analytics'), available: true },
        { name: 'Activity Logs', icon: '📋', action: () => setActiveTab('logs'), available: true },
        { name: 'Data Cleaning', icon: '🧹', action: () => setActiveTab('datacleaning'), available: true }
      ]
    },
    {
      title: 'Data Export & Reports',
      description: 'Export and generate comprehensive reports',
      icon: '📤',
      color: '#10b981',
      tools: [
        { name: 'Export to CSV', icon: '📊', action: exportToCSV, available: true },
        { name: 'Generate PDF Report', icon: '📄', action: exportToPDF, available: true },
        { name: 'Custom Reports', icon: '📋', action: () => showNotification('Custom reports feature coming soon!', 'info'), available: false },
        { name: 'Data Visualization', icon: '📈', action: () => showNotification('Data visualization coming soon!', 'info'), available: false }
      ]
    },
    {
      title: 'System Operations',
      description: 'Database and system maintenance tools',
      icon: '⚙️',
      color: '#f59e0b',
      tools: [
        { name: 'Database Sync', icon: '🔄', action: () => showNotification('Database sync feature coming soon!', 'info'), available: false },
        { name: 'System Health Check', icon: '🔧', action: () => showNotification('System health check coming soon!', 'info'), available: false },
        { name: 'Cache Management', icon: '🧹', action: () => showNotification('Cache management coming soon!', 'info'), available: false },
        { name: 'Backup Database', icon: '💾', action: () => showNotification('Database backup coming soon!', 'info'), available: false }
      ]
    },
    {
      title: 'Communication Tools',
      description: 'Send notifications and communicate with users',
      icon: '📧',
      color: '#8b5cf6',
      tools: [
        { name: 'Bulk Email', icon: '📧', action: () => showNotification('Bulk email feature coming soon!', 'info'), available: false },
        { name: 'SMS Notifications', icon: '📱', action: () => showNotification('SMS notifications coming soon!', 'info'), available: false },
        { name: 'Push Notifications', icon: '🔔', action: () => showNotification('Push notifications coming soon!', 'info'), available: false },
        { name: 'Email Templates', icon: '📝', action: () => showNotification('Email templates coming soon!', 'info'), available: false }
      ]
    }
  ];

  return (
    <div className="section">
      {/* Professional Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '32px',
        borderRadius: '16px',
        marginBottom: '32px'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>
          🛠️ Administrative Tools
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          Comprehensive suite of tools for system management and data operations
        </p>
      </div>

      {/* Tools Categories */}
      <div style={{ 
        display: 'grid', 
        gap: '24px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
      }}>
        {toolCategories.map((category, categoryIndex) => (
          <div 
            key={categoryIndex}
            style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              border: '1px solid #f1f3f4'
            }}
          >
            {/* Category Header */}
            <div style={{
              background: `${category.color}15`,
              padding: '24px',
              borderBottom: '1px solid #f1f3f4'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: category.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  marginRight: '16px'
                }}>
                  {category.icon}
                </div>
                <div>
                  <h3 style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    {category.title}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    color: '#6b7280' 
                  }}>
                    {category.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Tools List */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                {category.tools.map((tool, toolIndex) => (
                  <button
                    key={toolIndex}
                    onClick={tool.action}
                    disabled={!tool.available}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      background: tool.available ? 'transparent' : '#f9fafb',
                      border: `2px solid ${tool.available ? '#e5e7eb' : '#f3f4f6'}`,
                      borderRadius: '12px',
                      cursor: tool.available ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      width: '100%',
                      opacity: tool.available ? 1 : 0.6
                    }}
                    onMouseOver={(e) => {
                      if (tool.available) {
                        e.target.style.borderColor = category.color;
                        e.target.style.background = `${category.color}08`;
                      }
                    }}
                    onMouseOut={(e) => {
                      if (tool.available) {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: tool.available ? `${category.color}15` : '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      fontSize: '16px'
                    }}>
                      {tool.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: tool.available ? '#1f2937' : '#9ca3af',
                        marginBottom: '2px'
                      }}>
                        {tool.name}
                      </div>
                      {!tool.available && (
                        <div style={{
                          fontSize: '12px',
                          color: '#9ca3af'
                        }}>
                          Coming Soon
                        </div>
                      )}
                    </div>
                    {tool.available && (
                      <div style={{
                        color: category.color,
                        fontSize: '18px'
                      }}>
                        →
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Status & Quick Stats */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '32px',
        marginTop: '32px'
      }}>
        <h3 style={{ 
          margin: '0 0 24px 0', 
          fontSize: '20px', 
          fontWeight: '600',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📊 System Overview
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px' 
        }}>
          <div style={{
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔧</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
              {toolCategories.reduce((total, category) => total + category.tools.filter(tool => tool.available).length, 0)}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Available Tools</div>
          </div>
          
          <div style={{
            padding: '20px',
            background: '#f0fdf4',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚡</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
              {toolCategories.length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Tool Categories</div>
          </div>
          
          <div style={{
            padding: '20px',
            background: '#fef3f2',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #fecaca'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📤</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>2</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Export Formats</div>
          </div>
          
          <div style={{
            padding: '20px',
            background: '#f0f9ff',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #bae6fd'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
              ✅ Online
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>System Status</div>
          </div>
        </div>
      </div>

      {/* Help & Documentation */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '32px',
        marginTop: '24px'
      }}>
        <h3 style={{ 
          margin: '0 0 24px 0', 
          fontSize: '20px', 
          fontWeight: '600',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ❓ Quick Help Guide
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          <div style={{
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            background: '#fafbfc'
          }}>
            <h4 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🚀 Navigation Tools
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              Use quick navigation buttons to jump between different sections of the admin dashboard efficiently.
            </p>
          </div>
          
          <div style={{
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            background: '#fafbfc'
          }}>
            <h4 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📤 Data Export
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              Export registration data as CSV for spreadsheet analysis or generate PDF reports for comprehensive documentation.
            </p>
          </div>
          
          <div style={{
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            background: '#fafbfc'
          }}>
            <h4 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🧹 Data Cleaning
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              Use advanced data cleaning tools to standardize institution names and improve overall data quality.
            </p>
          </div>
          
          <div style={{
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            background: '#fafbfc'
          }}>
            <h4 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📊 Analytics
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              Access detailed analytics and insights about registrations, payment trends, and user engagement patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
