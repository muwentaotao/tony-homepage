import { useState } from 'react';
import Modal from '../Modal';

export default function AdminPasswordExport() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    setShowConfirm(false);
    setDownloading(true);

    try {
      const token = sessionStorage.getItem('graduation_admin_token');
      const res = await fetch('/api/graduation/admin/passwords', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const contentType = res.headers.get('content-type') || '';
        let errorMsg = '导出失败';
        if (contentType.includes('application/json')) {
          const data = await res.json().catch(() => ({}));
          errorMsg = data.error || '导出失败';
        } else {
          const text = await res.text().catch(() => '');
          errorMsg = text.slice(0, 200) || '导出失败';
        }
        alert('导出失败：' + errorMsg);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '学生密码表.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('导出失败：' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={downloading}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-tony-text/10 border border-tony-border text-tony-text hover:bg-tony-text/15 transition-all disabled:opacity-50"
      >
        {downloading ? '导出中...' : '导出学生密码表'}
      </button>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="导出密码表"
      >
        <div className="py-4 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#c4a574]/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#c4a574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-tony-text text-sm mb-2">密码表包含敏感信息</p>
          <p className="text-tony-muted text-xs mb-6">请妥善保存，不要分享给无关人员</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleExport}
              className="px-6 py-2 rounded-xl bg-[#c4a574]/20 border border-[#c4a574]/40 text-[#c4a574] font-medium hover:bg-[#c4a574]/30 transition-all"
            >
              确认导出
            </button>
            <button
              onClick={() => setShowConfirm(false)}
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
