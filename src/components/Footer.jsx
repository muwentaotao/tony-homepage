import useScrollReveal from '../hooks/useScrollReveal';

export default function Footer() {
  const { ref, isVisible } = useScrollReveal(0.5);

  return (
    <footer
      ref={ref}
      className={`section-padding py-10 sm:py-12 border-t border-tony-border transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-tony-muted">
          © 2026 Tony. Built with AI & curiosity.
        </p>
        <div className="flex items-center gap-1 text-sm text-tony-muted">
          <span>Made with</span>
          <svg
            className="w-4 h-4 text-tony-gold-bright opacity-70"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>and code</span>
        </div>
      </div>
    </footer>
  );
}
