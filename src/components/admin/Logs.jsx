import React, { useState } from 'react';

const Logs = ({ logs, logsLoading, fetchLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Calculate log statistics
  const logStats = {
    total: logs.length,
    today: logs.filter(log => {
      if (!log.timestamp) return false;
      const logDate = new Date(log.timestamp.seconds * 1000);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length,
    users: new Set(logs.map(log => log.userId || 'system')).size,
    actions: new Set(logs.map(log => log.action)).size
  };

  // Get log icon and color based on action
  const getLogIcon = (action) => {
    if (action?.toLowerCase().includes('delete') || action?.toLowerCase().includes('remove')) {
      return { icon: '🗑️', class: 'delete', color: '#ef4444' };
    } else if (action?.toLowerCase().includes('create') || action?.toLowerCase().includes('add')) {
      return { icon: '➕', class: 'create', color: '#10b981' };
    } else if (action?.toLowerCase().includes('update') || action?.toLowerCase().includes('edit')) {
      return { icon: '✏️', class: 'update', color: '#f59e0b' };
    } else if (action?.toLowerCase().includes('login') || action?.toLowerCase().includes('auth')) {
      return { icon: '🔐', class: 'auth', color: '#8b5cf6' };
    } else {
      return { icon: '⚙️', class: 'system', color: '#6b7280' };
    }
  };

  // Filter logs based on search and type
  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || 
      log.action?.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesType;
  });

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>
              📋 System Activity Logs
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
              Monitor real-time system activities and user actions
            </p>
          </div>
          <button 
            onClick={fetchLogs}
            disabled={logsLoading}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: logsLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => !logsLoading && (e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
            onMouseOut={(e) => !logsLoading && (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
          >
            {logsLoading ? '⏳' : '🔄'} {logsLoading ? 'Loading...' : 'Refresh Logs'}
          </button>
        </div>
        
        {/* Statistics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '16px' 
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
              {logStats.total}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Logs</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
              {logStats.today}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Today</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
              {logStats.users}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Active Users</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
              {logStats.actions}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Action Types</div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search logs by action, user, or details..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Actions</option>
          <option value="create">Create Actions</option>
          <option value="delete">Delete Actions</option>
          <option value="update">Update Actions</option>
          <option value="login">Login Actions</option>
          <option value="system">System Actions</option>
        </select>
        <div style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          padding: '12px 0'
        }}>
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      </div>
      {/* Logs Display */}
      {logsLoading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <div style={{ color: '#6b7280', fontSize: '16px' }}>Loading activity logs...</div>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {filteredLogs.length > 0 ? (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredLogs.map((log, index) => {
                const { icon, color } = getLogIcon(log.action);
                return (
                  <div 
                    key={log.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      padding: '20px 24px',
                      borderBottom: index < filteredLogs.length - 1 ? '1px solid #f1f3f4' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {log.action}
                      </div>
                      {log.details && (
                        <div style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          marginBottom: '8px',
                          lineHeight: '1.5'
                        }}>
                          {log.details}
                        </div>
                      )}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '13px',
                        color: '#9ca3af'
                      }}>
                        <span>
                          🕒 {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Unknown time'}
                        </span>
                        <span>
                          👤 {log.userId || 'System'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📋</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '20px' }}>
                No Activity Logs Found
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '16px' }}>
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'System activities will appear here as you use the dashboard'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Logs;
