import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const trips = [
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    coords: [48.8566, 2.3522],
    date: '2023 年 4 月',
  },
  {
    id: 'dolomites',
    city: 'Dolomites',
    country: 'Italy',
    coords: [46.6167, 12.3000],
    date: '2022 年 9 月',
  },
  {
    id: 'kyoto',
    city: 'Kyoto',
    country: 'Japan',
    coords: [35.0116, 135.7681],
    date: '2022 年 11 月',
  },
];

export default function TravelMap({ onMarkerClick, activeId }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [35, 20],
      zoom: 2,
      zoomControl: false,
      attributionControl: false,
      minZoom: 1,
      maxZoom: 8,
      scrollWheelZoom: false,
    });

    // CartoDB Dark Matter 深色底图
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // 移动端添加 zoom 控件
    if (window.innerWidth <= 640) {
      L.control.zoom({ position: 'bottomright' }).addTo(map);
    }

    mapInstance.current = map;

    // 创建标记
    trips.forEach((trip) => {
      const icon = L.divIcon({
        className: 'travel-map-marker',
        html: `<div class="marker-dot ${activeId === trip.id ? 'active' : ''}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker(trip.coords, { icon }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:system-ui,sans-serif;text-align:center;">
          <div style="font-weight:500;color:#f0f0f0;margin-bottom:2px;">${trip.city}</div>
          <div style="font-size:12px;color:#9ca3af;">${trip.country} · ${trip.date}</div>
        </div>`,
        { offset: [0, -10], closeButton: false }
      );

      marker.on('click', () => {
        onMarkerClick?.(trip.id);
      });

      markersRef.current[trip.id] = marker;
    });

    return () => {
      map.remove();
      mapInstance.current = null;
      markersRef.current = {};
    };
  }, []);

  // 当 activeId 变化时，更新标记样式和弹出层
  useEffect(() => {
    if (!mapInstance.current) return;

    trips.forEach((trip) => {
      const marker = markersRef.current[trip.id];
      if (!marker) return;

      const el = marker.getElement();
      if (el) {
        const dot = el.querySelector('.marker-dot');
        if (dot) {
          if (activeId === trip.id) {
            dot.classList.add('active');
            marker.openPopup();
          } else {
            dot.classList.remove('active');
            marker.closePopup();
          }
        }
      }
    });

    // 如果 activeId 存在，将地图平滑移动到对应位置
    if (activeId) {
      const trip = trips.find((t) => t.id === activeId);
      if (trip) {
        mapInstance.current.flyTo(trip.coords, 4, {
          duration: 1.2,
          easeLinearity: 0.25,
        });
      }
    } else {
      mapInstance.current.flyTo([35, 20], 2, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [activeId]);

  return <div ref={mapRef} className="w-full h-full" />;
}
