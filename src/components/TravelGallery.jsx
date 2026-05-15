import { useState, useEffect } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const places = [
  {
    id: 1,
    src: '/travel/travel-1.jpg',
    title: 'Paris',
    subtitle: 'Museums, streets and evening lights.',
  },
  {
    id: 2,
    src: '/travel/travel-2.jpg',
    title: 'Dolomites',
    subtitle: 'Mountains, lakes and quiet valleys.',
  },
  {
    id: 3,
    src: '/travel/travel-3.jpg',
    title: 'Kyoto',
    subtitle: 'Temples, alleys and old memories.',
  },
];

function TravelCard({ src, title, subtitle }) {
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setHasImage(true);
    img.onerror = () => setHasImage(false);
    img.src = src;
  }, [src]);

  return (
    <div className="glass-card rounded-xl overflow-hidden aspect-[4/3] relative group cursor-pointer">
      {hasImage ? (
        <img
          src={src}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        /* 高级深色渐变占位 */
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f18] via-[#151520] to-[#0a0a12]">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(148, 163, 184, 0.5) 1px, transparent 0)`,
              backgroundSize: '20px 20px',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-tony-muted opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* 底部暗色渐变遮罩 + 文字 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-lg font-medium text-tony-text mb-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          {title}
        </h3>
        <p className="text-sm text-tony-muted drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function TravelGallery() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="travel"
      ref={ref}
      className={`section-padding py-16 sm:py-20 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-light text-tony-text mb-2">
            Some Places I've Been
          </h2>
          <div className="w-12 h-px bg-gradient-to-r from-tony-ice to-transparent" />
        </div>

        {/* 照片卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {places.map((place) => (
            <TravelCard
              key={place.id}
              src={place.src}
              title={place.title}
              subtitle={place.subtitle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
// force redeploy 1778826427
