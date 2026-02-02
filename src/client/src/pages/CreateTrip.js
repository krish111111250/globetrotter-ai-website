import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip, fetchDestinations } from '../api';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: '2000',
        travelers: '1',
        description: ''
    });
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [finderQuery, setFinderQuery] = useState('');
    const [finderLoading, setFinderLoading] = useState(false);
    const [finderResults, setFinderResults] = useState([]);
    const [finderError, setFinderError] = useState('');

    const suggestions = [
        { id: 1, name: 'Paris', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400' },
        { id: 2, name: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
        { id: 3, name: 'Tokyo', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
        { id: 4, name: 'Alps', img: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=400' },
        { id: 5, name: 'Santorini', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400' },
        { id: 6, name: 'Canyon', img: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400' },
    ];

    const CATEGORY_IMAGES = {
        Beach: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
            'https://images.unsplash.com/photo-1501959915551-4e8a04a2f2b5?w=800&q=80',
            'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=800&q=80',
        ],
        Mountain: [
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
            'https://images.unsplash.com/photo-1500048993953-d23a4365e0df?w=800&q=80',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        ],
        Urban: [
            'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
            'https://images.unsplash.com/photo-1488747279002-c8523379faaa?w=800&q=80',
            'https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=800&q=80',
        ],
        Historical: [
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
        ],
        Culinary: [
            'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
            'https://images.unsplash.com/photo-1473090310263-e6c23b065941?w=800&q=80',
        ],
    };

    const resolveCategory = (place) => {
        if (place?.category) return place.category;
        const name = String(place?.name || '').toLowerCase();
        if (name.includes('bali') || name.includes('maldives') || name.includes('santorini')) return 'Beach';
        if (name.includes('alps') || name.includes('banff') || name.includes('patagonia')) return 'Mountain';
        if (name.includes('paris') || name.includes('tokyo') || name.includes('new york')) return 'Urban';
        if (name.includes('rome') || name.includes('athens') || name.includes('cairo')) return 'Historical';
        if (name.includes('osaka') || name.includes('naples') || name.includes('bangkok')) return 'Culinary';
        return 'Urban';
    };

    const debouncedQuery = useMemo(() => finderQuery.trim(), [finderQuery]);

    useEffect(() => {
        let active = true;
        const run = async () => {
            setFinderLoading(true);
            setFinderError('');
            const query = debouncedQuery || '';
            try {
                const { data } = await fetchDestinations(query);
                if (!active) return;
                setFinderResults(data?.destinations || []);
            } catch (e) {
                if (!active) return;
                setFinderError('Unable to fetch places. Please try again.');
                setFinderResults([]);
            } finally {
                if (active) setFinderLoading(false);
            }
        };
        const t = setTimeout(run, 400);
        return () => {
            active = false;
            clearTimeout(t);
        };
    }, [debouncedQuery]);

    const toStars = (popularity = '80%') => {
        const pct = Number(String(popularity).replace('%', '')) || 80;
        const val = Math.round((pct / 100) * 10) / 2; // 0–5 in 0.5 steps
        const full = Math.floor(val);
        const half = val - full >= 0.5;
        return { full, half, value: val };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert("Please log in to create a trip.");
            setLoading(false);
            return;
        }

        try {
            await createTrip({ ...formData, userId });
            setLoading(false);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/itinerary-view');
            }, 2000);
        } catch (err) {
            console.error("Failed to create trip", err);
            setLoading(false);
            alert("Failed to create trip. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {showSuccess && (
                <div className="fixed inset-0 bg-aero-900/40 backdrop-blur-2xl z-[200] flex items-center justify-center p-6 text-center">
                    <div className="bg-white/90 p-12 rounded-[3.5rem] shadow-glass border border-white max-w-sm w-full animate-in zoom-in duration-300">
                        <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">✨</div>
                        <h2 className="text-4xl font-serif italic text-aero-900 mb-2">Journey Set.</h2>
                        <p className="text-aero-500 font-black uppercase text-[10px] tracking-[0.3em]">Igniting Itinerary Engines...</p>
                    </div>
                </div>
            )}

            {/* Header Content */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-serif italic text-aero-900 mb-2">New Journey</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.4em]">Itinerary Creator</span>
                        <div className="h-px w-12 bg-aero-200"></div>
                        <span className="text-aero-400 font-bold text-[10px] uppercase tracking-widest">Bespoke Design</span>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-aero-600 hover:text-primary-500 transition-all active:scale-95 border border-aero-200"
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="space-y-6">
                <form onSubmit={handleSubmit}>
                    {/* Box: Destination */}
                    <div className="bg-white border border-aero-200 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-aero-900">Destination</h3>
                            <span className="text-[10px] font-black text-aero-500 tracking-widest">Step 1</span>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-aero-500">Destination Name</label>
                            <input
                                type="text"
                                required
                                className="trip-input text-lg py-4"
                                placeholder="e.g. Kyoto Sunset Expedition"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            />
                        </div>
                        <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-4">
                            {suggestions.map((item) => (
                                <button
                                    type="button"
                                    key={item.id}
                                    className={`group relative aspect-square rounded-xl overflow-hidden border transition-all ${selectedSuggestion === item.id ? 'border-primary-500' : 'border-aero-100 hover:border-primary-500'}`}
                                    onClick={() => {
                                        setSelectedSuggestion(item.id);
                                        setFormData({ ...formData, destination: item.name });
                                    }}
                                >
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/50 text-white text-[10px]">{item.name}</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                            {suggestions.map((item) => (
                                <button
                                    type="button"
                                    key={`pill-${item.id}`}
                                    onClick={() => {
                                        setSelectedSuggestion(item.id);
                                        setFormData({ ...formData, destination: item.name });
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedSuggestion === item.id ? 'bg-aero-900 text-white border-aero-900' : 'bg-white text-aero-700 border-aero-200 hover:bg-aero-200'}`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Box: Discover Real Places */}
                    <div className="bg-white border border-aero-200 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-aero-900">Discover Real Places</h3>
                            <span className="text-[10px] font-black text-aero-500 tracking-widest">Live Finder</span>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm text-aero-500">Search city, country or vibe</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100">🔎</span>
                                <input
                                    type="text"
                                    className="trip-input pl-10"
                                    placeholder="Paris, Bali, Tokyo, Mountain, Beach..."
                                    value={finderQuery}
                                    onChange={(e) => setFinderQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            {finderLoading && (
                                <div className="flex items-center gap-3 text-aero-600">
                                    <div className="w-4 h-4 border-4 border-aero-200 border-t-primary-600 rounded-full animate-spin"></div>
                                    <span className="text-sm font-semibold">Searching places...</span>
                                </div>
                            )}
                            {!finderLoading && finderError && (
                                <p className="text-sm text-red-600 font-semibold">{finderError}</p>
                            )}
                            {!finderLoading && !finderError && finderQuery && finderResults.length === 0 && (
                                <p className="text-sm text-aero-500 font-semibold">No places found. Try different keywords.</p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {finderResults.map((place) => {
                                    const stars = toStars(place.popularity);
                                    const cat = resolveCategory(place);
                                    const gallery = [place.image, ...(CATEGORY_IMAGES[cat] || []).slice(0, 3)];
                                    return (
                                        <div key={place.id} className="glass-card rounded-2xl overflow-hidden border border-aero-100">
                                            <div className="h-40 w-full overflow-hidden">
                                                <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="p-4 flex flex-col gap-2">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-aero-900">{place.name}</h4>
                                                        <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{place.country}</p>
                                                    </div>
                                                    <span className="px-2 py-1 rounded-full bg-aero-100 text-[10px] font-black text-aero-700 uppercase tracking-widest">{place.category}</span>
                                                </div>
                                                <p className="text-sm text-aero-700 line-clamp-2">{place.description}</p>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    {gallery.map((src, i) => (
                                                        <div key={`${place.id}-g-${i}`} className="h-20 w-full overflow-hidden rounded-lg">
                                                            <img src={src} alt={`${place.name} ${i + 1}`} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(stars.full)].map((_, i) => <span key={`s-${place.id}-${i}`}>⭐</span>)}
                                                        {stars.half && <span>⭐️</span>}
                                                        <span className="text-[11px] font-black text-aero-500 tracking-widest ml-2">{stars.value}/5 · {place.popularity}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 rounded-xl bg-aero-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all active:scale-95"
                                                        onClick={() => setFormData({ ...formData, destination: place.name, description: place.description })}
                                                    >
                                                        Use This
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Box: Dates */}
                    <div className="bg-white border border-aero-200 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-aero-900">Travel Dates</h3>
                            <span className="text-[10px] font-black text-aero-500 tracking-widest">Step 2</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-aero-500">Departure</label>
                                <input
                                    type="date"
                                    required
                                    className="trip-input"
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-aero-500">Return</label>
                                <input
                                    type="date"
                                    required
                                    className="trip-input"
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Box: Budget & Travelers */}
                    <div className="bg-white border border-aero-200 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-aero-900">Budget & Travelers</h3>
                            <span className="text-[10px] font-black text-aero-500 tracking-widest">Step 3</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-aero-500">Budget Allocation ($)</label>
                                <input
                                    type="number"
                                    placeholder="2000"
                                    className="trip-input"
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-aero-500">Traveler Type</label>
                                <select
                                    className="trip-input"
                                    onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                                >
                                    <option value="1">Solo Traveler</option>
                                    <option value="2">Couple / Duo</option>
                                    <option value="3">Family Group</option>
                                    <option value="4">Corporate Team</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Box: Notes */}
                    <div className="bg-white border border-aero-200 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-aero-900">Adventure Notes</h3>
                            <span className="text-[10px] font-black text-aero-500 tracking-widest">Step 4</span>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-aero-500">Tell us about the experiences you want</label>
                            <textarea
                                rows="5"
                                className="trip-input"
                                placeholder="Culture, relaxation, hidden gems..."
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="bg-white border border-aero-200 rounded-2xl p-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 font-display font-black text-white py-5 rounded-xl transition-all shadow-lg hover:bg-primary-500 active:scale-95 disabled:opacity-50 text-lg tracking-tight flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>COMMIT JOURNEY <span className="text-xl">⚡</span></>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .trip-input {
                    @apply w-full p-4 bg-aero-50 border-2 border-transparent rounded-2xl focus:border-primary-400 focus:bg-white outline-none font-bold text-aero-900 transition-all placeholder:text-aero-300;
                }
            `}</style>
        </div>
    );
};

export default CreateTrip;
