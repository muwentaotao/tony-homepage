import { useState, useEffect } from 'react';
import AdminLoginForm from '../components/graduation/AdminLoginForm';
import AdminDashboard from '../components/graduation/AdminDashboard';

export default function GraduationAdminPage() {
  const [token, setToken] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem('graduation_admin_token');
    if (saved) {
      setToken(saved);
    }
    setChecking(false);
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-tony-muted text-sm">加载中...</p>
      </div>
    );
  }

  if (!token) {
    return <AdminLoginForm onLogin={handleLogin} />;
  }

  return <AdminDashboard />;
}
