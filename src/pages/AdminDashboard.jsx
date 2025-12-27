import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  LogOut, LayoutDashboard, Users, Briefcase, 
  DollarSign, Plus, Trash2, Search, Bell, 
  ChevronRight, Activity, Calendar, X,
  Clock, AlertCircle, CheckCircle2, RefreshCcw, Globe, ShieldCheck,
  CreditCard, Wallet, Hourglass, Radio, UserCheck, 
  ExternalLink, Layers, ShieldAlert, Settings, FileDown, 
  Calculator, AlertTriangle, ArrowRightLeft, FileCheck, ClipboardList
} from 'lucide-react';

export default function AdminDashboard() {
  // --- CORE DATA ENGINE ---
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Parameters
  const [marketRate, setMarketRate] = useState(278);
  const [gracePeriod, setGracePeriod] = useState(5);
  const [calcUsd, setCalcUsd] = useState(0);

  // New Data Models
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

  const downloadSystemReport = () => {
    let reportContent = `CODE NEST - SYSTEM STATUS REPORT [${new Date().toLocaleString()}]\n`;
    reportContent += "=================================================================\n\n";
    projects.forEach((p, i) => {
        const staff = employees.find(e => e.id === p.assigned_to)?.full_name || 'UNASSIGNED';
        reportContent += `LOG_0${i+1}: ${p.project_name.toUpperCase()}\nCLIENT: ${p.client_name}\nOPERATIVE: ${staff}\nSYNC: ${p.last_report_date}\n---------------------------\n`;
    });
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `CN_Audit_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="flex h-screen bg-[#fcfdfe] font-sans overflow-hidden text-[#1a1a1a] selection:bg-cnLightGreen selection:text-white uppercase font-black italic">
      
      {/* SIDEBAR: ELITE SCALING */}
      <aside className="w-60 bg-cnDarkGreen text-white flex flex-col shadow-2xl z-50 shrink-0 hidden md:flex border-r border-white/5">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-cnLightGreen rounded-lg shadow-xl"><Briefcase size={16}/></div>
             <h1 className="text-lg font-black italic uppercase tracking-tighter">Code Nest</h1>
          </div>
          <p className="text-[8px] font-black text-cnLightGreen mt-2 tracking-[0.3em] opacity-60 ml-0.5">Control: Executive</p>
        </div>

        <nav className="flex-1 px-3 mt-6 space-y-1">
          <NavButton active={activeTab === 'overview'} icon={<LayoutDashboard size={16}/>} label="Dashboard" onClick={() => setActiveTab('overview')} />
          <NavButton active={activeTab === 'employees'} icon={<Users size={16}/>} label="Staff registry" onClick={() => setActiveTab('employees')} />
          <NavButton active={activeTab === 'clients'} icon={<UserCheck size={16}/>} label="Clients portal" onClick={() => setActiveTab('clients')} />
          <NavButton active={activeTab === 'records'} icon={<ClipboardList size={16}/>} label="Internal record" onClick={() => setActiveTab('records')} />
          <NavButton active={activeTab === 'projects'} icon={<Activity size={16}/>} label="Project matrix" onClick={() => setActiveTab('projects')} />
          <div className="h-px bg-white/5 my-4 mx-3"></div>
          <NavButton active={activeTab === 'finance'} icon={<DollarSign size={16}/>} label="Finance hub" onClick={() => setActiveTab('finance')} />
          <NavButton active={activeTab === 'settings'} icon={<Settings size={16}/>} label="HQ Settings" onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 mb-2">
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 w-full p-3 bg-red-500/10 text-red-400 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[9px] uppercase tracking-widest font-black italic">
            <LogOut size={14}/> <span>HQ Log-out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 overflow-y-auto flex flex-col relative bg-[#F9FBFC] min-w-0">
        
        {/* HEADER */}
        <header className="h-14 bg-white/70 backdrop-blur-xl sticky top-0 border-b border-slate-100 px-8 flex justify-between items-center z-40 shrink-0">
          <div className="flex items-center gap-4 bg-slate-100/50 px-5 py-1.5 rounded-xl w-80 border border-slate-100 group transition-all focus-within:bg-white">
             <Search size={14} className="text-slate-500" />
             <input type="text" placeholder="CMD_GLOBAL_SCAN..." className="bg-transparent border-none text-[9.5px] font-black tracking-widest text-[#000000] outline-none w-full uppercase placeholder:text-slate-300"/>
          </div>
          
          <div className="flex items-center gap-3">
              <div className="text-right leading-none hidden sm:block">
                <p className="text-[10px] font-black text-[#000000] uppercase italic leading-none">Sir Rabnawaz</p>
                <p className="text-[7px] font-bold text-cnLightGreen tracking-[0.1em] mt-1 opacity-70 italic">HQ COMMANDER</p>
              </div>
              <div className="size-8 bg-cnDarkGreen text-cnLightGreen rounded-lg flex items-center justify-center font-black text-sm shadow-lg border border-white/10">R</div>
          </div>
        </header>

        <div className="p-4 md:p-8 w-full">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in">
              <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                 <div>
                    <h2 className="text-xl font-black italic tracking-tighter text-[#000000] uppercase underline decoration-cnLightGreen decoration-4 underline-offset-4 leading-none">Executive dashboard</h2>
                    <p className="text-[8px] font-black text-[#000000] uppercase tracking-[0.25em] mt-2 opacity-50 font-mono italic leading-none">Data Node Latency: 04MS | Operational: True</p>
                 </div>
              </div>

              {/* STAT MATRIX - 5 CARDS 100% WIDTH */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard label="Active clients" value={projects.length} desc="Audit Logs" color="border-blue-500 text-blue-600" icon={<Activity size={14} />} />
                <StatCard label="Payments cleared" value="412,450" desc="Settled Cycle" color="border-cnLightGreen text-cnLightGreen" icon={<CheckCircle2 size={14}/>} />
                <StatCard label="Awaiting payment" value="PKR 85,000" desc="Incoming Net" color="border-yellow-600 text-yellow-600" icon={<Hourglass size={14}/>} />
                <StatCard label="Vendor payouts" value="12,500" desc="Gross Output" color="border-red-600 text-red-600" icon={<Wallet size={14}/>} />
                <StatCard label="Team strength" value={employees.length} desc="Linked Nodes" color="border-cnDarkGreen text-cnDarkGreen" icon={<Users size={14}/>} />
              </div>

              {/* ACTION BLOCK */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                 <div className="bg-cnDarkGreen p-6 md:p-8 rounded-[25px] text-white relative overflow-hidden shadow-2xl group min-h-[140px] flex items-center">
                    <RefreshCcw size={150} className="absolute -right-10 -bottom-10 opacity-5 group-hover:rotate-[360deg] duration-[6s]" />
                    <div className="relative z-10">
                       <h3 className="text-[12px] font-black italic uppercase tracking-widest text-cnLightGreen">Database link Active</h3>
                       <p className="text-[10px] font-bold opacity-40 max-w-md italic mt-2 leading-relaxed">Central processing engine syncing monthly client subscriptions across HQ nodes. Remittance logs confirmed for Dec-2025.</p>
                    </div>
                 </div>
                 <div className="bg-[#fafcfc] rounded-[25px] border-2 border-slate-100 flex items-center justify-center border-dashed opacity-50"><Globe size={60} className="text-[#000000]" /></div>
              </div>

              {/* RESOLUTION MODULE */}
              <section className="bg-[#fafcfc] rounded-[28px] border border-slate-200 shadow-xl overflow-hidden">
                  <div className="px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-white">
                      <div className="flex items-center gap-3">
                         <div className="size-2 bg-red-600 rounded-full animate-ping"></div>
                         <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#000000] italic underline decoration-red-600 underline-offset-8">Priority resolution : Overdue</h3>
                      </div>
                      <div className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest shadow-red-200 shadow-lg uppercase border-b-4 border-black/20">immediate action required</div>
                  </div>
                  <table className="w-full text-left">
                      <thead className="bg-[#f0f4f4]">
                          <tr className="text-[7.5px] uppercase tracking-widest text-[#000000] italic opacity-60"><th className="px-8 py-4">Node identify string</th><th className="px-8 text-center">Span</th><th className="px-8 text-center">Vol (pkr)</th><th className="px-8 text-right">Protocol</th></tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white/80"><td className="px-8 py-6 text-xs text-[#000000]">VND_NETWORK_INFRA_ASSETS</td><td className="px-8 py-6 text-center text-red-600 font-mono tracking-tighter">32D EXPIRED</td><td className="px-8 py-6 text-center text-[#000000]">142,500.00</td><td className="px-8 py-6 text-right"><span className="text-[8px] bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded">HALTED</span></td></tr>
                      </tbody>
                  </table>
              </section>
            </div>
          )}

          {/* TAB: PROJECT MATRIX (NOW FIXED) */}
          {activeTab === 'projects' && (
            <div className="space-y-8 animate-in pb-12">
               <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                 <div>
                    <h2 className="text-2xl font-black italic tracking-tighter text-[#000000] uppercase underline decoration-blue-600 decoration-4 underline-offset-4">Instance management</h2>
                    <p className="text-[8px] mt-2 opacity-50">Global maintenance monitoring and subscriber allocation.</p>
                 </div>
                 <button onClick={() => setIsProjectModalOpen(true)} className="bg-cnDarkGreen text-cnLightGreen px-6 py-3 rounded-2xl shadow-xl hover:-translate-y-1 active:scale-95 transition-all text-[9.5px] tracking-widest">+ DEPLOY CLIENT NODE</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {projects.map((p) => {
                    const staff = employees.find(e => e.id === p.assigned_to);
                    const alert = checkMaintenanceAlert(p.last_report_date);
                    return (
                      <div key={p.id} className={`bg-white p-6 rounded-[28px] border-l-[12px] shadow-sm relative group hover:shadow-2xl transition-all ${alert ? 'border-red-600' : 'border-cnLightGreen'}`}>
                        {alert && <AlertCircle className="absolute top-4 right-4 text-red-600 animate-bounce" size={20}/>}
                        <p className="text-[7.5px] font-bold opacity-30 tracking-widest italic mb-2 uppercase">Protocol Reference: ${p.id.toString().slice(-4)}</p>
                        <h4 className="text-base font-black italic uppercase tracking-tighter text-[#000000] mb-0.5">{p.project_name}</h4>
                        <p className="text-[9px] text-cnLightGreen uppercase tracking-tighter mb-4">Instance of {p.client_name}</p>

                        <div className="space-y-2 mb-6">
                            <div className="bg-slate-100/50 p-3 rounded-xl border border-slate-100">
                                <p className="text-[7px] text-slate-400 mb-1 leading-none uppercase">Security maintenance Op</p>
                                <div className="flex items-center gap-2 text-[9.5px] text-[#000000] uppercase leading-none font-black italic"><UserCheck size={12} className="text-cnLightGreen"/> {staff?.full_name || 'NO_ALLOCATION'}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                            <div><p className={`text-[10px] ${alert ? 'text-red-600' : 'text-cnDarkGreen'}`}>{alert ? 'SYNC FAILURE' : 'SYSTEM PASS'}</p></div>
                            <button className="bg-[#000000] p-2.5 rounded-lg text-cnLightGreen active:rotate-180 transition-all shadow-md"><RefreshCcw size={14}/></button>
                        </div>
                      </div>
                    )
                 })}
               </div>
            </div>
          )}

          {/* TAB: INTERNAL RECORD (THE LEDGER) */}
          {activeTab === 'records' && (
             <div className="animate-in space-y-6">
                 <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tighter text-[#000000] uppercase underline decoration-[#1a1a1a]/5 decoration-8">Internal registry</h2>
                        <div className="flex items-center gap-5 text-cnLightGreen text-[8px] font-black uppercase tracking-[0.25em] mt-3">
                           <span className="flex items-center gap-1"><CheckCircle2 size={12}/> STORAGE_LOCK: OK</span>
                           <span className="flex items-center gap-1 opacity-50 text-[#000000]"><ShieldCheck size={12}/> AUDIT_ENABLED</span>
                        </div>
                    </div>
                    <div className="bg-cnDarkGreen text-cnLightGreen px-5 py-2.5 rounded-2xl font-black text-[9px] tracking-widest shadow-2xl animate-pulse">REMITTANCE LIVE</div>
                 </div>

                 <div className="bg-white rounded-[30px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden relative font-black">
                    <table className="w-full text-left font-black italic">
                        <thead className="bg-cnDarkGreen text-white border-b-8 border-CN-LIGHT">
                           <tr className="text-[7.5px] uppercase tracking-widest opacity-80 italic">
                             <th className="px-10 py-5">Operational cycle</th>
                             <th className="px-10 py-5">Stakeholder</th>
                             <th className="px-10 py-5 text-center">Payment vector</th>
                             <th className="px-10 py-5 text-center">Span</th>
                             <th className="px-10 py-5 text-center">Vendor settlement</th>
                             <th className="px-10 py-5 text-right">Risk indicators</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/70 text-[#000000]">
                          {projects.map((p, idx) => (
                             <tr key={idx} className="hover:bg-cnLightGreen/5 transition-all group">
                               <td className="px-10 py-5 text-xs text-slate-400 font-mono italic tracking-tighter underline decoration-dotted decoration-slate-200">{new Date().getFullYear()}-{new Date().getMonth()+1}</td>
                               <td className="px-10 py-5">
                                 <p className="text-[12.5px] uppercase font-black tracking-tight">{p.client_name}</p>
                                 <p className="text-[8px] tracking-[0.2em] opacity-40 font-mono mt-1 text-cnLightGreen uppercase italic leading-none font-bold">Protocol ID: STK_X8{p.id.toString().slice(-4)}</p>
                               </td>
                               <td className="px-10 py-5 text-center"><div className="bg-slate-100/70 text-[9px] py-1 px-3 rounded uppercase font-black opacity-30 border border-slate-200 tracking-tighter">Pending gateway</div></td>
                               <td className="px-10 py-5 text-center text-xs">1 cycle</td>
                               <td className="px-10 py-5 text-center text-[10px] opacity-20 underline decoration-cnLightGreen/30 italic">Not applicable</td>
                               <td className="px-10 py-5 text-right">
                                  {checkMaintenanceAlert(p.last_report_date) ? (
                                    <div className="flex items-center justify-end gap-2 text-red-600 animate-pulse text-[8px] uppercase tracking-widest italic leading-none font-bold">
                                       <ShieldAlert size={14}/> SYSTEM_DELAY
                                    </div>
                                  ) : (
                                    <span className="text-[8px] text-cnLightGreen border border-cnLightGreen/20 px-2 py-0.5 rounded tracking-tighter">NODE_PASS</span>
                                  )}
                               </td>
                             </tr>
                          ))}
                        </tbody>
                    </table>
                 </div>
             </div>
          )}

          {/* TAB: HQ SETTINGS */}
          {activeTab === 'settings' && (
             <div className="animate-in space-y-8 pb-12">
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tighter text-[#000000] uppercase leading-none mb-2">HQ operational configuration</h2>
                        <p className="text-[9px] font-black text-cnLightGreen uppercase tracking-[0.3em] italic">Parameters Control Layer v4.0</p>
                    </div>
                    <button onClick={downloadSystemReport} className="bg-[#000000] text-cnLightGreen p-3.5 rounded-2xl flex items-center gap-3 active:scale-95 transition-all"><FileDown size={18}/><span className="text-[10px] tracking-widest uppercase">System print audit</span></button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <section className="bg-white p-10 rounded-[45px] border border-slate-200 shadow-CN space-y-10 font-black italic text-[#000000]">
                      <h4 className="text-xs uppercase tracking-[0.35em] underline decoration-cnLightGreen decoration-2 italic font-black uppercase text-[#000000]">Economic parameters</h4>
                      <div className="space-y-8">
                         <div className="space-y-4">
                            <label className="text-[9.5px] uppercase tracking-widest font-black leading-none italic block opacity-50 underline underline-offset-4 decoration-[#000000]/10">Maintenance threshold (Days)</label>
                            <input type="number" value={gracePeriod} onChange={e => setGracePeriod(e.target.value)} className="w-full bg-slate-100/50 p-5 rounded-3xl text-2xl text-[#000000] outline-none ring-1 ring-transparent focus:ring-cnLightGreen font-black italic" />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[9.5px] uppercase tracking-widest font-black leading-none italic block opacity-50 underline underline-offset-4 decoration-[#000000]/10">Local currency index (USD - PKR)</label>
                            <div className="bg-slate-100/50 rounded-3xl px-6 flex items-center ring-1 ring-slate-100">
                                <span className="text-lg opacity-40 font-serif mr-4 tracking-tighter">PKR</span>
                                <input type="number" value={marketRate} onChange={e => setMarketRate(e.target.value)} className="bg-transparent border-none py-6 flex-1 outline-none text-2xl text-[#000000]" />
                            </div>
                         </div>
                         <button className="w-full bg-cnLightGreen py-5 rounded-[22px] text-[#000000] tracking-widest uppercase border-b-[8px] border-cnDarkGreen shadow-2xl active:translate-y-1 active:border-b-0 transition-all font-black italic tracking-widest text-[12px]">AUTHORIZE MODIFICATION</button>
                      </div>
                   </section>

                   <div className="space-y-6">
                      <div className="bg-[#000000] text-cnLightGreen p-10 rounded-[45px] font-black italic relative overflow-hidden group">
                         <Calculator className="absolute -right-5 -top-5 opacity-5" size={150} />
                         <h4 className="text-xs uppercase tracking-widest mb-10 underline decoration-cnLightGreen/30 italic font-black uppercase">Rapid Yield Projection</h4>
                         <div className="space-y-2">
                             <p className="text-[8px] tracking-widest opacity-50 uppercase italic font-bold">Input USD ($)</p>
                             <input type="number" value={calcUsd} onChange={e => setCalcUsd(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-[#000000] font-black outline-none placeholder:text-white/20 bg-white" />
                         </div>
                         <div className="flex justify-center p-6"><ArrowRightLeft className="text-cnLightGreen/20 animate-pulse"/></div>
                         <div className="p-6 bg-cnLightGreen/5 rounded-3xl border border-cnLightGreen/10 flex flex-col items-center">
                            <p className="text-[8px] uppercase tracking-[0.4em] opacity-40 italic mb-2 leading-none">Net Pak PKR Revenue</p>
                            <p className="text-3xl text-white tracking-tighter italic font-serif">{(calcUsd * marketRate).toLocaleString()}.00</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* TAB: FINANCE VAULT (UPDATABLE DATA) */}
          {activeTab === 'finance' && (
            <div className="animate-in space-y-6">
               <h2 className="text-xl font-black italic tracking-tighter text-[#000000] uppercase underline decoration-[#1a1a1a]/5 decoration-8 font-black">Capital asset reserve</h2>
               <div className="bg-cnDarkGreen p-10 rounded-[45px] text-white shadow-2xl relative border-[8px] border-white/5 overflow-hidden group">
                  <DollarSign className="absolute -right-16 -bottom-16 opacity-5 group-hover:scale-125 transition-all duration-1000 rotate-12" size={250} />
                  <div className="relative z-10 italic">
                    <h3 className="text-3xl text-cnLightGreen tracking-tighter font-black italic">Financial core</h3>
                    <p className="mt-4 text-[11px] opacity-40 max-w-sm italic tracking-widest underline decoration-white/10 leading-loose">Automated pkr remittance engine. All monthly salary indices for {employees.length} employee operational nodes are locked for final payout command.</p>
                    <div className="mt-8 flex flex-wrap gap-5 italic font-black">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-[30px] flex flex-col justify-center gap-3">
                            <p className="text-[8.5px] uppercase tracking-widest text-cnLightGreen underline underline-offset-4 decoration-cnLightGreen/10 italic">Local Liquidity Index (Dec Cycle)</p>
                            <p className="text-4xl text-white tracking-tighter leading-none font-serif italic">PKR 1,450,220.00</p>
                        </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: CLIENTS Center */}
          {activeTab === 'clients' && (
            /* INTACT from Registry Component built in previous step */
            <div className="animate-in space-y-6">
                <div className="flex justify-between border-b pb-5 items-end">
                    <h2 className="text-xl font-black italic tracking-tighter text-[#000000] uppercase underline decoration-[#1a1a1a]/5 decoration-8 italic font-black uppercase text-[#000000]">Active Stakeholders Registry</h2>
                    <p className="text-[8px] opacity-30 italic font-mono uppercase tracking-[0.2em] italic font-black">Central DB Connectivity: SyncPass</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map((p) => (
                        <div key={p.id} className="bg-white p-10 rounded-[35px] shadow-sm hover:shadow-2xl transition-all border border-slate-100 group border-t-8 border-cnLightGreen/40">
                             <div className="size-10 bg-[#fafcfc] rounded-xl flex items-center justify-center font-black italic text-lg opacity-30 mb-5">{p.client_name.charAt(0)}</div>
                             <h4 className="text-sm font-black italic uppercase text-[#000000] leading-none mb-1 group-hover:text-cnLightGreen transition-colors">{p.client_name}</h4>
                             <p className="text-[9px] opacity-30 tracking-[0.1em] font-mono underline decoration-cnLightGreen/20">Client_Node_${p.id}</p>
                             <div className="mt-8 pt-5 border-t border-slate-100"><p className="text-[7.5px] font-bold text-slate-300 uppercase tracking-widest italic mb-2 leading-none">Mapping Project String</p><p className="text-xs uppercase italic tracking-tight font-black leading-none italic">{p.project_name}</p></div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* TAB: STAFF TEAM REGISTRY */}
          {activeTab === 'employees' && (
             <div className="animate-in space-y-6">
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black italic tracking-tighter text-[#000000] uppercase underline decoration-cnLightGreen decoration-4 underline-offset-8 italic font-black uppercase">Staff operational directory</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-cnLightGreen hover:bg-cnDarkGreen text-white px-5 py-2.5 rounded-lg font-black uppercase text-[9.5px] tracking-widest shadow-xl shadow-cnLightGreen/20 active:scale-95 italic">Register staff unit node</button>
             </div>

             <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-x-auto">
               <table className="w-full text-left font-black italic tracking-tight italic">
                  <thead className="bg-[#f0f3f4] border-b border-slate-200">
                    <tr className="text-[7.5px] uppercase text-[#000000] tracking-[0.3em] italic"><th className="px-6 py-4">Internal Profile logic</th><th className="px-6 py-4">Task Allocation</th><th className="px-6 py-4">Protocol Auth</th><th className="px-6 py-4 text-right">Delete Record</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[#000000]">
                    {employees.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50/50 group italic font-black">
                        <td className="px-6 py-5 uppercase font-black italic"><div className="flex items-center gap-3">
                        <div className="size-7 bg-white rounded-lg flex items-center justify-center font-black border border-slate-200 shadow-inner group-hover:bg-[#000000] group-hover:text-white transition-all text-[11px]">{emp.full_name?.charAt(0)}</div>{emp.full_name}</div></td>
                        <td className="px-6 py-5 text-[10px] opacity-40 uppercase tracking-tighter leading-none italic">{emp.role}</td>
                        <td className="px-6 py-5"><div className={`flex items-center gap-2 ${emp.is_approved ? "text-cnLightGreen" : "text-amber-600"} text-[8.5px] tracking-[0.25em]`}>{emp.is_approved ? <ShieldCheck size={14}/> : <Clock size={14}/>} {emp.is_approved ? "LOGIC PASS" : "PENDING SYNC"}</div></td>
                        <td className="px-6 py-5 text-right"><button onClick={() => deleteEmployee(emp.id)} className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100 active:scale-110"><Trash2 size={15}/></button></td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
           </div>
          )}

        </div>
      </main>

      {/* --- MODAL SCALING: REGISTER EMPLOYEE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/85 backdrop-blur-3xl z-[999] flex items-center justify-center p-4">
           <div className="bg-[#fcfdfe] w-full max-w-sm rounded-[38px] shadow-[0_40px_100px_-20px_#0c3740aa] overflow-hidden border-2 border-cnLightGreen animate-in zoom-in duration-200">
              <div className="bg-cnLightGreen p-8 text-[#000000] flex justify-between items-center relative font-black uppercase italic leading-none underline underline-offset-4 decoration-black/10">
                 <h4 className="text-lg">Staff Unit Profile</h4>
                 <button onClick={() => setIsModalOpen(false)} className="size-10 rounded-2xl bg-black hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xl active:scale-75"><X size={20}/></button>
              </div>

              <form onSubmit={handleAddEmployee} className="p-10 space-y-6 font-black uppercase text-[#000000] italic">
                 <div>
                    <label className="text-[9px] opacity-50 tracking-[0.35em] mb-1.5 block leading-none">Internal full identity string</label>
                    <input required className="w-full bg-slate-100 border-none px-5 py-4 rounded-2xl text-[14px] text-[#000000] outline-none ring-2 ring-transparent focus:ring-[#000000]/20 placeholder:text-slate-300 font-black uppercase italic" placeholder="Muhammad Hamza" onChange={e => setNewEmp({...newEmp, full_name: e.target.value})}/>
                 </div>
                 <div>
                    <label className="text-[9px] opacity-50 tracking-[0.35em] mb-1.5 block leading-none font-black italic">Functional Protocol assignment</label>
                    <select className="w-full bg-slate-100 border-none px-5 py-4 rounded-2xl text-[10.5px] italic text-[#000000] outline-none shadow-sm uppercase font-black italic" onChange={e => setNewEmp({...newEmp, role: e.target.value})}>
                        <option>Full stack operative</option>
                        <option>Lead Visual Architect</option>
                        <option>System Node Handler</option>
                    </select>
                 </div>
                 <button disabled={isSubmitting} className="w-full bg-[#000000] text-cnLightGreen py-6 rounded-3xl uppercase text-[12px] italic tracking-[0.25em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-all border-t-2 border-white/5 active:scale-95 active:rotate-1 hover:tracking-[0.4em] duration-300 font-black italic">COMMIT Registry node</button>
              </form>
           </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/95 backdrop-blur-2xl z-[999] flex items-center justify-center p-4">
           <div className="bg-[#fcfdfe] w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-blue-600 scale-95 font-black uppercase italic tracking-tighter">
              <div className="bg-blue-600 p-8 text-white flex justify-between items-center shadow-lg font-black underline underline-offset-4 decoration-white/20">
                 <h4 className="text-xl">Project instance link</h4>
                 <button onClick={() => setIsProjectModalOpen(false)} className="size-10 rounded-xl bg-white/20 hover:bg-white hover:text-blue-600 flex items-center justify-center transition-all"><X size={20}/></button>
              </div>

              <form onSubmit={handleCreateProject} className="p-10 space-y-6 text-[#000000]">
                 <div className="grid grid-cols-2 gap-4">
                    <input required className="w-full bg-slate-50 border p-4 rounded-xl text-[12px]" placeholder="PROJECT UID STRING" onChange={e => setNewProj({...newProj, name: e.target.value})}/>
                    <input required className="w-full bg-slate-50 border p-4 rounded-xl text-[10px]" placeholder="CLIENT STRING LABEL" onChange={e => setNewProj({...newProj, client: e.target.value})}/>
                 </div>
                 <input className="w-full bg-slate-50 border p-4 rounded-xl text-[11px] text-blue-600 lowercase italic" placeholder="System-endpoint.root" onChange={e => setNewProj({...newProj, url: e.target.value})}/>
                 <div className="space-y-1">
                    <label className="text-[8px] opacity-40 ml-1 block italic font-bold">Protocol Maintainer assignment</label>
                    <select required className="w-full bg-[#000000] text-cnLightGreen p-5 rounded-3xl text-[11px] outline-none" onChange={e => setNewProj({...newProj, staff_id: e.target.value})}>
                       <option value="">SCANNING DIRECTORY FOR PERSONNEL NODES...</option>
                       {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
                    </select>
                 </div>
                 <button disabled={isSubmitting} className="w-full bg-blue-600 text-white py-6 rounded-3xl text-[13px] border-b-8 border-blue-900 shadow-2xl hover:scale-105 active:scale-95 transition-all active:border-b-0 duration-300 font-black uppercase">Commit registry sequence</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

// SHARED NAV COMPONENT (Maintain Scale Protocol)
function NavButton({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all relative group
    ${active ? 'bg-cnLightGreen text-[#000000] shadow-[0_20px_40px_-10px_#2b945fcc] scale-105 translate-x-2' : 'text-white/30 hover:bg-white/5 hover:text-white/60 italic'}`}>
      <span className={active ? 'scale-110 opacity-100 bg-white p-1 rounded-md shadow shadow-black/20' : 'opacity-30 group-hover:scale-110 transition-all'}>{icon}</span>
      {label}
      {active && <div className="absolute right-3 size-1.5 bg-[#000000] rounded-full shadow-[0_0_10px_white]"></div>}
    </button>
  );
}

// STAT COMPONENT (SaaS scaling Optimized)
function StatCard({ label, value, desc, color, icon }) {
  return (
    <div className="bg-white p-5 rounded-[26px] shadow-sm hover:shadow-2xl transition-all flex flex-col items-center text-center group border-t-[8px] border-slate-50 relative overflow-hidden font-black uppercase italic leading-none border-b-2 border-slate-100/10">
       <div className={`size-11 bg-[#fafcfc] flex items-center justify-center rounded-2xl mb-4 ${color} group-hover:bg-[#000000] group-hover:text-cnLightGreen transition-all duration-700 shadow-inner group-hover:rotate-[360deg] duration-1000`}>{icon}</div>
       <p className="text-[7.5px] uppercase text-[#000000] tracking-[0.3em] mb-2 underline decoration-cnLightGreen/50 decoration-2 underline-offset-4 font-black">{label}</p>
       <h4 className={`text-[23px] tracking-tighter text-[#000000] leading-none mb-1.5 font-black italic`}>{value}</h4>
       <div className="h-[2px] w-6 bg-slate-200 rounded-full mb-1.5"></div>
       <p className="text-[6.5px] tracking-[0.2em] text-[#000000] opacity-30 italic leading-none font-bold uppercase">{desc}</p>
    </div>
  );
}