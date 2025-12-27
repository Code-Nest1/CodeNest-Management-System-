import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Lock, User, Mail, ArrowRight, Loader2, Cpu, LogOut } from 'lucide-react';

const Auth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('OPERATIVE');
    const [error, setError] = useState(null);

    // Protocol Styling Constants
    const inputStyle = "w-full bg-white border-2 border-[#0c3740] px-3 py-2 text-[#000000] font-bold uppercase placeholder:text-gray-400 focus:ring-2 focus:ring-[#2b945f] outline-none transition-all text-xs";
    const labelStyle = "block text-[10px] font-black italic uppercase text-[#0c3740] mb-1 tracking-tighter";

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            verifyApproval(session.user.id);
        }
    };

    const verifyApproval = async (uid) => {
        setLoading(true);
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_approved, role')
            .eq('id', uid)
            .single();

        if (profile) {
            if (profile.is_approved) {
                // Route based on role
                navigate(profile.role === 'ADMIN' ? '/admin' : '/dashboard');
            } else {
                setIsWaiting(true);
            }
        }
        setLoading(false);
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (signUpError) throw signUpError;

                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([{
                            id: data.user.id,
                            full_name: fullName.toUpperCase(),
                            role: role.toUpperCase(),
                            is_approved: false,
                        }]);

                    if (profileError) throw profileError;
                    setIsWaiting(true);
                }
            } else {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) throw signInError;
                if (data.user) verifyApproval(data.user.id);
            }
        } catch (err) {
            setError(err.message.toUpperCase());
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsWaiting(false);
        window.location.reload();
    };

    // UI RENDER: WAITING FOR APPROVAL
    if (isWaiting) {
        return (
            <div className="min-h-screen bg-[#F9FBFC] flex items-center justify-center p-4" style={{ zoom: '0.8' }}>
                <div className="w-full max-w-[450px] bg-white border-[3px] border-[#0c3740] shadow-[12px_12px_0px_0px_#0c3740] p-10 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-amber-100 p-4 rounded-full border-2 border-amber-600 animate-pulse">
                            <ShieldAlert size={48} className="text-amber-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black italic uppercase text-[#0c3740] tracking-tighter leading-none mb-4">
                        PENDING AUTHORIZATION
                    </h2>
                    <p className="text-[#000000] font-bold text-sm uppercase leading-tight mb-8">
                        Your credentials have been logged. <br />
                        System Administrator <span className="text-[#2b945f]">Rabnawaz</span> must approve your access 
                        before the node can be unlocked.
                    </p>
                    <button 
                        onClick={handleSignOut}
                        className="w-full bg-[#0c3740] text-white py-3 font-black italic uppercase tracking-tighter flex items-center justify-center gap-2 hover:bg-black transition-all"
                    >
                        <LogOut size={18} /> RETURN TO ENTRY POINT
                    </button>
                    <div className="mt-6 border-t-2 border-dashed border-gray-200 pt-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            CODE NEST HQ SECURITY PROTOCOL 01
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // UI RENDER: LOGIN / SIGNUP
    return (
        <div className="min-h-screen bg-[#F9FBFC] flex items-center justify-center p-4 font-sans select-none" style={{ zoom: '0.8' }}>
            <div className="w-full max-w-[400px] bg-white border-[3px] border-[#0c3740] shadow-[8px_8px_0px_0px_#0c3740]">
                <div className="bg-[#0c3740] p-6 text-white text-center border-b-[3px] border-[#0c3740]">
                    <div className="flex justify-center mb-2">
                        <div className="bg-[#2b945f] p-2 rounded-full border border-white/20">
                            <Cpu size={32} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter leading-none">CODE NEST ERP</h1>
                    <p className="text-[10px] font-bold text-[#2b945f] tracking-widest mt-2 uppercase">Authorized Personnel Only</p>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-600 p-3 mb-4">
                            <p className="text-[10px] font-black text-red-700 italic tracking-tight">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        {isSignUp && (
                            <>
                                <div>
                                    <label className={labelStyle}>Full Operative Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 text-[#0c3740]" size={14} />
                                        <input 
                                            type="text" 
                                            className={`${inputStyle} pl-10`} 
                                            placeholder="ENTER FULL NAME"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelStyle}>Unit Role</label>
                                    <select 
                                        className={inputStyle}
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="OPERATIVE">FIELD OPERATIVE</option>
                                        <option value="DEVELOPER">SR. DEVELOPER</option>
                                        <option value="MANAGER">HUB MANAGER</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div>
                            <label className={labelStyle}>Network ID (Email)</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-[#0c3740]" size={14} />
                                <input 
                                    type="email" 
                                    className={`${inputStyle} pl-10`} 
                                    placeholder="IDENTIFIER@NEST.HQ"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelStyle}>Security Cipher</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 text-[#0c3740]" size={14} />
                                <input 
                                    type="password" 
                                    className={`${inputStyle} pl-10`} 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full bg-[#2b945f] hover:bg-[#237a4e] text-white py-3 font-black italic uppercase tracking-tighter flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 border-b-4 border-black/20"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    {isSignUp ? "REQUEST SYSTEM ENTRY" : "INITIALIZE LOGIN"}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t-2 border-gray-100 text-center">
                        <button 
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError(null);
                            }}
                            className="text-[11px] font-black text-[#0c3740] hover:text-[#2b945f] transition-colors uppercase tracking-widest italic underline decoration-2 underline-offset-4"
                        >
                            {isSignUp ? "Already Registered? Sign In" : "Don't have an account? Create Here"}
                        </button>
                    </div>
                </div>

                <div className="bg-gray-100 p-2 text-center border-t-[2px] border-[#0c3740]">
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-1">
                        <ShieldCheck size={10} /> Encryption Standard: PKR-LOCKED-04
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;