import { useState, useEffect } from 'react';
import Modal from '../Modal';

export default function AdminPreviewModal({ isOpen, onClose, studentId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !studentId) return;

    setLoading(true);
    setError('');

    const fetchPreview = async () => {
      try {
        const token = sessionStorage.getItem('graduation_admin_token');
        const res = await fetch(`/api/graduation/admin/preview?studentId=${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) {
          setError(result.error || '预览失败');
          return;
        }
        setData(result);
      } catch (err) {
        setError('网络错误');
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [isOpen, studentId]);

  const handleClose = () => {
    setData(null);
    setError('');
    onClose();
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="学生页面预览">
      <div className="py-4">
        {/* 预览模式标记 */}
        <div className="mb-4 px-3 py-2 rounded-lg bg-[#c4a574]/10 border border-[#c4a574]/20 text-center">
          <span className="text-xs text-[#c4a574] font-medium">👁️ 老师预览模式 — 学生不会看到此标记</span>
        </div>

        {loading && <p className="text-sm text-tony-muted text-center py-8">加载中...</p>}
        {error && <p className="text-sm text-red-400 text-center py-8">{error}</p>}

        {data && (
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {/* 学生卡片模拟 */}
            <div
              className="rounded-xl p-6"
              style={{
                background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%)',
              }}
            >
              <div className="text-center mb-4">
                <p className="text-xs text-[#8b7355] mb-1">{data.className}</p>
                <h3 className="text-xl font-medium text-[#3d3229]">{data.name}</h3>
              </div>
              <div className="w-12 h-px bg-[#c4a574] mx-auto mb-4 opacity-40" />
              <p className="text-[#5c4d3c] text-sm leading-relaxed whitespace-pre-wrap mb-4">
                {data.teacherMessage}
              </p>
              <div className="text-right">
                <p className="text-xs text-[#8b7355]">—— {data.teacherName}</p>
                <p className="text-xs text-[#a89b8c] mt-0.5">{formatDate(data.teacherMessageAt)}</p>
              </div>
            </div>

            {/* 期望分数 */}
            <div className="text-center">
              <p className="text-xs text-tony-muted mb-1">老师对你的中考期待值</p>
              <p className="text-3xl font-bold text-gradient-gold">{data.expectedScore || '—'}</p>
            </div>

            {/* 回信区域 */}
            {data.hasReplied ? (
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(196,165,116,0.08) 0%, rgba(196,165,116,0.04) 100%)',
                  border: '1px solid rgba(196,165,116,0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-[#c4a574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-[#c4a574]">学生回信</span>
                  {data.replyHidden && (
                    <span className="ml-auto text-xs text-red-400">（已隐藏）</span>
                  )}
                </div>
                {data.replyHidden ? (
                  <p className="text-tony-muted text-sm text-center py-2">这封回信已被老师收藏</p>
                ) : (
                  <p className="text-tony-text text-sm leading-relaxed whitespace-pre-wrap">{data.reply}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-tony-muted">该学生尚未提交回信</p>
              </div>
            )}

            {/* 状态信息 */}
            <div className="text-xs text-tony-muted space-y-1">
              <p>登录状态：{data.hasLoggedIn ? '已登录' : '未登录'}</p>
              <p>板块状态：{data.settingsStatus}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
