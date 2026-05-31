import { useState } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import Modal from './Modal';

const entries = [
  {
    title: '2026 届毕业留言',
    subtitle: 'Graduation 2026',
    description: '老师写给你的专属毕业留言，只属于你。',
    to: '/graduation',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: '关于我',
    subtitle: 'About Tony',
    description: '关于我是谁，以及我正在做什么。',
    to: null,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: '我去过的地方',
    subtitle: 'Travel Map',
    description: '我去过的地方、照片和路线记忆。',
    to: '/travel',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: '我做过的东西',
    subtitle: 'Things I Built',
    description: '一些用 AI 和 Vibe Coding 做出来的小作品。',
    to: null,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: '个人说明书',
    subtitle: 'Manual',
    description: '一份写给别人，也写给自己的个人说明书。',
    to: null,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export default function EntryCards() {
  const { ref, isVisible } = useScrollReveal();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        ref={ref}
        className={`section-padding py-16 sm:py-20 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {entries.map((entry) => {
              if (entry.to) {
                return (
                  <Link
                    key={entry.title}
                    to={entry.to}
                    className="glass-card rounded-xl p-6 cursor-pointer group block"
                  >
                    <div className="text-tony-ice mb-4 group-hover:text-tony-text transition-colors duration-300">
                      {entry.icon}
                    </div>
                    <h3 className="text-lg font-medium text-tony-text mb-1">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-tony-gold-bright mb-2 opacity-70">
                      {entry.subtitle}
                    </p>
                    <p className="text-sm text-tony-muted">
                      {entry.description}
                    </p>
                  </Link>
                );
              }
              return (
                <div
                  key={entry.title}
                  className="glass-card rounded-xl p-6 cursor-pointer group"
                  onClick={() => setModalOpen(true)}
                >
                  <div className="text-tony-ice mb-4 group-hover:text-tony-text transition-colors duration-300">
                    {entry.icon}
                  </div>
                  <h3 className="text-lg font-medium text-tony-text mb-1">
                    {entry.title}
                  </h3>
                  <p className="text-sm text-tony-gold-bright mb-2 opacity-70">
                    {entry.subtitle}
                  </p>
                  <p className="text-sm text-tony-muted">
                    {entry.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Coming Soon"
      >
        这个部分还在慢慢完善中。
      </Modal>
    </>
  );
}
