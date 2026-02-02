import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchChecklist, addChecklistItem, toggleChecklistItem } from '../api';

const Checklist = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [newItemText, setNewItemText] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('Essentials');

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return; // Or redirect
        try {
            const { data } = await fetchChecklist(userId);
            // Ensure boolean for completed
            const formatted = data.items.map(i => ({...i, completed: !!i.completed}));
            setItems(formatted);
        } catch (err) {
            console.error("Failed to load checklist", err);
        }
    };

    const toggleItem = async (id, currentStatus) => {
        try {
            await toggleChecklistItem(id, !currentStatus);
            setItems(items.map(item => 
                item.id === id ? { ...item, completed: !item.completed } : item
            ));
        } catch (err) {
            console.error("Failed to toggle item", err);
        }
    };

    const handleAddItem = async () => {
        if (!newItemText.trim()) return;
        const userId = localStorage.getItem('userId');
        if (!userId) return alert("Please login to save your checklist");

        try {
            await addChecklistItem({
                userId,
                text: newItemText,
                category: newItemCategory
            });
            setNewItemText('');
            loadItems();
        } catch (err) {
            console.error("Failed to add item", err);
        }
    };

    const progress = items.length > 0 ? Math.round((items.filter(i => i.completed).length / items.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#F1F5F9] p-6 lg:p-12">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 text-[#102C57] font-bold flex items-center gap-2 hover:underline"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-[#102C57] p-8 text-white">
                        <h2 className="text-3xl font-black tracking-tight">Packing List</h2>
                        <p className="text-blue-200 text-sm mt-1 font-medium">Don't leave anything behind!</p>
                        
                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                                <span>Preparation Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-blue-900/50 h-3 rounded-full overflow-hidden">
                                <div 
                                    className="bg-green-400 h-full transition-all duration-500" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-3">
                        {items.length > 0 ? items.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => toggleItem(item.id, item.completed)}
                                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                                    item.completed 
                                    ? 'bg-green-50 border-green-100 opacity-70' 
                                    : 'bg-gray-50 border-gray-50 hover:border-blue-200'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                        item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                                    }`}>
                                        {item.completed && <span className="text-white text-xs">✓</span>}
                                    </div>
                                    <div>
                                        <p className={`font-bold ${item.completed ? 'line-through text-gray-500' : 'text-[#102C57]'}`}>
                                            {item.text}
                                        </p>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400 font-bold py-8">Your list is empty. Add items below!</p>
                        )}
                    </div>

                    <div className="p-8 bg-gray-50 border-t border-gray-100">
                        <div className="flex flex-col gap-3">
                            <input 
                                type="text" 
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                placeholder="Add new item (e.g. Sunscreen)"
                                className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#102C57] outline-none font-bold text-[#102C57]"
                            />
                            <div className="flex gap-2">
                                <select 
                                    value={newItemCategory}
                                    onChange={(e) => setNewItemCategory(e.target.value)}
                                    className="p-4 rounded-xl border border-gray-200 focus:border-[#102C57] outline-none font-bold text-[#102C57] bg-white flex-1"
                                >
                                    <option value="Essentials">Essentials</option>
                                    <option value="Tech">Tech</option>
                                    <option value="Health">Health</option>
                                    <option value="Clothing">Clothing</option>
                                </select>
                                <button 
                                    onClick={handleAddItem}
                                    className="px-8 py-4 bg-[#102C57] text-white rounded-xl font-bold hover:bg-[#1a417a] transition-all shadow-lg active:scale-95"
                                >
                                    ADD
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checklist;