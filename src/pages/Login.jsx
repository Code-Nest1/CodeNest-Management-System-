import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, Building2, ShieldAlert, UserPlus, KeyRound, User, Loader2 } from 'lucide-react';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false); 
  const [identifier, setIdentifier] = useState(''); 
  const [fullName, setFullName] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // AUTH HANDSHAKE PROTOCOL
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    // SECURITY NORMALIZATION: Removes spaces and forces lowercase for case-insensitivity
    const cleanId = identifier.trim().toLowerCase();
    const formattedEmail = cleanId.includes('@') 
      ? cleanId 
      : `${cleanId}@codenest.com`;

    try {
      if (isSignup) {
        // --- 1. SIGNUP PHASE ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formattedEmail,
          password: password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // --- 2. REGISTRY PHASE: Insert pending profile (Sir Rabnawaz's alert) ---
          const { error: profileError } = await supabase.from('profiles').insert([
            { 
              id: authData.user.id, 
              full_name: fullName.toUpperCase().trim(), 
              role: 'employee', 
              is_approved: false 
            }
          ]);

          if (profileError) throw profileError;

          alert("TRANSMISSION SUCCESS: Personnel node logged. Wait for Sir Rabnawaz to authorize access via HQ Dashboard.");
          setIsSignup(false);
          setFullName('');
          setIdentifier('');
        }
      } else {
        // --- 3. LOGIN PHASE ---
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ 
          email: formattedEmail, 
          password: password 
        });

        if (loginError) {
          if (loginError.message.includes("Email not confirmed")) {
             throw new Error("GATE BLOCKED: Confirm Email is ON in Supabase Auth Settings. Disable it to allow entry.");
          }
          const message = loginError.message === "Invalid login credentials" 
            ? "IDENTIFIER OR CIPHER MISMATCH. RE-CHECK NODE ID." 
            : loginError.message.toUpperCase();
          throw new Error(message);
        }
      }
    } catch (error) {
      alert("TERMINAL ERROR: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* OUTER WRAPPER: Forced absolute position to kill white blank space at bottom */
    <div className="fixed inset-0 h-screen w-screen bg-[#0c3740] flex flex-col items-center justify-center font-sans selection:bg-[#2b945f] selection:text-white overflow-hidden select-none m-0 p-0 border-none">
      
      {/* 80% SCALE BOX */}
      <div className="w-full max-w-[340px] animate-in slide-in-from-bottom-5 duration-700 p-4" style={{ zoom: '0.8' }}>
        
        <div className="bg-white rounded-[35px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden border border-white/5 relative z-10">
            
            {/* ENCRYPTED HEADER */}
            <div className={`p-9 text-center text-white relative overflow-hidden transition-all duration-700 ${isSignup ? 'bg-[#0c3740]' : 'bg-[#2b945f]'}`}>
                <div className="absolute -top-6 -right-6 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                    {isSignup ? <UserPlus size={120} /> : <ShieldAlert size={120} />}
                </div>
                
                <div className="flex justify-center mb-4 relative z-10 font-black">
                    <div className="bg-white/10 p-2.5 rounded-[18px] backdrop-blur-md border border-white/20">
                       {isSignup ? <KeyRound size={26} /> : <Building2 size={26} />}
                    </div>
                </div>
                
                <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none relative z-10 font-black italic uppercase">
                    {isSignup ? "Register" : "Code Nest"}
                </h1>
                <p className="text-[10px] font-black opacity-80 mt-2 uppercase tracking-[0.4em] relative z-10 italic">
                    {isSignup ? "Personnel Entry" : "System Login 1.0.4"}
                </p>
            </div>

            {/* INTERFACE INPUTS */}
            <div className="p-9 bg-white">
                <form onSubmit={handleAuth} className="space-y-4">
                    
                    {/* FULL NAME - (VISIBLE ONLY IN SIGNUP MODE) */}
                    {isSignup && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest italic opacity-60">Full Name String</label>
                            <div className="relative group">
                                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0c3740] transition-colors" />
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="NODE NAME"
                                    className="w-full bg-slate-50 border border-slate-100 pl-11 p-4 rounded-2xl text-[11px] font-black italic text-[#0c3740] outline-none focus:bg-white focus:border-[#0c3740] transition-all uppercase placeholder:opacity-20 shadow-inner" 
                                    onChange={(e) => setFullName(e.target.value)} 
                                    value={fullName}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest italic opacity-60">Authentication Identifier</label>
                        <div className="relative group">
                            <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2b945f] transition-colors" />
                            <input 
                                type="text" 
                                required 
                                placeholder={isSignup ? "username" : "codenest_id"}
                                className="w-full bg-slate-50 border border-slate-100 pl-11 p-4 rounded-2xl text-[11px] font-black italic text-[#0c3740] outline-none focus:bg-white focus:border-[#2b945f] transition-all uppercase placeholder:opacity-20 shadow-inner" 
                                onChange={(e) => setIdentifier(e.target.value)} 
                                value={identifier}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest italic opacity-60">Security Cipher</label>
                        <div className="relative group">
                            <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2b945f] transition-colors" />
                            <input 
                                type="password" 
                                required 
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-100 pl-11 p-4 rounded-2xl text-[11px] font-black italic text-[#0c3740] outline-none focus:bg-white focus:border-[#2b945f] transition-all shadow-inner tracking-[0.2em]" 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button 
                            disabled={loading} 
                            className={`w-full text-white font-black py-5 rounded-[22px] shadow-xl transition-all text-[11px] uppercase tracking-[0.25em] active:scale-95 border-t border-white/5 italic flex items-center justify-center gap-3
                            ${isSignup ? 'bg-[#0c3740] hover:bg-black shadow-[#0c3740]/20' : 'bg-[#2b945f] hover:bg-[#0c3740] shadow-[#2b945f]/20'}`}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : (isSignup ? "Submit Node Request" : "Establish Link")}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <button 
                        onClick={() => { setIsSignup(!isSignup); setIdentifier(''); setPassword(''); }}
                        className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#2b945f] transition-colors italic underline underline-offset-[6px] decoration-slate-100 hover:decoration-[#2b945f] font-black italic"
                    >
                        {isSignup ? "Already Enrolled? Initiate Login" : "No Registry? Establish Personnel Node"}
                    </button>
                </div>
            </div>
        </div>

        {/* PERSISTENT BRANDING (Prevents Blank Bottom) */}
        <div className="mt-8 text-center space-y-1">
           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic leading-none font-black italic uppercase italic">Code Nest ERP Alpha</p>
           <p className="text-[8px] font-bold text-white/10 uppercase tracking-[0.3em] italic">Encryption standard tier-4 Active</p>
        </div>
      </div>
    </div>
  );
}