import useScrollReveal from '../hooks/useScrollReveal';

export default function AboutCard() {
  const { ref, isVisible } = useScrollReveal();
  const tags = [
    '地图爱好者',
    '课堂实验者',
    '终身学习者',
    '影像记录者',
    '好奇收藏家',
  ];

  return (
    <section
      id="about"
      ref={ref}
      className={`section-padding py-16 sm:py-20 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          {/* 头像 */}
          <div className="shrink-0">
            <img
              src="/avatar.png"
              alt="Tony 头像"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-tony-border"
            />
          </div>

          {/* 文字内容 */}
          <div className="text-center sm:text-left flex-1">
            <p className="text-lg sm:text-xl text-tony-text leading-relaxed mb-3">
              一个喜欢历史、旅行、地图和影像的历史老师。
            </p>
            <p className="text-sm text-tony-muted leading-relaxed mb-5">
              我把课堂、旅途和一些突然冒出来的想法，慢慢整理成自己的数字空间。
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs text-tony-muted border border-tony-border bg-tony-card/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
