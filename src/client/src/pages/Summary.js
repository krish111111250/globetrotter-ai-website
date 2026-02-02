import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrips } from '../api';

const Summary = () => {
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTrip = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const { data } = await fetchTrips(userId);
                    if (data.trips && data.trips.length > 0) {
                        setTrip(data.trips[data.trips.length - 1]);
                    }
                } catch (err) {
                    console.error("Failed to load trip", err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadTrip();
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-aero-400 font-black text-[10px] uppercase tracking-[0.2em]">Finalizing Ticket Data...</p>
        </div>
    );

    if (!trip) return (
        <div className="text-center py-32 glass-panel rounded-[3rem] max-w-md mx-auto">
            <p className="text-aero-400 font-serif italic text-2xl mb-6">No active dossiers found.</p>
            <button onClick={() => navigate('/create-trip')} className="bg-aero-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-xl active:scale-95 transition-all">Initiate Journey →</button>
        </div>
    );

    const travelDays = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24));

    return (
        <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-20">

            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-serif italic text-aero-900 mb-2">Bon Voyage</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.4em]">Node Confirmed</span>
                        <div className="h-px w-12 bg-aero-200"></div>
                        <span className="text-aero-400 font-bold text-[10px] uppercase tracking-widest">Entry Granted</span>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-aero-600 hover:text-primary-500 transition-all active:scale-95 border border-aero-200"
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Boarding Pass Ticket */}
            <div className="glass-panel p-2 border-white/40 shadow-glass group">
                <div className="bg-white rounded-[3.5rem] overflow-hidden relative border border-aero-50">

                    {/* Top Stripe */}
                    <div className="bg-aero-900 p-10 text-white flex justify-between items-center relative overflow-hidden">
                        <div className="z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Destination Alpha</p>
                            <h2 className="text-5xl font-display font-black leading-none">{trip.destination.toUpperCase()}</h2>
                        </div>
                        <div className="z-10 flex flex-col items-end">
                            <div className="bg-primary-500 p-2 rounded-xl text-xs shadow-lg mb-2">PREMIUM</div>
                            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">Global Access</p>
                        </div>
                        {/* Deco */}
                        <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-[-30deg] translate-x-24"></div>
                    </div>

                    {/* Mid Section */}
                    <div className="p-10 md:p-14 space-y-10 group-hover:bg-aero-50/20 transition-all duration-700">
                        <div className="grid grid-cols-2 gap-12">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-aero-300 uppercase tracking-widest">Initiation Date</p>
                                <p className="text-2xl font-serif italic text-aero-900">{new Date(trip.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[10px] font-black text-aero-300 uppercase tracking-widest">Duration Profile</p>
                                <p className="text-2xl font-serif italic text-aero-900">{travelDays} Sol Days</p>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-aero-100 pt-10">
                            <p className="text-[10px] font-black text-aero-300 uppercase tracking-widest mb-4">Explorer Manifesto</p>
                            <p className="text-lg font-bold text-aero-800 leading-relaxed italic">
                                "{trip.description || 'No specific mission parameters set for this journey.'}"
                            </p>
                        </div>

                        <div className="bg-aero-900/5 p-8 rounded-[2rem] flex justify-between items-center border border-aero-100/50">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">Allocated Credits</span>
                                <span className="text-4xl font-display font-black text-aero-900">${trip.budget}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-aero-400 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Reserved</span>
                            </div>
                        </div>
                    </div>

                    {/* Barcode Segment */}
                    <div className="px-10 pb-12 pt-4 border-t border-aero-50">
                        <div className="h-20 w-full bg-[repeating-linear-gradient(90deg,#0F172A,#0F172A_2px,transparent_2px,transparent_10px)] opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
                        <p className="text-center text-[9px] font-mono text-aero-400 mt-4 tracking-[0.5em] uppercase">GT-2026-NEXUS-{trip.destination.replace(/\s/g, '').toUpperCase()}</p>
                    </div>

                    {/* Perforation Deco */}
                    <div className="absolute bottom-32 -left-4 w-8 h-8 bg-aero-100 rounded-full shadow-inner"></div>
                    <div className="absolute bottom-32 -right-4 w-8 h-8 bg-aero-100 rounded-full shadow-inner"></div>
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="group relative bg-aero-900 text-white px-20 py-5 rounded-[2rem] font-display font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl hover:bg-primary-600 transition-all active:scale-95 overflow-hidden"
                >
                    <span className="relative z-10">Return to Command Center</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
            </div>
        </div>
    );
};

export default Summary;