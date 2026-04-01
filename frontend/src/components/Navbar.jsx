import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <Link to="/" className="logo">
        <div className="logo-icon">
          <span>🧠</span>
        </div>
        <span className="logo-text">MoodLogger</span>
      </Link>

      <div className="nav-links">
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        {token ? (
          <>
            <Link className="nav-link" to="/">Dashboard</Link>
            <Link className="nav-link" to="/history">History</Link>
            <Link className="nav-link" to="/analytics">Analytics</Link>
            <div 
              title={user?.name || 'Friend'}
              style={{
                width: '36px', height: '36px', borderRadius: '50%', marginLeft: '8px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #d8b4fe 100%)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                border: '2px solid var(--card-bg)', cursor: 'pointer', transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {(user?.name || 'Friend').charAt(0).toUpperCase()}
            </div>
            
            <button 
              onClick={handleLogout} 
              style={{
                background: 'rgba(252, 165, 165, 0.15)',
                color: 'var(--angry)',
                border: '1px solid rgba(252, 165, 165, 0.3)',
                padding: '6px 14px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--angry)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(252, 165, 165, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(252, 165, 165, 0.15)';
                e.currentTarget.style.color = 'var(--angry)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Logout <span style={{fontSize: '1.1rem'}}>👋</span>
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
