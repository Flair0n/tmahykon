import React from 'react';
import '../../styles/admin/LogsSection.css';

const LogsSection = ({ logs, logsLoading, fetchLogs }) => {
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

  // Get log icon based on action
  const getLogIcon = (action) => {
    if (action?.toLowerCase().includes('delete') || action?.toLowerCase().includes('remove')) {
      return { icon: '🗑️', class: 'delete' };
    } else if (action?.toLowerCase().includes('create') || action?.toLowerCase().includes('add')) {
      return { icon: '➕', class: 'create' };
    } else if (action?.toLowerCase().includes('update') || action?.toLowerCase().includes('edit')) {
      return { icon: '✏️', class: 'update' };
    } else {
      return { icon: '⚙️', class: 'system' };
    }
  };

  return (
    <div className="section">
      <div className="logs-section">
        {/* Professional Header */}
        <div className="logs-header">
          <div className="logs-title">
            📋 Activity Logs
          </div>
          <div className="logs-subtitle">
            Complete system activity and user actions from Firestore database
          </div>
          
          {/* Statistics */}
          <div className="logs-stats">
            <div className="logs-stat-item">
              <div className="logs-stat-value">{logStats.total}</div>
              <div className="logs-stat-label">Total Logs</div>
            </div>
            <div className="logs-stat-item">
              <div className="logs-stat-value">{logStats.today}</div>
              <div className="logs-stat-label">Today</div>
            </div>
            <div className="logs-stat-item">
              <div className="logs-stat-value">{logStats.users}</div>
              <div className="logs-stat-label">Users</div>
            </div>
            <div className="logs-stat-item">
              <div className="logs-stat-value">{logStats.actions}</div>
              <div className="logs-stat-label">Action Types</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="logs-filter-bar">
          <input 
            type="text" 
            className="logs-filter-input" 
            placeholder="Search logs by action, user, or details..."
          />
          <select className="logs-filter-select">
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="delete">Delete</option>
            <option value="update">Update</option>
            <option value="system">System</option>
          </select>
          <button className="btn-primary" onClick={fetchLogs}>
            🔄 Refresh
          </button>
        </div>
        
        {logsLoading ? (
          <div className="professional-loading">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading all activity logs from Firestore...</div>
          </div>
        ) : (
          <div className="logs-container">
            {logs.length > 0 ? logs.map(log => {
              const { icon, class: iconClass } = getLogIcon(log.action);
              return (
                <div key={log.id} className="log-entry">
                  <div className={`log-icon ${iconClass}`}>
                    {icon}
                  </div>
                  <div className="log-content">
                    <div className="log-action">{log.action}</div>
                    {log.details && (
                      <div className="log-details">{log.details}</div>
                    )}
                    <div className="log-meta">
                      <span className="log-time">
                        {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Unknown time'}
                      </span>
                      <span className="log-user">
                        {log.userId || 'system'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="logs-empty">
                <div className="logs-empty-icon">📋</div>
                <div className="logs-empty-title">No Activity Logs</div>
                <div className="logs-empty-subtitle">
                  System activity and user actions will appear here as you use the dashboard
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsSection;
