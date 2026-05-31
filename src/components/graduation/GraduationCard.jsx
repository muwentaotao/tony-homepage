import { useState, useEffect } from 'react';

export default function GraduationCard({
  name,
  className,
  teacherMessage,
  teacherName,
  teacherMessageAt,
  isFirstLogin,
  onAnimationComplete,
}) {
  const [visible, setVisible] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [messageDone, setMessageDone] = useState(false);

  // 卡片升起
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // 逐字显示留言
  useEffect(() => {
    if (!visible) return;
    if (!isFirstLogin) {
      setDisplayedMessage(teacherMessage);
      setMessageDone(true);
      onAnimationComplete && onAnimationComplete();
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedMessage(teacherMessage.slice(0, i));
      if (i >= teacherMessage.length) {
        clearInterval(interval);
        setMessageDone(true);
        onAnimationComplete && onAnimationComplete();
      }
    }, 45);

    return () => clearInterval(interval);
  }, [visible, isFirstLogin, teacherMessage, onAnimationComplete]);

  const dateStr = teacherMessageAt
    ? new Date(teacherMessageAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div
      className={`w-full max-w-lg mx-auto transition-all duration-1000 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div
        className="rounded-2xl p-8 sm:p-10 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* 装饰角标 */}
        <div
          className="absolute top-0 right-0 w-20 h-20 opacity-10"
          style={{
            background: 'radial-gradient(circle at top right, #c4a574, transparent 70%)',
          }}
        />

        {/* 学生信息 */}
        <div className="text-center mb-6">
          <p className="text-sm text-[#8b7355] mb-1">{className}</p>
          <h2 className="text-2xl font-medium text-[#3d3229]">{name}</h2>
        </div>

        {/* 分隔线 */}
        <div className="w-16 h-px bg-[#c4a574] mx-auto mb-6 opacity-50" />

        {/* 老师留言 */}
        <div className="min-h-[120px] mb-6">
          <p className="text-[#5c4d3c] text-base leading-relaxed whitespace-pre-wrap">
            {displayedMessage}
            {isFirstLogin && !messageDone && (
              <span className="inline-block w-0.5 h-5 bg-[#c4a574] ml-0.5 animate-pulse" />
            )}
          </p>
        </div>

        {/* 老师署名 */}
        <div className="text-right">
          <p className="text-[#8b7355] text-sm">
            —— {teacherName}
          </p>
          {dateStr && (
            <p className="text-[#a89b8c] text-xs mt-1">{dateStr}</p>
          )}
        </div>
      </div>

      {/* 提醒语 */}
      <p
        className={`text-center text-xs text-tony-muted mt-4 transition-opacity duration-700 ${
          messageDone ? 'opacity-100' : 'opacity-0'
        }`}
      >
        这是只属于你的留言，请珍惜保存
      </p>
    </div>
  );
}
