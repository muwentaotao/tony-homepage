import { Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Earth3D from './components/Earth3D';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TravelPage from './pages/TravelPage';
import GraduationPage from './pages/GraduationPage';
import GraduationAdminPage from './pages/GraduationAdminPage';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-tony-dark relative">
      {/* 全站固定 3D 夜景地球背景 */}
      <Earth3D currentPath={location.pathname} />

      {/* 全局暗色遮罩 */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(5, 5, 12, 0.25) 0%, rgba(5, 5, 12, 0.5) 50%, rgba(5, 5, 12, 0.82) 100%)',
        }}
      />

      {/* 导航栏 */}
      <Navbar />

      {/* 页面内容 */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/graduation" element={<GraduationPage />} />
          <Route path="/graduation/admin" element={<GraduationAdminPage />} />
        </Routes>
      </div>

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
