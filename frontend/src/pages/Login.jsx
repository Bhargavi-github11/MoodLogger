import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await login(email, password);
        navigate('/');
    } catch (err) {
        setError(err.response?.data?.msg || 'Error logging in');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="card" style={{ maxWidth: 400, width: '100%', textAlign: 'center', padding: '40px 30px' }}>
        <div className="logo-icon" style={{ margin: '0 auto 20px auto', width: 60, height: 60 }}>
          <span style={{ fontSize: '2rem' }}>🧠</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Log in to continue tracking your mood journey.</p>
        
        {error && <div style={{ background: 'rgba(252, 165, 165, 0.2)', color: 'var(--angry)', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email</label>
          <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginTop: '10px' }}>Password</label>
          <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          
          <button className="btn" type="submit" style={{width: '100%', marginTop: '20px', padding: '14px', fontSize: '1.1rem'}}>Login 🚀</button>
        </form>
        <p style={{marginTop: 30, color: 'var(--text-muted)'}}>Don't have an account? <Link to="/register" style={{color: 'var(--primary)', fontWeight: 600}}>Register here</Link></p>
      </div>
    </div>
  );
}

export default Login;
