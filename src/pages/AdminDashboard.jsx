import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  LogOut, LayoutDashboard, Users, Briefcase, 
  DollarSign, Plus, Trash2, Search, Bell, 
  Settings, ChevronRight, Activity, Calendar, X,
  Clock, AlertCircle, CheckCircle2, RefreshCcw, Globe, ShieldCheck
} from 'lucide-react';

export default function AdminDashboard() {
  // --- CORE STATES ---
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newEmp, setNewEmp] = useState({ full_name: '', role: 'Remote Full Stack Dev' });
  const [newProj, setNewProj] = useState({ name: '', client: '', url: '', staff_id: '' });

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    const { data: profs } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: projs } = await supabase.from('projects').select('*').order('last_report_date', { ascending: true });
    setEmployees(profs || []);
    setProjects(projs || []);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const empId = "EMP-" + Date.now();
    try {
      const { error } = await supabase.from('profiles').insert([{ id: empId, full_name: newEmp.full_name, role: newEmp.role, is_approved: true }]);
      if (error) throw error;
      setIsModalOpen(false);
      setNewEmp({ full_name: '', role: 'Remote Full Stack Dev' });
      fetchSystemData();
    } catch (err) { alert(err.message); } 
    finally { setIsSubmitting(false); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('projects').insert([{ 
        project_name: newProj.name, client_name: newProj.client, 
        website_url: newProj.url, assigned_to: newProj.staff_id,
        last_report_date: new Date().toISOString()
      }]);
      if (error) throw error;
      setIsProjectModalOpen(false);
      setNewProj({ name: '', client: '', url: '', staff_id: '' });
      fetchSystemData();
    } catch (err) { alert(err.message); } 
    finally { setIsSubmitting(false); }
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("CRITICAL: Permanent Deletion?")) {
      await supabase.from('profiles').delete().eq('id', id);
      fetchSystemData();
    }
  };

  const checkMaintenanceAlert = (lastDate) => {
    if (!lastDate) return true;
    const diff = Math.floor((new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24));
    return diff >= 30; 
  };

  return (
    <div className="flex h-screen bg-[#FDFDFF] font-sans overflow-hidden text-[#1a1a1a] selection:bg-cnLightGreen selection:text-white">
      
      {/* SIDEBAR: SHRUNK TO PRO-SCALE */}
      <aside className="w-60 bg-cnDarkGreen text-white flex flex-col shadow-2xl z-50 shrink-0">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-cnLightGreen rounded-lg shadow-xl shadow-cnLightGreen/20"><Briefcase size={16}/></div>
             <h1 className="text-lg font-black italic uppercase tracking-tighter">Code Nest</h1>
          </div>
          <p className="text-[8px] font-black text-cnLightGreen mt-2 tracking-[0.3em] uppercase opacity-60 italic ml-0.5">Control: 101</p>
        </div>

        <nav className="flex-1 px-3 mt-6 space-y-1">
          <NavButton active={activeTab === 'overview'} icon={<LayoutDashboard size={16}/>} label="Dashboard" onClick={() => setActiveTab('overview')} />
          <NavButton active={activeTab === 'employees'} icon={<Users size={16}/>} label="Team" onClick={() => setActiveTab('employees')} />
          <NavButton active={activeTab === 'projects'} icon={<Activity size={16}/>} label="Projects" onClick={() => setActiveTab('projects')} />
          <div className="h-px bg-white/5 my-4 mx-3"></div>
          <NavButton active={activeTab === 'finance'} icon={<DollarSign size={16}/>} label="Finance" onClick={() => setActiveTab('finance')} />
        </nav>

        <div className="p-4 mb-2">
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 w-full p-3 bg-red-500/10 text-red-400 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest">
            <LogOut size={14}/> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW: SHRUNK SCALE */}
      <main className="flex-1 overflow-y-auto flex flex-col relative bg-[#F9FBFC] min-w-0">
        
        {/* TOP HEADER: SLIM DESIGN */}
        <header className="h-16 bg-white/70 backdrop-blur-xl sticky top-0 border-b border-slate-100 px-8 flex justify-between items-center z-40">
          <div className="flex items-center gap-4 bg-slate-100/50 px-5 py-2 rounded-xl w-80 border border-slate-100 group transition-all focus-within:w-96 focus-within:bg-white">
             <Search size={14} className="text-slate-300 group-focus-within:text-cnLightGreen" />
             <input type="text" placeholder="GLOBAL QUERY..." className="bg-transparent border-none text-[10px] font-black tracking-widest text-cnDarkGreen outline-none w-full uppercase"/>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-slate-300 hover:text-cnLightGreen">
                <Bell size={18}/><span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full ring-2 ring-white"></span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right leading-none">
                <p className="text-[10px] font-black text-cnDarkGreen uppercase italic leading-none">Sir Rabnawaz</p>
                <p className="text-[8px] font-bold text-cnLightGreen tracking-[0.1em] uppercase mt-1 opacity-70">Admin Access</p>
              </div>
              <div className="size-9 bg-cnDarkGreen text-cnLightGreen rounded-lg flex items-center justify-center font-black text-base shadow-lg border-2 border-white transition-transform hover:rotate-3 cursor-default">R</div>
            </div>
          </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <div className="p-8 max-w-[1400px] mx-auto w-full">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in">
              <div className="flex justify-between items-end border-b border-slate-50 pb-6">
                 <div>
                    <h2 className="text-2xl font-black italic tracking-tighter text-cnDarkGreen uppercase underline decoration-cnLightGreen decoration-4 underline-offset-4 leading-tight">Overview</h2>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 italic leading-loose opacity-60 font-mono uppercase italic leading-loose">Real-time Node Metrics Active</p>
                 </div>
                 <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-50 text-[10px] font-black text-cnDarkGreen italic">
                    {new Date().toDateString().toUpperCase()}
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Team Strength" value={employees.length} desc="Synced Cloud Nodes" color="border-cnLightGreen text-cnLightGreen" icon={<Users size={16} />} />
                <StatCard label="Active Clients" value={projects.length} desc="System Monitoring" color="border-blue-500 text-blue-500" icon={<Activity size={16}/>} />
                <StatCard label="Gross Flow" value="85k" desc="Currency: PKR" color="border-yellow-500 text-yellow-500" icon={<DollarSign size={16}/>} />
                <StatCard label="Maintenance" value={projects.filter(p => checkMaintenanceAlert(p.last_report_date)).length} desc="Alerts Due" color="border-red-500 text-red-500" icon={<AlertCircle size={16}/>} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                 <div className="bg-cnDarkGreen p-8 rounded-[30px] text-white relative overflow-hidden shadow-2xl group min-h-[220px]">
                    <RefreshCcw size={150} className="absolute -right-10 -bottom-10 text-white/5 opacity-5 group-hover:rotate-45 transition-transform duration-1000" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                       <h3 className="text-base font-black italic uppercase tracking-widest text-cnLightGreen">Connectivity Monitor</h3>
                       <p className="text-[11px] font-bold opacity-50 max-w-sm italic mt-2">All encrypted database sessions are stable. No latency detected in remote team nodes.</p>
                       <div className="flex gap-2 mt-auto pt-8">
                          <div className="px-2.5 py-1 bg-white/5 rounded text-[8px] font-black uppercase tracking-widest text-white/30 border border-white/5 italic">Uptime 99%</div>
                       </div>
                    </div>
                 </div>
                 <div className="bg-white rounded-[30px] border border-gray-100 flex items-center justify-center p-8 opacity-20"><Globe size={100} className="text-slate-100" /></div>
              </div>
            </div>
          )}

          {/* TAB 2: TEAM LIST */}
          {activeTab === 'employees' && (
            <div className="animate-in space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-black italic tracking-tighter text-cnDarkGreen uppercase">Personnel Directory</h2>
                 <button onClick={() => setIsModalOpen(true)} className="bg-cnLightGreen hover:bg-cnDarkGreen text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-cnLightGreen/10 flex items-center gap-2 active:scale-95">
                   <Plus size={16} strokeWidth={5}/> Register Node
                 </button>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-50 overflow-hidden">
                <table className="w-full text-left text-cnBlack">
                   <thead className="bg-slate-50 border-b border-slate-100">
                     <tr className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] italic">
                       <th className="px-8 py-4">Internal ID</th>
                       <th className="px-8 py-4">Functional Role</th>
                       <th className="px-8 py-4">Live Pulse</th>
                       <th className="px-8 py-4 text-right">Data Hub</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {employees.map(emp => (
                       <tr key={emp.id} className="hover:bg-slate-50 transition-all group">
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                               <div className="size-8 bg-slate-50 rounded-lg flex items-center justify-center font-black text-cnDarkGreen group-hover:bg-cnLightGreen group-hover:text-white transition-all text-[10px] uppercase border border-slate-200">{emp.full_name?.charAt(0)}</div>
                               <span className="font-black uppercase italic text-sm tracking-tight text-cnDarkGreen">{emp.full_name}</span>
                            </div>
                         </td>
                         <td className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-cnDarkGreen opacity-60">{emp.role}</td>
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-2 text-cnLightGreen text-[9px] font-black italic tracking-widest">
                               <ShieldCheck size={14}/> {emp.is_approved ? "SYNC ACTIVE" : "NODE STANDBY"}
                            </div>
                         </td>
                         <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                            {/* NEW ACCESS PERMISSION BUTTON */}
                            {!emp.is_approved && (
                               <button 
                                  onClick={async () => {
                                     await supabase.from('profiles').update({ is_approved: true }).eq('id', emp.id);
                                     fetchSystemData();
                                  }}
                                  className="px-3 py-1.5 bg-cnLightGreen text-white text-[7px] font-black uppercase rounded-md shadow-sm animate-pulse hover:bg-cnDarkGreen transition-all shrink-0"
                               >
                                  Allow Access
                               </button>
                            )}
                            <button onClick={() => deleteEmployee(emp.id)} className="p-2 text-red-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS MAINTENANCE */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-in">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-black italic tracking-tighter text-cnDarkGreen uppercase">Portal Maintenance</h2>
                 <button onClick={() => setIsProjectModalOpen(true)} className="bg-cnDarkGreen hover:bg-cnLightGreen text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">
                    Register Client Node
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {projects.map(proj => {
                   const overdue = checkMaintenanceAlert(proj.last_report_date);
                   const staff = employees.find(e => e.id === proj.assigned_to);
                   return (
                     <div key={proj.id} className={`bg-white p-6 rounded-[30px] border-l-[12px] shadow-sm relative group hover:-translate-y-1 transition-all ${overdue ? 'border-red-500 shadow-red-500/5' : 'border-cnLightGreen shadow-cnLightGreen/5'}`}>
                        {overdue && <AlertCircle className="absolute top-4 right-4 text-red-500 animate-pulse" size={20}/>}
                        <h4 className="text-lg font-black italic uppercase tracking-tighter text-cnDarkGreen mb-1">{proj.project_name}</h4>
                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest italic mb-6">Subscription: {proj.client_name}</p>
                        
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-2">
                           <div className="flex items-center gap-2 text-cnDarkGreen text-[9px] font-black"><Users size={12}/><span className="uppercase">Res: {staff ? staff.full_name : 'No Allocation'}</span></div>
                           <div className="flex items-center gap-2 text-blue-500 text-[9px] font-black"><Globe size={12}/><span className="lowercase truncate italic">{proj.website_url}</span></div>
                        </div>

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                           <p className={`text-[10px] font-black italic uppercase ${overdue ? 'text-red-500 animate-pulse' : 'text-cnLightGreen'}`}>
                             {overdue ? 'URGENT: REPORT REQ' : 'Operational Status'}
                           </p>
                           <button onClick={async () => { await supabase.from('projects').update({ last_report_date: new Date().toISOString() }).eq('id', proj.id); fetchSystemData(); }} 
                                   className="p-2.5 bg-slate-100 text-slate-400 rounded-lg hover:bg-cnDarkGreen hover:text-white transition-all shadow-sm group-hover:scale-105 active:scale-95"><RefreshCcw size={14}/></button>
                        </div>
                     </div>
                   );
                 })}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCE */}
          {activeTab === 'finance' && (
            <div className="animate-in space-y-8">
               <h2 className="text-2xl font-black italic uppercase text-cnDarkGreen tracking-tighter leading-none text-cnDarkGreen uppercase underline decoration-cnLightGreen/20">The Economy Hub</h2>
               <div className="bg-cnDarkGreen p-12 rounded-[50px] text-white shadow-2xl relative border-[12px] border-white/5 overflow-hidden group">
                  <DollarSign className="absolute -right-32 -bottom-32 opacity-10 group-hover:scale-110 transition-all duration-1000" size={350} />
                  <div className="relative z-10 max-w-lg">
                    <h3 className="text-4xl font-black italic uppercase underline decoration-cnLightGreen decoration-4 underline-offset-8">Salary Engine</h3>
                    <p className="mt-6 text-sm font-bold opacity-50 italic leading-relaxed pr-8">Finance terminal for Code Nest. Oversee current balances, disbursement cycles and pending PKRs for {employees.length} records.</p>
                    <div className="mt-12 p-1.5 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 inline-block">
                        <p className="text-[9px] uppercase font-black tracking-widest text-white/40 mb-1">Total Allocated Volume</p>
                        <p className="text-xl font-black italic leading-none">PKR 184,450.00</p>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL SCALING --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-cnDarkGreen/90 backdrop-blur-2xl z-[999] flex items-center justify-center p-4 animate-in">
           <div className="bg-white w-full max-w-md rounded-[50px] shadow-2xl overflow-hidden shadow-cnLightGreen/5">
              <div className="bg-cnLightGreen p-10 text-white flex justify-between items-center relative overflow-hidden group">
                 <h4 className="text-2xl font-black italic uppercase tracking-tighter underline decoration-cnDarkGreen/10">Enroll Profile</h4>
                 <button onClick={() => setIsModalOpen(false)} className="size-10 rounded-xl bg-white/10 hover:bg-white hover:text-cnLightGreen flex items-center justify-center transition-all active:scale-90"><X size={20}/></button>
              </div>

              <form onSubmit={handleAddEmployee} className="p-10 space-y-6">
                 <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em] italic ml-1 leading-none opacity-60 font-mono italic leading-none">Node ID Registration</label>
                    <input required className="w-full bg-slate-50 border-none p-5 rounded-2xl text-lg font-black italic tracking-tight uppercase text-cnDarkGreen outline-none ring-1 ring-slate-100 focus:ring-cnLightGreen transition-all placeholder:opacity-10" placeholder="Hamza Bin Sabir" onChange={e => setNewEmp({...newEmp, full_name: e.target.value})}/>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em] italic ml-1 leading-none opacity-60 font-mono italic leading-none">Assignment Path</label>
                    <select className="w-full bg-slate-50 border-none p-5 rounded-2xl text-xs font-black italic text-cnDarkGreen outline-none cursor-pointer appearance-none shadow-sm uppercase tracking-[0.2em]" onChange={e => setNewEmp({...newEmp, role: e.target.value})}>
                        <option>Full Stack Developer</option>
                        <option>Maintainance Specialist</option>
                        <option>Visual Architect</option>
                    </select>
                 </div>
                 <button disabled={isSubmitting} className="w-full bg-cnDarkGreen text-cnWhite py-5 rounded-[25px] font-black uppercase text-lg italic tracking-tighter shadow-xl shadow-cnDarkGreen/20 flex items-center justify-center gap-4 hover:bg-cnLightGreen transition-all hover:-translate-y-1 active:scale-95 group uppercase">
                   {isSubmitting ? "Linking Database Node..." : "Onboard Service Account"}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL: REGISTER PROJECT */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-cnDarkGreen/95 backdrop-blur-2xl z-[999] flex items-center justify-center p-4 animate-in">
           <div className="bg-white w-full max-w-md rounded-[50px] shadow-2xl overflow-hidden scale-100">
              <div className="bg-blue-600 p-10 text-white flex justify-between items-center overflow-hidden relative">
                 <h4 className="text-2xl font-black italic uppercase tracking-tighter underline decoration-white/20">Client Instance</h4>
                 <button onClick={() => setIsProjectModalOpen(false)} className="size-10 rounded-xl bg-white/10 hover:bg-white hover:text-blue-600 transition-all active:scale-90"><X size={20}/></button>
              </div>

              <form onSubmit={handleCreateProject} className="p-10 space-y-6">
                 <input required className="w-full bg-slate-50 border-none p-5 rounded-2xl text-base font-black italic tracking-tighter uppercase text-cnDarkGreen" placeholder="Instance Label (E.g. Code Nest CMS)" onChange={e => setNewProj({...newProj, name: e.target.value})}/>
                 <input required className="w-full bg-slate-50 border-none p-5 rounded-2xl text-[10px] font-black italic tracking-widest text-cnGrey uppercase" placeholder="Client Identification" onChange={e => setNewProj({...newProj, client: e.target.value})}/>
                 <input className="w-full bg-slate-50 border-none p-5 rounded-2xl text-[10px] font-black text-blue-500 font-mono italic" placeholder="GLOBAL_DOMAIN.URL" onChange={e => setNewProj({...newProj, url: e.target.value})}/>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest italic ml-1">Assigned Maintenance Operator</label>
                    <select required className="w-full bg-slate-50 border-none p-5 rounded-2xl text-[10px] font-black italic uppercase text-cnDarkGreen appearance-none outline-none ring-1 ring-slate-100" onChange={e => setNewProj({...newProj, staff_id: e.target.value})}>
                       <option value="">SCAN SERVER RECORDS...</option>
                       {employees.map(emp => (
                         <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                       ))}
                    </select>
                 </div>
                 <button disabled={isSubmitting} className="w-full bg-cnDarkGreen text-cnWhite py-5 rounded-[30px] font-black uppercase text-base italic tracking-widest shadow-xl hover:bg-blue-600 active:scale-95 transition-all mt-4 border-t-[4px] border-blue-500/20 uppercase tracking-[0.2em] italic">Commit Instance Registration</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

// SHARED MINI COMPONENTS
function NavButton({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] transition-all relative group
    ${active ? 'bg-cnLightGreen text-white shadow-xl scale-[1.03] translate-x-1 italic' : 'text-white/40 hover:bg-white/5 hover:text-white/70 italic opacity-80'}`}>
      <span className={active ? 'scale-110 opacity-100' : 'opacity-30 group-hover:scale-110 group-hover:opacity-100'}>{icon}</span>
      {label}
      {active && <div className="absolute right-3 size-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>}
    </button>
  );
}

function StatCard({ label, value, desc, color, icon }) {
  return (
    <div className="bg-white p-6 rounded-[40px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center group border border-slate-50 border-t-2">
       <div className={`size-10 bg-slate-50/50 flex items-center justify-center rounded-xl mb-4 ${color} shadow-inner group-hover:bg-cnDarkGreen group-hover:text-cnLightGreen transition-all`}>{icon}</div>
       <p className="text-[8px] font-black uppercase text-cnGrey tracking-[0.3em] mb-1 italic opacity-40 font-mono italic leading-none">{label}</p>
       <h4 className={`text-4xl font-black italic tracking-tighter leading-tight mb-2 group-hover:scale-105 transition-transform duration-500 text-cnDarkGreen leading-tight`}>{value}</h4>
       <div className="h-[2px] w-6 bg-slate-100 rounded-full mb-2"></div>
       <p className="text-[7px] font-black uppercase tracking-widest text-cnGrey italic opacity-30 leading-none">{desc}</p>
    </div>
  );
}