import React from 'react';

const ShareModal = ({ isOpen, onClose, tripId }) => {
  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}/shared/${tripId || 'demo-123'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    alert("Link copied to clipboard! Anyone with this link can now view your itinerary.");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔗</span>
          </div>
          <h2 className="text-2xl font-black text-[#102C57] uppercase tracking-tighter">Share Itinerary</h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">Public Access Link</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 break-all text-xs font-mono text-gray-500">
            {publicUrl}
          </div>
          
          <button 
            onClick={copyToClipboard}
            className="w-full bg-[#102C57] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
          >
            Copy Secret Link
          </button>
          
          <button 
            onClick={onClose}
            className="w-full text-gray-400 text-[10px] font-black uppercase tracking-widest pt-2 hover:text-red-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;