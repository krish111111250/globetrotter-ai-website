import React from 'react';

const Admin = () => {
  const stats = [
    { label: 'Total Users', value: '1,284', trend: '+12%', color: 'text-blue-600' },
    { label: 'Active Trips', value: '452', trend: '+5%', color: 'text-green-600' },
    { label: 'Avg. Budget', value: '$2,400', trend: '-2%', color: 'text-purple-600' },
    { label: 'AI Chats Today', value: '890', trend: '+40%', color: 'text-orange-600' },
  ];

  const popularDestinations = [
    { city: 'Paris', trips: 124, growth: 'High' },
    { city: 'Tokyo', trips: 98, growth: 'Stable' },
    { city: 'Bali', trips: 85, growth: 'Rising' },
    { city: 'New York', trips: 62, growth: 'Stable' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#F8FAFC]">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#102C57] italic uppercase tracking-tighter">Admin Control Center</h1>
        <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase">Odoo Feature #13: Platform Analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] font-bold text-gray-400">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Destination Trends Table */}
        <div className="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-xl border border-gray-50">
          <h2 className="text-xl font-black text-[#102C57] mb-6 uppercase tracking-tight">Top Travel Trends</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                  <th className="pb-4">City</th>
                  <th className="pb-4">Total Trips</th>
                  <th className="pb-4">Demand</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {popularDestinations.map((dest, i) => (
                  <tr key={i} className="group hover:bg-gray-50 transition-all">
                    <td className="py-4 font-bold text-[#102C57]">{dest.city}</td>
                    <td className="py-4 text-gray-500 font-medium">{dest.trips}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                        dest.growth === 'High' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {dest.growth}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-[10px] font-black text-gray-300 group-hover:text-blue-600 uppercase">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Engagement Radar (Visual Placeholder) */}
        <div className="bg-[#102C57] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
          <h2 className="text-xl font-black italic mb-2">User Feedback</h2>
          <p className="text-blue-300 text-[10px] font-bold uppercase mb-8">Sentiment: 94% Positive</p>
          
          <div className="space-y-6">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
              <p className="text-xs italic text-blue-100">"The AI Chatbot saved me 3 hours of planning for my Tokyo trip!"</p>
              <p className="text-[9px] font-black mt-2 uppercase text-white">— User #2849</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/5 opacity-60">
              <p className="text-xs italic text-blue-100">"Shared itineraries are so easy to use with my family."</p>
              <p className="text-[9px] font-black mt-2 uppercase text-white">— User #1102</p>
            </div>
          </div>

          {/* Decorative Graph Element */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-500/20 to-transparent flex items-end px-4 gap-1">
             {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
               <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-blue-400/30 rounded-t-sm"></div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;