import React from 'react';
import '../../styles/admin/AnalyticsSection.css';

const AnalyticsSection = ({ 
  loading, 
  registrations, 
  dateFilter, 
  setDateFilter, 
  getFilteredRegistrations, 
  applyDateFilter, 
  resetDateFilter, 
  logs 
}) => {
  return (
    <div className="section">
      <h2>📊 Analytics & Insights</h2>
      
      {/* Date Filter Section for Analytics */}
      <div className="date-filter-section" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>
          📅 Filter Analytics by Date Range
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: '0.9' }}>
              From Date:
            </label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', opacity: '0.9' }}>
              To Date:
            </label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={applyDateFilter}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              Apply Filter
            </button>
            <button
              onClick={resetDateFilter}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              Clear Filter
            </button>
          </div>
        </div>
        {dateFilter.enabled && (
          <div style={{ 
            marginTop: '12px', 
            padding: '8px 12px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '6px',
            fontSize: '0.85rem'
          }}>
            📊 Analyzing {getFilteredRegistrations().length} of {registrations.length} registrations
            {dateFilter.startDate && ` from ${dateFilter.startDate}`}
            {dateFilter.endDate && ` to ${dateFilter.endDate}`}
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading analytics from Firestore...
        </div>
      ) : (
        <>
          {/* Professional Analytics KPIs based on filtered data */}
          <div className="kpi-cards">
            <div className="kpi-card">
              <div className="kpi-icon">👥</div>
              <h3>Total Registrations</h3>
              <div className="kpi-value">{getFilteredRegistrations().length}</div>
              <div className="kpi-change positive">
                {dateFilter.enabled ? 'Filtered Data' : 'All Data'}
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">✅</div>
              <h3>Completion Rate</h3>
              <div className="kpi-value">
                {getFilteredRegistrations().length > 0 
                  ? Math.round(getFilteredRegistrations().filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length / getFilteredRegistrations().length * 100)
                  : 0}%
              </div>
              <div className="kpi-change">
                {getFilteredRegistrations().filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length} completed
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon">🎯</div>
              <h3>Active Cohorts</h3>
              <div className="kpi-value">{new Set(getFilteredRegistrations().map(r => r.Cohort)).size}</div>
              <div className="kpi-change">
                Different Programs
              </div>
            </div>
          </div>

          {/* Professional Analytics Insights */}
          <div className="analytics-insights">
            <h3>📈 Key Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">🎓</div>
                <div className="insight-content">
                  <h4>TMA Membership</h4>
                  <div className="insight-stats">
                    <span className="insight-value">
                      {Math.round((getFilteredRegistrations().filter(r => r.TMAMember && (r.TMAMember.toString().startsWith("Yes") || r.TMAMember === true)).length / getFilteredRegistrations().length) * 100) || 0}%
                    </span>
                    <span className="insight-label">are TMA members</span>
                  </div>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🌟</div>
                <div className="insight-content">
                  <h4>Top Cohort</h4>
                  <div className="insight-stats">
                    <span className="insight-value">
                      {Object.entries(
                        getFilteredRegistrations().reduce((acc, reg) => {
                          const cohort = reg.Cohort || 'Unknown';
                          acc[cohort] = (acc[cohort] || 0) + 1;
                          return acc;
                        }, {})
                      ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                    </span>
                    <span className="insight-label">most popular</span>
                  </div>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">💳</div>
                <div className="insight-content">
                  <h4>Payment Success</h4>
                  <div className="insight-stats">
                    <span className="insight-value">
                      {Math.round((getFilteredRegistrations().filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length / getFilteredRegistrations().length) * 100) || 0}%
                    </span>
                    <span className="insight-label">completion rate</span>
                  </div>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🏛️</div>
                <div className="insight-content">
                  <h4>Institutions</h4>
                  <div className="insight-stats">
                    <span className="insight-value">
                      {new Set(getFilteredRegistrations().map(r => r.Institution || r.CollegeName || 'Unknown')).size}
                    </span>
                    <span className="insight-label">unique institutions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="cohort-distribution">
            <h3>Cohort Distribution {dateFilter.enabled ? '(Filtered)' : ''}</h3>
            {getFilteredRegistrations().length > 0 ? (
              <div className="cohort-stats">
                {Object.entries(
                  getFilteredRegistrations().reduce((acc, reg) => {
                    const cohort = reg.Cohort || 'Unknown';
                    acc[cohort] = (acc[cohort] || 0) + 1;
                    return acc;
                  }, {})
                )
                .sort(([,a], [,b]) => b - a)
                .map(([cohort, count]) => (
                  <div key={cohort} className="cohort-item">
                    <span className="cohort-name">{cohort}</span>
                    <span className="cohort-count">{count}</span>
                    <div className="cohort-bar">
                      <div 
                        className="cohort-fill" 
                        style={{ width: `${(count / Math.max(...Object.values(
                          getFilteredRegistrations().reduce((acc, reg) => {
                            const cohort = reg.Cohort || 'Unknown';
                            acc[cohort] = (acc[cohort] || 0) + 1;
                            return acc;
                          }, {})
                        ))) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>{dateFilter.enabled ? 'No registrations found for the selected date range' : 'No cohort data available'}</p>
            )}
          </div>

          {/* Leaderboards Section for Analytics */}
          <div className="leaderboards-section" style={{ marginTop: '30px' }}>
            <h3>Detailed Analytics {dateFilter.enabled ? '(Filtered)' : ''}</h3>
            <div className="leaderboards-grid">
              
              {/* TMA Members Analytics */}
              <div className="leaderboard-card">
                <h4>👥 TMA Membership Analysis</h4>
                <div className="leaderboard-list">
                  {Object.entries(
                    getFilteredRegistrations().reduce((acc, reg) => {
                      const isTMAMember = reg.TMAMember && (reg.TMAMember.toString().startsWith("Yes") || reg.TMAMember === true);
                      const category = isTMAMember ? 'TMA Members' : 'Non-Members';
                      acc[category] = (acc[category] || 0) + 1;
                      return acc;
                    }, {})
                  )
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, count], index) => (
                    <div key={category} className="leaderboard-item">
                      <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                      <span className="name">{category === 'TMA Members' ? 'TMA Member' : 'Non TMA Member'}</span>
                      <span className="score">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Institution Analysis */}
              <div className="leaderboard-card">
                <h4>🏛️ Top Institutions</h4>
                <div className="leaderboard-list">
                  {Object.entries(
                    getFilteredRegistrations().reduce((acc, reg) => {
                      const institution = reg.Institution || reg.CollegeName || 'Unknown Institution';
                      acc[institution] = (acc[institution] || 0) + 1;
                      return acc;
                    }, {})
                  )
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([institution, count], index) => (
                    <div key={institution} className="leaderboard-item">
                      <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                      <span className="name">{institution}</span>
                      <span className="score">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Analysis */}
              <div className="leaderboard-card">
                <h4>🌍 Geographic Distribution</h4>
                <div className="leaderboard-list">
                  {Object.entries(
                    getFilteredRegistrations().reduce((acc, reg) => {
                      const state = reg.State || reg.Region || 'Unknown State';
                      acc[state] = (acc[state] || 0) + 1;
                      return acc;
                    }, {})
                  )
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([state, count], index) => (
                    <div key={state} className="leaderboard-item">
                      <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                      <span className="name">{state}</span>
                      <span className="score">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Professional Recent Activity Section */}
          <div className="recent-activity-section">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">⚡</div>
                <h3>Recent Activity</h3>
              </div>
              <div className="activity-count">
                {logs.length} total logs
              </div>
            </div>
            {logs.length > 0 ? (
              <div className="activity-timeline">
                {logs.slice(0, 5).map((log, index) => (
                  <div key={log.id} className="activity-timeline-item">
                    <div className="activity-marker">
                      <div className="activity-dot"></div>
                      {index < 4 && <div className="activity-line"></div>}
                    </div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <span className="activity-action">{log.action}</span>
                        <span className="activity-timestamp">
                          {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Unknown time'}
                        </span>
                      </div>
                      <div className="activity-details">
                        {log.details}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No recent activity found</p>
                <span>Activity logs will appear here when actions are performed</span>
              </div>
            )}
          </div>

          {/* Professional Recent Registrations Section */}
          <div className="recent-registrations-section">
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">👥</div>
                <h3>Recent Registrations {dateFilter.enabled ? '(Filtered)' : ''}</h3>
              </div>
              <div className="registrations-count">
                {getFilteredRegistrations().length} registrations
              </div>
            </div>
            {getFilteredRegistrations().length > 0 ? (
              <div className="registrations-grid">
                {getFilteredRegistrations().slice(-5).reverse().map(reg => (
                  <div key={reg.id} className="registration-card">
                    <div className="registration-avatar">
                      {(reg.FullName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="registration-info">
                      <div className="registration-name">
                        {reg.FullName || 'Unknown'}
                      </div>
                      <div className="registration-cohort">
                        {reg.Cohort || 'Unknown cohort'}
                      </div>
                      <div className="registration-date">
                        {reg.submittedAt ? new Date(reg.submittedAt.seconds * 1000).toLocaleDateString() : 'Date unknown'}
                      </div>
                    </div>
                    <div className={`registration-status status-${reg.payment_status === 'captured' || reg.payment_status === 'authorized' ? 'completed' : 'pending'}`}>
                      <div className="status-indicator"></div>
                      <span className="status-text">
                        {reg.payment_status === 'captured' || reg.payment_status === 'authorized' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">👤</div>
                <p>No registrations found</p>
                <span>
                  {dateFilter.enabled 
                    ? 'No registrations found for the selected date range' 
                    : 'The Firestore registrations collection appears to be empty'}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsSection;
