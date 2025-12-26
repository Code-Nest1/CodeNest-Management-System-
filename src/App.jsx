import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { ShieldCheck, LogOut } from 'lucide-react'; // For the security screen
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else setLoading(false);
    });

    // 2. Listen for Login/Logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    // UPDATED LOGIC: Fetches 'is_approved' column to check for Sir Rabnawaz's permission
    const { data, error } = await supabase
      .from('profiles')
      .select('role, is_approved')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Profile Fetch Error:", error.message);
      setRole('employee'); 
    } else {
      // Logic: If they are NOT an admin AND they are NOT approved yet
      if (data?.role !== 'admin' && data?.is_approved === false) {
         setRole('pending'); 
      } else {
         setRole(data?.role);
      }
    }
    setLoading(false);
  };

  // 1. LOADING SCREEN
  if (loading) return (
    <div className="min-h-screen bg-cnDarkGreen flex items-center justify-center">
       <div className="text-white text-xl animate-pulse font-black uppercase tracking-[0.4em] italic">Code Nest Synchronizing...</div>
    </div>
  );

  // 2. UNAUTHENTICATED (LOGGED OUT)
  if (!session) return <Login />;

  // 3. AUTHENTICATED BUT PENDING APPROVAL FROM RABNAWAZ
  if (role === 'pending') return (
    <div className="min-h-screen bg-cnDarkGreen flex flex-col items-center justify-center p-6 text-center">
       <div className="bg-white w-full max-w-[340px] rounded-[45px] p-10 shadow-2xl animate-in scale-90 md:scale-100 transition-transform">
          <div className="size-20 bg-cnLightGreen/10 text-cnLightGreen rounded-[24px] flex items-center justify-center mx-auto mb-8 border border-cnLightGreen/20 animate-pulse">
             <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-cnDarkGreen mb-4 leading-tight">Access Restricted</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed italic mb-10">
            Node Identity Detected. Sir Rabnawaz has been notified. Terminal will synchronize automatically upon Boss authorization.
          </p>
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="w-full py-5 bg-cnDarkGreen text-white rounded-[22px] font-black uppercase text-[10px] tracking-[0.2em] italic shadow-xl shadow-cnDarkGreen/30 hover:bg-cnLightGreen transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <LogOut size={16}/> Terminate Link
          </button>
       </div>
       <p className="mt-8 text-[8px] font-black text-white/20 uppercase tracking-[0.4em] italic">Code Nest Encryption Protocol v2.1</p>
    </div>
  );

  // 4. APPROVED DASHBOARDS (SWITCHES BASED ON ROLE)
  return (
    <>
      {role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </>
  );
}

export default App;