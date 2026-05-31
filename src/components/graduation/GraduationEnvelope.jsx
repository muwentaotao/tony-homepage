import { useState, useEffect } from 'react';

export default function GraduationEnvelope({ onOpenComplete }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setOpened(true), 300);
    const t2 = setTimeout(() => onOpenComplete && onOpenComplete(), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onOpenComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`relative w-72 h-48 sm:w-96 sm:h-56 transition-all duration-1000 ease-out ${
          opened ? 'scale-105' : 'scale-100'
        }`}
        style={{ perspective: '1000px' }}
      >
        {/* 信封主体 */}
        <div
          className={`absolute inset-0 rounded-lg transition-all duration-1000 ease-out ${
            opened ? 'bg-[#c4a574]' : 'bg-[#b8956a]'
          }`}
          style={{
            boxShadow: opened
              ? '0 20px 60px rgba(0,0,0,0.4)'
              : '0 8px 30px rgba(0,0,0,0.3)',
          }}
        />

        {/* 信封翻盖 */}
        <div
          className="absolute top-0 left-0 right-0 h-1/2 origin-top transition-transform duration-1000 ease-out"
          style={{
            transform: opened ? 'rotateX(180deg)' : 'rotateX(0deg)',
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(180deg, #d4b483 0%, #c4a574 100%)',
            clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
            zIndex: opened ? 0 : 10,
          }}
        />

        {/* 信纸内容（展开后显示） */}
        <div
          className={`absolute left-4 right-4 bottom-2 top-4 rounded bg-[#faf8f5] transition-all duration-1000 ease-out flex items-center justify-center ${
            opened ? 'translate-y-[-60%] opacity-100' : 'translate-y-0 opacity-0'
          }`}
          style={{
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 5,
          }}
        >
          <span className="text-[#8b7355] text-sm tracking-widest">毕业留言</span>
        </div>

        {/* 底部三角形封口 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, #b08d5f 100%)',
            clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
          }}
        />
      </div>

      {/* 展开提示 */}
      <p
        className={`mt-8 text-sm text-tony-muted transition-opacity duration-700 ${
          opened ? 'opacity-0' : 'opacity-100'
        }`}
      >
        正在为你打开专属信封...
      </p>
    </div>
  );
}
