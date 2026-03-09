import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === "/";
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Explore', path: '/city-search', icon: '🏙️' },
    { label: 'My Trips', path: '/itinerary-view', icon: '📍' },
    { label: 'Community', path: '/collaborate', icon: '🌐' },
    { label: 'AI Suite', path: '/ai-chat', icon: '🤖' },
  ];

  if (isAuthPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#102C57] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 md:gap-3">
          <span className="text-lg md:text-xl font-black tracking-tight">GLOBETROTTER</span>
        </button>
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors
                ${location.pathname === item.path ? 'bg-white text-[#102C57]' : 'hover:bg-white/10'}`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/create-trip" className="bg-white text-[#102C57] px-4 py-2 rounded-md text-sm font-black hover:bg-aero-200 transition-all">
            + New Trip
          </Link>
          <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/10">Profile</Link>
          <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/10">Logout</button>
        </div>
        <button className="md:hidden px-3 py-2 rounded-md hover:bg-white/10" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-6 py-3 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors
                  ${location.pathname === item.path ? 'bg-white text-[#102C57]' : 'hover:bg-white/10'}`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/create-trip" onClick={() => setOpen(false)} className="bg-white text-[#102C57] px-4 py-2 rounded-md text-sm font-black">
              + New Trip
            </Link>
            <div className="flex gap-2">
              <Link to="/profile" onClick={() => setOpen(false)} className="flex-1 px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/10">Profile</Link>
              <button onClick={() => { setOpen(false); handleLogout(); }} className="flex-1 px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/10">Logout</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
