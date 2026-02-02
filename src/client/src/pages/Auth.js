import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    phone: '', city: '', country: '', additionalInfo: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
        navigate('/dashboard');
    }
  }, [navigate]);

  // Handle Photo Upload & Storage
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        // Store photo immediately so it's ready for profile
        localStorage.setItem('userPhoto', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  // Google Login Bypass for Demo
  const handleGoogleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', 'Traveler Admin');
    localStorage.setItem('userEmail', 'admin@globetrotter.com');
    navigate('/dashboard');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // --- SECURE LOGIN CHECK ---
        const { data } = await loginUser({ email: formData.email, password: formData.password });
        
        localStorage.setItem('isAuthenticated', 'true');
        const user = data.user;
        
        // IMPORTANT: Move stored data to active session keys for Profile page
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', `${user.firstName} ${user.lastName}`);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userPhone', user.phone || '');
        localStorage.setItem('userCity', user.city || '');
        localStorage.setItem('userCountry', user.country || '');
        localStorage.setItem('userBio', user.additionalInfo || '');
        
        // Use backend image if available, else check if user just uploaded one (rare for login but possible if they switched modes)
        if (user.profileImage) {
            localStorage.setItem('userPhoto', user.profileImage);
        }
        
        navigate('/dashboard');
      } else {
        // --- REGISTRATION LOGIC ---
        await registerUser({
            ...formData,
            profileImage: localStorage.getItem('userPhoto') // Use the uploaded photo if any
        });
        
        alert("Registration Successful! Now use your email to sign in.");
        setIsLogin(true); // Switch to login view
        setError('');
        setFormData(prev => ({ ...prev, password: '' })); // Clear password for safety
      }
    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || "Authentication failed.";
        setError(msg === "Invalid email or password" ? "Incorrect Email or Password. Please try again." : msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-4">
      
      {/* BRANDING LOGO */}
      <div className="flex items-center gap-3 mb-6 self-start md:ml-10">
        <div className="bg-[#102C57] p-2 rounded-xl shadow-lg flex items-center justify-center">
           <span className="text-white text-xl">✈️</span>
        </div>
        <h2 className="text-[#102C57] font-black italic tracking-tighter text-2xl uppercase">Globetrotter</h2>
      </div>

      <div className="w-full max-w-[480px] bg-white rounded-[50px] shadow-[0_40px_80px_-15px_rgba(16,44,87,0.25)] border border-white overflow-hidden relative">
        
        {/* HEADER SECTION */}
        <div className="bg-[#102C57] pt-14 pb-24 px-10 text-center relative">
            <div className="flex justify-center mb-3">
              <span className="text-4xl">✈️</span>
            </div>
            <h1 className="text-white text-3xl font-black uppercase tracking-[0.25em] italic leading-none">Globetrotter</h1>
            <p className="text-blue-300 text-[10px] font-bold uppercase mt-3 tracking-[0.3em] opacity-70">Travel Systems v2.0</p>
            
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-45px]">
                {!isLogin && (
                  <label className="cursor-pointer block animate-bounce-short group">
                      <div className="w-24 h-24 rounded-full border-[6px] border-white bg-slate-50 shadow-xl flex items-center justify-center overflow-hidden transition-all group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-200">
                          {profileImage ? (
                              <div className="relative w-full h-full">
                                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <span className="text-white text-[10px] font-black uppercase">Change</span>
                                  </div>
                              </div>
                          ) : (
                              <div className="text-center p-2 flex flex-col items-center">
                                  <span className="text-2xl mb-1">📸</span>
                                  <p className="text-[7px] font-black text-slate-400 uppercase leading-tight">Click to<br/>Add Photo</p>
                              </div>
                          )}
                      </div>
                      <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                )}
                {isLogin && (
                  <div 
                      onClick={() => setIsLogin(false)}
                      className="w-24 h-24 rounded-full border-[6px] border-white bg-slate-100 shadow-xl flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-blue-50 transition-all group relative"
                  >
                      <span className="text-3xl mb-1">🔒</span>
                      <p className="text-[7px] font-black text-slate-400 uppercase leading-tight">
                          Login Mode
                      </p>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-2xl mb-1">👤</span>
                          <p className="text-[8px] font-black text-[#102C57] uppercase text-center leading-tight">
                              New?<br/>Create Profile
                          </p>
                      </div>
                  </div>
                )}
            </div>
        </div>

        <div className="p-10 pt-16">
          <div className="flex justify-center gap-8 mb-8">
            <button onClick={() => { setIsLogin(true); setError(''); }} className={`text-[11px] font-black tracking-widest uppercase transition-all ${isLogin ? 'text-[#102C57] border-b-2 border-[#102C57] pb-1' : 'text-slate-300'}`}>Sign In</button>
            <button onClick={() => { setIsLogin(false); setError(''); }} className={`text-[11px] font-black tracking-widest uppercase transition-all ${!isLogin ? 'text-[#102C57] border-b-2 border-[#102C57] pb-1' : 'text-slate-300'}`}>Register</button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6">
              <p className="text-red-600 text-[10px] font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isLogin ? (
              <>
                <input name="email" type="email" placeholder="Email Address" className="sketch-input" onChange={handleInputChange} required />
                <div className="relative">
                    <input 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        className="sketch-input" 
                        onChange={handleInputChange} 
                        required 
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-wider hover:text-[#102C57]"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <input name="firstName" placeholder="First Name" className="sketch-input" onChange={handleInputChange} required />
                <input name="lastName" placeholder="Last Name" className="sketch-input" onChange={handleInputChange} required />
                <input name="email" type="email" placeholder="Email" className="sketch-input col-span-2" onChange={handleInputChange} required />
                <div className="col-span-2 relative">
                    <input 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        className="sketch-input w-full" 
                        onChange={handleInputChange} 
                        required 
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-wider hover:text-[#102C57]"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                <input name="city" placeholder="City" className="sketch-input" onChange={handleInputChange} />
                <input name="country" placeholder="Country" className="sketch-input" onChange={handleInputChange} />
              </div>
            )}

            <button type="submit" className="w-full bg-[#102C57] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-900 active:scale-95 transition-all mt-2">
              {isLogin ? 'Access System →' : 'Complete Registration'}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-8 text-center">
            <hr className="border-slate-100" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[9px] font-black text-slate-300 uppercase">Or</span>
          </div>

          {/* GOOGLE BUTTON */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border-2 border-slate-100 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5" />
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Continue with Google</span>
          </button>
        </div>
      </div>

      <style>{`
        .sketch-input {
          width: 100%;
          padding: 14px 20px;
          background: #F8FAFC;
          border: 2px solid #F1F5F9;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 700;
          color: #102C57;
          transition: all 0.2s;
        }
        .sketch-input:focus {
          outline: none;
          border-color: #102C57;
          background: white;
          box-shadow: 0 10px 20px rgba(16,44,87,0.05);
        }
      `}</style>
    </div>
  );
};

export default Auth;
