import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, addDoc, query, orderBy, limit, Timestamp } from 'firebase/firestore';

// Login Component
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation - updated to correct password
    if (username === 'admin' && password === 'tma@2025') {
      onLogin();
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
          <p>Use the following credentials:</p>
          <p><strong>Username:</strong> admin</p>
          <p><strong>Password:</strong> tma@2025</p>
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

  // Export to CSV
  const exportToCSV = () => {
    if (registrations.length === 0) {
      showNotification('No data to export', 'error');
      return;
    }

    const headers = ['Full Name', 'Email', 'Phone', 'Institution', 'Course', 'Year', 'Cohort', 'Track', 'Project Title', 'Problem Statement', 'Context', 'Stakeholders', 'Solution', 'Working Principle', 'Novelty', 'Impact', 'Budget', 'Timeline', 'Team Members', 'Has Mentor', 'Mentor Name', 'Mentor Email', 'Mentor Department', 'Mentor Institution', 'Mentor Phone', 'TMA Member', 'TMA Chapter', 'Payment Status', 'Payment ID', 'Order ID', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
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
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('CSV file downloaded successfully', 'success');
    createLog('CSV export', `Exported ${registrations.length} registrations to CSV`);
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
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading data from Firestore...
        </div>
      ) : (
        <>
          <div className="overview-stats">
            <div className="stat-card">
              <h3>Total Registrations</h3>
              <div className="stat-value">{registrations.length}</div>
              <div className="stat-label">All registrations</div>
            </div>
            <div className="stat-card">
              <h3>Paid Registrations</h3>
              <div className="stat-value">{registrations.filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length}</div>
              <div className="stat-label">
                {registrations.length > 0 
                  ? Math.round(registrations.filter(r => r.payment_status === 'captured' || r.payment_status === 'authorized').length / registrations.length * 100)
                  : 0}% completion rate
              </div>
            </div>
            <div className="stat-card">
              <h3>Active Cohorts</h3>
              <div className="stat-value">{new Set(registrations.map(r => r.Cohort)).size}</div>
              <div className="stat-label">Different cohorts</div>
            </div>
            <div className="stat-card">
              <h3>Pending Payments</h3>
              <div className="stat-value">{registrations.filter(r => !r.payment_status || r.payment_status === 'pending').length}</div>
              <div className="stat-label">Awaiting payment</div>
            </div>
          </div>
          
          <div className="recent-activity">
            <h3>Recent Registrations</h3>
            {registrations.length > 0 ? (
              <div className="activity-list">
                {registrations.slice(-5).reverse().map(reg => (
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
              <p>No registrations found. The Firestore 'registrations' collection appears to be empty.</p>
            )}
          </div>
          
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="btn-action" onClick={() => setActiveTab('users')}>Manage Registrations</button>
              <button className="btn-action" onClick={() => setActiveTab('analytics')}>View Analytics</button>
              <button className="btn-action" onClick={fetchRegistrations}>Refresh Data</button>
              <button className="btn-action" onClick={exportToCSV}>Export CSV</button>
            </div>
          </div>
        </>
      )}
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul className="activity-list">
          <li className="activity-item">
            <span className="activity-time">Just now</span>
            <span className="activity-text">User login: admin@example.com</span>
          </li>
          <li className="activity-item">
            <span className="activity-time">5 minutes ago</span>
            <span className="activity-text">New user registered: guest@example.com</span>
          </li>
          <li className="activity-item">
            <span className="activity-time">1 hour ago</span>
            <span className="activity-text">System backup completed</span>
          </li>
          <li className="activity-item">
            <span className="activity-time">3 hours ago</span>
            <span className="activity-text">Database optimization performed</span>
          </li>
        </ul>
      </div>
    </div>
  );

  // Render Analytics Section
  const renderAnalytics = () => (
    <div className="section">
      <h2>Analytics & Reports</h2>
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading analytics from Firestore...
        </div>
      ) : (
        <>
          <div className="kpi-cards">
            {analytics.kpis && analytics.kpis.map((kpi, index) => (
              <div className="kpi-card" key={index}>
                <h3>{kpi.name}</h3>
                <div className="kpi-value">{kpi.value}</div>
                <div className={`kpi-change ${kpi.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {kpi.change}
                </div>
              </div>
            ))}
          </div>
          
          <div className="cohort-distribution">
            <h3>Cohort Distribution</h3>
            {analytics.cohortStats && Object.entries(analytics.cohortStats).length > 0 ? (
              <div className="cohort-stats">
                {Object.entries(analytics.cohortStats).map(([cohort, count]) => (
                  <div key={cohort} className="cohort-item">
                    <span className="cohort-name">{cohort}</span>
                    <span className="cohort-count">{count} registrations</span>
                    <div className="cohort-bar">
                      <div 
                        className="cohort-fill" 
                        style={{ width: `${(count / Math.max(...Object.values(analytics.cohortStats))) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No cohort data available</p>
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
      <h2>Tools & Utilities</h2>
      
      <div className="tools-grid">
        <div className="tool-card">
          <h3>Data Management</h3>
          <div className="tool-actions">
            <button className="btn-primary" onClick={fetchRegistrations}>
              🔄 Refresh Firestore Data
            </button>
            <button className="btn-accent" onClick={exportToCSV}>
              📊 Export All Data (CSV)
            </button>
          </div>
        </div>
        
        <div className="tool-card">
          <h3>System Information</h3>
          <div className="system-info">
            <div className="info-item">
              <span>Database:</span>
              <strong>Firebase Firestore</strong>
            </div>
            <div className="info-item">
              <span>Connection Status:</span>
              <strong style={{color: '#10b981'}}>Connected</strong>
            </div>
            <div className="info-item">
              <span>Total Records:</span>
              <strong>{registrations.length}</strong>
            </div>
            <div className="info-item">
              <span>Last Updated:</span>
              <strong>{new Date().toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
    showNotification('Login successful', 'success');
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
          <span className="user-name">Admin User</span>
          <span className="user-avatar">👤</span>
          <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>Logout</button>
        </div>
      </header>
      
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <ul className="nav-menu">
          <li className={activeTab === 'dashboard' ? 'active' : ''}>
            <button onClick={() => setActiveTab('dashboard')}>
              <span className="icon">📊</span>
              <span className="label">Dashboard</span>
            </button>
          </li>
          <li className={activeTab === 'users' ? 'active' : ''}>
            <button onClick={() => setActiveTab('users')}>
              <span className="icon">👥</span>
              <span className="label">User Management</span>
            </button>
          </li>
          <li className={activeTab === 'analytics' ? 'active' : ''}>
            <button onClick={() => setActiveTab('analytics')}>
              <span className="icon">📈</span>
              <span className="label">Analytics</span>
            </button>
          </li>
          <li className={activeTab === 'logs' ? 'active' : ''}>
            <button onClick={() => setActiveTab('logs')}>
              <span className="icon">📝</span>
              <span className="label">System Logs</span>
            </button>
          </li>
          <li className={activeTab === 'tools' ? 'active' : ''}>
            <button onClick={() => setActiveTab('tools')}>
              <span className="icon">🛠️</span>
              <span className="label">Tools & Utilities</span>
            </button>
          </li>
        </ul>
      </nav>
      
      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'logs' && renderLogs()}
        {activeTab === 'tools' && renderTools()}
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
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .tool-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }
        
        .tool-card h3 {
          margin-bottom: 1rem;
          color: #3f51b5;
        }
        
        /* Dashboard Overview */
        .dashboard-overview {
          display: grid;
          gap: 1.5rem;
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