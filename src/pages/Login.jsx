import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, Building2, ShieldAlert, UserPlus, KeyRound } from 'lucide-react';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false); // Mode Toggle
  const [identifier, setIdentifier] = useState(''); // ID or Gmail
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ID LOGIC: Convert codenest_user to codenest_user@codenest.com if no @ is present
    const formattedEmail = identifier.includes('@') 
      ? identifier 
      : `${identifier}@codenest.com`;

    if (isSignup) {
      // --- SIGNUP LOGIC ---
      const { data, error } = await supabase.auth.signUp({
        email: formattedEmail,
        password: password,
      });

      if (error) {
        alert("Registration Failed: " + error.message);
      } else {
        alert("SUCCESS: Request sent to Code Nest Database. Wait for Sir Rabnawaz to authorize your account.");
        setIsSignup(false); // Send back to login
      }
    } else {
      // --- LOGIN LOGIC ---
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: formattedEmail, 
        password: password 
      });

      if (error) {
        alert("Authentication Failed: " + error.message);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cnDarkGreen flex flex-col items-center justify-center p-4 font-sans selection:bg-cnLightGreen selection:text-white">
      
      <div className="bg-cnWhite w-full max-w-[340px] rounded-[35px] shadow-[0_30px_70px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500 border border-white/10 animate-in">
        
        {/* DYNAMIC HEADER */}
        <div className={`p-8 text-center text-cnWhite relative overflow-hidden group transition-colors duration-500 ${isSignup ? 'bg-cnDarkGreen' : 'bg-cnLightGreen'}`}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
            {isSignup ? <UserPlus size={80} /> : <ShieldAlert size={80} />}
          </div>
          
          <div className="flex justify-center mb-3 relative z-10">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
               {isSignup ? <KeyRound size={24} /> : <Building2 size={24} />}
            </div>
          </div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter uppercase leading-none z-10">
            {isSignup ? "Sign Up" : "Code Nest"}
          </h1>
          <p className="text-[9px] font-black opacity-80 mt-2 uppercase tracking-[0.3em] z-10">
            {isSignup ? "Create Personnel Node" : "Access Terminal v1"}
          </p>
        </div>

        {/* AUTH FORM */}
        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-cnGrey mb-1.5 uppercase tracking-widest italic opacity-60">
                {isSignup ? "Enter Identity (Gmail or ID)" : "Personnel ID / Email"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-cnLightGreen transition-colors">
                  <Mail size={14} />
                </div>
                <input 
                  type="text" 
                  required 
                  placeholder={isSignup ? "user@gmail.com" : "codenest_user"}
                  className="w-full bg-slate-50 border border-slate-100 pl-11 p-3.5 rounded-2xl text-[11px] font-black italic text-cnDarkGreen outline-none focus:bg-white focus:border-cnLightGreen transition-all shadow-inner uppercase tracking-tighter" 
                  onChange={(e) => setIdentifier(e.target.value)} 
                  value={identifier}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-cnGrey mb-1.5 uppercase tracking-widest italic opacity-60">
                {isSignup ? "Create Security Key" : "Security Key"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-cnLightGreen transition-colors">
                  <Lock size={14} />
                </div>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 pl-11 p-3.5 rounded-2xl text-[11px] font-black italic text-cnDarkGreen outline-none focus:bg-white focus:border-cnLightGreen transition-all shadow-inner tracking-widest" 
                  onChange={(e) => setPassword(e.target.value)} 
                  value={password}
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                disabled={loading} 
                className={`w-full text-cnWhite font-black py-4 rounded-2xl shadow-xl transition-all text-[11px] uppercase tracking-[0.2em] italic active:scale-95 border-t border-white/5 
                ${isSignup ? 'bg-cnDarkGreen shadow-cnDarkGreen/20 hover:bg-cnBlack' : 'bg-cnLightGreen shadow-cnLightGreen/20 hover:bg-cnDarkGreen'}`}
              >
                {loading ? (
                   <div className="flex items-center justify-center gap-2 font-mono uppercase text-[9px] tracking-widest">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      Processing...
                   </div>
                ) : (
                  isSignup ? "Submit Join Request" : "Initiate Access"
                )}
              </button>
            </div>
          </form>

          {/* DYNAMIC MODE SWITCHER */}
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <button 
              onClick={() => setIsSignup(!isSignup)}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-cnLightGreen transition-colors italic underline underline-offset-4 decoration-slate-100 hover:decoration-cnLightGreen"
            >
              {isSignup ? "Existing Node? Terminate Registration & Login" : "Awaiting Node Registration? Request Access"}
            </button>
          </div>
        </div>
      </div>
      
      {/* BRAND SLOGAN */}
      <div className="mt-6 text-center space-y-1">
         <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">Code Nest Operations System v1.0.4</p>
         <p className="text-[7px] font-bold text-white/10 uppercase tracking-[0.3em] italic">Encryption Standard: Level 04 Alpha</p>
      </div>
    </div>
  );
}