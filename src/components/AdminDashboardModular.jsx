import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import '../styles/AdminDashboard.css';
import DataCleaningPanel from './DataCleaningPanel';

// Import modular components
import LoginPage from './admin/LoginPage';
import DashboardOverview from './admin/DashboardOverview';
import AnalyticsSection from './admin/AnalyticsSection';
import UserManagement from './admin/UserManagement';
import LogsSection from './admin/LogsSection';
import ToolsSection from './admin/ToolsSection';

// Import custom hook
import { useAdminData } from '../hooks/useAdminData';

// Import utilities
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

// Main Admin Dashboard Component
const AdminDashboard = () => {
  // Mandatory Firebase Connection Check
  if (!db) {
    return (
      <div className="firebase-error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h1 className="error-title">Firebase Connection Required</h1>
          <p className="error-message">
            The Dashboard requires a Firebase connection to function. Please ensure Firebase is properly configured.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary retry-btn"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Use the custom hook for data management
  const {
    // State
    registrations,
    loading,
    analytics,
    logs,
    logsLoading,
    notification,
    dateFilter,
    searchTerm,
    searchFilter,
    filteredRegistrations,
    isEditing,
    editUserId,
    editForm,
    
    // Setters
    setDateFilter,
    setSearchTerm,
    setSearchFilter,
    
    // Functions
    fetchRegistrations,
    fetchLogs,
    createLog,
    showNotification,
    removeUser,
    getFilteredRegistrations,
    resetDateFilter,
    applyDateFilter,
    handleEditClick,
    handleEditFormChange,
    handleEditSave,
    handleEditCancel
  } = useAdminData();

  // Local state for UI
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchRegistrations();
      fetchLogs();
      createLog('Admin login', 'Administrator logged into dashboard');
    }
  }, [isLoggedIn]);

  // Handle login
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    showNotification(`Welcome ${userData.name}!`, 'success');
  };

  // Role-based access control
  const hasAccess = (requiredRole) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true; // Admin has access to everything
    return currentUser.role === requiredRole;
  };

  // Get available tabs based on user role
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'tools', label: 'Tools', icon: '🛠️' },
      { id: 'datacleaning', label: 'Data Cleaning', icon: '🧹' }
    ];

    if (currentUser?.role === 'admin') {
      return allTabs; // Admin gets all tabs
    } else if (currentUser?.role === 'dashboard') {
      return allTabs.filter(tab => tab.id === 'overview'); // Dashboard user only gets dashboard
    }
    return [];
  };

  // Export functions with proper context
  const handleExportCSV = () => {
    exportToCSV(registrations, getFilteredRegistrations, dateFilter, showNotification, createLog);
  };

  const handleExportPDF = () => {
    exportToPDF(getFilteredRegistrations, showNotification, createLog);
  };

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="admin-dashboard">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      {/* Header */}
      <header className="dashboard-header">
        <h1>TMA Hykon Dashboard</h1>
        <div className="user-info">
          <span className="user-role">{currentUser?.role === 'admin' ? '👑 Admin' : '👤 Dashboard User'}</span>
          <span className="user-name">{currentUser?.name || 'User'}</span>
          <button className="logout-btn" onClick={() => {
            setIsLoggedIn(false);
            setCurrentUser(null);
            setActiveTab('overview');
            showNotification('Logged out successfully', 'info');
          }}>Logout</button>
        </div>
      </header>
      
      {/* Navigation Sidebar - Always visible */}
      <nav className="nav-tabs nav-tabs-always-visible">
        {getAvailableTabs().map(tab => (
          <button 
            key={tab.id} 
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        
        {/* Admin-only sections */}
        {hasAccess('admin') && (
          <>
            <button 
              className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="tab-icon">👥</span>
              User Management
            </button>
            <button 
              className={`nav-tab ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <span className="tab-icon">📝</span>
              System Logs
            </button>
          </>
        )}
      </nav>
      
      {/* Main Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <DashboardOverview
            currentUser={currentUser}
            loading={loading}
            registrations={registrations}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            getFilteredRegistrations={getFilteredRegistrations}
            applyDateFilter={applyDateFilter}
            resetDateFilter={resetDateFilter}
          />
        )}
        
        {activeTab === 'analytics' && hasAccess('admin') && (
          <AnalyticsSection
            loading={loading}
            registrations={registrations}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            getFilteredRegistrations={getFilteredRegistrations}
            applyDateFilter={applyDateFilter}
            resetDateFilter={resetDateFilter}
            logs={logs}
          />
        )}
        
        {activeTab === 'tools' && hasAccess('admin') && (
          <ToolsSection
            registrations={registrations}
            logs={logs}
            setActiveTab={setActiveTab}
            fetchRegistrations={fetchRegistrations}
            fetchLogs={fetchLogs}
            setRegistrations={() => {}} // This would need to be implemented in the hook
            setLogs={() => {}} // This would need to be implemented in the hook
            showNotification={showNotification}
            createLog={createLog}
            getFilteredRegistrations={getFilteredRegistrations}
            dateFilter={dateFilter}
          />
        )}
        
        {activeTab === 'users' && hasAccess('admin') && (
          <UserManagement
            registrations={registrations}
            filteredRegistrations={filteredRegistrations}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            fetchRegistrations={fetchRegistrations}
            fetchLogs={fetchLogs}
            exportToCSV={handleExportCSV}
            isEditing={isEditing}
            editUserId={editUserId}
            editForm={editForm}
            handleEditClick={handleEditClick}
            handleEditFormChange={handleEditFormChange}
            handleEditSave={handleEditSave}
            handleEditCancel={handleEditCancel}
            removeUser={removeUser}
          />
        )}
        
        {activeTab === 'logs' && hasAccess('admin') && (
          <LogsSection
            logs={logs}
            logsLoading={logsLoading}
            fetchLogs={fetchLogs}
          />
        )}
        
        {activeTab === 'datacleaning' && hasAccess('admin') && (
          <DataCleaningPanel 
            registrations={registrations} 
            onNotification={showNotification} 
          />
        )}
        
        {/* Access Denied Message */}
        {!hasAccess('admin') && activeTab !== 'overview' && (
          <div className="access-denied">
            <div className="access-denied-content">
              <div className="access-denied-icon">🚫</div>
              <h2>Access Denied</h2>
              <p>You don't have permission to access this section.</p>
              <p>Contact an administrator if you need access to this feature.</p>
              <button onClick={() => setActiveTab('overview')} className="btn-primary">
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
