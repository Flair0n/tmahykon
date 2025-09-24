import React from 'react';

const DashboardOverview = ({ 
  currentUser, 
  loading, 
  registrations, 
  dateFilter, 
  setDateFilter, 
  applyDateFilter, 
  resetDateFilter, 
  getFilteredRegistrations,
  showNotification 
}) => {
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading data from Firestore...
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      
      {/* Date Display */}
      <div className="date-display">
        <div className="current-date">
          <span className="date-icon">📅</span>
          <span className="date-text">Today: {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>
      
      {/* Role-based welcome message */}
      <div className="welcome-message">
        <h3>Welcome, {currentUser?.name}!</h3>
        <p>
          {currentUser?.role === 'admin' 
            ? 'You have full administrative access to all system features.' 
            : 'You have read-only access to dashboard statistics.'}
        </p>
      </div>
      
      {/* Date Filter Section - Only affects leaderboards */}
      <div className="date-filter-section" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>
          📅 Filter Leaderboards by Date Range
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
            📊 Leaderboards showing {getFilteredRegistrations().length} of {registrations.length} registrations
            {dateFilter.startDate && ` from ${dateFilter.startDate}`}
            {dateFilter.endDate && ` to ${dateFilter.endDate}`}
            <br />
            <small style={{ opacity: '0.8' }}>
              💡 Note: Statistics above show all data, only leaderboards are filtered
            </small>
          </div>
        )}
      </div>

      {/* Leaderboards Section - Uses filtered data */}
      <div className="leaderboards-section">
        <h3>Leaderboards {dateFilter.enabled ? '(Filtered by Date)' : ''}</h3>
        <div className="leaderboards-grid">
          
          {/* Cohorts Leaderboard */}
          <div className="leaderboard-card">
            <h4>🏆 Top Cohorts</h4>
            <div className="leaderboard-list">
              {Object.entries(
                getFilteredRegistrations().reduce((acc, reg) => {
                  const cohort = reg.Cohort || 'Unknown';
                  acc[cohort] = (acc[cohort] || 0) + 1;
                  return acc;
                }, {})
              )
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([cohort, count], index) => (
                <div key={cohort} className="leaderboard-item">
                  <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                  <span className="name">{cohort}</span>
                  <span className="score">{count} registrations</span>
                </div>
              ))}
            </div>
          </div>

          {/* TMA Members vs Non-Members */}
          <div className="leaderboard-card">
            <h4>👥 TMA Membership</h4>
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
                  <span className="name">{category}</span>
                  <span className="score">{count} registrations</span>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Leaderboard */}
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
                  <span className="score">{count} registrations</span>
                </div>
              ))}
            </div>
          </div>

          {/* States/Regions Leaderboard */}
          <div className="leaderboard-card">
            <h4>🌍 Top States/Regions</h4>
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
                  <span className="score">{count} registrations</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Year/Level */}
          <div className="leaderboard-card">
            <h4>🎓 Academic Year/Level</h4>
            <div className="leaderboard-list">
              {Object.entries(
                getFilteredRegistrations().reduce((acc, reg) => {
                  const year = reg.AcademicYear || reg.Year || reg.CurrentYear || 'Unknown Year';
                  acc[year] = (acc[year] || 0) + 1;
                  return acc;
                }, {})
              )
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([year, count], index) => (
                <div key={year} className="leaderboard-item">
                  <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                  <span className="name">{year}</span>
                  <span className="score">{count} students</span>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Timeline */}
          <div className="leaderboard-card">
            <h4>📅 Registration Timeline</h4>
            <div className="leaderboard-list">
              {Object.entries(
                getFilteredRegistrations().reduce((acc, reg) => {
                  if (reg.submittedAt && reg.submittedAt.seconds) {
                    const date = new Date(reg.submittedAt.seconds * 1000).toLocaleDateString();
                    acc[date] = (acc[date] || 0) + 1;
                  } else {
                    acc['Unknown Date'] = (acc['Unknown Date'] || 0) + 1;
                  }
                  return acc;
                }, {})
              )
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([date, count], index) => (
                <div key={date} className="leaderboard-item">
                  <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                  <span className="name">{date}</span>
                  <span className="score">{count} registrations</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
