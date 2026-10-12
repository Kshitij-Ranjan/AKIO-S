import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Settings } from 'lucide-react';
import '../../styles/admin.css';

export function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="admin-layout-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          AKIO'S
        </div>
        <nav className="admin-nav">
          <Link to="/admin/projects" className={`admin-nav-link ${isActive('/admin/projects') || isActive('/admin') ? 'active' : ''}`}>
            <LayoutDashboard className="w-4 h-4" />
            PROJECTS
          </Link>
          <Link to="/admin/settings" className={`admin-nav-link ${isActive('/admin/settings') ? 'active' : ''}`}>
            <Settings className="w-4 h-4" />
            SETTINGS
          </Link>
          <button onClick={handleLogout} className="admin-nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <LogOut className="w-4 h-4" />
            LOGOUT
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
