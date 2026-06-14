import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, RefreshCw, QrCode } from 'lucide-react';
import { api } from '../utils/api';

const Signup = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await api.signup(name, email, password);
      localStorage.setItem('token', data.token);
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <QrCode size={28} />
          </div>
          <h2>Create Account</h2>
          <p>Sign up to generate and monitor your dynamic QR codes</p>
        </div>

        {error && <div className="message-box error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="Minimum 6 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-auth" disabled={loading}>
            {loading ? <RefreshCw className="spinner" size={18} /> : <User size={18} />}
            <span>Sign Up</span>
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>

      <style>{`
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 160px);
          padding: 2rem 0;
        }
        .auth-card {
          width: 100%;
          max-width: 450px;
          padding: 1.25rem 1rem;
        }
        @media (min-width: 480px) {
          .auth-card {
            padding: 2.5rem;
          }
        }
        .auth-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-logo {
          background: var(--accent-gradient);
          padding: 0.75rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
          color: white;
          margin-bottom: 0.5rem;
        }
        .auth-header h2 {
          font-size: 1.85rem;
          color: white;
        }
        .auth-header p {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        
        .input-with-icon {
          position: relative;
        }
        .input-with-icon .form-input {
          padding-left: 2.75rem;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .btn-auth {
          width: 100%;
          padding: 0.9rem;
          margin-top: 1.5rem;
        }
        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .auth-footer a {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
        }
        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Signup;
