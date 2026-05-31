import { useState, useEffect } from 'react';
import Modal from '../Modal';

export default function AdminEditStudentModal({ isOpen, onClose, student, onSuccess }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setForm({
        id: student.id,
        name: student.name || '',
        className: student.className || '',
        teacherMessage: student.teacherMessage || '',
        expectedScore: student.expectedScore || '',
        teacherName: student.teacherName || '',
        teacherMessageAt: student.teacherMessageAt
          ? new Date(student.teacherMessageAt).toISOString().slice(0, 16)
          : '',
      });
      setError('');
    }
  }, [student]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.name || !form.className || !form.teacherMessage || !form.teacherName) {
      setError('姓名、班级、老师留言、老师署名为必填项');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('graduation_admin_token');
      const res = await fetch('/api/graduation/admin/student', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: form.id,
          name: form.name,
          className: form.className,
          teacherMessage: form.teacherMessage,
          expectedScore: form.expectedScore,
          teacherName: form.teacherName,
          teacherMessageAt: form.teacherMessageAt || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '更新失败');
        return;
      }

      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError('网络错误，更新失败');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg bg-tony-darker border border-tony-border text-sm text-tony-text placeholder-tony-muted/50 focus:outline-none focus:border-tony-border-hover';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="编辑学生信息">
      <div className="py-4 space-y-4">
        <div>
          <label className="block text-xs text-tony-muted mb-1.5">姓名</label>
          <input type="text" value={form.name || ''} onChange={(e) => handleChange('name', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-tony-muted mb-1.5">班级</label>
          <input type="text" value={form.className || ''} onChange={(e) => handleChange('className', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-tony-muted mb-1.5">老师留言</label>
          <textarea
            value={form.teacherMessage || ''}
            onChange={(e) => handleChange('teacherMessage', e.target.value)}
            rows={4}
            className={inputClass + ' resize-none'}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-tony-muted mb-1.5">期望分数</label>
            <input type="text" value={form.expectedScore || ''} onChange={(e) => handleChange('expectedScore', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-tony-muted mb-1.5">老师署名</label>
            <input type="text" value={form.teacherName || ''} onChange={(e) => handleChange('teacherName', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-tony-muted mb-1.5">留言时间</label>
          <input
            type="datetime-local"
            value={form.teacherMessageAt || ''}
            onChange={(e) => handleChange('teacherMessageAt', e.target.value)}
            className={inputClass}
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-[#c4a574]/20 border border-[#c4a574]/40 text-[#c4a574] font-medium hover:bg-[#c4a574]/30 transition-all disabled:opacity-40"
          >
            {loading ? '保存中...' : '保存'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-tony-text/5 border border-tony-border text-tony-muted hover:text-tony-text transition-all"
          >
            取消
          </button>
        </div>
      </div>
    </Modal>
  );
}
