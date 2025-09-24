import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import '../styles/AdminDashboard.css';
import { collection, getDocs, deleteDoc, doc, addDoc, query, orderBy, limit, Timestamp } from 'firebase/firestore';

// Import modular components
import LoginPage from './admin/LoginPage';
import DashboardOverview from './admin/DashboardOverview';
import Analytics from './admin/Analytics';
import UserManagement from './admin/UserManagement';
import Tools from './admin/Tools';
import Logs from './admin/Logs';
import DataCleaningPanel from './DataCleaningPanel';

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

  // State Management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  
  // Date filtering state
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    enabled: false
  });

  // Create a log entry in Firestore
  const createLog = async (action, details = '') => {
    try {
      const logEntry = {
        action,
        details,
        timestamp: Timestamp.now(),
        userId: currentUser?.username || 'admin',
        type: 'admin_action'
      };
      
      await addDoc(collection(db, 'logs'), logEntry);
    } catch (error) {
      console.error('Error creating log:', error);
    }
  };

  // Fetch logs from Firestore
  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const logsCollection = collection(db, 'logs');
      const q = query(logsCollection, orderBy('timestamp', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setLogs(logsData);
      
    } catch (error) {
      console.error('Error fetching logs:', error);
      showNotification('Error loading logs from Firestore: ' + error.message, 'error');
    } finally {
      setLogsLoading(false);
    }
  };

  // Fetch registrations from Firestore
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const registrationsCollection = collection(db, 'registrations');
      const snapshot = await getDocs(registrationsCollection);
      const regsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setRegistrations(regsData);
      
      // Calculate analytics from real data
      const analyticsData = {
        kpis: [
          { name: 'Total Registrations', value: regsData.length, change: '+' + Math.round(regsData.length * 0.1) + '%' },
          { name: 'Paid Registrations', value: regsData.filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length, change: '+5%' },
          { name: 'Failed Payments', value: regsData.filter(r => r.payment_status === 'failed').length, change: '+0%' },
          { name: 'Pending Payments', value: regsData.filter(r => (!r.payment_status || r.payment_status === 'pending')).length, change: '-2%' },
          { name: 'Success Rate', value: regsData.length > 0 ? Math.round((regsData.filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length / regsData.length) * 100) + '%' : '0%', change: '+8%' }
        ],
        cohortStats: regsData.reduce((acc, reg) => {
          const cohort = reg.Cohort || 'Unknown';
          acc[cohort] = (acc[cohort] || 0) + 1;
          return acc;
        }, {}),
        recentRegistrations: regsData.slice(-10).reverse()
      };
      setAnalytics(analyticsData);
      
      showNotification(`Loaded ${regsData.length} registrations from Firestore`, 'success');
      await createLog('Data refresh', `Loaded ${regsData.length} registrations from Firestore`);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      showNotification('Error loading data from Firestore: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchRegistrations();
      fetchLogs();
      createLog('Admin login', 'Administrator logged into dashboard');
    }
  }, [isLoggedIn]);

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Remove registration from Firestore
  const removeUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        const userToDelete = registrations.find(reg => reg.id === userId);
        await deleteDoc(doc(db, 'registrations', userId));
        showNotification('Registration deleted successfully', 'success');
        await createLog('Registration deleted', `Deleted registration: ${userToDelete?.FullName || 'Unknown'} (${userToDelete?.Email || 'Unknown'})`);
        fetchRegistrations();
        fetchLogs();
      } catch (error) {
        console.error('Error removing user:', error);
        showNotification('Error deleting registration: ' + error.message, 'error');
      }
    }
  };

  // Date filtering utilities
  const getFilteredRegistrations = () => {
    if (!dateFilter.enabled || (!dateFilter.startDate && !dateFilter.endDate)) {
      return registrations;
    }

    return registrations.filter(reg => {
      if (!reg.submittedAt || !reg.submittedAt.seconds) {
        return !dateFilter.enabled;
      }

      const regDate = new Date(reg.submittedAt.seconds * 1000);
      const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      const endDate = dateFilter.endDate ? new Date(dateFilter.endDate + 'T23:59:59') : null;

      if (startDate && endDate) {
        return regDate >= startDate && regDate <= endDate;
      } else if (startDate) {
        return regDate >= startDate;
      } else if (endDate) {
        return regDate <= endDate;
      }

      return true;
    });
  };

  const resetDateFilter = () => {
    setDateFilter({
      startDate: '',
      endDate: '',
      enabled: false
    });
    showNotification('Date filter cleared', 'success');
  };

  const applyDateFilter = () => {
    if (dateFilter.startDate || dateFilter.endDate) {
      setDateFilter(prev => ({ ...prev, enabled: true }));
      const filteredCount = getFilteredRegistrations().length;
      showNotification(`Date filter applied - showing ${filteredCount} registrations`, 'success');
    } else {
      showNotification('Please select at least one date', 'error');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
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

  // Export Dashboard to PDF
  const exportToPDF = () => {
    try {
      const printWindow = window.open('', '_blank');
      const dataForPDF = getFilteredRegistrations();
      
      const totalRegistrations = dataForPDF.length;
      const paidRegistrations = dataForPDF.filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length;
      const activeCohorts = new Set(dataForPDF.map(r => r.Cohort)).size;
      const pendingPayments = dataForPDF.filter(r => (!r.payment_status || r.payment_status === 'pending')).length;
      const completionRate = totalRegistrations > 0 ? Math.round(paidRegistrations / totalRegistrations * 100) : 0;

      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>TMA Hykon Dashboard Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TMA Hykon Innovation Challenge</h1>
            <h2>Dashboard Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="stats">
            <div class="stat-card">
              <h3>${totalRegistrations}</h3>
              <p>Total Registrations</p>
            </div>
            <div class="stat-card">
              <h3>${paidRegistrations}</h3>
              <p>Paid Registrations</p>
            </div>
            <div class="stat-card">
              <h3>${completionRate}%</h3>
              <p>Completion Rate</p>
            </div>
            <div class="stat-card">
              <h3>${activeCohorts}</h3>
              <p>Active Cohorts</p>
            </div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        showNotification('PDF report generated successfully!', 'success');
        createLog('PDF export', `Exported dashboard report`);
      }, 1000);

    } catch (error) {
      console.error('Error exporting to PDF:', error);
      showNotification('Error exporting to PDF', 'error');
    }
  };

  // Handle login
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  // Check access permissions
  const hasAccess = (requiredRole) => {
    if (!currentUser) return false;
    if (requiredRole === 'admin') {
      return currentUser.role === 'admin';
    }
    return true;
  };

  // Get available tabs based on user role
  const getAvailableTabs = () => {
    const allTabs = [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'tools', label: 'Tools', icon: '🛠️' },
      { id: 'datacleaning', label: 'Data Cleaning', icon: '🧹' }
    ];

    if (currentUser?.role === 'admin') {
      return allTabs;
    } else if (currentUser?.role === 'dashboard') {
      return allTabs.filter(tab => tab.id === 'dashboard');
    }
    return [];
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
      <header className="header">
        <div className="logo">
          <h1>TMA Hykon Admin Dashboard</h1>
        </div>
        <div className="user-info">
          <span>Welcome, {currentUser?.name}</span>
          <span className="user-role">({currentUser?.role})</span>
          <button 
            className="logout-btn" 
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s',
              letterSpacing: '0.025em'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
              e.target.style.transform = 'none';
              e.target.style.boxShadow = 'none';
            }}
            onClick={() => {
              setIsLoggedIn(false);
              setCurrentUser(null);
              setActiveTab('dashboard');
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <ul className="nav-menu">
          {getAvailableTabs().map(tab => (
            <li key={tab.id} className={activeTab === tab.id ? 'active' : ''}>
              <button onClick={() => setActiveTab(tab.id)}>
                <span className="icon">{tab.icon}</span>
                <span className="label">{tab.label}</span>
              </button>
            </li>
          ))}
          
          {/* Admin-only navigation items */}
          {hasAccess('admin') && (
            <>
              <li className={activeTab === 'users' ? 'active' : ''}>
                <button onClick={() => setActiveTab('users')}>
                  <span className="icon">👥</span>
                  <span className="label">User Management</span>
                </button>
              </li>
              <li className={activeTab === 'logs' ? 'active' : ''}>
                <button onClick={() => setActiveTab('logs')}>
                  <span className="icon">📝</span>
                  <span className="label">System Logs</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardOverview 
            currentUser={currentUser}
            registrations={registrations}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            applyDateFilter={applyDateFilter}
            resetDateFilter={resetDateFilter}
            getFilteredRegistrations={getFilteredRegistrations}
            showNotification={showNotification}
          />
        )}
        
        {activeTab === 'analytics' && hasAccess('admin') && (
          <Analytics 
            loading={loading}
            registrations={registrations}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            applyDateFilter={applyDateFilter}
            resetDateFilter={resetDateFilter}
            getFilteredRegistrations={getFilteredRegistrations}
            logs={logs}
            logsLoading={logsLoading}
          />
        )}
        
        {activeTab === 'tools' && hasAccess('admin') && (
          <Tools 
            setActiveTab={setActiveTab}
            exportToCSV={exportToCSV}
            exportToPDF={exportToPDF}
            showNotification={showNotification}
          />
        )}
        
        {activeTab === 'users' && hasAccess('admin') && (
          <UserManagement 
            registrations={registrations}
            loading={loading}
            removeUser={removeUser}
            fetchRegistrations={fetchRegistrations}
            fetchLogs={fetchLogs}
            showNotification={showNotification}
          />
        )}
        
        {activeTab === 'logs' && hasAccess('admin') && (
          <Logs 
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
        {!hasAccess('admin') && activeTab !== 'dashboard' && (
          <div className="access-denied">
            <div className="access-denied-content">
              <div className="access-denied-icon">🚫</div>
              <h2>Access Denied</h2>
              <p>You don't have permission to access this section.</p>
              <p>Contact an administrator if you need access to this feature.</p>
              <button onClick={() => setActiveTab('dashboard')} className="btn-primary">
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
