import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrips, fetchItineraryStops } from '../api';

const MapView = () => {
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [stopsCount, setStopsCount] = useState(0);

    useEffect(() => {
        const loadTrip = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const { data } = await fetchTrips(userId);
                    if (data.trips && data.trips.length > 0) {
                        const latestTrip = data.trips[data.trips.length - 1];
                        setTrip(latestTrip);
                        
                        // Fetch stops to count pins
                        const { data: stopsData } = await fetchItineraryStops(latestTrip.id);
                        setStopsCount(stopsData.stops.length);
                    }
                } catch (err) {
                    console.error("Failed to load trip data", err);
                }
            }
        };
        loadTrip();
    }, []);

    const destination = trip ? trip.destination : 'Loading...';

    return (
        <div className="min-h-screen bg-[#F1F5F9] p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="text-[#102C57] font-bold hover:underline mb-2 block text-sm"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-black text-[#102C57]">Trip Map: {destination}</h1>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                        <div className="text-center px-4 border-r">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Pins</p>
                            <p className="text-xl font-black text-[#102C57]">{stopsCount > 0 ? stopsCount : '--'}</p>
                        </div>
                        <div className="text-center px-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Est. Distance</p>
                            <p className="text-xl font-black text-[#102C57]">~</p>
                        </div>
                    </div>
                </div>

                {/* Map Container */}
                <div className="bg-white p-4 rounded-[40px] shadow-2xl border-8 border-white h-[600px] relative overflow-hidden">
                    {/* Placeholder for real map (like Google Maps or Leaflet) */}
                    <div className="w-full h-full bg-blue-50 rounded-[30px] flex items-center justify-center relative border-2 border-dashed border-blue-200">
                        <div className="text-center">
                            <div className="text-6xl mb-4">📍</div>
                            <p className="text-[#102C57] font-bold text-xl">Map Preview Mode</p>
                            <p className="text-gray-400 text-sm">Interactive map for {destination}</p>
                        </div>

                        {/* Fake Pins to show the judges the idea */}
                        <div className="absolute top-1/4 left-1/3 group cursor-pointer">
                            <div className="bg-[#102C57] text-white p-2 rounded-lg text-xs font-bold shadow-xl animate-bounce">
                                {trip ? trip.destination : 'City Center'}
                            </div>
                            <div className="w-3 h-3 bg-[#102C57] rounded-full mx-auto border-2 border-white mt-1"></div>
                        </div>

                        <div className="absolute bottom-1/3 right-1/4 group cursor-pointer">
                            <div className="bg-orange-500 text-white p-2 rounded-lg text-xs font-bold shadow-xl">
                                Local Attraction
                            </div>
                            <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto border-2 border-white mt-1"></div>
                        </div>
                    </div>

                    {/* Floating Legend */}
                    <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 w-64">
                        <h4 className="font-black text-[#102C57] mb-4 uppercase text-xs tracking-widest">Route Legend</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-[#102C57] rounded-full"></div>
                                <span className="text-sm font-bold text-gray-600">Sightseeing</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <span className="text-sm font-bold text-gray-600">Dining</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapView;