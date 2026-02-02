import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchActivities } from '../api';

const ActivitySearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        loadActivities();
    }, [searchQuery]);

    const loadActivities = async () => {
        try {
            const { data } = await fetchActivities(searchQuery);
            setActivities(data.activities);
        } catch (err) {
            console.error("Failed to fetch activities", err);
        }
    };

    // Filter by category helper (client-side for categories buttons, or mixed)
    // Actually the backend handles search, but category buttons might want strict filtering.
    // Let's rely on backend search for simplicity or do client side filtering if fetched all.
    // The current implementation fetches all if query is empty.
    // If user clicks a category, we can set searchQuery to that category.
    
    return (
        <div className="min-h-screen bg-[#F1F5F9] p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="mb-8 flex items-center gap-2 text-[#102C57] font-bold hover:underline"
                >
                    ← Back to Dashboard
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-[#102C57] mb-4 tracking-tight">Discover Experiences</h1>
                    <div className="relative max-w-xl mx-auto">
                        <input 
                            type="text" 
                            className="w-full p-5 pl-12 rounded-2xl border-none shadow-xl focus:ring-2 focus:ring-[#102C57] outline-none font-medium"
                            placeholder="Try searching 'Museum' or 'Food'..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute left-4 top-5 text-xl">🔍</span>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar justify-center">
                    {['All', 'Culture', 'Food', 'Adventure', 'Romantic'].map((cat) => (
                        <button 
                            key={cat} 
                            onClick={() => setSearchQuery(cat === 'All' ? '' : cat)}
                            className={`whitespace-nowrap px-6 py-2 rounded-full font-bold transition-all shadow-sm active:scale-95 ${
                                (searchQuery === cat || (cat === 'All' && searchQuery === '')) 
                                ? 'bg-[#102C57] text-white' 
                                : 'bg-white text-[#102C57] border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Activity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {activities.length > 0 ? activities.map((act) => (
                        <div key={act.id} className="bg-white rounded-3xl overflow-hidden shadow-lg group hover:-translate-y-2 transition-all">
                            <div className="h-48 overflow-hidden relative">
                                <img 
                                    src={act.img} 
                                    alt={act.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-[#102C57] uppercase">
                                    {act.category}
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-[#102C57] leading-tight text-lg">{act.name}</h3>
                                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">⭐ {act.rating}</span>
                                </div>
                                <div className="flex justify-between items-center mt-6">
                                    <span className="text-xl font-black text-[#102C57]">{act.price}</span>
                                    <button className="bg-[#102C57] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#1a417a] transition-colors shadow-md active:scale-90">
                                        + Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-400 font-bold text-xl">No activities found for "{searchQuery}"</p>
                            <button onClick={() => setSearchQuery('')} className="text-[#102C57] underline mt-2 font-bold">Clear search</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivitySearch;