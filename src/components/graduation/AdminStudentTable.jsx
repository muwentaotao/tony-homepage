import { useState } from 'react';
import Modal from '../Modal';

export default function AdminStudentTable({ students, onRefresh }) {
  const [confirmClear, setConfirmClear] = useState(null);
  const [clearLoading, setClearLoading] = useState(false);

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleToggleHide = async (student) => {
    const token = sessionStorage.getItem('graduation_admin_token');
    try {
      const res = await fetch('/api/graduation/admin/reply', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId: student.id, replyHidden: !student.replyHidden }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || '操作失败');
        return;
      }
      onRefresh && onRefresh();
    } catch (err) {
      alert('网络错误');
    }
  };

  const handleClearReply = async () => {
    if (!confirmClear) return;
    setClearLoading(true);
    const token = sessionStorage.getItem('graduation_admin_token');
    try {
      const res = await fetch('/api/graduation/admin/reply', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId: confirmClear.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || '清空失败');
        return;
      }
      setConfirmClear(null);
      onRefresh && onRefresh();
    } catch (err) {
      alert('网络错误');
    } finally {
      setClearLoading(false);
    }
  };

  if (students.length === 0) {
    return (
      <div className="glass-card rounded-xl p-10 text-center">
        <p className="text-tony-muted text-sm">没有找到符合条件的学生</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-tony-border">
              <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">姓名</th>
              <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">班级</th>
              <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">期待值</th>
              <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">老师</th>
              <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">登录</th>
              <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">回复</th>
              <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">收藏</th>
              <th className="text-left text-xs text-tony-muted font-medium px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-tony-border/50 hover:bg-tony-text/[0.02] transition-colors">
                <td className="px-4 py-3 text-sm text-tony-text">{s.name}</td>
                <td className="px-4 py-3 text-sm text-tony-muted">{s.className}</td>
                <td className="px-4 py-3 text-sm text-[#c4a574]">{s.expectedScore || '—'}</td>
                <td className="px-4 py-3 text-sm text-tony-muted">{s.teacherName}</td>
                <td className="px-4 py-3">
                  {s.hasLoggedIn ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />已登录
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-tony-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-tony-muted/40" />未登录
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {s.hasReplied ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />已回复
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-tony-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-tony-muted/40" />未回复
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {s.replyHidden ? (
                    <span className="text-xs text-[#c4a574]">已收藏</span>
                  ) : (
                    <span className="text-xs text-tony-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRefresh?.({ action: 'preview', student: s })}
                      className="text-xs text-tony-muted hover:text-tony-text transition-colors"
                    >
                      预览
                    </button>
                    <button
                      onClick={() => onRefresh?.({ action: 'edit', student: s })}
                      className="text-xs text-tony-muted hover:text-tony-text transition-colors"
                    >
                      编辑
                    </button>
                    {s.hasReplied && (
                      <>
                        <button
                          onClick={() => handleToggleHide(s)}
                          className="text-xs text-[#c4a574] hover:text-[#d4b483] transition-colors"
                        >
                          {s.replyHidden ? '取消收藏' : '收藏'}
                        </button>
                        <button
                          onClick={() => setConfirmClear(s)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          清空
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 移动端卡片视图 */}
        <div className="sm:hidden divide-y divide-tony-border/50">
          {students.map((s) => (
            <div key={s.id} className="px-4 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-tony-text">{s.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => onRefresh?.({ action: 'preview', student: s })} className="text-xs text-tony-muted">预览</button>
                  <button onClick={() => onRefresh?.({ action: 'edit', student: s })} className="text-xs text-tony-muted">编辑</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-2">
                <span className="text-[#c4a574]">期待值: {s.expectedScore || '—'}</span>
                <span className="text-tony-muted">老师: {s.teacherName}</span>
                <span className={s.hasLoggedIn ? 'text-green-400' : 'text-tony-muted'}>{s.hasLoggedIn ? '已登录' : '未登录'}</span>
                <span className={s.hasReplied ? 'text-green-400' : 'text-tony-muted'}>{s.hasReplied ? '已回复' : '未回复'}</span>
                {s.replyHidden && <span className="text-[#c4a574]">已收藏</span>}
              </div>
              {s.hasReplied && (
                <div className="flex gap-3">
                  <button onClick={() => handleToggleHide(s)} className="text-xs text-[#c4a574]">{s.replyHidden ? '取消收藏' : '收藏'}</button>
                  <button onClick={() => setConfirmClear(s)} className="text-xs text-red-400">清空回复</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 清空确认弹窗 */}
      <Modal isOpen={!!confirmClear} onClose={() => setConfirmClear(null)} title="清空学生回复">
        <div className="py-4 text-center">
          <p className="text-tony-text text-sm mb-1">确认清空「{confirmClear?.name}」的回信？</p>
          <p className="text-tony-muted text-xs mb-6">清空后该学生可以重新写一次回信</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleClearReply}
              disabled={clearLoading}
              className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium hover:bg-red-500/20 transition-all disabled:opacity-50"
            >
              {clearLoading ? '清空中...' : '确认清空'}
            </button>
            <button
              onClick={() => setConfirmClear(null)}
              className="px-6 py-2 rounded-xl bg-tony-text/5 border border-tony-border text-tony-muted hover:text-tony-text transition-all"
            >
              取消
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
