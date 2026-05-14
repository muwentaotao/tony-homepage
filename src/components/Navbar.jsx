import { useState, useEffect } from 'react';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Travel', href: '#travel' },
  { label: 'Built', href: '#built' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="mx-3 sm:mx-6 mt-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 py-3 rounded-xl border border-tony-border bg-[#0a0a0f]/70 backdrop-blur-xl">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-tony-text font-light tracking-tight text-lg hover:opacity-80 transition-opacity"
          >
            Tony
          </a>
          <div className="flex items-center gap-5 sm:gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="text-sm text-tony-muted hover:text-tony-text transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
