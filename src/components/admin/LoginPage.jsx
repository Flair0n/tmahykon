import React, { useState } from 'react';
import '../../styles/admin/LoginPage.css';

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

export default LoginPage;
