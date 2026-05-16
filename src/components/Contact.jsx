import useScrollReveal from '../hooks/useScrollReveal';

const contacts = [
  {
    label: 'Email',
    value: 'muwentaotao@gmail.com',
    href: 'mailto:muwentaotao@gmail.com',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'muwentaotao',
    href: 'https://github.com/muwentaotao',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export default function Contact() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="contact"
      ref={ref}
      className={`section-padding py-16 sm:py-20 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="mb-10 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-light text-tony-text mb-2">
            Say Hello
          </h2>
          <p className="text-tony-muted text-sm">
            欢迎交流、合作或只是打个招呼
          </p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-tony-ice to-transparent mx-auto mt-4" />
        </div>

        {/* 联系方式 */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              className="glass-card rounded-xl px-6 py-4 flex items-center gap-4 group"
            >
              <div className="text-tony-ice group-hover:text-tony-text transition-colors duration-300">
                {contact.icon}
              </div>
              <div>
                <div className="text-xs text-tony-muted mb-0.5">{contact.label}</div>
                <div className="text-sm text-tony-text">{contact.value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
