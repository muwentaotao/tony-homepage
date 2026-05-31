import { useState } from 'react';

const STATUS_MAP = {
  open: { label: '开放', color: 'text-green-400', border: 'border-green-400/30', bg: 'bg-green-400/10' },
  readonly: { label: '只读', color: 'text-[#c4a574]', border: 'border-[#c4a574]/30', bg: 'bg-[#c4a574]/10' },
  closed: { label: '关闭', color: 'text-red-400', border: 'border-red-400/30', bg: 'bg-red-400/10' },
};

export default function AdminSettingsPanel({ status, onChange }) {
  const [loading, setLoading] = useState(false);
  const current = STATUS_MAP[status] || STATUS_MAP.closed;

  const handleSwitch = async (newStatus) => {
    if (newStatus === status || loading) return;
    setLoading(true);

    const token = sessionStorage.getItem('graduation_admin_token');
    try {
      const res = await fetch('/api/graduation/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || '切换失败');
        return;
      }

      onChange(data.status);
    } catch (err) {
      alert('网络错误，切换失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-tony-text mb-1">板块状态</h3>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${current.color} ${current.border} ${current.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'closed' ? 'bg-red-400' : status === 'readonly' ? 'bg-[#c4a574]' : 'bg-green-400'}`} />
              当前：{current.label}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {(['open', 'readonly', 'closed'] ).map((s) => (
            <button
              key={s}
              onClick={() => handleSwitch(s)}
              disabled={loading || s === status}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                s === status
                  ? `${STATUS_MAP[s].color} ${STATUS_MAP[s].border} ${STATUS_MAP[s].bg}`
                  : 'text-tony-muted border-tony-border hover:text-tony-text hover:border-tony-border-hover'
              } disabled:opacity-60`}
            >
              {STATUS_MAP[s].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
