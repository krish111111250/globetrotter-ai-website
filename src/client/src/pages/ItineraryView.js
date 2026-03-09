import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareModal from '../components/ShareModal';
import { fetchTrips, fetchItineraryStops } from '../api';

const ItineraryView = ({ isPublic = false }) => {
    const navigate = useNavigate();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tripDetails, setTripDetails] = useState(null);
    const [itinerary, setItinerary] = useState([]);

    useEffect(() => {
        const loadTripData = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const { data: tripData } = await fetchTrips(userId);
                    if (tripData.trips && tripData.trips.length > 0) {
                        // Get the most recent trip
                        const latestTrip = tripData.trips[tripData.trips.length - 1];
                        setTripDetails(latestTrip);

                        // Fetch Itinerary Stops
                        const { data: stopsData } = await fetchItineraryStops(latestTrip.id);

                        let viewItinerary = [];

                        if (stopsData.stops && stopsData.stops.length > 0) {
                            // Transform DB stops to View structure
                            viewItinerary = stopsData.stops.map((stop, index) => ({
                                day: index + 1,
                                city: stop.city,
                                activities: JSON.parse(stop.activities || '[]').map((act, i) => ({
                                    id: `${stop.id}-${i}`,
                                    task: act,
                                    expense: "50", // Default expense if not in DB
                                    icon: "📍",
                                    image: `https://source.unsplash.com/random/200x200?travel,${i}` // Fallback image
                                }))
                            }));
                        } else {
                            // GENERATE SUGGESTED ITINERARY (User Request: Day 1 & Day 2 with 3 images each)
                            viewItinerary = [
                                {
                                    day: 1,
                                    city: latestTrip.destination,
                                    activities: [
                                        { id: 'd1-1', task: 'City Walking Tour', expense: '20', icon: '🚶', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400' },
                                        { id: 'd1-2', task: 'Local Museum Visit', expense: '45', icon: '🏛️', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
                                        { id: 'd1-3', task: 'Sunset Dinner', expense: '80', icon: '🍽️', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400' }
                                    ]
                                },
                                {
                                    day: 2,
                                    city: latestTrip.destination,
                                    activities: [
                                        { id: 'd2-1', task: 'Morning Market', expense: '30', icon: '🛍️', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400' },
                                        { id: 'd2-2', task: 'Historical Landmark', expense: '40', icon: '🏰', image: 'https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=400' },
                                        { id: 'd2-3', task: 'Evening River Cruise', expense: '60', icon: '⛴️', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' }
                                    ]
                                }
                            ];
                        }

                        setItinerary(viewItinerary);
                    }
                } catch (err) {
                    console.error("Failed to fetch trip data", err);
                }
            }
        };
        loadTripData();
    }, []);

    const handleExpenseChange = (dayIndex, actId, value) => {
        const newItinerary = [...itinerary];
        const day = newItinerary[dayIndex];
        const act = day.activities.find(a => a.id === actId);
        if (act) act.expense = value;
        setItinerary(newItinerary);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">

            {/* 1. SEARCH & FILTER HEADER */}
            <div className="max-w-6xl mx-auto mb-10">
                <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
                    <div className="flex-1 relative w-full">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2">🔍</span>
                        <input
                            type="text"
                            placeholder="Search in itinerary..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-bold text-[#102C57] outline-none focus:ring-2 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <button className="screen9-filter-btn">Group by</button>
                        <button className="screen9-filter-btn">Filter</button>
                        <button className="screen9-filter-btn">Sort by...</button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                {/* 2. MAIN TITLE */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-black text-[#102C57] italic uppercase tracking-tighter">
                        Itinerary for {tripDetails ? tripDetails.destination : 'Your Trip'}
                    </h1>
                    <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mt-2">
                        Smart Budget & Activity Sync
                    </p>
                </div>

                {/* 3. ACTIVITY GRID HEADER */}
                <div className="hidden md:grid grid-cols-12 gap-6 mb-6 px-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="col-span-2">Timeline</div>
                    <div className="col-span-7 text-center">Physical Activity & Highlights</div>
                    <div className="col-span-3 text-right">Expense ($)</div>
                </div>

                {/* 4. DAY-WISE FLOW */}
                <div className="space-y-20">
                    {itinerary.map((dayGroup, dayIdx) => (
                        <div key={dayGroup.day} className="relative">

                            {/* Day Label */}
                            <div className="absolute -left-4 top-0 z-10">
                                <div className="bg-[#102C57] text-white w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-white">
                                    <span className="text-[8px] font-black uppercase opacity-60">Day</span>
                                    <span className="text-xl font-black">{dayGroup.day}</span>
                                </div>
                            </div>

                            {/* Activities Container */}
                            <div className="ml-16 space-y-6">
                                {dayGroup.activities.map((act, actIdx) => (
                                    <div key={act.id} className="flex flex-col items-center">
                                        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 w-full items-center bg-white p-4 rounded-[20px] md:rounded-[30px] shadow-sm border border-gray-100 hover:border-blue-400 transition-all group overflow-hidden">

                                            {/* IMAGE & Activity (Center) */}
                                            <div className="col-span-12 md:col-span-9 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 md:gap-6 w-full text-center sm:text-left">
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
                                                    <img src={act.image} alt={act.task} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{act.icon} Activity</span>
                                                    <input
                                                        type="text"
                                                        value={act.task}
                                                        className="w-full text-lg md:text-xl font-black text-[#102C57] uppercase tracking-tight outline-none bg-transparent text-center sm:text-left"
                                                        readOnly={isPublic}
                                                    />
                                                </div>
                                            </div>

                                            {/* Expense Box (Right) */}
                                            <div className="col-span-12 md:col-span-3 w-full md:w-auto mt-2 md:mt-0">
                                                <div className="relative">
                                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                                                    <input
                                                        type="number"
                                                        value={act.expense}
                                                        onChange={(e) => handleExpenseChange(dayIdx, act.id, e.target.value)}
                                                        className="w-full p-4 pl-10 bg-[#F8FAFC] text-[#102C57] rounded-[20px] font-black text-base md:text-lg text-center shadow-inner focus:bg-[#102C57] focus:text-white outline-none transition-all"
                                                        placeholder="0"
                                                        readOnly={isPublic}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Connector Arrow */}
                                        {actIdx !== dayGroup.activities.length - 1 && (
                                            <div className="h-8 flex flex-col items-center justify-center opacity-20 my-1">
                                                <div className="w-0.5 h-full bg-[#102C57]"></div>
                                                <div className="text-[#102C57] -mt-1">↓</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 5. SUMMARY ACTION */}
                {!isPublic && (
                    <div className="mt-16 md:mt-20 flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-[#102C57] text-[#102C57] font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all"
                        >
                            Share Itinerary
                        </button>
                        <button
                            onClick={() => navigate('/budget')}
                            className="px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl bg-[#102C57] text-white font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-all"
                        >
                            Full Budget Breakdown
                        </button>
                    </div>
                )}
            </div>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                tripId="paris-999"
            />

            <style jsx>{`
                .screen9-filter-btn {
                    background: #F1F5F9;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 15px;
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #64748B;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                .screen9-filter-btn:hover {
                    background: #102C57;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default ItineraryView;