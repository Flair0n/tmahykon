import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import '../styles/AdminDashboard.css';
import { collection, getDocs, deleteDoc, doc, addDoc, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import DataCleaningPanel from './DataCleaningPanel';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // User credentials with roles
  const users = {
    'admin': { password: 'admin@tma', role: 'admin', name: 'Administrator' },
    'user': { password: 'user@inker', role: 'dashboard', name: 'Dashboard User' }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (users[username] && users[username].password === password) {
      onLogin({
        username: username,
        role: users[username].role,
        name: users[username].name
      });
    } else {
      setError('Invalid username or password');
    }
  };
//this is a new comment
  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Dashboard</h1>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn-primary login-btn">Login</button>
        </form>
        <div className="login-info">
          <p>Please enter your credentials to access the dashboard.</p>
        </div>
      </div>
    </div>
  );
};

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
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Handle edit button click
  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditForm({ ...user });
    setIsEditing(true);
  };

  // Handle form field change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited user data to Firestore
  const handleEditSave = async () => {
    try {
      const userRef = doc(db, 'registrations', editUserId);
      await import('firebase/firestore').then(({ updateDoc }) => updateDoc(userRef, editForm));
      showNotification('User updated successfully', 'success');
      setIsEditing(false);
      setEditUserId(null);
      setEditForm({});
      fetchRegistrations();
    } catch (error) {
      showNotification('Error updating user: ' + error.message, 'error');
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditUserId(null);
    setEditForm({});
  };
  const [emailContent, setEmailContent] = useState('');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [dbOperation, setDbOperation] = useState('');
  const [systemOperation, setSystemOperation] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  
  // Date filtering state
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    enabled: false
  });

  // Search functionality state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);

  // Create a log entry in Firestore
  const createLog = async (action, details = '') => {
    try {
      const logEntry = {
        action,
        details,
        timestamp: Timestamp.now(),
        userId: 'admin', // You can make this dynamic based on logged-in user
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
      const q = query(logsCollection, orderBy('timestamp', 'desc'), limit(50)); // Get latest 50 logs
      const snapshot = await getDocs(q);
      
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Fetched logs from Firestore:', logsData);
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
      
      console.log('Fetched registrations from Firestore:', regsData);
      console.log('Number of registrations:', regsData.length);
      
      if (regsData.length > 0) {
        console.log('Sample registration data structure:', regsData[0]);
        console.log('All registration data:', regsData);
        console.log('Available fields in first registration:', Object.keys(regsData[0]));
        
        // Check each expected field
        const expectedFields = [
          'Cohort', 'Track', 'FullName', 'Institution', 'InstitutionType', 'Course', 'Year', 'City', 'State', 'Email', 'Phone',
          'ProjectTitle', 'ProblemStatement', 'Context', 'Stakeholders', 'Solution', 
          'WorkingPrinciple', 'Novelty', 'Impact', 'Budget', 'Timeline', 'TeamMembers',
          'HasMentor', 'MentorName', 'MentorEmail', 'MentorDepartment', 'MentorInstitution', 
          'MentorPhone', 'TMAMember', 'TMAChapter', 'payment_status', 'payment_id', 
          'order_id', 'submittedAt', 'failure_reason', 'abandoned_at'
        ];
        
        const missingFields = expectedFields.filter(field => !(field in regsData[0]));
        const extraFields = Object.keys(regsData[0]).filter(field => !expectedFields.includes(field));
        
        console.log('Missing expected fields:', missingFields);
        console.log('Extra fields in data:', extraFields);
      }
      
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
        fetchRegistrations(); // Refresh the list
        fetchLogs(); // Refresh logs
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
        return !dateFilter.enabled; // Include records without dates only if filter is disabled
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
                <h3>� Institution Type Distribution</h3>
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
                <h3>�🎓 Academic Year Distribution</h3>
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

  // User Management Functions (kept for backward compatibility)
  const addUser = () => {
    const newUser = {
      id: users.length + 1,
      name: 'New User',
      email: 'newuser@example.com',
      role: 'Viewer',
      permissions: ['read'],
      status: 'Active'
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsEditing(true);
    showNotification('User added successfully', 'success');
  };

  const editUser = (user) => {
    setCurrentUser(user);
    setIsEditing(true);
  };

  const updateUser = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setCurrentUser(null);
    setIsEditing(false);
    showNotification('User updated successfully', 'success');
  };

  // Debug logging
  console.log('Registrations state:', registrations);
  console.log('Total registrations to display:', registrations.length);
  
  // Check if any registration has mentor or TMA data to show conditional columns
  const hasMentorData = registrations.some(reg => reg.HasMentor === 'Yes');
  const hasTMAChapterData = registrations.some(reg => reg.TMAMember && reg.TMAMember.startsWith('Yes'));

  // Utility Functions
  const sendBulkEmail = () => {
    // Simulate sending emails
    showNotification(`Emails sent to ${emailRecipients}`, 'success');
    setEmailContent('');
    setEmailRecipients('');
  };

  const executeDbOperation = () => {
    // Simulate database operation
    showNotification(`Database operation "${dbOperation}" executed successfully`, 'success');
    setDbOperation('');
  };

  const executeSystemOperation = () => {
    // Simulate system operation
    showNotification(`System operation "${systemOperation}" executed successfully`, 'success');
    setSystemOperation('');
  };

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

  // Render Registration Management Section
  const renderUserManagement = () => (
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
            <button className="btn-header-action" onClick={exportToCSV}>
              📊 Export CSV
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
      
      {loading ? (
        <div className="professional-loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading registrations from Firestore...</div>
        </div>
      ) : registrations.length === 0 ? (
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
                  editUserId === reg.id && isEditing ? (
                    <tr key={reg.id} className="edit-row">
                      {/* Basic Information Section */}
                      <td><input name="FullName" value={editForm.FullName || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Email" value={editForm.Email || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Phone" value={editForm.Phone || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Institution" value={editForm.Institution || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="InstitutionType" value={editForm.InstitutionType || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Course" value={editForm.Course || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Year" value={editForm.Year || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="City" value={editForm.City || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="State" value={editForm.State || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Cohort" value={editForm.Cohort || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Track" value={editForm.Track || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      {/* Project Information Section */}
                      <td><input name="ProjectTitle" value={editForm.ProjectTitle || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="ProblemStatement" value={editForm.ProblemStatement || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Context" value={editForm.Context || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Stakeholders" value={editForm.Stakeholders || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Solution" value={editForm.Solution || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="WorkingPrinciple" value={editForm.WorkingPrinciple || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Novelty" value={editForm.Novelty || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Impact" value={editForm.Impact || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Budget" value={editForm.Budget || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="Timeline" value={editForm.Timeline || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      {/* Team & Mentor Section */}
                      <td><input name="TeamMembers" value={editForm.TeamMembers || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      <td><input name="HasMentor" value={editForm.HasMentor || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      {hasMentorData && (
                        <>
                          <td><input name="MentorName" value={editForm.MentorName || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                          <td><input name="MentorEmail" value={editForm.MentorEmail || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                          <td><input name="MentorDepartment" value={editForm.MentorDepartment || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                          <td><input name="MentorInstitution" value={editForm.MentorInstitution || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                          <td><input name="MentorPhone" value={editForm.MentorPhone || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                        </>
                      )}
                      {/* Membership Section */}
                      <td><input name="TMAMember" value={editForm.TMAMember || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      {hasTMAChapterData && (
                        <td><input name="TMAChapter" value={editForm.TMAChapter || ''} onChange={handleEditFormChange} className="edit-input" /></td>
                      )}
                      {/* System/Payment Section (read-only or hidden in edit) */}
                      <td className="center">{reg.payment_status || ''}</td>
                      <td className="center">{reg.payment_id || ''}</td>
                      <td className="center">{reg.order_id || ''}</td>
                      <td className="center">{reg.failure_reason || ''}</td>
                      <td className="center">{reg.abandoned_at ? new Date(reg.abandoned_at.seconds * 1000).toLocaleDateString() : ''}</td>
                      <td className="center">{reg.submittedAt ? new Date(reg.submittedAt.seconds * 1000).toLocaleDateString() : ''}</td>
                      <td className="center">
                        <button className="btn-table-action btn-save btn-primary" onClick={handleEditSave} title="Save">💾 Save</button>
                        <button className="btn-table-action btn-cancel btn-warning" onClick={handleEditCancel} title="Cancel">✖ Cancel</button>
                      </td>
                    </tr>
                  ) : (
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
                          className="btn-table-action btn-edit" 
                          onClick={() => handleEditClick(reg)}
                          title="Edit Registration"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn-table-action btn-delete" 
                          onClick={() => removeUser(reg.id)}
                          title="Delete Registration"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // Render Dashboard Overview
  const renderDashboard = () => (
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
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading data from Firestore...
        </div>
      ) : (
        <>
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
          {/* Quick Actions section removed - moved to Tools */}
        </>
      )}
    </div>
  );

  // Render Analytics Section
  const renderAnalytics = () => (
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
                    <span className="cohort-count">{count} registrations</span>
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
                      <span className="name">{category}</span>
                      <span className="score">{count} registrations</span>
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
                      <span className="score">{count} registrations</span>
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
                      <span className="score">{count} registrations</span>
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
            {logsLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <span>Loading recent activities...</span>
              </div>
            ) : logs.length > 0 ? (
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

  // Render Logs Section
  const renderLogs = () => {
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
              Real-time system activity and user actions from Firestore database
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
              <div className="loading-text">Loading activity logs from Firestore...</div>
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

  // Render Tools Section
  const renderTools = () => (
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
            <button className="btn-accent" onClick={exportToCSV}>
              📊 Export CSV
            </button>
            <button className="btn-accent pdf-export" onClick={exportToPDF}>
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
              �️ Export JSON
            </button>
          </div>
        </div>
        
        {/* Data Management */}
        <div className="tool-card">
          <div className="tool-header">
            <h3>�🔄 Data Management</h3>
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
                const sizeInKB = (totalSize / 1024).toFixed(2);
                showNotification(`Current data size: ${sizeInKB} KB`, 'info');
              }}
            >
              📏 Data Size
            </button>
          </div>
        </div>

        {/* User Management */}
        <div className="tool-card">
          <div className="tool-header">
            <h3>👤 User Management</h3>
            <p>Current session and user information</p>
          </div>
          <div className="system-info">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Current User:</span>
                <strong className="info-value">{currentUser?.name || 'Unknown'}</strong>
              </div>
              <div className="info-item">
                <span className="info-label">Role:</span>
                <strong className="info-value">{currentUser?.role || 'Unknown'}</strong>
              </div>
              <div className="info-item">
                <span className="info-label">Login Time:</span>
                <strong className="info-value">{new Date().toLocaleTimeString()}</strong>
              </div>
            </div>
            <div className="tool-actions" style={{ marginTop: '16px' }}>
              <button 
                className="btn-warning"
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                    showNotification('Logged out successfully', 'success');
                  }
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'tools', label: 'Tools', icon: '🛠️' },
{ id: 'datacleaning', label: 'Data Cleaning', icon: '🧹' }
    ];

    if (currentUser?.role === 'admin') {
      return allTabs; // Admin gets all tabs
    } else if (currentUser?.role === 'dashboard') {
      return allTabs.filter(tab => tab.id === 'dashboard'); // Dashboard user only gets dashboard
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
          <h1>Dashboard</h1>
        </div>
        <div className="user-info">
          <span className="user-role">{currentUser?.role === 'admin' ? '👑 Admin' : '👤 Dashboard User'}</span>
          <span className="user-name">{currentUser?.name || 'User'}</span>
          <span className="user-avatar">{currentUser?.role === 'admin' ? '🔐' : '�️'}</span>
          <button className="logout-btn" onClick={() => {
            setIsLoggedIn(false);
            setCurrentUser(null);
            setActiveTab('dashboard');
          }}>Logout</button>
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
          
          {/* Admin-only sections */}
          {hasAccess('admin') && (
            <>
              <li className={activeTab === 'users' ? 'active' : ''}>
                <button onClick={() => setActiveTab('users')}>
                  <span className="icon">�</span>
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
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'analytics' && hasAccess('admin') && renderAnalytics()}
        {activeTab === 'tools' && hasAccess('admin') && renderTools()}
        {activeTab === 'users' && hasAccess('admin') && renderUserManagement()}
        {activeTab === 'logs' && hasAccess('admin') && renderLogs()}
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
      
      {/* Footer */}
      <footer className="footer">
        
      </footer>
    </div>
  );
};

export default AdminDashboard;