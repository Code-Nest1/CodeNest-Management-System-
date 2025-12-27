import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { ShieldCheck, LogOut } from 'lucide-react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else setLoading(false);
    });

    // 2. Real-time Auth Listening
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchRole(session.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    try {
      // Logic synchronized with Supabase profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('role, is_approved')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Profile Fetch Error:", error.message);
        setRole('employee'); 
      } else {
        const dbRole = data?.role?.toLowerCase(); // Standardize to lowercase for check
        
        // SECURITY GATE LOGIC
        // If they are not an admin AND they have not been approved yet, set to pending
        if (dbRole !== 'admin' && data?.is_approved === false) {
           setRole('pending'); 
        } else {
           setRole(dbRole);
        }
      }
    } catch (err) {
      setRole('employee');
    } finally {
      setLoading(false);
    }
  };

  // 1. HQ SYNCHRONIZATION (LOADING SCREEN)
  if (loading) return (
    <div className="min-h-screen bg-[#0c3740] flex items-center justify-center font-sans">
       <div className="text-white text-xl animate-pulse font-black uppercase tracking-[0.4em] italic">Code Nest Synchronizing...</div>
    </div>
  );

  // 2. ENTRY POINT (UNAUTHENTICATED)
  if (!session) return <Login />;

  // 3. HQ RESTRICTION GATE (WAITING FOR SIR RABNAWAZ)
  if (role === 'pending') return (
    <div className="min-h-screen bg-[#0c3740] flex flex-col items-center justify-center p-6 text-center font-sans">
       <div className="bg-white w-full max-w-[340px] rounded-[45px] p-10 shadow-2xl animate-in scale-90 md:scale-100 transition-transform border-[3px] border-[#0c3740]">
          <div className="size-20 bg-[#2b945f]/10 text-[#2b945f] rounded-[24px] flex items-center justify-center mx-auto mb-8 border border-[#2b945f]/20 animate-pulse">
             <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[#0c3740] mb-4 leading-tight">Access Restricted</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed italic mb-10">
            Node Identity Detected. Sir Rabnawaz has been notified. Terminal will synchronize automatically upon Boss authorization.
          </p>
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="w-full py-5 bg-[#0c3740] text-white rounded-[22px] font-black uppercase text-[10px] tracking-[0.2em] italic shadow-xl shadow-[#0c3740]/30 hover:bg-[#2b945f] transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <LogOut size={16}/> Terminate Link
          </button>
       </div>
       <p className="mt-8 text-[8px] font-black text-white/20 uppercase tracking-[0.4em] italic">Code Nest Encryption Protocol v2.1</p>
    </div>
  );

  // 4. COMMAND CENTER ROUTING
  return (
    <>
      {role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </>
  );
}

export default App;