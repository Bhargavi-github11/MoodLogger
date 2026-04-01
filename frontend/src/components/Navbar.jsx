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
            {user?.name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '5px', padding: '4px 12px 4px 4px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid var(--card-border)', borderRadius: '30px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #d8b4fe 100%)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-color)' }}>{user.name}</span>
              </div>
            )}
            <button className="theme-toggle" onClick={handleLogout} style={{color: '#fca5a5'}}>Logout</button>
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
