import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrips } from '../api';

const CalendarView = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const targetYear = 2026;

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const { data } = await fetchTrips(userId);
      const newEvents = [];
      data.trips.forEach(trip => {
        newEvents.push({
          date: trip.startDate.split('T')[0],
          title: trip.destination.toUpperCase(),
          color: "bg-aero-900 shadow-lg text-white"
        });
        if (trip.endDate) {
          newEvents.push({
            date: trip.endDate.split('T')[0],
            title: `${trip.destination} (END)`,
            color: "bg-primary-500 shadow-lg text-white"
          });
        }
      });
      setEvents(newEvents);
    } catch (err) {
      console.error("Failed to fetch trips", err);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(targetYear, i, 1);
    return {
      name: date.toLocaleString('default', { month: 'long' }),
      index: i,
      daysInMonth: new Date(targetYear, i + 1, 0).getDate(),
      firstDayOffset: new Date(targetYear, i, 1).getDay()
    };
  });

  const scrollToMonth = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">

      {/* Quick Jump Navigator */}
      <div className="hidden xl:block w-32 shrink-0">
        <div className="sticky top-32 glass-panel p-6 flex flex-col items-center gap-4 border-white/40">
          <p className="text-[9px] font-black text-aero-400 uppercase tracking-widest text-center mb-4">Nav Timeline</p>
          {months.map(m => (
            <button
              key={m.index}
              onClick={() => scrollToMonth(`month-${m.index}`)}
              className="text-[10px] font-black text-aero-600 hover:text-primary-500 hover:scale-125 transition-all uppercase tracking-tighter"
            >
              {m.name.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-16">

        {/* Calendar Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-serif italic text-aero-900 mb-2">{targetYear} Calendar</h1>
            <div className="flex items-center gap-3">
              <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.4em]">Temporal Overview</span>
              <div className="h-px w-12 bg-aero-200"></div>
              <span className="text-aero-400 font-bold text-[10px] uppercase tracking-widest">Global Itinerary Nodes</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-aero-600 hover:text-primary-500 transition-all active:scale-95 border border-aero-200"
          >
            ← Back to Dashboard
          </button>
        </div>

          <div className="w-full md:w-96 relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
            <input
              type="text"
              placeholder="Search chronological events..."
              className="w-full p-5 pl-16 bg-white border-2 border-white rounded-[2rem] shadow-glass font-bold text-aero-900 outline-none focus:border-primary-400 transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        {/* 12 Month Grid Stack */}
        <div className="space-y-32">
          {months.map((month) => (
            <section key={month.index} id={`month-${month.index}`} className="scroll-mt-32">

              <div className="flex items-center gap-8 mb-8">
                <h2 className="text-5xl font-serif italic text-aero-900 leading-none">{month.name}</h2>
                <div className="h-px flex-1 bg-aero-100"></div>
              </div>

              <div className="glass-panel p-2 border-white/40 overflow-hidden">
                <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 border-b border-aero-50 bg-aero-50/30">
                    {daysOfWeek.map(day => (
                      <div key={day} className="p-5 text-center text-[10px] font-black text-aero-300 tracking-[0.3em] font-display">{day}</div>
                    ))}
                  </div>

                  {/* Day Cells */}
                  <div className="grid grid-cols-7 divide-x divide-y divide-aero-50">
                    {[...Array(month.firstDayOffset)].map((_, i) => (
                      <div key={`empty-${i}`} className="min-h-[140px] bg-aero-50/10"></div>
                    ))}

                    {Array.from({ length: month.daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateStr = `${targetYear}-${String(month.index + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      const dailyEvents = events.filter(e =>
                        e.date === dateStr &&
                        (!search || e.title.toLowerCase().includes(search.toLowerCase()))
                      );

                      return (
                        <div key={dayNum} className="min-h-[160px] p-4 relative hover:bg-white transition-all group border-aero-50">
                          <span className="text-lg font-display font-black text-aero-200 group-hover:text-primary-500 transition-colors">
                            {dayNum}
                          </span>
                          <div className="mt-4 space-y-2">
                            {dailyEvents.map((ev, idx) => (
                              <div key={idx} className={`p-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest animate-in zoom-in duration-300 ${ev.color}`}>
                                {ev.title}
                              </div>
                            ))}
                          </div>
                          {/* Hidden decorative circle on hover */}
                          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;