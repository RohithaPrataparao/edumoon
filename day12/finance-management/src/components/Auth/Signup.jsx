import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    const allUsers = JSON.parse(localStorage.getItem('financeapp_all_users') || '[]');
    if (allUsers.find(u => u.email === email)) {
      setError('User with this email already exists');
      return;
    }
    const user = { name, email, password };
    allUsers.push(user);
    localStorage.setItem('financeapp_all_users', JSON.stringify(allUsers));
    localStorage.setItem('financeapp_user', JSON.stringify(user));
    localStorage.setItem('financeapp_data_owner', user.email);
    setError('');
    navigate('/auth/signin');
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 text-center">Sign Up</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
