import { useState } from 'react';
import TravelMap from '../components/TravelMap';

const stats = [
  { number: '3', label: '个国家' },
  { number: '3', label: '座城市' },
  { number: '2022', label: '年开始' },
];

const trips = [
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    date: '2023 年 4 月',
    photo: '/travel/travel-1.jpg',
    note: '在卢浮宫待了一整天，发现历史课本上的图片和站在原作面前完全不是一回事。',
  },
  {
    id: 'dolomites',
    city: 'Dolomites',
    country: 'Italy',
    date: '2022 年 9 月',
    photo: '/travel/travel-2.jpg',
    note: '山里的云走得很快，下午的一场暴雨让山谷变成了水墨画。',
  },
  {
    id: 'kyoto',
    city: 'Kyoto',
    country: 'Japan',
    date: '2022 年 11 月',
    photo: '/travel/travel-3.jpg',
    note: '清晨的清水寺没有游客，只有钟声和红叶。',
  },
];

export default function TravelPage() {
  const [activeId, setActiveId] = useState(null);

  const handleMarkerClick = (id) => {
    setActiveId(id);
    // 滚动到对应卡片
    const card = document.getElementById(`travel-card-${id}`);
    if (card) {
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-8 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight mb-3 text-gradient">
          Places I've Been
        </h1>
        <p className="text-tony-muted text-base max-w-md mx-auto">
          点击地图上的光点，看看我在那里留下了什么。
        </p>
      </section>

      {/* 统计 */}
      <div className="flex gap-4 justify-center px-6 pb-8 flex-wrap">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass-card rounded-xl px-6 py-3 text-center transition-all duration-300 hover:-translate-y-1"
          >
            <span className="text-xl font-light text-tony-text block">{s.number}</span>
            <span className="text-xs text-tony-muted">{s.label}</span>
          </div>
        ))}
      </div>

      {/* 地图 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div
          className="rounded-2xl overflow-hidden border border-tony-border"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(148,163,184,0.04)',
            height: 'clamp(320px, 45vh, 500px)',
          }}
        >
          <TravelMap onMarkerClick={handleMarkerClick} activeId={activeId} />
        </div>
      </section>

      {/* 卡片列表 */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-xl sm:text-2xl font-light text-tony-text mb-2">旅行档案</h2>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-tony-ice to-transparent mx-auto" />
        </div>

        <div className="space-y-5">
          {trips.map((trip) => (
            <div
              key={trip.id}
              id={`travel-card-${trip.id}`}
              className={`glass-card rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-[200px_1fr] transition-all duration-500 cursor-pointer ${
                activeId === trip.id
                  ? 'border-tony-border-hover shadow-[0_0_30px_rgba(148,163,184,0.1)]'
                  : ''
              }`}
              onMouseEnter={() => setActiveId(trip.id)}
              onMouseLeave={() => setActiveId(null)}
            >
              <div className="h-48 sm:h-auto overflow-hidden">
                <img
                  src={trip.photo}
                  alt={trip.city}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-lg font-medium text-tony-text">{trip.city}</span>
                  <span className="text-xs text-tony-muted px-2.5 py-1 rounded-full border border-tony-border bg-tony-card/50">
                    {trip.country}
                  </span>
                  <span className="text-xs text-tony-muted ml-auto sm:ml-0">{trip.date}</span>
                </div>
                <p className="text-sm text-tony-muted leading-relaxed pl-3 border-l-2 border-tony-border">
                  {trip.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
