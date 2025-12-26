import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else setLoading(false);
    });

    // 2. Listen for auth changes (Login/Logout)
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
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    setRole(data?.role);
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-cnDarkGreen flex items-center justify-center">
       <div className="text-white text-xl animate-pulse font-bold uppercase tracking-widest">Code Nest...</div>
    </div>
  );

  // If not logged in, show Login Screen
  if (!session) return <Login />;

  // If logged in, show based on role
  return (
    <>
      {role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </>
  );
}

export default App;