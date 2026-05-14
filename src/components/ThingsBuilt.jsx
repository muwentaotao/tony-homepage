import useScrollReveal from '../hooks/useScrollReveal';

const projects = [
  {
    title: '历史时间轴网站',
    description: '用横向时间轴重新整理历史事件，让历史像地图一样展开。',
    status: 'Planning / Building',
  },
  {
    title: '历史梗大集合',
    description: '把历史课上有趣的梗、段子和知识点整理成一个轻松入口。',
    status: 'Idea',
  },
  {
    title: '新的点子正在路上',
    description: '还有一些关于教学、旅行和 AI 的小项目，正在慢慢成形。',
    status: 'Coming Soon',
  },
];

export default function ThingsBuilt() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="built"
      ref={ref}
      className={`section-padding py-16 sm:py-20 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-light text-tony-text mb-2">
            Things I Built
          </h2>
          <div className="w-12 h-px bg-gradient-to-r from-tony-ice to-transparent" />
        </div>

        {/* 项目卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {projects.map((project) => (
            <div
              key={project.title}
              className="glass-card rounded-xl p-6 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-tony-darker border border-tony-border flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-tony-ice"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <span className="text-xs text-tony-muted px-2 py-1 rounded-full border border-tony-border">
                  {project.status}
                </span>
              </div>
              <h3 className="text-lg font-medium text-tony-text mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-tony-muted leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
