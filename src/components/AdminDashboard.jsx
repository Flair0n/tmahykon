import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, addDoc, query, orderBy, limit, Timestamp } from 'firebase/firestore';

// Login Component
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // User credentials with roles
  const users = {
    'admin': { password: 'tma@2025', role: 'admin', name: 'Administrator' },
    'dashboard': { password: 'dashboard@2025', role: 'dashboard', name: 'Dashboard User' }
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

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Admin Dashboard</h1>
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
          <p>Use one of the following credentials:</p>
          <div className="user-credentials">
            <div className="credential-item">
              <h4>Admin User (Full Access)</h4>
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> tma@2025</p>
            </div>
            <div className="credential-item">
              <h4>Dashboard User (View Only)</h4>
              <p><strong>Username:</strong> dashboard</p>
              <p><strong>Password:</strong> dashboard@2025</p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f5f7fa;
        }
        
        .login-form {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
        
        .login-form h1 {
          color: #3f51b5;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        
        .login-form h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #333;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .login-btn {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .login-info {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
          font-size: 0.9rem;
          color: #666;
        }

        .user-credentials {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        .credential-item {
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 6px;
          border-left: 4px solid #3f51b5;
        }

        .credential-item h4 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 0.9rem;
        }

        .credential-item p {
          margin: 0.25rem 0;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  // Mandatory Firebase Connection Check
  if (!db) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', color: '#ff4444', marginBottom: '20px' }}>⚠️</div>
          <h1 style={{ color: '#333', marginBottom: '16px' }}>Firebase Connection Required</h1>
          <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
            The Admin Dashboard requires a Firebase connection to function. Please ensure Firebase is properly configured.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#3f51b5',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
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

  // Add custom scrollbar styles for better horizontal scrolling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .table-container::-webkit-scrollbar {
        height: 12px;
      }
      .table-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 6px;
      }
      .table-container::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 6px;
      }
      .table-container::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
          'Cohort', 'Track', 'FullName', 'Institution', 'Course', 'Year', 'Email', 'Phone',
          'ProjectTitle', 'ProblemStatement', 'Context', 'Stakeholders', 'Solution', 
          'WorkingPrinciple', 'Novelty', 'Impact', 'Budget', 'Timeline', 'TeamMembers',
          'HasMentor', 'MentorName', 'MentorEmail', 'MentorDepartment', 'MentorInstitution', 
          'MentorPhone', 'TMAMember', 'TMAChapter', 'payment_status', 'payment_id', 
          'order_id', 'submittedAt'
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
          { name: 'Pending Payments', value: regsData.filter(r => !r.payment_status || r.payment_status === 'pending').length, change: '-2%' },
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

    const headers = ['Full Name', 'Email', 'Phone', 'Institution', 'Course', 'Year', 'Cohort', 'Track', 'Project Title', 'Problem Statement', 'Context', 'Stakeholders', 'Solution', 'Working Principle', 'Novelty', 'Impact', 'Budget', 'Timeline', 'Team Members', 'Has Mentor', 'Mentor Name', 'Mentor Email', 'Mentor Department', 'Mentor Institution', 'Mentor Phone', 'TMA Member', 'TMA Chapter', 'Payment Status', 'Payment ID', 'Order ID', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(reg => [
        reg.FullName || '',
        reg.Email || '',
        reg.Phone || '',
        reg.Institution || '',
        reg.Course || '',
        reg.Year || '',
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
      const pendingPayments = dataForPDF.filter(r => !r.payment_status || r.payment_status === 'pending').length;
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
        const isTMAMember = reg.TMAMember === 'Yes' || reg.TMAMember === true;
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
          const state = reg.State || reg.Region || 'Unknown State';
          acc[state] = (acc[state] || 0) + 1;
          return acc;
        }, {})
      ).sort(([,a], [,b]) => b - a);

      const revenueByCohort = Object.entries(
        dataForPDF.reduce((acc, reg) => {
          const cohort = reg.Cohort || 'Unknown';
          const amount = parseFloat(reg.payment_amount || reg.amount || 0);
          if (!acc[cohort]) acc[cohort] = { count: 0, revenue: 0 };
          acc[cohort].count += 1;
          acc[cohort].revenue += amount;
          return acc;
        }, {})
      ).sort(([,a], [,b]) => b.revenue - a.revenue);

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
                <h3>💵 Revenue Analysis by Cohort</h3>
                <div class="leaderboard-content">
                  ${revenueByCohort.map(([cohort, data], index) => 
                    `<div class="leaderboard-item">
                      <div class="item-info">
                        <span class="rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">${index + 1}.</span>
                        <span class="item-name">${cohort}</span>
                      </div>
                      <span class="item-value">₹${data.revenue.toLocaleString()} (${data.count} reg.)</span>
                    </div>`
                  ).join('')}
                </div>
              </div>

              <div class="leaderboard">
                <h3>🎓 Academic Year Distribution</h3>
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
              <p>Generated from Admin Dashboard | © ${new Date().getFullYear()} TMA Hykon - All rights reserved</p>
              <p>For questions about this report, contact the admin team</p>
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

  // Render Registration Management Section
  const renderUserManagement = () => (
    <div className="section">
      <div className="section-header">
        <h2>Registration Management - Complete View</h2>
        <p style={{fontSize: '14px', color: '#666', margin: '5px 0'}}>
          Showing all registration form fields. Scroll horizontally to view all columns. Table width: ~5000px
        </p>
        <div style={{display: 'flex', gap: '10px', margin: '10px 0', fontSize: '12px'}}>
          <span style={{backgroundColor: '#e3f2fd', padding: '4px 8px', borderRadius: '4px'}}>🔵 Basic Info</span>
          <span style={{backgroundColor: '#fff3e0', padding: '4px 8px', borderRadius: '4px'}}>🟡 Project Details</span>
          <span style={{backgroundColor: '#e8f5e8', padding: '4px 8px', borderRadius: '4px'}}>🟢 Team & Mentor {hasMentorData ? '(+Details)' : ''}</span>
          <span style={{backgroundColor: '#fce4ec', padding: '4px 8px', borderRadius: '4px'}}>🔴 Membership {hasTMAChapterData ? '(+Chapter)' : ''}</span>
          <span style={{backgroundColor: '#f3e5f5', padding: '4px 8px', borderRadius: '4px'}}>🟣 Payment/System</span>
        </div>
        <div className="actions">
          <button className="btn-primary" onClick={fetchRegistrations}>Refresh Data</button>
          <button className="btn-secondary" onClick={fetchLogs}>Refresh Logs</button>
          <button className="btn-accent" onClick={exportToCSV}>Export CSV</button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading registrations from Firestore...
        </div>
      ) : (
        <div className="table-container" style={{
          overflowX: 'auto', 
          maxWidth: '100%',
          width: '100%',
          border: '1px solid #ddd',
          borderRadius: '8px',
          // Enhanced scrollbar styling
          scrollbarWidth: 'auto',
          scrollbarColor: '#888 #f1f1f1'
        }}>
          <div className="data-table-flex" style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '5000px', // Increased from 3500px to accommodate all columns
            width: 'max-content',
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'visible'
          }}>
            {/* Scroll indicator */}
            <div style={{
              position: 'sticky',
              top: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: '#fff3cd',
              padding: '5px 10px',
              fontSize: '12px',
              color: '#856404',
              borderBottom: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              ← Scroll horizontally to see all {hasMentorData && hasTMAChapterData ? '31' : hasMentorData ? '29' : hasTMAChapterData ? '27' : '25'} columns →
            </div>
            {/* Header Row with Grouped Sections */}
            <div className="table-header-flex" style={{
              display: 'flex',
              backgroundColor: '#f8f9fa',
              fontWeight: 'bold',
              borderBottom: '2px solid #ddd',
              minHeight: '50px',
              alignItems: 'center'
            }}>
              {/* Basic Information Section */}
              <div style={{flex: '0 0 150px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd'}}>Full Name</div>
              <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd'}}>Email</div>
              <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd'}}>Phone</div>
              <div style={{flex: '0 0 180px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd'}}>Institution</div>
              <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd'}}>Course</div>
              <div style={{flex: '0 0 80px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd'}}>Year</div>
              <div style={{flex: '0 0 100px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd'}}>Cohort</div>
              <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e3f2fd'}}>Track</div>
              
              {/* Project Information Section */}
              <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fff3e0'}}>Project Title</div>
              <div style={{flex: '0 0 250px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fff3e0'}}>Problem Statement</div>
              <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fff3e0'}}>Context</div>
              <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fff3e0'}}>Stakeholders</div>
              <div style={{flex: '0 0 250px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fff3e0'}}>Solution</div>
              <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fff3e0'}}>Working Principle</div>
              <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fff3e0'}}>Novelty</div>
              <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fff3e0'}}>Impact</div>
              <div style={{flex: '0 0 100px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fff3e0'}}>Budget</div>
              <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fff3e0'}}>Timeline</div>
              
              {/* Team & Mentor Section */}
              <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e8f5e8'}}>Team Members</div>
              <div style={{flex: '0 0 100px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e8f5e8'}}>Has Mentor</div>
              {hasMentorData && (
                <>
                  <div style={{flex: '0 0 150px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e8f5e8'}}>Mentor Name</div>
                  <div style={{flex: '0 0 180px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e8f5e8'}}>Mentor Email</div>
                  <div style={{flex: '0 0 150px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e8f5e8'}}>Mentor Department</div>
                  <div style={{flex: '0 0 180px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e8f5e8'}}>Mentor Institution</div>
                  <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#e8f5e8'}}>Mentor Phone</div>
                </>
              )}
              
              {/* Membership Section */}
              <div style={{flex: '0 0 100px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fce4ec'}}>TMA Member</div>
              {hasTMAChapterData && (
                <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#fce4ec'}}>TMA Chapter</div>
              )}
              
              {/* System/Payment Section */}
              <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#f3e5f5'}}>Payment Status</div>
              <div style={{flex: '0 0 150px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#f3e5f5'}}>Payment ID</div>
              <div style={{flex: '0 0 150px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#f3e5f5'}}>Order ID</div>
              <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #ddd', backgroundColor: '#f3e5f5'}}>Registration Date</div>
              <div style={{flex: '0 0 100px', padding: '10px', backgroundColor: '#ffebee'}}>Actions</div>
            </div>

            {/* Data Rows */}
            <div className="table-body-flex">
              {registrations.length > 0 ? registrations.map((reg, index) => (
                <div key={reg.id} className="table-row-flex" style={{
                  display: 'flex',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                  borderBottom: '1px solid #eee',
                  minHeight: '60px',
                  alignItems: 'center',
                  transition: 'background-color 0.3s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e3f2fd'}
                onMouseLeave={(e) => e.target.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f8f9fa'}
                >
                  <div style={{flex: '0 0 150px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.FullName}>
                    {reg.FullName || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Email}>
                    {reg.Email || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Phone}>
                    {reg.Phone || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 180px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Institution}>
                    {reg.Institution || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Course}>
                    {reg.Course || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 80px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Year}>
                    {reg.Year || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 100px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Cohort}>
                    {reg.Cohort || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Track}>
                    {reg.Track || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.ProjectTitle}>
                    {reg.ProjectTitle || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 250px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.ProblemStatement}>
                    {reg.ProblemStatement || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Context}>
                    {reg.Context || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Stakeholders}>
                    {reg.Stakeholders || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 250px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Solution}>
                    {reg.Solution || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.WorkingPrinciple}>
                    {reg.WorkingPrinciple || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Novelty}>
                    {reg.Novelty || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Impact}>
                    {reg.Impact || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 100px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Budget}>
                    {reg.Budget || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.Timeline}>
                    {reg.Timeline || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.TeamMembers}>
                    {reg.TeamMembers || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 100px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.HasMentor}>
                    {reg.HasMentor || 'N/A'}
                  </div>
                  {hasMentorData && (
                    <>
                      <div style={{flex: '0 0 150px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.MentorName}>
                        {reg.MentorName || 'N/A'}
                      </div>
                      <div style={{flex: '0 0 180px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.MentorEmail}>
                        {reg.MentorEmail || 'N/A'}
                      </div>
                      <div style={{flex: '0 0 150px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.MentorDepartment}>
                        {reg.MentorDepartment || 'N/A'}
                      </div>
                      <div style={{flex: '0 0 180px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.MentorInstitution}>
                        {reg.MentorInstitution || 'N/A'}
                      </div>
                      <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.MentorPhone}>
                        {reg.MentorPhone || 'N/A'}
                      </div>
                    </>
                  )}
                  <div style={{flex: '0 0 100px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.TMAMember}>
                    {reg.TMAMember || 'N/A'}
                  </div>
                  {hasTMAChapterData && (
                    <div style={{flex: '0 0 200px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.TMAChapter}>
                      {reg.TMAChapter || 'N/A'}
                    </div>
                  )}
                  <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #eee', display: 'flex', alignItems: 'center'}}>
                    <span className={`status ${reg.payment_status === 'captured' || reg.payment_status === 'authorized' ? 'completed' : 'pending'}`} style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: reg.payment_status === 'captured' || reg.payment_status === 'authorized' ? '#d4edda' : '#fff3cd',
                      color: reg.payment_status === 'captured' || reg.payment_status === 'authorized' ? '#155724' : '#856404'
                    }}>
                      {reg.payment_status || 'Pending'}
                    </span>
                  </div>
                  <div style={{flex: '0 0 150px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.payment_id}>
                    {reg.payment_id || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 150px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={reg.order_id}>
                    {reg.order_id || 'N/A'}
                  </div>
                  <div style={{flex: '0 0 120px', padding: '10px', borderRight: '1px solid #eee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {reg.submittedAt ? new Date(reg.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </div>
                  <div style={{flex: '0 0 100px', padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <button 
                      className="btn-danger btn-sm" 
                      onClick={() => removeUser(reg.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )) : (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '40px',
                  fontSize: '16px',
                  color: '#666',
                  backgroundColor: '#f8f9fa'
                }}>
                  No registrations found in Firestore.
                </div>
              )}
            </div>
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
                      const isTMAMember = reg.TMAMember === 'Yes' || reg.TMAMember === true;
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

              {/* Revenue by Cohort */}
              <div className="leaderboard-card">
                <h4>💵 Revenue by Cohort</h4>
                <div className="leaderboard-list">
                  {Object.entries(
                    getFilteredRegistrations().reduce((acc, reg) => {
                      const cohort = reg.Cohort || 'Unknown';
                      const amount = parseFloat(reg.payment_amount || reg.amount || 0);
                      if (!acc[cohort]) acc[cohort] = { count: 0, revenue: 0 };
                      acc[cohort].count += 1;
                      acc[cohort].revenue += amount;
                      return acc;
                    }, {})
                  )
                  .sort(([,a], [,b]) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map(([cohort, data], index) => (
                    <div key={cohort} className="leaderboard-item">
                      <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                      <span className="name">{cohort}</span>
                      <span className="score">₹{data.revenue.toLocaleString()}</span>
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
      <h2>Analytics & Reports</h2>
      
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
          {/* Real-time Analytics KPIs based on filtered data */}
          <div className="kpi-cards">
            <div className="kpi-card">
              <h3>Total Registrations</h3>
              <div className="kpi-value">{getFilteredRegistrations().length}</div>
              <div className="kpi-change positive">
                {dateFilter.enabled ? 'Filtered Data' : 'All Data'}
              </div>
            </div>
            <div className="kpi-card">
              <h3>Completion Rate</h3>
              <div className="kpi-value">
                {getFilteredRegistrations().length > 0 
                  ? Math.round(getFilteredRegistrations().filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length / getFilteredRegistrations().length * 100)
                  : 0}%
              </div>
              <div className="kpi-change">
                {getFilteredRegistrations().filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length} paid
              </div>
            </div>
            <div className="kpi-card">
              <h3>Total Revenue</h3>
              <div className="kpi-value">
                ₹{getFilteredRegistrations().reduce((sum, reg) => sum + parseFloat(reg.payment_amount || reg.amount || 0), 0).toLocaleString()}
              </div>
              <div className="kpi-change positive">
                Revenue Generated
              </div>
            </div>
            <div className="kpi-card">
              <h3>Active Cohorts</h3>
              <div className="kpi-value">{new Set(getFilteredRegistrations().map(r => r.Cohort)).size}</div>
              <div className="kpi-change">
                Different Programs
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
                      const isTMAMember = reg.TMAMember === 'Yes' || reg.TMAMember === true;
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

              {/* Revenue Analysis */}
              <div className="leaderboard-card">
                <h4>💵 Revenue by Cohort</h4>
                <div className="leaderboard-list">
                  {Object.entries(
                    getFilteredRegistrations().reduce((acc, reg) => {
                      const cohort = reg.Cohort || 'Unknown';
                      const amount = parseFloat(reg.payment_amount || reg.amount || 0);
                      if (!acc[cohort]) acc[cohort] = { count: 0, revenue: 0 };
                      acc[cohort].count += 1;
                      acc[cohort].revenue += amount;
                      return acc;
                    }, {})
                  )
                  .sort(([,a], [,b]) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map(([cohort, data], index) => (
                    <div key={cohort} className="leaderboard-item">
                      <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                      <span className="name">{cohort}</span>
                      <span className="score">₹{data.revenue.toLocaleString()}</span>
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

          {/* Recent Activity Section */}
          <div className="recent-activity" style={{ marginTop: '30px' }}>
            <h3>Recent Activity</h3>
            {logsLoading ? (
              <div className="loading">
                <div className="spinner"></div>
                Loading recent activities...
              </div>
            ) : logs.length > 0 ? (
              <ul className="activity-list">
                {logs.slice(0, 5).map(log => (
                  <li key={log.id} className="activity-item">
                    <span className="activity-time">
                      {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Unknown time'}
                    </span>
                    <span className="activity-text">
                      <strong>{log.action}</strong>: {log.details}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent activity found. Activity logs will appear here when actions are performed.</p>
            )}
          </div>

          {/* Recent Registrations Section */}
          <div className="recent-activity" style={{ marginTop: '30px' }}>
            <h3>Recent Registrations {dateFilter.enabled ? '(Filtered)' : ''}</h3>
            {getFilteredRegistrations().length > 0 ? (
              <div className="activity-list">
                {getFilteredRegistrations().slice(-5).reverse().map(reg => (
                  <div key={reg.id} className="activity-item">
                    <div className="activity-info">
                      <strong>{reg.FullName || 'Unknown'}</strong> registered for <strong>{reg.Cohort || 'Unknown cohort'}</strong>
                      <span className="activity-time">
                        {reg.submittedAt ? new Date(reg.submittedAt.seconds * 1000).toLocaleDateString() : 'Date unknown'}
                      </span>
                    </div>
                    <span className={`status ${reg.payment_status === 'captured' || reg.payment_status === 'authorized' ? 'completed' : 'pending'}`}>
                      {reg.payment_status || 'pending'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>{dateFilter.enabled ? 'No registrations found for the selected date range.' : 'No registrations found. The Firestore \'registrations\' collection appears to be empty.'}</p>
            )}
          </div>
        </>
      )}
    </div>
  );

  // Render Logs Section
  const renderLogs = () => (
    <div className="section">
      <h2>Activity Logs</h2>
      <div className="section-header">
        <p style={{fontSize: '14px', color: '#666', margin: '5px 0'}}>
          Real-time activity logs from Firestore database
        </p>
        <div className="actions">
          <button className="btn-primary" onClick={fetchLogs}>Refresh Logs</button>
        </div>
      </div>
      
      {logsLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading logs from Firestore...
        </div>
      ) : (
        <div className="log-container">
          {logs.length > 0 ? logs.map(log => (
            <div key={log.id} className="log-entry">
              <span className="log-time">
                {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Unknown time'}
              </span>
              <span className="log-action">
                <strong>{log.action}</strong>
                {log.details && `: ${log.details}`}
              </span>
              <span className="log-user" style={{
                fontSize: '12px', 
                color: '#666', 
                fontStyle: 'italic',
                marginLeft: '10px'
              }}>
                by {log.userId || 'system'}
              </span>
            </div>
          )) : (
            <div className="log-entry">
              <span className="log-action">No logs found. Activity will appear here as you use the dashboard.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

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
      { id: 'tools', label: 'Tools', icon: '🛠️' }
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
          <h1>HAdmin</h1>
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
        <p>&copy; 2023 HAdmin Dashboard. All rights reserved.</p>
      </footer>
      
      {/* CSS Styles */}
      <style jsx>{`
        /* Reset and Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
          background-color: #f5f7fa;
          color: #333;
          line-height: 1.6;
        }
        
        /* Layout */
        .admin-dashboard {
          display: grid;
          grid-template-areas:
            "header header"
            "sidebar main"
            "footer footer";
          grid-template-columns: 240px 1fr;
          grid-template-rows: auto 1fr auto;
          min-height: 100vh;
        }
        
        /* Header */
        .header {
          grid-area: header;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 10;
        }
        
        .logo h1 {
          color: #3f51b5;
          font-size: 1.8rem;
          font-weight: 700;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-role {
          background-color: #3f51b5;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .user-name {
          font-weight: 500;
          color: #333;
        }
        
        .user-avatar {
          font-size: 1.5rem;
        }
        
        .logout-btn {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          margin-left: 1rem;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }
        
        .logout-btn:hover {
          background-color: #e0e0e0;
        }
        
        /* Sidebar */
        .sidebar {
          grid-area: sidebar;
          background-color: #3f51b5;
          color: #fff;
          padding: 1rem 0;
          height: 100%;
        }
        
        .nav-menu {
          list-style: none;
        }
        
        .nav-menu li {
          margin-bottom: 0.5rem;
        }
        
        .nav-menu li button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          color: #fff;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .nav-menu li button:hover {
          background-color: rgba(255,255,255,0.1);
        }
        
        .nav-menu li.active button {
          background-color: rgba(255,255,255,0.2);
          font-weight: 600;
        }
        
        .icon {
          margin-right: 0.75rem;
          font-size: 1.2rem;
        }
        
        /* Main Content */
        .main-content {
          grid-area: main;
          padding: 2rem;
          overflow-y: auto;
        }

        /* Access Denied */
        .access-denied {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60vh;
          text-align: center;
        }

        .access-denied-content {
          max-width: 400px;
        }

        .access-denied-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .access-denied h2 {
          color: #333;
          margin-bottom: 1rem;
        }

        .access-denied p {
          color: #666;
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }
        
        /* Footer */
        .footer {
          grid-area: footer;
          text-align: center;
          padding: 1rem;
          background-color: #fff;
          border-top: 1px solid #eee;
        }
        
        /* Section Styles */
        .section {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .actions {
          display: flex;
          gap: 1rem;
        }
        
        /* Form Styles */
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        input, select, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .checkbox-group {
          display: flex;
          gap: 1rem;
        }
        
        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: normal;
        }
        
        .checkbox-group input[type="checkbox"] {
          width: auto;
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        /* Button Styles */
        .btn-primary {
          background-color: #3f51b5;
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s;
        }
        
        .btn-primary:hover {
          background-color: #303f9f;
        }
        
        .btn-primary:disabled {
          background-color: #9fa8da;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s;
        }
        
        .btn-secondary:hover {
          background-color: #e0e0e0;
        }
        
        .btn-icon {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.25rem;
        }
        
        .btn-action {
          background-color: #f5f7fa;
          border: 1px solid #ddd;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .btn-action:hover {
          background-color: #3f51b5;
          color: #fff;
          border-color: #3f51b5;
        }

        .btn-action.pdf-export {
          background: linear-gradient(135deg, #dc3545, #c82333);
          color: white;
          border: none;
          font-weight: 600;
        }

        .btn-action.pdf-export:hover {
          background: linear-gradient(135deg, #c82333, #a71e2a);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
        }
        
        /* Table Styles */
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        th {
          font-weight: 600;
          background-color: #f5f7fa;
        }
        
        .status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }
        
        .status.active {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .status.inactive {
          background-color: #ffebee;
          color: #c62828;
        }
        
        /* Search Input */
        .search-input {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 250px;
        }
        
        /* KPI Cards */
        .kpi-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .kpi-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          text-align: center;
        }
        
        .kpi-value {
          font-size: 2rem;
          font-weight: 700;
          margin: 0.5rem 0;
        }
        
        .kpi-change {
          font-size: 0.875rem;
        }
        
        .kpi-change.positive {
          color: #2e7d32;
        }
        
        .kpi-change.negative {
          color: #c62828;
        }
        
        /* Charts */
        .charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }
        
        .chart {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }
        
        .chart h3 {
          margin-bottom: 1rem;
        }
        
        .chart-container {
          height: 300px;
          position: relative;
        }
        
        /* Bar Chart */
        .bar-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 100%;
          padding-top: 20px;
        }
        
        .bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        
        .bar {
          width: 20px;
          background-color: #3f51b5;
          border-radius: 4px 4px 0 0;
          transition: height 0.5s;
        }
        
        .bar-label {
          margin-top: 0.5rem;
          font-size: 0.75rem;
        }
        
        /* Pie Chart */
        .pie-chart {
          position: relative;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: conic-gradient(
            var(--segment-color, #3f51b5) 0% var(--segment-size, 25%),
            var(--segment-color, #f44336) var(--segment-size, 25%) calc(var(--segment-size, 25%) + var(--segment-size, 25%)),
            var(--segment-color, #4caf50) calc(var(--segment-size, 25%) + var(--segment-size, 25%)) calc(var(--segment-size, 25%) + var(--segment-size, 25%) + var(--segment-size, 25%)),
            var(--segment-color, #ff9800) calc(var(--segment-size, 25%) + var(--segment-size, 25%) + var(--segment-size, 25%)) 100%
          );
          margin: 0 auto;
        }
        
        .segment-label {
          position: absolute;
          font-size: 0.75rem;
          white-space: nowrap;
        }
        
        .pie-segment:nth-child(1) .segment-label {
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .pie-segment:nth-child(2) .segment-label {
          top: 50%;
          right: -120px;
          transform: translateY(-50%);
        }
        
        .pie-segment:nth-child(3) .segment-label {
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .pie-segment:nth-child(4) .segment-label {
          top: 50%;
          left: -120px;
          transform: translateY(-50%);
        }
        
        /* Tools Grid */
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .tool-card {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .tool-card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }
        
        .tool-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .tool-header h3 {
          margin: 0 0 0.5rem 0;
          color: #3f51b5;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .tool-header p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .tool-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #666;
          font-size: 0.9rem;
        }

        .info-value {
          color: #333;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background-color: #5a6268;
        }

        .btn-warning {
          background-color: #f59e0b;
          color: white;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .btn-warning:hover {
          background-color: #d97706;
        }

        .btn-info {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .btn-info:hover {
          background-color: #2563eb;
        }
        
        /* Dashboard Overview */
        .dashboard-overview {
          display: grid;
          gap: 1.5rem;
        }

        .date-display {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }

        .current-date {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 500;
          color: #333;
        }

        .date-icon {
          font-size: 1.2rem;
        }

        .date-text {
          color: #495057;
        }

        .welcome-message {
          background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .welcome-message h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }

        .welcome-message p {
          margin: 0;
          opacity: 0.9;
          line-height: 1.5;
        }
        
        .overview-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        
        .stat-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          text-align: center;
        }
        
        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
          color: #3f51b5;
        }
        
        .stat-label {
          color: #666;
          font-size: 0.875rem;
        }

        /* Leaderboards */
        .leaderboards-section {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin: 1.5rem 0;
        }

        .leaderboards-section h3 {
          margin: 0 0 1.5rem 0;
          color: #333;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .leaderboards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .leaderboard-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 8px;
          padding: 1.25rem;
          border: 1px solid #dee2e6;
        }

        .leaderboard-card h4 {
          margin: 0 0 1rem 0;
          color: #495057;
          font-size: 1.1rem;
          text-align: center;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #dee2e6;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          background: white;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }

        .leaderboard-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .rank {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
          color: white;
          flex-shrink: 0;
        }

        .rank-1 {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #8b5a00;
          box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
        }

        .rank-2 {
          background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
          color: #666;
          box-shadow: 0 2px 4px rgba(192, 192, 192, 0.3);
        }

        .rank-3 {
          background: linear-gradient(135deg, #cd7f32, #daa852);
          color: white;
          box-shadow: 0 2px 4px rgba(205, 127, 50, 0.3);
        }

        .rank:not(.rank-1):not(.rank-2):not(.rank-3) {
          background: linear-gradient(135deg, #6c757d, #858e96);
        }

        .leaderboard-item .name {
          flex: 1;
          margin: 0 1rem;
          font-weight: 500;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .leaderboard-item .score {
          color: #3f51b5;
          font-weight: 600;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        
        .quick-actions, .recent-activity {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }
        
        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        
        .activity-list {
          list-style: none;
          margin-top: 1rem;
        }
        
        .activity-item {
          display: flex;
          padding: 0.75rem 0;
          border-bottom: 1px solid #eee;
        }
        
        .activity-time {
          width: 120px;
          color: #666;
          font-size: 0.875rem;
        }
        
        /* Notification */
        .notification {
          position: fixed;
          top: 1rem;
          right: 1rem;
          padding: 1rem 1.5rem;
          border-radius: 4px;
          z-index: 1000;
          animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
        }
        
        .notification.success {
          background-color: #e8f5e9;
          color: #2e7d32;
          border-left: 4px solid #2e7d32;
        }
        
        .notification.error {
          background-color: #ffebee;
          color: #c62828;
          border-left: 4px solid #c62828;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .admin-dashboard {
            grid-template-areas:
              "header"
              "sidebar"
              "main"
              "footer";
            grid-template-columns: 1fr;
          }
          
          .sidebar {
            height: auto;
          }
          
          .charts, .tools-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;