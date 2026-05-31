import { useState, useRef } from 'react';
import Modal from '../Modal';

export default function AdminImportModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
      setErrors([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setErrors([]);

    try {
      // 读取文件为 base64
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const token = sessionStorage.getItem('graduation_admin_token');
      const res = await fetch('/api/graduation/admin/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileBase64: base64 }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors([data.error || '导入失败']);
        }
        return;
      }

      setResult(data);
      onSuccess && onSuccess();
    } catch (err) {
      setErrors(['上传失败：' + err.message]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setErrors([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="批量导入学生">
      <div className="py-4">
        <div className="mb-4 p-3 rounded-lg bg-tony-text/5 border border-tony-border">
          <p className="text-xs text-tony-muted mb-1">Excel 模板格式（第一行为表头）：</p>
          <p className="text-xs text-tony-text font-mono">姓名 | 班级 | 老师留言 | 期望分数 | 老师署名</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => inputRef.current?.click()}
          className="w-full py-3 rounded-xl border border-dashed border-tony-border text-tony-muted hover:text-tony-text hover:border-tony-border-hover transition-colors text-sm"
        >
          {file ? file.name : '点击选择 .xlsx 文件'}
        </button>

        {errors.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400 mb-2">导入失败，请修正以下错误：</p>
            <ul className="space-y-1">
              {errors.map((err, i) => (
                <li key={i} className="text-xs text-red-300">• {err}</li>
              ))}
            </ul>
          </div>
        )}

        {result && (
          <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-400">✅ {result.message}</p>
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex-1 py-2.5 rounded-xl bg-[#c4a574]/20 border border-[#c4a574]/40 text-[#c4a574] font-medium hover:bg-[#c4a574]/30 transition-all disabled:opacity-40"
          >
            {loading ? '导入中...' : '开始导入'}
          </button>
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl bg-tony-text/5 border border-tony-border text-tony-muted hover:text-tony-text transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    </Modal>
  );
}
