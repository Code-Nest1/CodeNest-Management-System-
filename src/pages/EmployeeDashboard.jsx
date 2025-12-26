import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  LogOut, Briefcase, DollarSign, Globe, CheckCircle2, 
  Clock, ShieldCheck, Lock, User, RefreshCcw, AlertTriangle
} from 'lucide-react';

export default function EmployeeDashboard() {
  const [profile, setProfile] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [newPass, setNewPass] = useState('');

  useEffect(() => {
    fetchMyData();
  }, []);

  async function fetchMyData() {
    setLoading(true);
    try {
      // 1. Get current logged in user info
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Authentication failed");

      // 2. Fetch Profile from our public.profiles table
      const { data: prof, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profError) {
          console.error("Profile Fetch Error:", profError);
          throw new Error("Profile not found in system.");
      }
      setProfile(prof);

      // 3. Fetch Projects assigned to this user
      const { data: projs } = await supabase
        .from('projects')
        .select('*')
        .eq('assigned_to', user.id);
        
      setMyProjects(projs || []);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => supabase.auth.signOut();

  // STUCK ON SYNCING? Show why
  if (loading) return (
    <div className="min-h-screen bg-cnDarkGreen flex flex-col items-center justify-center p-10">
        <RefreshCcw size={40} className="text-cnLightGreen animate-spin mb-4" />
        <div className="text-white text-lg font-black uppercase tracking-[0.3em] animate-pulse">Syncing Employee Node...</div>
    </div>
  );

  // FAILED TO SYNC? Show fix button
  if (errorMsg) return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center p-10 text-center">
        <AlertTriangle size={60} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-black text-cnDarkGreen uppercase italic mb-2 tracking-tighter">Identity Match Failed</h2>
        <p className="text-cnGrey text-sm mb-8 font-bold max-w-sm italic leading-relaxed">System Error: {errorMsg}. <br/> (Boss Note: Check if Ali's Auth ID matches his Profile ID in the DB!)</p>
        <button onClick={handleLogout} className="bg-cnDarkGreen text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl">Return to Logic Entry</button>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FDFDFF] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-60 bg-cnDarkGreen text-white flex flex-col shadow-2xl z-50 shrink-0">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="p-1.5 bg-cnLightGreen rounded-lg shadow-lg"><Globe size={18}/></div>
             <h1 className="text-lg font-black italic uppercase tracking-tighter leading-none">Code Nest</h1>
          </div>
          <p className="text-[9px] font-black text-cnLightGreen mt-2 tracking-[0.2em] opacity-50 uppercase italic leading-none">Remote Portal</p>
        </div>
        
        <nav className="flex-1 px-4 mt-8 space-y-2">
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 text-cnLightGreen shadow-inner italic">
             <User size={18}/> 
             <span className="text-[11px] font-black uppercase tracking-widest leading-none">Hub Overview</span>
          </div>
        </nav>

        <div className="p-6">
           <button onClick={() => setIsPassModalOpen(true)} className="flex items-center gap-4 w-full p-4 hover:bg-white/5 text-white/40 hover:text-white transition-all rounded-2xl mb-4 border border-white/5 group italic">
             <Lock size={14} className="group-hover:text-cnLightGreen" /> <span className="text-[9px] font-black uppercase tracking-[0.15em]">Security Key</span>
           </button>
           <button onClick={handleLogout} className="flex items-center gap-4 w-full p-4 bg-red-500/10 text-red-400 border border-red-500/10 rounded-2xl hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.1em]">
            <LogOut size={16}/> <span>Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-[#f9fbfc] relative">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex justify-between items-center px-12 sticky top-0 z-30">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-cnDarkGreen leading-tight underline decoration-cnLightGreen/20 decoration-8 underline-offset-2">Resource Center</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic leading-none opacity-60">Status: Secure Connect // Node: Active</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right leading-none">
                <p className="text-[12px] font-black text-cnDarkGreen uppercase leading-none">{profile.full_name}</p>
                <p className="text-[9px] font-black text-cnLightGreen uppercase mt-1.5 italic tracking-widest">{profile.role}</p>
             </div>
             <div className="size-11 bg-cnDarkGreen text-cnLightGreen border-2 border-white rounded-xl shadow-xl flex items-center justify-center font-black text-xl italic">{profile.full_name.charAt(0)}</div>
          </div>
        </header>

        <div className="p-10 max-w-6xl mx-auto space-y-10">
          {/* PERSONAL METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatBox label="Live Assignments" value={myProjects.length} color="text-cnLightGreen" icon={<Briefcase size={20}/>}/>
            <StatBox label="System Status" value="Healthy" color="text-blue-500" icon={<ShieldCheck size={20}/>}/>
            <StatBox label="Base Remittance" value="Pending" color="text-amber-500" icon={<DollarSign size={20}/>}/>
          </div>

          {/* PROJECT TASKBOARD */}
          <div className="bg-white rounded-[45px] shadow-sm border border-slate-50 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-cnDarkGreen flex items-center gap-3 italic underline decoration-cnLightGreen decoration-4 underline-offset-4">Active Operations Directory</h3>
                <span className="bg-slate-100 text-[10px] font-bold text-slate-400 px-4 py-1 rounded-full uppercase italic tracking-widest">{myProjects.length} Assigned</span>
            </div>
            
            <div className="overflow-x-auto min-h-[300px]">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[9px] font-black uppercase text-slate-300 tracking-[0.2em] italic border-b border-slate-50">
                       <th className="px-10 py-6">Operation Title</th>
                       <th className="px-10 py-6">Website Access</th>
                       <th className="px-10 py-6 text-center">Maintenance Node</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-[11px] font-black text-cnDarkGreen italic">
                    {myProjects.map(proj => (
                       <tr key={proj.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-10 py-6 uppercase tracking-tighter text-base group-hover:translate-x-1 transition-transform">{proj.project_name}</td>
                          <td className="px-10 py-6 lowercase font-bold text-blue-500 underline underline-offset-4 opacity-70 group-hover:opacity-100">{proj.website_url || 'Internal Private Node'}</td>
                          <td className="px-10 py-6 text-center">
                             <div className="flex items-center justify-center gap-2 text-cnLightGreen text-[10px] uppercase font-black leading-none group-hover:scale-105 transition-transform">
                                <Clock size={12}/> {new Date(proj.last_report_date).toLocaleDateString().toUpperCase()}
                             </div>
                          </td>
                       </tr>
                    ))}
                    {myProjects.length === 0 && (
                       <tr>
                          <td colSpan="3" className="p-32 text-center text-slate-100 font-black italic text-2xl uppercase tracking-[0.5em] select-none">No active task-data provided</td>
                       </tr>
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      </main>

      {/* SECURITY MODAL */}
      {isPassModalOpen && (
           <div className="fixed inset-0 bg-cnDarkGreen/80 backdrop-blur-xl z-[999] flex items-center justify-center p-6 animate-in">
              <div className="bg-white w-full max-w-sm rounded-[60px] overflow-hidden p-12 border-4 border-white shadow-2xl scale-100 transition-all">
                 <h4 className="text-2xl font-black italic uppercase tracking-tighter text-cnDarkGreen mb-4 underline decoration-cnLightGreen decoration-8 underline-offset-4">Security Key Registry</h4>
                 <p className="text-[10px] font-black text-cnGrey uppercase mb-8 tracking-widest leading-loose italic opacity-60 font-mono tracking-widest">Update private access credentials for Node ID: {profile.id}</p>
                 <form onSubmit={async (e) => {
                    e.preventDefault();
                    const { error } = await supabase.auth.updateUser({ password: newPass });
                    if (error) alert(error.message);
                    else { alert("Protocol Success: Key updated."); setIsPassModalOpen(false); }
                 }} className="space-y-6">
                    <input type="password" required className="w-full bg-slate-100 border-none p-6 rounded-[24px] text-cnDarkGreen font-black italic tracking-widest outline-none shadow-inner" placeholder="NEW KEY 1-5 DIGITS" onChange={e => setNewPass(e.target.value)}/>
                    <button className="w-full bg-cnDarkGreen text-cnWhite py-8 rounded-[40px] font-black uppercase text-xl italic tracking-tighter shadow-2xl shadow-cnDarkGreen/40 hover:bg-cnLightGreen transition-all active:scale-95 border-t-[8px] border-cnLightGreen/20">Apply Logic Sync</button>
                    <button type="button" onClick={() => setIsPassModalOpen(false)} className="w-full text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Abort Changes</button>
                 </form>
              </div>
           </div>
      )}
    </div>
  );
}

function StatBox({label, value, color, icon}) {
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-[0_15px_60px_rgba(0,0,0,0.02)] border border-slate-50 group hover:-translate-y-1 transition-all flex items-center gap-6">
       <div className={`p-4 bg-slate-50/50 rounded-2xl group-hover:bg-cnDarkGreen group-hover:text-cnLightGreen transition-all shadow-inner ${color}`}>{icon}</div>
       <div>
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1.5 italic font-mono tracking-widest italic">{label}</p>
         <h4 className={`text-2xl font-black italic tracking-tighter text-cnDarkGreen leading-none uppercase italic underline underline-offset-4 decoration-slate-50 group-hover:decoration-cnLightGreen transition-all ${color}`}>{value}</h4>
       </div>
    </div>
  );
}