import { useState } from 'react';
import { authApi } from '../../../api/auth';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AdminSettings() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(newPassword, confirmPassword);
      setMessage('Password updated successfully. Please log in again.');
      setTimeout(() => {
        logout();
        navigate('/admin/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h1 className="admin-title">SETTINGS</h1>
      </div>

      <div className="admin-content-box max-w-md">
        <form onSubmit={handleSubmit} className="admin-form">
          {error && <div className="admin-alert admin-alert-error">{error}</div>}
          {message && <div className="admin-alert admin-alert-success">{message}</div>}
          
          <div className="admin-field">
            <label>NEW PASSWORD</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="admin-field">
            <label>CONFIRM NEW PASSWORD</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
}
