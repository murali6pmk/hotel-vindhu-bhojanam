import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import DBSetup from './DBSetup';

type AppState = 'checking' | 'no_db' | 'login' | 'dashboard';

export default function AdminApp() {
  const [state, setState] = useState<AppState>('checking');

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('vb_admin_auth');

    // Check DB health
    fetch('/api/health')
      .then(r => r.json())
      .then(data => {
        if (data.database !== 'connected') {
          setState('no_db');
        } else if (auth === 'true') {
          setState('dashboard');
        } else {
          setState('login');
        }
      })
      .catch(() => {
        // If health check fails, still allow login attempt
        if (auth === 'true') setState('dashboard');
        else setState('login');
      });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('vb_admin_auth');
    setState('login');
  };

  if (state === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0d0804, #2c1a0e)' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl mb-4"
            style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
            🍛
          </div>
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-3" />
          <p className="text-cream/50 text-sm">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  if (state === 'no_db') {
    return <DBSetup onConnected={() => setState('login')} />;
  }

  if (state === 'login') {
    return <AdminLogin onLogin={() => { sessionStorage.setItem('vb_admin_auth', 'true'); setState('dashboard'); }} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
