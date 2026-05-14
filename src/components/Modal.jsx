import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* 弹窗内容 */}
      <div
        className={`relative z-10 max-w-sm w-full mx-4 p-8 rounded-2xl border border-tony-border bg-[#0d0d14]/95 backdrop-blur-xl text-center transition-all duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-tony-muted hover:text-tony-text transition-colors text-2xl leading-none"
          aria-label="关闭"
        >
          ×
        </button>
        <h3 className="text-xl font-medium text-tony-text mb-3">{title}</h3>
        <div className="text-sm text-tony-muted leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
