import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWeather, fetchTrips } from '../api';

const Weather = () => {
    const navigate = useNavigate();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWeather = async () => {
            try {
                // Default to Paris
                let city = 'Paris';
                
                // Try to get user's upcoming trip
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const { data } = await fetchTrips(userId);
                    if (data.trips && data.trips.length > 0) {
                        const latestTrip = data.trips[data.trips.length - 1];
                        city = latestTrip.destination;
                    }
                }

                const { data } = await fetchWeather(city);
                setWeather(data);
            } catch (err) {
                console.error("Failed to load weather", err);
            } finally {
                setLoading(false);
            }
        };
        loadWeather();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white font-bold">Loading Forecast...</div>;
    if (!weather) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-6 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="mb-8 text-white font-bold flex items-center gap-2 hover:opacity-80"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-white/20 backdrop-blur-xl rounded-[40px] p-10 border border-white/30 shadow-2xl text-white">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter capitalize">{weather.city}</h1>
                            <p className="text-blue-100 font-bold mt-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="text-center">
                            <span className="text-8xl">{weather.icon}</span>
                            <p className="text-6xl font-black mt-2">{weather.currentTemp}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {weather.forecast.map((f, i) => (
                            <div key={i} className="bg-white/10 p-6 rounded-3xl text-center border border-white/10 hover:bg-white/20 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-2">{f.day}</p>
                                <span className="text-3xl block mb-2">{f.icon}</span>
                                <p className="font-bold text-xl">{f.temp}</p>
                                <p className="text-[10px] font-medium opacity-70">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Travel Tip */}
                <div className="mt-8 bg-[#102C57] p-6 rounded-3xl shadow-xl flex items-center gap-6">
                    <div className="text-3xl">💡</div>
                    <p className="text-white font-medium italic text-sm">
                        "The weather in {weather.city} looks {weather.condition.toLowerCase()} today! Make sure to pack accordingly."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Weather;