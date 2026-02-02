import React, { useState, useEffect } from 'react';
import { fetchDestinations } from '../api';

const CitySearch = () => {
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState([]);
  const CATEGORY_IMAGES = {
    All: [
      { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80', label: 'Explore' },
      { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', label: 'Discover' },
      { src: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80', label: 'Journey' },
    ],
    Beach: [
      { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', label: 'Beach' },
      { src: 'https://images.unsplash.com/photo-1501959915551-4e8a04a2f2b5?w=800&q=80', label: 'Coast' },
      { src: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=800&q=80', label: 'Sea' },
    ],
    Mountain: [
      { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', label: 'Mountain' },
      { src: 'https://images.unsplash.com/photo-1500048993953-d23a4365e0df?w=800&q=80', label: 'Peak' },
      { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', label: 'Trail' },
    ],
    Urban: [
      { src: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80', label: 'Urban' },
      { src: 'https://images.unsplash.com/photo-1488747279002-c8523379faaa?w=800&q=80', label: 'City' },
      { src: 'https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=800&q=80', label: 'Skylines' },
    ],
    Historical: [
      { src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', label: 'Historical' },
      { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', label: 'Heritage' },
      { src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', label: 'Culture' },
    ],
    Culinary: [
      { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', label: 'Culinary' },
      { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', label: 'Cuisine' },
      { src: 'https://images.unsplash.com/photo-1473090310263-e6c23b065941?w=800&q=80', label: 'Taste' },
    ],
  };
  const normalized = search.toLowerCase();
  const selectedCategory =
    normalized.includes('mountain') ? 'Mountain' :
    normalized.includes('beach') ? 'Beach' :
    normalized.includes('urban') ? 'Urban' :
    normalized.includes('histor') ? 'Historical' :
    normalized.includes('culin') || normalized.includes('food') ? 'Culinary' :
    'All';

  useEffect(() => {
    loadDestinations();
  }, [search]);

  const loadDestinations = async () => {
    try {
      const { data } = await fetchDestinations(search);
      setCities(data.destinations);
    } catch (err) {
      console.error("Failed to fetch destinations", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* Header Content */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-serif italic text-aero-900 mb-2">Destinations</h1>
          <div className="flex items-center gap-3">
            <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.4em]">Global Scouter</span>
            <div className="h-px w-12 bg-aero-200"></div>
            <span className="text-aero-400 font-bold text-[10px] uppercase tracking-widest">Find Your Next Adventure</span>
          </div>
        </div>
      </div>

      {/* Search Hero */}
      <section className="space-y-6">
        <div className="max-w-2xl relative group">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
          <input
            type="text"
            placeholder="Search city, country or vibe..."
            className="w-full pl-16 pr-6 py-6 bg-white border-2 border-white rounded-[2.5rem] shadow-glass font-display font-bold text-aero-900 focus:outline-none focus:border-primary-400 transition-all text-lg"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>

      </section>

      {/* Discovery Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {['Beach', 'Mountain', 'Urban', 'Historical', 'Culinary'].map(tag => (
          <button
            key={tag}
            onClick={() => setSearch(tag)}
            className={`px-6 py-2.5 rounded-full border text-[10px] font-black tracking-widest transition-all
              ${selectedCategory === tag ? 'bg-aero-900 text-white border-aero-900' : 'bg-white text-aero-600 border-aero-100 hover:bg-aero-200'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {CATEGORY_IMAGES[selectedCategory].map((img, idx) => (
          <div key={idx} className="glass-card rounded-2xl overflow-hidden">
            <div className="h-48 w-full overflow-hidden">
              <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-aero-900">{img.label}</p>
              <span className="text-[10px] font-black text-aero-500 tracking-widest">Featured</span>
            </div>
          </div>
        ))}
      </div>

      {/* Results Grid */}
      <div className="grid gap-10 pb-20">
        {cities.length > 0 ? (
          cities.map(city => (
            <div key={city.id} className="group glass-panel p-2 flex flex-col md:flex-row items-stretch min-h-[420px] hover:shadow-2xl transition-all duration-700">
              <div className="md:w-2/5 h-72 md:h-auto overflow-hidden relative rounded-[2rem]">
                <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-6 left-6 glass-panel px-4 py-1.5 border-white/40">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Trending 🚀</span>
                </div>
              </div>

              <div className="flex-1 p-10 flex flex-col justify-between bg-white/40 backdrop-blur-md rounded-[2.5rem] rounded-l-none md:-ml-8 z-10">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-4xl font-serif italic text-aero-900">{city.name}</h3>
                      <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mt-1">{city.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-aero-400 uppercase tracking-widest mb-1">Cost Index</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={`w-1.5 h-4 rounded-full ${i <= 3 ? 'bg-accent-gold' : 'bg-aero-100'}`}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-aero-600 font-medium leading-relaxed max-w-lg italic">
                    "{city.description}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-6">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[9px] font-black text-aero-400 uppercase tracking-widest mb-1">Climate</p>
                      <p className="text-xs font-bold text-aero-900 uppercase">Temperate</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-aero-400 uppercase tracking-widest mb-1">Best For</p>
                      <p className="text-xs font-bold text-aero-900 uppercase">Couples</p>
                    </div>
                  </div>

                  <button className="bg-aero-900 text-white px-10 py-5 rounded-2xl font-display font-black uppercase text-[10px] tracking-widest transition-all shadow-lg hover:shadow-primary-900/40 hover:-translate-y-1 active:scale-95">
                    EXPLORE DESTINATION
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 glass-card rounded-[3rem]">
            <span className="text-6xl mb-6 block">🌋</span>
            <h3 className="text-2xl font-serif italic text-aero-900">Destination Foggy</h3>
            <p className="text-aero-400 font-black text-[10px] uppercase tracking-widest mt-2">Adjust your coordinates and try again</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitySearch;
