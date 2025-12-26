import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserPlus, Lock, Building2, Globe, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Logic: Automatically redirect to login after successful signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Process: Handle Personal Gmail or CodeNest IDs
    const email = identifier.includes('@') ? identifier : `${identifier}@codenest.com`;
    
    const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
            data: {
                full_name: identifier.split('@')[0], // Saves name prefix temporarily
            }
        }
    });

    if (error) {
      alert("Registration Error: " + error.message);
    } else {
      alert("REQUEST TRANSMITTED: Sir Rabnawaz has received your node registry. Please await permission on the Login terminal.");
      // Optional: Clear form
      setIdentifier('');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cnDarkGreen flex flex-col items-center justify-center p-4 font-sans selection:bg-cnLightGreen selection:text-white">
      
      {/* SHRUNK CONTAINER (Matching 80% look) */}
      <div className="bg-cnWhite w-full max-w-[340px] rounded-[35px] shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden animate-in border border-white/5">
        
        {/* DESIGNER HEADER */}
        <div className="bg-cnDarkGreen p-9 text-white text-center relative overflow-hidden group">
           <Globe size={100} className="absolute -right-4 -bottom-4 opacity-5 group-hover:rotate-12 transition-transform duration-1000"/>
           <div className="flex justify-center mb-3">
              <div className="bg-cnLightGreen/20 p-2 rounded-xl border border-cnLightGreen/20 backdrop-blur-md shadow-inner">
                <UserPlus size={22} className="text-cnLightGreen"/>
              </div>
           </div>
           <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none">Create Node</h1>
           <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mt-2">Tier-01 Staff Registry</p>
        </div>

        {/* REGISTRATION FORM */}
        <form onSubmit={handleSignup} className="p-8 space-y-5 bg-white shadow-inner">
           <div className="space-y-1.5">
             <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic ml-1 leading-none">Authentication ID</label>
             <div className="relative">
                <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200" />
                <input 
                  type="text" 
                  required 
                  placeholder="name@gmail.com" 
                  className="w-full bg-slate-50 border border-slate-100 pl-11 p-4 rounded-2xl text-[11px] font-black italic text-cnDarkGreen outline-none focus:ring-1 focus:ring-cnLightGreen transition-all uppercase placeholder:opacity-20 shadow-sm" 
                  onChange={e => setIdentifier(e.target.value)} 
                  value={identifier}
                />
             </div>
           </div>

           <div className="space-y-1.5">
             <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic ml-1 leading-none">Pass Key Entry</label>
             <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-100 pl-11 p-4 rounded-2xl text-[11px] font-black italic text-cnDarkGreen outline-none focus:ring-1 focus:ring-cnLightGreen transition-all shadow-sm tracking-widest" 
                  onChange={e => setPassword(e.target.value)} 
                  value={password}
                />
             </div>
           </div>

           <div className="pt-2">
             <button 
                disabled={loading} 
                className="w-full bg-cnDarkGreen text-white py-5 rounded-[22px] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-cnLightGreen transition-all active:scale-95 group flex items-center justify-center gap-3 italic"
              >
                {loading ? (
                    <div className="animate-pulse flex items-center gap-2">
                        <ShieldCheck size={14}/> Synchronizing...
                    </div>
                ) : (
                  "Initiate Signup"
                )}
             </button>
           </div>

           <div className="mt-8 pt-4 border-t border-slate-50 flex flex-col items-center gap-4">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-loose italic text-center max-w-[200px]">By signing up, you await Boss Permission Protocol from Sir Rabnawaz.</p>
              
              <button 
                type="button" 
                onClick={() => window.location.href = '/'} // Returns to main page (login)
                className="flex items-center gap-2 text-cnGrey hover:text-cnLightGreen text-[9px] font-black uppercase tracking-widest transition-colors duration-300 italic group"
              >
                 <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform"/> Terminate & Return to Login
              </button>
           </div>
        </form>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-6 text-[8px] font-black text-white/20 uppercase tracking-[0.5em] italic">
         System Ver: 1.0.9 Alpha / 2025 Operation
      </div>
    </div>
  );
}