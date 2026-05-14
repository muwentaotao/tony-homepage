export default function Hero() {
  const tags = [
    '历史老师',
    '旅行记录者',
    'AI 网页探索者',
    'Vibe Coding 初学者',
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center section-padding overflow-hidden">
      {/* 中心内容 */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* 名字 */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight mb-6 text-gradient drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]">
          Tony
        </h1>

        {/* 主文案 */}
        <p className="text-lg sm:text-xl text-tony-muted leading-relaxed mb-8 max-w-xl mx-auto drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)]">
          一个历史老师的数字世界，记录旅行、想法和正在创造的东西。
        </p>

        {/* 身份标签 */}
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-full text-sm text-tony-ice border border-tony-border bg-tony-card backdrop-blur-glass transition-all duration-300 hover:border-tony-border-hover hover:bg-tony-card-hover"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 向下滚动提示 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-pulse-slow">
          <svg
            className="w-6 h-6 text-tony-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
