import { useState } from 'react';
import Modal from '../Modal';

export default function StudentReplyForm({ onSubmit, disabled }) {
  const [content, setContent] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const charCount = content.length;

  const handleSubmitClick = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      setError('回信内容不能为空');
      return;
    }
    if (trimmed.length > 1000) {
      setError('回信内容不能超过 1000 字');
      return;
    }
    setError('');
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    try {
      await onSubmit(content.trim());
    } catch (err) {
      setError(err.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (disabled) {
    return (
      <div className="mt-8 text-center">
        <p className="text-sm text-tony-muted">板块当前只读，暂时不能提交回信。</p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-lg mx-auto">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-medium text-tony-text mb-1">给老师的回信</h3>
        <p className="text-sm text-tony-muted mb-4">写下你想对老师说的话，只能写一次哦。</p>

        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError('');
          }}
          placeholder="在这里写下你的回信..."
          rows={5}
          maxLength={1000}
          className="w-full px-4 py-3 rounded-xl bg-tony-darker border border-tony-border text-tony-text placeholder-tony-muted/50 focus:outline-none focus:border-tony-border-hover transition-colors resize-none"
        />

        <div className="flex items-center justify-between mt-3">
          <span
            className={`text-xs ${charCount > 1000 ? 'text-red-400' : 'text-tony-muted'}`}
          >
            {charCount} / 1000
          </span>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleSubmitClick}
            disabled={submitting || !content.trim()}
            className="flex-1 py-2.5 rounded-xl bg-[#c4a574]/20 border border-[#c4a574]/40 text-[#c4a574] font-medium hover:bg-[#c4a574]/30 transition-all duration-300 disabled:opacity-40"
          >
            {submitting ? '提交中...' : '提交回信'}
          </button>
        </div>
      </div>

      {/* 二次确认弹窗 */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="确认提交">
        <div className="text-center py-4">
          <p className="text-tony-text mb-6">
            这封回信提交后将无法修改，<br />确认把它交给老师吗？
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-xl bg-[#c4a574]/20 border border-[#c4a574]/40 text-[#c4a574] font-medium hover:bg-[#c4a574]/30 transition-all"
            >
              确认交给老师
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-6 py-2 rounded-xl bg-tony-text/5 border border-tony-border text-tony-muted hover:text-tony-text transition-all"
            >
              我再想想
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
