import { useState, useEffect } from 'react';

export default function GraduationSuccessAnimation({ onComplete }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => onComplete && onComplete(), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/90 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`text-center transition-all duration-700 ${
          visible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#c4a574]/10 flex items-center justify-center">
          <svg
            className={`w-10 h-10 text-[#c4a574] transition-all duration-500 ${
              visible ? 'scale-100' : 'scale-0'
            }`}
            style={{ transitionDelay: '300ms' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2
          className={`text-xl font-medium text-tony-text mb-2 transition-all duration-500 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          回信已交给老师
        </h2>
        <p
          className={`text-sm text-tony-muted transition-all duration-500 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          感谢你的真诚回应
        </p>
      </div>
    </div>
  );
}
