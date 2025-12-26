import React from 'react';
import { supabase } from '../supabaseClient';

export default function EmployeeDashboard() {
  return (
    <div className="p-10 bg-cnDarkGreen min-h-screen text-white text-center">
      <h1 className="text-3xl font-bold">Employee Dashboard - Under Construction</h1>
      <button onClick={() => supabase.auth.signOut()} className="mt-5 bg-cnLightGreen px-5 py-2 rounded">Logout</button>
    </div>
  );
}