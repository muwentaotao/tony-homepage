import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import StudentLoginForm from '../components/graduation/StudentLoginForm';
import GraduationEnvelope from '../components/graduation/GraduationEnvelope';
import GraduationCard from '../components/graduation/GraduationCard';
import ExpectedScoreReveal from '../components/graduation/ExpectedScoreReveal';
import StudentReplyForm from '../components/graduation/StudentReplyForm';
import StudentReplyView from '../components/graduation/StudentReplyView';
import GraduationClosed from '../components/graduation/GraduationClosed';
import GraduationReadonlyNotice from '../components/graduation/GraduationReadonlyNotice';
import GraduationSuccessAnimation from '../components/graduation/GraduationSuccessAnimation';

export default function GraduationPage() {
  const [phase, setPhase] = useState('loading'); // loading, login, closed, envelope, content
  const [studentData, setStudentData] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = '/api/graduation/student';

  const fetchMessage = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE}/message`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem('graduation_token');
          setPhase('login');
          return;
        }
        setError(data.error || '获取留言失败');
        setPhase('login');
        return;
      }

      if (data.settingsStatus === 'closed') {
        setPhase('closed');
        return;
      }

      setStudentData(data);
      setIsFirstLogin(data.isFirstLogin);
      setPhase('envelope');
    } catch (err) {
      setError('网络错误，请刷新页面重试');
      setPhase('login');
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('graduation_token');
    if (token) {
      fetchMessage(token);
    } else {
      setPhase('login');
    }
  }, [fetchMessage]);

  const handleLogin = (token, firstLogin) => {
    setIsFirstLogin(firstLogin);
    fetchMessage(token);
  };

  const handleEnvelopeOpen = () => {
    setTimeout(() => setPhase('content'), 500);
  };

  const handleCardAnimationDone = () => {
    setCardReady(true);
  };

  const handleReplySubmit = async (content) => {
    const token = sessionStorage.getItem('graduation_token');
    const res = await fetch(`${API_BASE}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || '提交失败');
    }

    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    // 刷新数据以显示已提交的回信
    const token = sessionStorage.getItem('graduation_token');
    fetchMessage(token);
  };

  // 加载中
  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-tony-muted text-sm">正在打开你的毕业留言...</div>
      </div>
    );
  }

  // 板块关闭
  if (phase === 'closed') {
    return <GraduationClosed />;
  }

  // 登录页
  if (phase === 'login') {
    return (
      <div className="min-h-screen relative">
        {error && (
          <div className="absolute top-4 left-0 right-0 text-center z-30">
            <span className="inline-block px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm">
              {error}
            </span>
          </div>
        )}
        <StudentLoginForm onLogin={handleLogin} />
      </div>
    );
  }

  // 信封动画
  if (phase === 'envelope') {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <GraduationEnvelope onOpenComplete={handleEnvelopeOpen} />
      </div>
    );
  }

  // 内容展示
  const isReadonly = studentData?.settingsStatus === 'readonly';
  const canSubmit = studentData?.canSubmitReply && !isReadonly;
  const hasReplied = studentData?.hasReplied;

  return (
    <div className="min-h-screen px-5 py-12 relative">
      {/* 返回主站 */}
      <Link
        to="/"
        className="absolute top-5 left-5 sm:top-8 sm:left-8 text-sm text-tony-muted hover:text-tony-text transition-colors duration-300 flex items-center gap-2 z-20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回主站
      </Link>

      <div className="max-w-xl mx-auto pt-10">
        {/* 毕业卡片 */}
        <GraduationCard
          name={studentData.name}
          className={studentData.className}
          teacherMessage={studentData.teacherMessage}
          teacherName={studentData.teacherName}
          teacherMessageAt={studentData.teacherMessageAt}
          isFirstLogin={isFirstLogin}
          onAnimationComplete={handleCardAnimationDone}
        />

        {/* 期望分数 */}
        {cardReady && (
          <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <ExpectedScoreReveal
              expectedScore={studentData.expectedScore}
              disabled={!cardReady}
            />
          </div>
        )}

        {/* 只读提示 */}
        {cardReady && isReadonly && <GraduationReadonlyNotice />}

        {/* 回信区域 */}
        {cardReady && canSubmit && (
          <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <StudentReplyForm
              onSubmit={handleReplySubmit}
              disabled={isReadonly}
            />
          </div>
        )}

        {cardReady && hasReplied && !canSubmit && (
          <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <StudentReplyView
              reply={studentData.reply}
              replyCreatedAt={studentData.replyCreatedAt}
              replyHidden={studentData.replyHidden}
            />
          </div>
        )}
      </div>

      {/* 提交成功动画 */}
      {showSuccess && (
        <GraduationSuccessAnimation onComplete={handleSuccessComplete} />
      )}
    </div>
  );
}
