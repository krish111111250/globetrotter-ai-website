import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Import All Project Pages
import Auth from './pages/Auth';
import Dashboard from './components/Dashboard';
import CreateTrip from './pages/CreateTrip';
import ItineraryView from './pages/ItineraryView';
import BudgetTracker from './pages/BudgetTracker';
import ActivitySearch from './pages/ActivitySearch';
import Profile from './pages/Profile';
import Collaborate from './pages/Collaborate';
import MapView from './pages/MapView';
import AIChat from './pages/AIChat';
import Checklist from './pages/Checklist';
import Weather from './pages/Weather';
import Summary from './pages/Summary';
import CalendarView from './pages/CalendarView';

// Requirement Modules
import ItineraryBuilder from './pages/ItineraryBuilder';
import CitySearch from './pages/CitySearch';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-aero-100 font-sans selection:bg-primary-100/50">
        <Navbar />
        <main className="pt-20 pb-12 px-6 max-w-7xl mx-auto">
          <Routes>
            {/* 1. Auth & Entry */}
            <Route path="/" element={<Auth />} />

            {/* 2. Core Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 3. Planning & Itinerary */}
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/itinerary-view" element={<ItineraryView />} />
            <Route path="/itinerary-builder" element={<ItineraryBuilder />} />
            <Route path="/shared/:tripId" element={<ItineraryView isPublic={true} />} />

            {/* 5. Logistics */}
            <Route path="/budget" element={<BudgetTracker />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/calendar" element={<CalendarView />} />

            {/* 6. Search & Exploration */}
            <Route path="/search" element={<ActivitySearch />} />
            <Route path="/city-search" element={<CitySearch />} />
            <Route path="/map" element={<MapView />} />

            {/* 7. AI & Collaboration */}
            <Route path="/collaborate" element={<Collaborate />} />
            <Route path="/ai-chat" element={<AIChat />} />

            {/* 8. Profile & Admin */}
            <Route path="/summary" element={<Summary />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="border-t mt-12 py-8 text-center text-sm text-aero-500">
          © {new Date().getFullYear()} Globetrotter. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
