import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrips, fetchItineraryStops, addItineraryStop, updateItineraryStop, deleteItineraryStop } from '../api';

const ItineraryBuilder = () => {
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                // 1. Get Trips to find current one
                const { data: tripData } = await fetchTrips(userId);
                if (tripData.trips && tripData.trips.length > 0) {
                    const latestTrip = tripData.trips[tripData.trips.length - 1];
                    setTrip(latestTrip);
                    
                    // 2. Get Stops for this trip
                    const { data: stopsData } = await fetchItineraryStops(latestTrip.id);
                    // Parse activities from JSON string to array
                    const formattedStops = stopsData.stops.map(s => ({
                        ...s,
                        activities: JSON.parse(s.activities || '[]')
                    }));
                    setStops(formattedStops);
                }
            } catch (err) {
                console.error("Failed to load itinerary data", err);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  // Update local state immediately, sync to DB on blur/change
  const updateStopLocal = (id, field, value) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, [field]: value } : stop
    ));
  };

  // Sync to DB
  const saveStop = async (stop) => {
      try {
          await updateItineraryStop(stop.id, {
              city: stop.city,
              dates: stop.dates,
              activities: stop.activities
          });
      } catch (err) {
          console.error("Failed to save stop", err);
      }
  };

  // Add a new stop (creates in DB immediately to get ID)
  const addStop = async () => {
    if (!trip) return alert("No active trip found!");
    
    const newStopData = {
      tripId: trip.id,
      city: 'New Destination',
      dates: 'Set Dates',
      activities: []
    };

    try {
        const { data } = await addItineraryStop(newStopData);
        const newStop = { ...newStopData, id: data.stopId };
        setStops([...stops, newStop]);
    } catch (err) {
        console.error("Failed to add stop", err);
    }
  };

  // Remove a stop
  const removeStop = async (id) => {
    try {
        await deleteItineraryStop(id);
        setStops(stops.filter(stop => stop.id !== id));
    } catch (err) {
        console.error("Failed to delete stop", err);
    }
  };

  // Add an activity
  const addActivity = async (stopId) => {
    const activityName = prompt("Enter activity name:");
    if (activityName) {
      const stop = stops.find(s => s.id === stopId);
      const updatedActivities = [...stop.activities, activityName];
      
      // Update local
      const updatedStop = { ...stop, activities: updatedActivities };
      setStops(stops.map(s => s.id === stopId ? updatedStop : s));

      // Sync DB
      await updateItineraryStop(stopId, {
          city: stop.city,
          dates: stop.dates,
          activities: updatedActivities
      });
    }
  };

  // Remove an activity
  const removeActivity = async (stopId, activityIndex) => {
    const stop = stops.find(s => s.id === stopId);
    const updatedActivities = stop.activities.filter((_, i) => i !== activityIndex);
    
    // Update local
    const updatedStop = { ...stop, activities: updatedActivities };
    setStops(stops.map(s => s.id === stopId ? updatedStop : s));

    // Sync DB
    await updateItineraryStop(stopId, {
        city: stop.city,
        dates: stop.dates,
        activities: updatedActivities
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
        <button 
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center gap-2 text-[#102C57] font-bold hover:underline"
        >
            ← Back to Dashboard
        </button>
          <h1 className="text-4xl font-black text-[#102C57] italic uppercase tracking-tighter text-center md:text-left">
            Itinerary Builder
          </h1>
          <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase text-center md:text-left">
            {trip ? `Planning for: ${trip.destination}` : 'Select a trip to start planning'}
          </p>
        </div>
        <button 
          onClick={addStop}
          className="bg-[#102C57] text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-blue-600 transition-all shadow-xl uppercase tracking-widest active:scale-95"
        >
          + Add New Stop
        </button>
      </div>

      {/* Timeline of Stops */}
      <div className="space-y-8 relative">
        {/* Vertical Line Connector */}
        {stops.length > 1 && (
          <div className="absolute left-8 top-10 bottom-10 w-1 bg-blue-100 -z-10 hidden md:block"></div>
        )}

        {stops.map((stop, index) => (
          <div key={stop.id} className="flex flex-col md:flex-row gap-8 items-start group animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stop Number Circle */}
            <div className="bg-white border-4 border-[#102C57] text-[#102C57] w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xl shadow-lg group-hover:bg-[#102C57] group-hover:text-white transition-all">
              {index + 1}
            </div>

            {/* Stop Card */}
            <div className="flex-1 bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 group-hover:border-blue-200 transition-all w-full">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <input 
                    type="text"
                    className="text-2xl font-black text-[#102C57] outline-none border-b-2 border-transparent focus:border-blue-500 bg-transparent w-full"
                    value={stop.city}
                    onChange={(e) => updateStopLocal(stop.id, 'city', e.target.value)}
                    onBlur={() => saveStop(stop)}
                  />
                  <div className="flex items-center gap-2 mt-2 text-gray-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">📅 Duration:</span>
                    <input 
                      type="text"
                      className="text-xs font-bold outline-none bg-blue-50 px-2 py-1 rounded-lg text-blue-600"
                      value={stop.dates}
                      onChange={(e) => updateStopLocal(stop.id, 'dates', e.target.value)}
                      onBlur={() => saveStop(stop)}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => removeStop(stop.id)}
                  className="text-red-300 hover:text-red-600 text-[10px] font-black uppercase transition-colors"
                >
                  Remove Stop ✕
                </button>
              </div>

              {/* Activities Section */}
              <div className="bg-gray-50 p-6 rounded-[24px]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Planned Activities</p>
                <div className="flex flex-wrap gap-3">
                  {stop.activities.map((act, i) => (
                    <span key={i} className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-[#102C57] shadow-sm flex items-center gap-2 border border-gray-100 hover:border-red-200 transition-all">
                      {act} 
                      <button 
                        onClick={() => removeActivity(stop.id, i)}
                        className="text-gray-300 hover:text-red-500 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={() => addActivity(stop.id)}
                    className="border-2 border-dashed border-gray-300 px-4 py-2 rounded-xl text-[10px] font-black text-gray-400 hover:border-[#102C57] hover:text-[#102C57] transition-all uppercase"
                  >
                    + Add Activity
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Action */}
      <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-end gap-6 items-center">
        <button 
            onClick={() => navigate('/dashboard')}
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-all"
        >
          Exit Builder
        </button>
        <button 
          onClick={() => alert("Itinerary Saved!")}
          className="bg-blue-600 text-white px-12 py-5 rounded-[20px] font-black text-xs shadow-2xl hover:bg-blue-700 transition-all uppercase tracking-widest active:scale-95 w-full sm:w-auto"
        >
          Save & Return
        </button>
      </div>
    </div>
  );
};

export default ItineraryBuilder;