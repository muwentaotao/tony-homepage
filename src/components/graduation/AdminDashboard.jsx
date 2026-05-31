import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminFilters from './AdminFilters';
import AdminStudentTable from './AdminStudentTable';
import AdminSettingsPanel from './AdminSettingsPanel';
import AdminImportModal from './AdminImportModal';
import AdminPasswordExport from './AdminPasswordExport';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [settingsStatus, setSettingsStatus] = useState('open');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [importOpen, setImportOpen] = useState(false);

  const token = sessionStorage.getItem('graduation_admin_token');

  const fetchData = useCallback(async () => {
    try {
      // 学生列表
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v && v !== 'all') params.append(k, v);
      });

      const studentsRes = await fetch(`/api/graduation/admin/students?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (studentsRes.status === 401) {
        sessionStorage.removeItem('graduation_admin_token');
        window.location.reload();
        return;
      }

      const studentsData = await studentsRes.json();

      // 设置
      const settingsRes = await fetch('/api/graduation/admin/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const settingsData = await settingsRes.json();

      setStudents(studentsData.students || []);
      setSettingsStatus(settingsData.status || 'open');
    } catch (err) {
      setError('数据加载失败');
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    const total = students.length;
    const loggedIn = students.filter((s) => s.hasLoggedIn).length;
    const replied = students.filter((s) => s.hasReplied).length;
    const hidden = students.filter((s) => s.replyHidden).length;
    return { total, loggedIn, replied, hidden };
  }, [students]);

  const classes = useMemo(() => {
    const set = new Set(students.map((s) => s.className).filter(Boolean));
    return Array.from(set).sort();
  }, [students]);

  const handleLogout = () => {
    sessionStorage.removeItem('graduation_admin_token');
    window.location.reload();
  };

  const handleImportSuccess = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-tony-muted text-sm">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-8 sm:py-10">
      {/* 顶部 */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-gradient-gold">2026 届毕业留言后台</h1>
            <p className="text-sm text-tony-muted mt-1">管理学生留言与板块状态</p>
          </div>
          <div className="flex items-center gap-3">
            <AdminPasswordExport />
            <button
              onClick={() => setImportOpen(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#c4a574]/20 border border-[#c4a574]/40 text-[#c4a574] hover:bg-[#c4a574]/30 transition-all"
            >
              批量导入学生
            </button>
            <Link
              to="/"
              className="text-sm text-tony-muted hover:text-tony-text transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回主站
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-tony-muted hover:text-red-400 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-medium text-tony-text">{stats.total}</p>
            <p className="text-xs text-tony-muted mt-1">学生总数</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-medium text-green-400">{stats.loggedIn}</p>
            <p className="text-xs text-tony-muted mt-1">已登录</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-medium text-[#c4a574]">{stats.replied}</p>
            <p className="text-xs text-tony-muted mt-1">已回复</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-medium text-red-400">{stats.hidden}</p>
            <p className="text-xs text-tony-muted mt-1">已收藏</p>
          </div>
        </div>

        {/* 状态切换 */}
        <AdminSettingsPanel status={settingsStatus} onChange={setSettingsStatus} />

        {/* 筛选 */}
        <AdminFilters onChange={setFilters} classes={classes} />

        {/* 表格 */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-tony-muted">
            共 {students.length} 条记录
          </p>
        </div>
        <AdminStudentTable students={students} />

        {/* 导入弹窗 */}
        <AdminImportModal
          isOpen={importOpen}
          onClose={() => setImportOpen(false)}
          onSuccess={handleImportSuccess}
        />
      </div>
    </div>
  );
}
