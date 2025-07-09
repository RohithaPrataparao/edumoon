import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get all registered emails
  const allUsers = JSON.parse(localStorage.getItem('financeapp_all_users') || '[]');
  const allEmails = allUsers.map(u => u.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = allUsers.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('financeapp_token', 'dummy-token');
      localStorage.setItem('financeapp_user', JSON.stringify(user));
      // Set user-specific data key prefix
      localStorage.setItem('financeapp_data_owner', user.email);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 text-center">Sign In</h2>
      {allEmails.length > 0 && (
        <div className="mb-3">
          <div className="text-muted small">Registered emails:</div>
          <ul style={{paddingLeft: '1.2em', marginBottom: 0}}>
            {allEmails.map(e => <li key={e} style={{fontSize: '0.95em'}}>{e}</li>)}
          </ul>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;
