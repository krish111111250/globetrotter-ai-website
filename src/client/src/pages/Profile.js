import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../api';

const Profile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // 1. DATA RECOVERY LOGIC
    const getStoredData = () => {
        const userDataRaw = localStorage.getItem('userData');
        const userData = userDataRaw ? JSON.parse(userDataRaw) : null;

        return {
            id: localStorage.getItem('userId'),
            email: (userData && userData.email) || localStorage.getItem('userEmail') || '',
            firstName: (userData && userData.firstName) || '', // Often part of userName, splitting might be needed if stored separately
            lastName: (userData && userData.lastName) || '',
            // KEY FIX: Check userPhoto directly if not in userData object
            photo: (userData && userData.profileImage) || localStorage.getItem('userPhoto') || '',
            phone: (userData && userData.phone) || localStorage.getItem('userPhone') || '',
            city: (userData && userData.city) || localStorage.getItem('userCity') || '',
            country: (userData && userData.country) || localStorage.getItem('userCountry') || '',
            bio: (userData && userData.additionalInfo) || localStorage.getItem('userBio') || ''
        };
    };

    const initialData = getStoredData();

    // If names are not split in storage but exist as userName
    const [formData, setFormData] = useState({
        firstName: initialData.firstName || localStorage.getItem('userName')?.split(' ')[0] || '',
        lastName: initialData.lastName || localStorage.getItem('userName')?.split(' ').slice(1).join(' ') || '',
        email: initialData.email,
        phone: initialData.phone,
        city: initialData.city,
        country: initialData.country,
        bio: initialData.bio,
        profileImage: initialData.photo
    });

    // SECURITY CHECK
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateUser(initialData.id, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                country: formData.country,
                additionalInfo: formData.bio,
                profileImage: formData.profileImage
            });

            // Update localStorage
            const updatedUser = {
                ...JSON.parse(localStorage.getItem('userData') || '{}'),
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                country: formData.country,
                additionalInfo: formData.bio,
                profileImage: formData.profileImage
            };
            
            // Sync all keys
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
            localStorage.setItem('userEmail', formData.email);
            localStorage.setItem('userPhone', formData.phone);
            localStorage.setItem('userCity', formData.city);
            localStorage.setItem('userCountry', formData.country);
            localStorage.setItem('userBio', formData.bio);
            if (formData.profileImage) {
                localStorage.setItem('userPhoto', formData.profileImage);
            }
            
            alert("✅ Profile synchronized and saved successfully!");
            // Optional: navigate('/dashboard'); // Stay on page to see changes
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("❌ Failed to update profile.");
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] p-6 lg:p-12 relative overflow-hidden">
            
            {/* LOGO & BACK NAVIGATION */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-[#102C57] p-2 rounded-xl shadow-lg">
                        <span className="text-white text-xl">✈️</span>
                    </div>
                    <h2 className="text-[#102C57] font-black italic tracking-tighter text-2xl uppercase">Globetrotter</h2>
                </div>
                <button 
                    onClick={handleBack}
                    className="text-[#102C57] font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-[50px] shadow-2xl overflow-hidden border border-gray-100">
                
                {/* 1. PROFILE HEADER */}
                <div className="bg-[#102C57] p-12 text-white flex flex-col items-center relative">
                    <div className="relative group cursor-pointer" onClick={handleImageClick}>
                        <div className="w-36 h-36 bg-white rounded-full border-4 border-blue-400/30 overflow-hidden flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105">
                            {formData.profileImage ? (
                                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <span className="text-[#102C57] text-4xl mb-1">👤</span>
                                    <span className="text-[#102C57] text-[9px] font-black uppercase tracking-widest text-center px-2">Upload Photo</span>
                                </div>
                            )}
                        </div>
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold uppercase tracking-widest">Change</span>
                        </div>
                        
                        <div 
                            className="absolute bottom-1 right-1 bg-blue-500 w-10 h-10 rounded-full border-4 border-[#102C57] flex items-center justify-center shadow-lg group-hover:bg-blue-400 transition-colors"
                        >
                            <span className="text-white text-xs">📸</span>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            className="hidden" 
                            accept="image/*" 
                        />
                    </div>
                    <h2 className="text-3xl font-black mt-6 tracking-tighter uppercase italic">{formData.firstName}'s Profile</h2>
                    <p className="text-blue-300 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 opacity-70">
                        Verified Traveler: {formData.email}
                    </p>
                </div>

                {/* 2. USER DETAILS GRID */}
                <div className="p-10 lg:p-16 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="profile-label">First Name</label>
                            <input name="firstName" type="text" className="profile-input" value={formData.firstName} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="profile-label">Last Name</label>
                            <input name="lastName" type="text" className="profile-input" value={formData.lastName} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="profile-label">Email Address (Sync Enabled)</label>
                            <input name="email" type="email" className="profile-input bg-gray-50 opacity-80" value={formData.email} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="profile-label">Phone Number</label>
                            <input name="phone" type="text" className="profile-input" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="profile-label">City</label>
                            <input name="city" type="text" className="profile-input" value={formData.city} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="profile-label">Country</label>
                            <input name="country" type="text" className="profile-input" value={formData.country} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="profile-label">Additional Information / Bio</label>
                            <textarea 
                                name="bio"
                                rows="4" 
                                className="profile-input resize-none" 
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about your travel style..."
                            ></textarea>
                        </div>
                    </div>

                    {/* ACTION BUTTON */}
                    <div className="pt-6 flex justify-center">
                        <button 
                            onClick={handleUpdate}
                            className="bg-[#102C57] text-white px-16 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-blue-900 transition-all hover:scale-105 active:scale-95"
                        >
                            Save Secure Changes
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .profile-label {
                    display: block; font-size: 10px; font-weight: 900; text-transform: uppercase;
                    letter-spacing: 0.15em; color: #94A3B8; margin-bottom: 8px; margin-left: 4px;
                }
                .profile-input {
                    width: 100%; padding: 16px 20px; background: #F8FAFC; border: 2px solid #E2E8F0;
                    border-radius: 18px; font-size: 14px; font-weight: 700; color: #102C57;
                    transition: all 0.2s; outline: none;
                }
                .profile-input:focus {
                    border-color: #102C57; background: white; box-shadow: 0 10px 20px rgba(16,44,87,0.05);
                }
            `}</style>
        </div>
    );
};

export default Profile;
