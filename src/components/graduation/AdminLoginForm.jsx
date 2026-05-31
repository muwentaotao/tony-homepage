import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminLoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/graduation/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '账号或密码错误');
        return;
      }

      sessionStorage.setItem('graduation_admin_token', data.token);
      onLogin(data.token);
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12 relative">
      <Link
        to="/"
        className="absolute top-5 left-5 sm:top-8 sm:left-8 text-sm text-tony-muted hover:text-tony-text transition-colors duration-300 flex items-center gap-2 z-20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回主站
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-medium text-gradient-gold mb-2">
            2026 届毕业留言后台
          </h1>
          <p className="text-sm text-tony-muted">管理员登录</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm text-tony-muted mb-2">管理员账号</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入管理员账号"
              className="w-full px-4 py-3 rounded-xl bg-tony-darker border border-tony-border text-tony-text placeholder-tony-muted/50 focus:outline-none focus:border-tony-border-hover transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-tony-muted mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full px-4 py-3 rounded-xl bg-tony-darker border border-tony-border text-tony-text placeholder-tony-muted/50 focus:outline-none focus:border-tony-border-hover transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-tony-text/10 border border-tony-border hover:bg-tony-text/15 hover:border-tony-border-hover text-tony-text font-medium transition-all duration-300 disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}
