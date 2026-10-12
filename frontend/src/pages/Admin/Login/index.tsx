import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api/auth';
import { useAuth } from '../../../context/AuthContext';
import './Login.css';

export function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = await authApi.login(username, password);
      login(token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="admin-login-title">AKIO'S</h2>
        <p className="admin-login-subtitle">SECURE ACCESS</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}
          
          <div className="admin-login-field">
            <label htmlFor="username">USERNAME</label>
            <input
              type="text" 
              id="username" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="password">AUTHORIZATION CODE</label>
            <input
              type="password" 
              id="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter code"
            />
          </div>

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER'}
          </button>
        </form>
      </div>
    </div>
  );
}
