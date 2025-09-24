import React, { useState, useEffect } from 'react';

const UserManagement = ({ 
  registrations, 
  loading, 
  removeUser, 
  fetchRegistrations, 
  fetchLogs, 
  showNotification 
}) => {
  // Search functionality state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);

  // Search functionality
  const handleSearch = (term, filter) => {
    if (!term.trim()) {
      setFilteredRegistrations(registrations);
      return;
    }

    const searchResults = registrations.filter(reg => {
      const searchFields = {
        all: [
          reg.FullName, reg.Email, reg.Phone, reg.Institution, reg.Course, 
          reg.Cohort, reg.Track, reg.ProjectTitle, reg.ProblemStatement,
          reg.TeamMembers, reg.TMAMember, reg.payment_status
        ],
        name: [reg.FullName],
        email: [reg.Email],
        institution: [reg.Institution],
        cohort: [reg.Cohort],
        track: [reg.Track],
        project: [reg.ProjectTitle, reg.ProblemStatement],
        payment: [reg.payment_status, reg.payment_id]
      };

      const fieldsToSearch = searchFields[filter] || searchFields.all;
      return fieldsToSearch.some(field => 
        field?.toString().toLowerCase().includes(term.toLowerCase())
      );
    });

    setFilteredRegistrations(searchResults);
  };

  // Effect to handle search when searchTerm or searchFilter changes
  useEffect(() => {
    handleSearch(searchTerm, searchFilter);
  }, [searchTerm, searchFilter, registrations]);

  // Initialize filtered registrations
  useEffect(() => {
    setFilteredRegistrations(registrations);
  }, [registrations]);

  // Check if any registration has mentor or TMA data to show conditional columns
  const hasMentorData = registrations.some(reg => reg.HasMentor === 'Yes');
  const hasTMAChapterData = registrations.some(reg => reg.TMAMember && reg.TMAMember.startsWith('Yes'));

  if (loading) {
    return (
      <div className="professional-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading registrations from Firestore...</div>
      </div>
    );
  }

  return (
    <div className="section">
      {/* Professional Header */}
      <div className="professional-section-header">
        <div className="header-title-row">
          <div>
            <h2 className="header-title">Registration Management</h2>
            <p className="header-subtitle">
              Complete view of all registration data with {registrations.length} total records. 
              Use horizontal scroll to view all {hasMentorData && hasTMAChapterData ? '31' : hasMentorData ? '29' : hasTMAChapterData ? '27' : '25'} data fields.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn-header-action primary" onClick={fetchRegistrations}>
              🔄 Refresh Data
            </button>
            <button className="btn-header-action" onClick={fetchLogs}>
              📋 Refresh Logs
            </button>
          </div>
        </div>
        
        {/* Enhanced Legend */}
        <div className="enhanced-table-legend">
          <div className="legend-item">
            <div className="legend-icon basic"></div>
            <span>Basic Information</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon project"></div>
            <span>Project Details</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon team"></div>
            <span>Team & Mentorship{hasMentorData ? ' (+Details)' : ''}</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon membership"></div>
            <span>TMA Membership{hasTMAChapterData ? ' (+Chapter)' : ''}</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon payment"></div>
            <span>Payment & System</span>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="table-stats-bar">
        <div className="stats-item">
          <div className="stats-value">
            {searchTerm ? `${filteredRegistrations.length}/${registrations.length}` : registrations.length}
          </div>
          <div className="stats-label">{searchTerm ? 'Filtered/Total' : 'Total Records'}</div>
        </div>
        <div className="stats-item">
          <div className="stats-value">
            {(searchTerm ? filteredRegistrations : registrations).filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length}
          </div>
          <div className="stats-label">Paid</div>
        </div>
        <div className="stats-item">
          <div className="stats-value">
            {(searchTerm ? filteredRegistrations : registrations).filter(r => (!r.payment_status || r.payment_status === 'pending')).length}
          </div>
          <div className="stats-label">Pending</div>
        </div>
        <div className="stats-item">
          <div className="stats-value">
            {(searchTerm ? filteredRegistrations : registrations).length > 0 ? Math.round(((searchTerm ? filteredRegistrations : registrations).filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length / (searchTerm ? filteredRegistrations : registrations).length) * 100) : 0}%
          </div>
          <div className="stats-label">Success Rate</div>
        </div>
        <div className="stats-item">
          <div className="stats-value">{new Set((searchTerm ? filteredRegistrations : registrations).map(r => r.Cohort)).size}</div>
          <div className="stats-label">Cohorts</div>
        </div>
      </div>
      
      {registrations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No Registrations Found</div>
          <div className="empty-subtitle">No registration data available in Firestore database.</div>
        </div>
      ) : (
        <div className="table-container">
          {/* Search Interface */}
          <div className="table-search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search registrations... (name, email, institution, project, etc.)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="search-filters">
              <select 
                className="filter-select"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              >
                <option value="all">All Fields</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="institution">Institution</option>
                <option value="cohort">Cohort</option>
                <option value="track">Track</option>
                <option value="project">Project</option>
                <option value="payment">Payment</option>
              </select>
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="search-results-info">
              Found {filteredRegistrations.length} of {registrations.length} registrations matching "{searchTerm}"
              {searchFilter !== 'all' && ` in ${searchFilter}`}
            </div>
          )}

          <div className="table-wrapper">
            <div style={{background: '#fff3cd', color: '#856404', textAlign: 'center', fontSize: '12px', padding: '8px'}}>
              ← Scroll horizontally to view all {hasMentorData && hasTMAChapterData ? '31' : hasMentorData ? '29' : hasTMAChapterData ? '27' : '25'} data fields →
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  {/* Basic Information Section */}
                  <th className="basic-info">Full Name</th>
                  <th className="basic-info">Email Address</th>
                  <th className="basic-info">Phone</th>
                  <th className="basic-info">Institution</th>
                  <th className="basic-info">Institution Type</th>
                  <th className="basic-info">Course</th>
                  <th className="basic-info">Year</th>
                  <th className="basic-info">City</th>
                  <th className="basic-info">State</th>
                  <th className="basic-info">Cohort</th>
                  <th className="basic-info">Track</th>
                  
                  {/* Project Information Section */}
                  <th className="project-info">Project Title</th>
                  <th className="project-info">Problem Statement</th>
                  <th className="project-info">Context</th>
                  <th className="project-info">Stakeholders</th>
                  <th className="project-info">Solution</th>
                  <th className="project-info">Working Principle</th>
                  <th className="project-info">Novelty</th>
                  <th className="project-info">Impact</th>
                  <th className="project-info">Budget</th>
                  <th className="project-info">Timeline</th>
                  
                  {/* Team & Mentor Section */}
                  <th className="team-info">Team Members</th>
                  <th className="team-info">Has Mentor</th>
                  {hasMentorData && (
                    <>
                      <th className="team-info">Mentor Name</th>
                      <th className="team-info">Mentor Email</th>
                      <th className="team-info">Department</th>
                      <th className="team-info">Mentor Institution</th>
                      <th className="team-info">Mentor Phone</th>
                    </>
                  )}
                  
                  {/* Membership Section */}
                  <th className="membership-info">TMA Member</th>
                  {hasTMAChapterData && (
                    <th className="membership-info">TMA Chapter</th>
                  )}
                  
                  {/* System/Payment Section */}
                  <th className="payment-info">Payment Status</th>
                  <th className="payment-info">Payment ID</th>
                  <th className="payment-info">Order ID</th>
                  <th className="payment-info">Failure Reason</th>
                  <th className="payment-info">Abandoned At</th>
                  <th className="payment-info">Reg. Date</th>
                  <th className="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg, index) => (
                  <tr key={reg.id}>
                    <td title={reg.FullName}>{reg.FullName || 'N/A'}</td>
                    <td title={reg.Email}>{reg.Email || 'N/A'}</td>
                    <td title={reg.Phone}>{reg.Phone || 'N/A'}</td>
                    <td title={reg.Institution}>{reg.Institution || 'N/A'}</td>
                    <td title={reg.InstitutionType}>{reg.InstitutionType || 'N/A'}</td>
                    <td title={reg.Course}>{reg.Course || 'N/A'}</td>
                    <td title={reg.Year}>{reg.Year || 'N/A'}</td>
                    <td title={reg.City}>{reg.City || 'N/A'}</td>
                    <td title={reg.State}>{reg.State || 'N/A'}</td>
                    <td title={reg.Cohort}>{reg.Cohort || 'N/A'}</td>
                    <td title={reg.Track}>{reg.Track || 'N/A'}</td>
                    
                    <td title={reg.ProjectTitle}>{reg.ProjectTitle || 'N/A'}</td>
                    <td title={reg.ProblemStatement}>{reg.ProblemStatement || 'N/A'}</td>
                    <td title={reg.Context}>{reg.Context || 'N/A'}</td>
                    <td title={reg.Stakeholders}>{reg.Stakeholders || 'N/A'}</td>
                    <td title={reg.Solution}>{reg.Solution || 'N/A'}</td>
                    <td title={reg.WorkingPrinciple}>{reg.WorkingPrinciple || 'N/A'}</td>
                    <td title={reg.Novelty}>{reg.Novelty || 'N/A'}</td>
                    <td title={reg.Impact}>{reg.Impact || 'N/A'}</td>
                    <td title={reg.Budget}>{reg.Budget || 'N/A'}</td>
                    <td title={reg.Timeline}>{reg.Timeline || 'N/A'}</td>
                    
                    <td title={reg.TeamMembers}>{reg.TeamMembers || 'N/A'}</td>
                    <td title={reg.HasMentor}>{reg.HasMentor || 'N/A'}</td>
                    {hasMentorData && (
                      <>
                        <td title={reg.MentorName}>{reg.MentorName || 'N/A'}</td>
                        <td title={reg.MentorEmail}>{reg.MentorEmail || 'N/A'}</td>
                        <td title={reg.MentorDepartment}>{reg.MentorDepartment || 'N/A'}</td>
                        <td title={reg.MentorInstitution}>{reg.MentorInstitution || 'N/A'}</td>
                        <td title={reg.MentorPhone}>{reg.MentorPhone || 'N/A'}</td>
                      </>
                    )}
                    
                    <td title={reg.TMAMember}>{reg.TMAMember || 'N/A'}</td>
                    {hasTMAChapterData && (
                      <td title={reg.TMAChapter}>{reg.TMAChapter || 'N/A'}</td>
                    )}
                    
                    <td className="center">
                      <span className={`status-badge ${
                        reg.payment_status === 'captured' || reg.payment_status === 'authorized' 
                          ? 'status-completed' 
                          : reg.payment_status === 'failed' 
                          ? 'status-failed' 
                          : 'status-pending'
                      }`} title={reg.failure_reason ? `Reason: ${reg.failure_reason}` : ''}>
                        {reg.payment_status === 'captured' && '✓ Paid'}
                        {reg.payment_status === 'authorized' && '✓ Auth'}
                        {reg.payment_status === 'failed' && (reg.failure_reason?.toLowerCase().includes('abandon') ? '✗ Abandoned' : '✗ Failed')}
                        {(!reg.payment_status || reg.payment_status === 'pending') && '⏳ Pending'}
                      </span>
                    </td>
                    <td title={reg.payment_id}>{reg.payment_id || 'N/A'}</td>
                    <td title={reg.order_id}>{reg.order_id || 'N/A'}</td>
                    <td title={reg.failure_reason}>{reg.failure_reason || '—'}</td>
                    <td title={reg.abandoned_at ? new Date(reg.abandoned_at.seconds * 1000).toLocaleString() : ''}>
                      {reg.abandoned_at ? new Date(reg.abandoned_at.seconds * 1000).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      {reg.submittedAt ? new Date(reg.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="center">
                      <button 
                        className="btn-table-action btn-delete" 
                        onClick={() => removeUser(reg.id)}
                        title="Delete Registration"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
