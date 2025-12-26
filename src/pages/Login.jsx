import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, Building2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cnDarkGreen flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-cnWhite w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-cnLightGreen p-8 text-center text-cnWhite">
          <div className="flex justify-center mb-4"><Building2 size={48} /></div>
          <h1 className="text-3xl font-extrabold tracking-tight">CODE NEST</h1>
          <p className="text-sm opacity-90 mt-1 uppercase tracking-widest text-cnWhite">Management System</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-cnGrey mb-2 uppercase">Email Address</label>
              <input type="email" required className="w-full border-2 border-gray-100 p-3 rounded-xl outline-cnLightGreen" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cnGrey mb-2 uppercase">Password</label>
              <input type="password" required className="w-full border-2 border-gray-100 p-3 rounded-xl outline-cnLightGreen" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button disabled={loading} className="w-full bg-cnDarkGreen text-cnWhite font-bold py-4 rounded-xl hover:bg-cnLightGreen transition-all shadow-lg">
              {loading ? "Checking details..." : "LOGIN TO SYSTEM"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}