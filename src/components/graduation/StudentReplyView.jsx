export default function StudentReplyView({ reply, replyCreatedAt, replyHidden }) {
  if (replyHidden) {
    return (
      <div className="mt-8 w-full max-w-lg mx-auto text-center">
        <div className="glass-card rounded-2xl p-8">
          <svg
            className="w-10 h-10 mx-auto mb-3 text-[#c4a574]/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <p className="text-tony-muted text-sm">这封回信已被老师收藏</p>
        </div>
      </div>
    );
  }

  const dateStr = replyCreatedAt
    ? new Date(replyCreatedAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="mt-8 w-full max-w-lg mx-auto">
      <div
        className="rounded-2xl p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(196,165,116,0.08) 0%, rgba(196,165,116,0.04) 100%)',
          border: '1px solid rgba(196,165,116,0.15)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-[#c4a574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-[#c4a574]">你的回信</span>
        </div>

        <p className="text-tony-text text-base leading-relaxed whitespace-pre-wrap">{reply}</p>

        {dateStr && (
          <p className="text-right text-xs text-tony-muted mt-4">{dateStr}</p>
        )}
      </div>
    </div>
  );
}
