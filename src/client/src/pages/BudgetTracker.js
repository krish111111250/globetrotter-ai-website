import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExpenses, addExpense, fetchTrips } from '../api';

const BudgetTracker = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // New Expense Form State
  const [newExpense, setNewExpense] = useState({ category: 'Food', amount: '', description: '' });

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
                    
                    // 2. Get Expenses for this trip
                    const { data: expData } = await fetchExpenses(latestTrip.id);
                    setExpenses(expData.expenses);
                }
            } catch (err) {
                console.error("Failed to load budget data", err);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!trip) return alert("No active trip found!");
    
    try {
        await addExpense({
            tripId: trip.id,
            category: newExpense.category,
            amount: parseFloat(newExpense.amount),
            description: newExpense.description,
            date: new Date().toISOString()
        });
        
        // Refresh list
        const { data } = await fetchExpenses(trip.id);
        setExpenses(data.expenses);
        setNewExpense({ category: 'Food', amount: '', description: '' });
    } catch (err) {
        console.error("Failed to add expense", err);
    }
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const getIcon = (cat) => {
      switch(cat) {
          case 'Flights': return '✈️';
          case 'Accommodation': return '🏨';
          case 'Food': return '🍽️';
          case 'Transport': return '🚕';
          case 'Shopping': return '🛍️';
          default: return '💰';
      }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">
        
        <button 
            onClick={() => navigate('/dashboard')}
            className="mb-8 flex items-center gap-2 text-[#102C57] font-bold hover:underline"
        >
            ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-[#102C57] tracking-tight">Budget Analysis</h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.2em] mt-2">
            {trip ? `${trip.destination} Financial Overview` : 'No Trip Selected'}
          </p>
        </div>

        {/* Total Card */}
        <div className="bg-[#102C57] rounded-3xl p-10 text-white shadow-2xl mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-2">Total Estimated Cost</p>
            <h2 className="text-6xl font-black">${total.toLocaleString()}</h2>
            {trip && <p className="mt-2 text-blue-300 font-bold">Budget: ${trip.budget}</p>}
          </div>
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Expense Breakdown */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-[#102C57] mb-6 uppercase tracking-tight">Spending by Category</h3>
            
            {expenses.length === 0 ? (
                <p className="text-gray-400 font-bold text-center py-10">No expenses recorded yet.</p>
            ) : (
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                {expenses.map((item) => (
                    <div key={item.id}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="flex items-center gap-2 font-bold text-gray-700">
                        <span>{getIcon(item.category)}</span> 
                        <div>
                            <p>{item.category}</p>
                            <p className="text-[10px] text-gray-400 uppercase">{item.description}</p>
                        </div>
                        </span>
                        <span className="font-black text-[#102C57]">${item.amount}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div 
                        className="bg-blue-500 h-full rounded-full" 
                        style={{ width: `${Math.min((item.amount / (trip?.budget || total || 1)) * 100, 100)}%` }}
                        ></div>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>

          {/* Add Expense Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-[#102C57] mb-6 uppercase tracking-tight">Add New Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Category</label>
                    <select 
                        className="w-full p-3 bg-gray-50 rounded-xl font-bold text-[#102C57] border-none outline-none"
                        value={newExpense.category}
                        onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                    >
                        <option>Flights</option>
                        <option>Accommodation</option>
                        <option>Food</option>
                        <option>Transport</option>
                        <option>Shopping</option>
                        <option>Activities</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Amount ($)</label>
                    <input 
                        type="number" 
                        required
                        className="w-full p-3 bg-gray-50 rounded-xl font-bold text-[#102C57] border-none outline-none"
                        value={newExpense.amount}
                        onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Description</label>
                    <input 
                        type="text" 
                        className="w-full p-3 bg-gray-50 rounded-xl font-bold text-[#102C57] border-none outline-none"
                        placeholder="e.g. Dinner at Bistro"
                        value={newExpense.description}
                        onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                    />
                </div>
                <button className="w-full bg-[#102C57] text-white font-black uppercase py-4 rounded-xl hover:bg-blue-900 transition-all shadow-lg">
                    + Add Expense
                </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;