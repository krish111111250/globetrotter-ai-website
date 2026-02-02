import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            
            {/* NAVIGATION BAR */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div></div> {/* Spacer to keep layout if needed, or just remove branding */}
                
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                        <button className="hover:text-[#102C57] transition-colors">Explore</button>
                        <button className="hover:text-[#102C57] transition-colors">My Trips</button>
                        <button className="hover:text-[#102C57] transition-colors">Community</button>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-black text-[10px] hover:bg-red-50 hover:text-red-600 transition-all uppercase tracking-widest"
                    >
                        Logout ⎋
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-[1400px] mx-auto">
                
                {/* BANNER IMAGE */}
                <div className="relative w-full h-[450px] rounded-[50px] overflow-hidden shadow-2xl mb-12 group">
                    <img 
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80" 
                        alt="Travel Banner" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102C57]/80 to-transparent flex flex-col justify-end p-12">
                        <p className="text-blue-300 text-xs font-black uppercase tracking-[0.4em] mb-3">Welcome Back, Traveler</p>
                        <h1 className="text-white text-6xl font-black uppercase italic tracking-tighter leading-none">
                            Your Next Adventure <br/> Starts Here.
                        </h1>
                    </div>
                </div>

                {/* --- SEARCH & CONTROLS SECTION --- */}
                <div className="flex flex-col lg:flex-row gap-6 items-end justify-between mb-12">
                    
                    {/* Search Bar with Label and Icon */}
                    <div className="w-full lg:w-1/3">
                        <label className="text-[10px] font-black uppercase text-[#102C57] mb-2 ml-2 block tracking-widest">Search for...</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Find your destination..." 
                                className="dashboard-control-input w-full pl-12"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Group, Filter, Sort Lined Up Horizontally */}
                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-2 block tracking-widest">Group by</label>
                            <select className="dashboard-control-select min-w-[140px]">
                                <option>Recent</option>
                                <option>Region</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-2 block tracking-widest">Filter</label>
                            <button className="dashboard-control-select min-w-[140px] text-left">All Trips</button>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-2 block tracking-widest">Sort by</label>
                            <select className="dashboard-control-select min-w-[140px]">
                                <option>Date</option>
                                <option>Priority</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* PLAN A TRIP BUTTON */}
                <div className="flex justify-center mt-20">
                    <button 
                        onClick={() => navigate('/create-trip')}
                        className="group relative bg-[#102C57] text-white px-12 py-6 rounded-3xl font-black uppercase text-sm tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(16,44,87,0.4)] hover:bg-blue-900 transition-all hover:-translate-y-2 active:scale-95"
                    >
                        <span className="flex items-center gap-4">
                           Plan A New Trip <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                        </span>
                    </button>
                </div>

            </main>

            {/* PAGE DECORATION */}
            <div className="fixed bottom-10 right-10 opacity-10 pointer-events-none">
                <span className="text-[150px] select-none">✈️</span>
            </div>

            {/* STYLES FOR CONTROLS */}
            <style jsx>{`
                .dashboard-control-input {
                    padding: 14px 20px;
                    background: white;
                    border: 2px solid #E2E8F0;
                    border-radius: 18px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #102C57;
                    transition: all 0.2s;
                }
                .dashboard-control-input:focus {
                    outline: none;
                    border-color: #102C57;
                }
                .dashboard-control-select {
                    padding: 14px 20px;
                    background: white;
                    border: 2px solid #E2E8F0;
                    border-radius: 18px;
                    font-size: 12px;
                    font-weight: 800;
                    color: #102C57;
                    cursor: pointer;
                }
            `}</style>

        </div>
    );
};

export default Dashboard;