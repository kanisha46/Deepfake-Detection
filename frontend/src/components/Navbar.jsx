import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { checkHealth } from '../services/api';

export default function Navbar() {
  const [health, setHealth] = useState({ status: 'checking', checkpoint_loaded: false });
  const location = useLocation();

  useEffect(() => {
    const fetchStatus = async () => {
      const data = await checkHealth();
      setHealth(data);
    };
    fetchStatus();
    const timer = setInterval(fetchStatus, 15000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { path: '/', label: 'Overview' },
    { path: '/detection', label: '⚡ Detection' },
    { path: '/experiments', label: '📊 Experiments' },
    { path: '/research', label: '🔬 Methodology' },
    { path: '/about', label: '👥 Team' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #4f46e5, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(79, 70, 229, 0.25)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <circle cx="12" cy="11" r="3"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>DeepfakeDefense</span>
              <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>Research</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Cross-Dataset Generalization Study
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navLinks.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '7px 14px',
                  borderRadius: '7px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: active ? '#4f46e5' : 'var(--text-secondary)',
                  background: active ? 'var(--accent-indigo-light)' : 'transparent',
                  border: active ? '1px solid #c7d2fe' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Server & Checkpoint Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: '20px',
            background: '#f1f5f9',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: health.status === 'healthy' ? '#059669' : '#d97706',
              boxShadow: health.status === 'healthy' ? '0 0 8px #059669' : 'none',
              display: 'inline-block'
            }} />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              {health.status === 'healthy' ? 'Backend Ready' : 'Connecting...'}
            </span>
          </div>

          <a
            href="https://www.kaggle.com/kanishajasoliya"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
          >
            Kaggle Workspace ↗
          </a>
        </div>
      </div>
    </header>
  );
}
