import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  LogOut, LayoutDashboard, Users, Briefcase, 
  DollarSign, Plus, Trash2, Search, Bell, 
  ChevronRight, Activity, Calendar, X,
  Clock, AlertCircle, CheckCircle2, RefreshCcw, Globe, ShieldCheck,
  CreditCard, Wallet, Hourglass, Radio, UserCheck, 
  ExternalLink, Layers, ShieldAlert, Settings, FileDown, 
  Calculator, AlertTriangle, ArrowRightLeft, FileCheck, ClipboardList,
  Printer, HardDriveDownload, FileText, Sparkles, User, Shield, CheckSquare
} from 'lucide-react';

export default function AdminDashboard() {
  // --- CORE DATA ENGINE ---
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Settings Parameters
  const [marketRate, setMarketRate] = useState(278);
  const [gracePeriod, setGracePeriod] = useState(5);
  const [calcUsd, setCalcUsd] = useState(0);

  // New Node Models
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

  // Logic to calculate pending requests for notification badge
  const pendingApprovals = employees.filter(emp => !emp.is_approved).length;

  // Filter Logic
  const filteredProjects = projects.filter(p => p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) || p.client_name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredEmployees = employees.filter(e => e.full_name.toLowerCase().includes(searchQuery.toLowerCase()));

  // --- REPORT LOGIC: PRINT-TO-PDF BRIDGE ---
  const downloadSystemReport = () => {
    const printWindow = window.open('', '_blank');
    let htmlContent = `
      <html>
        <head>
          <title>Code Nest - Executive Monthly Audit</title>
          <style>
            body { font-family: 'Arial', sans'; padding: 40px; color: #1a1a1a; line-height: 1.6; }
            h1 { text-transform: uppercase; font-style: italic; border-bottom: 4px solid #0c3740; padding-bottom: 10px; }
            .header-info { display: flex; justify-content: space-between; margin-bottom: 40px; font-size: 12px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #0c3740; color: white; padding: 12px; text-align: left; font-size: 10px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #eee; font-size: 11px; }
            .status-red { color: red; font-weight: bold; }
            .status-green { color: green; font-weight: bold; }
            footer { margin-top: 50px; font-size: 10px; opacity: 0.5; border-top: 1px solid #ccc; pt: 10px; }
          </style>
        </head>
        <body>
          <h1>Monthly Operational Audit: Dec 2025</h1>
          <div class="header-info">
             <div>ADMINISTRATOR: SIR RABNAWAZ<br/>STATION: HQ_ERP_COMMAND</div>
             <div style="text-align: right">NODES: ${employees.length}<br/>SUBSCRIPTIONS: ${projects.length}</div>
          </div>
          <table>
            <thead><tr><th>Client</th><th>Assigned</th><th>URL</th><th>Status</th></tr></thead>
            <tbody>
    `;

    projects.forEach(p => {
        const staffNode = employees.find(e => e.id === p.assigned_to);
        const isOverdue = checkMaintenanceAlert(p.last_report_date);
        htmlContent += `
          <tr><td>${p.client_name.toUpperCase()}</td><td>${staffNode ? staffNode.full_name : 'RESTRICTED'}</td><td>${p.website_url}</td><td class="${isOverdue ? 'status-red' : 'status-green'}">${isOverdue ? '!! CRITICAL !!' : 'OPERATIONAL_PASS'}</td></tr>
        `;
    });

    htmlContent += `</tbody></table><footer>ENCRYPTED LOG GENERATED LOCALLY BY CODE NEST ERP SYSTEM</footer></body></html>`;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex h-screen w-full bg-[#fcfdfe] font-sans overflow-hidden text-[#1a1a1a] selection:bg-cnLightGreen selection:text-white uppercase font-black italic">
      
      {/* SIDEBAR: (STAYS ORIGINAL AS REQUESTED) */}
      <aside className="w-60 bg-cnDarkGreen text-white flex flex-col shadow-2xl z-50 shrink-0 hidden md:flex border-r border-white/5">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-cnLightGreen rounded-lg shadow-xl shadow-cnLightGreen/20"><Briefcase size={16}/></div>
             <h1 className="text-lg font-black italic uppercase tracking-tighter">Code Nest</h1>
          </div>
          <p className="text-[8px] font-black text-cnLightGreen mt-2 tracking-[0.3em] uppercase opacity-60 italic ml-0.5">Control Terminal 1.04</p>
        </div>
        <nav className="flex-1 px-3 mt-6 space-y-1">
          <NavButton active={activeTab === 'overview'} icon={<LayoutDashboard size={16}/>} label="Dashboard" onClick={() => setActiveTab('overview')} />
          <NavButton active={activeTab === 'employees'} icon={<Users size={16}/>} label="Staff registry" onClick={() => setActiveTab('employees')} />
          <NavButton active={activeTab === 'clients'} icon={<UserCheck size={16}/>} label="Clients Center" onClick={() => setActiveTab('clients')} />
          <NavButton active={activeTab === 'records'} icon={<ClipboardList size={16}/>} label="Internal record" onClick={() => setActiveTab('records')} />
          <NavButton active={activeTab === 'projects'} icon={<Activity size={16}/>} label="Project matrix" onClick={() => setActiveTab('projects')} />
          <div className="h-px bg-white/5 my-4 mx-3"></div>
          <NavButton active={activeTab === 'finance'} icon={<DollarSign size={16}/>} label="Finance vault" onClick={() => setActiveTab('finance')} />
          <NavButton active={activeTab === 'settings'} icon={<Settings size={16}/>} label="HQ Settings" onClick={() => setActiveTab('settings')} />
        </nav>
        <div className="p-4 mb-2">
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 w-full p-3 bg-red-500/10 text-red-400 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[9px] uppercase tracking-widest font-black italic">
            <LogOut size={14}/> <span>HQ Log-out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW AREA: SCALE APPLIED */}
      <main className="flex-1 overflow-y-auto flex flex-col relative bg-[#F9FBFC] min-w-0 font-black italic min-h-screen" style={{ zoom: '0.8' }}>
        
        {/* HEADER: MODIFIED WITH PROFILE DROPDOWN */}
        <header className="h-16 bg-white/70 backdrop-blur-xl sticky top-0 border-b border-slate-100 px-8 flex justify-between items-center z-40 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-black italic uppercase tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-4 bg-[#eff2f7] px-6 py-2.5 rounded-full w-96 border border-slate-100">
               <Search size={16} className="text-slate-400" />
               <input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} type="text" placeholder="Search projects, tasks, devs..." className="bg-transparent border-none text-[11px] font-black tracking-widest text-[#000000] outline-none w-full uppercase placeholder:text-slate-400 italic"/>
            </div>
          </div>
          <div className="flex items-center gap-6 relative">
              <div className="relative p-2" onClick={() => setActiveTab('employees')}>
                  <Bell size={20} className={pendingApprovals > 0 ? "text-red-600 animate-bounce" : "text-slate-400"} />
                  {pendingApprovals > 0 && <span className="absolute top-1 right-1 bg-red-600 text-white text-[8px] font-black rounded-full px-1 min-w-[14px] flex items-center justify-center border-2 border-white">{pendingApprovals}</span>}
              </div>
              <div className="flex items-center gap-3 pl-4 cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                  <div className="text-right">
                    <p className="text-[11px] font-black text-[#000000] uppercase italic">Sir Rabnawaz</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">HQ Administrator</p>
                  </div>
                  <div className="size-10 bg-cnDarkGreen text-cnLightGreen rounded-full flex items-center justify-center font-black italic text-lg border-2 border-white">R</div>
              </div>
              {/* DROPDOWN MENU */}
              {isProfileOpen && (
                 <div className="absolute top-16 right-0 w-64 bg-[#0d1629] border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden text-white font-black uppercase italic p-4">
                    <div className="p-3 border-b border-white/5 mb-3">
                        <p className="text-[9px] text-indigo-400 mb-1">Admin Session</p>
                        <p className="text-xs truncate italic">mameerhamzak07@gmail.com</p>
                    </div>
                    <button className="w-full flex items-center gap-2 p-3 text-[10px] hover:bg-white/5 rounded-xl"><User size={14}/> My Profile</button>
                    <button className="w-full flex items-center gap-2 p-3 text-[10px] hover:bg-white/5 rounded-xl"><Settings size={14}/> Account Settings</button>
                    <button onClick={()=>supabase.auth.signOut()} className="w-full flex items-center gap-2 p-3 text-[10px] text-red-400 mt-4 border-t border-white/5 pt-4 hover:brightness-150 transition-all"><LogOut size={14}/> Logout</button>
                 </div>
              )}
          </div>
        </header>

        <div className="p-8 space-y-8">
          
          {/* TAB 1: DASHBOARD (APPROVED CLONE) */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ModernCard label="Active Projects" value={projects.length} icon={<Activity size={24}/>} color="bg-blue-50 text-blue-500" onClick={()=>setActiveTab('projects')}/>
                <ModernCard label="Tasks Completed" value="0" icon={<CheckSquare size={24}/>} color="bg-emerald-50 text-emerald-500"/>
                <div className="bg-white p-8 rounded-[32px] border shadow-sm">
                   <h3 className="text-xs font-black italic flex items-center gap-2"><Calendar size={18} className="text-pink-500"/> DEADLINES</h3>
                   <div className="mt-8 space-y-6"><div className="border-b pb-2 flex justify-between"><p className="text-[10px] font-black italic">TITAN_CORE</p><p className="text-pink-500 text-[10px]">64%</p></div><div className="border-b pb-2 flex justify-between"><p className="text-[10px] font-black italic">NEBULA_APP</p><p className="text-pink-500 text-[10px]">78%</p></div></div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border shadow-sm">
                   <h3 className="text-xs font-black italic flex items-center gap-2 text-amber-500"><AlertCircle size={18}/> URGENT TASKS</h3>
                   <div className="mt-6 space-y-4">
                     <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between text-[8px] font-black italic"><span>OAUTH PROTOCOL FIX</span><div className="size-5 bg-black rounded-full"></div></div>
                     <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between text-[8px] font-black italic"><span>DB_NODE_LATENCY</span><div className="size-5 bg-blue-500 rounded-full"></div></div>
                   </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <WideCard label="Payments Cleared (NET)" value="412,450 PKR" sub="Gross Remittance Ledger" icon={<Wallet/>} color="bg-[#0c3740] text-[#2b945f]" onClick={()=>setActiveTab('finance')}/>
                  <WideCard label="Awaiting payout (Client)" value="85,000 PKR" sub="Pending Inbound Nodes" icon={<Briefcase/>} color="bg-slate-900 text-white" onClick={()=>setActiveTab('finance')}/>
                  <WideCard label="Awaiting payout (Employee)" value="12,500 PKR" sub="Staff Settlement Queue" icon={<UserCheck/>} color="bg-[#5542f0] text-white" onClick={()=>setActiveTab('finance')}/>
              </div>
              <div className="grid lg:grid-cols-12 gap-8 h-[420px]">
                 <div className="lg:col-span-8 bg-white p-10 rounded-[40px] shadow-sm border overflow-hidden relative group">
                    <h3 className="font-black italic text-base uppercase mb-10 underline decoration-indigo-200 decoration-4">Sprint Workload Analysis</h3>
                    <div className="flex items-end justify-between h-48 border-b border-slate-50 px-20">
                        <div className="w-12 bg-indigo-500 rounded-t-xl h-[90%] shadow-lg shadow-indigo-100"></div>
                        <div className="w-12 bg-slate-100 rounded-t-xl h-0 border-2 border-dashed"></div>
                        <div className="w-12 bg-pink-500 rounded-t-xl h-[75%] shadow-lg shadow-pink-100"></div>
                        <div className="w-12 bg-emerald-500 rounded-t-xl h-[92%] shadow-lg shadow-emerald-100"></div>
                    </div>
                    <Sparkles size={60} className="absolute -bottom-10 -right-10 text-slate-100 rotate-45" />
                 </div>
                 <div className="lg:col-span-4 bg-[#0d1629] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-10 text-indigo-400 font-black italic text-xs uppercase"><Clock size={16}/> Recent HQ Activity</div>
                        <div className="space-y-6 ml-1 border-l border-white/5 pl-6 font-black italic text-[9px] uppercase opacity-70">
                            <p><span className="text-indigo-400 font-black">Sarah Chen</span> Audit Completed<br/><span className="text-[8px] opacity-20 italic">2M AGO</span></p>
                            <p><span className="text-indigo-400 font-black">Marcus</span> node updated<br/><span className="text-[8px] opacity-20 italic">45M AGO</span></p>
                        </div>
                    </div>
                    <div className="space-y-4 pt-10">
                        <button onClick={()=>setIsProjectModalOpen(true)} className="w-full flex justify-between bg-white text-black p-5 rounded-2xl font-black italic text-[10px] active:scale-95 shadow-2xl uppercase">Publish Release <Plus size={16}/></button>
                        <button onClick={downloadSystemReport} className="w-full flex justify-between bg-white/5 border border-white/10 text-white p-5 rounded-2xl font-black italic text-[10px] active:scale-95 uppercase">Sprint Report <FileDown size={16}/></button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* TAB 2: STAFF registry (RETAINED FROM ORIGINAL) */}
          {activeTab === 'employees' && (
            <div className="animate-in space-y-6">
              <div className="flex justify-between items-center gap-4 border-b border-slate-100 pb-4">
                 <h2 className="text-3xl font-black italic tracking-tighter text-[#000000] uppercase underline decoration-cnLightGreen decoration-8 underline-offset-8">HQ team node directory</h2>
                 <button onClick={() => setIsModalOpen(true)} className="bg-cnLightGreen text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-xl active:scale-95">Register System member</button>
              </div>
              <div className="bg-white rounded-[35px] shadow-2xl border border-slate-200 overflow-hidden font-black italic uppercase">
                <table className="w-full text-left italic">
                   <thead className="bg-[#f0f4f5] border-b border-slate-200 text-[7.5px] opacity-40 italic tracking-[0.3em]">
                     <tr><th className="px-8 py-5">Internal logical Identity</th><th className="px-8 py-5">Role</th><th className="px-8 py-5 text-center">Status</th><th className="px-8 py-5 text-right">Records</th></tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-[11px]">
                     {filteredEmployees.map(emp => (
                       <tr key={emp.id} className="hover:bg-[#fafcfc] group">
                         <td className="px-8 py-5 flex items-center gap-4"><div className="size-8 bg-black text-cnLightGreen rounded-lg flex items-center justify-center font-bold">{emp.full_name?.charAt(0)}</div>{emp.full_name}</td>
                         <td className="px-8 py-5 opacity-40 italic uppercase">{emp.role}</td>
                         <td className="px-8 py-5 text-center text-cnLightGreen italic"><div className={emp.is_approved ? "" : "text-amber-500"}><ShieldCheck size={14} className="inline"/> {emp.is_approved ? "ACTIVE" : "PENDING"}</div></td>
                         <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                            {!emp.is_approved && <button onClick={async()=> {await supabase.from('profiles').update({is_approved: true}).eq('id', emp.id); fetchSystemData();}} className="bg-black text-cnLightGreen p-1.5 px-4 rounded-lg mr-2">Authorize</button>}
                            <button onClick={()=>deleteEmployee(emp.id)} className="p-1.5 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INTERNAL RECORDS LEDGER (FULL RESTORE) */}
          {activeTab === 'records' && (
            <div className="animate-in space-y-6">
                <div className="flex justify-between items-center border-b border-CN-LIGHT pb-5 italic font-black uppercase">
                    <div>
                        <h2 className="text-2xl text-[#000000] underline decoration-[#000000]/10 italic font-black">Ledger internal logic</h2>
                        <div className="flex items-center gap-3 text-cnLightGreen mt-2"><div className="size-1.5 bg-cnLightGreen rounded-full"></div> <p className="text-[9px] tracking-widest opacity-60">Record tracking: Automated System audit v4</p></div>
                    </div>
                </div>
                <div className="bg-white rounded-[30px] border shadow-2xl border-slate-100 overflow-hidden italic font-black">
                    <table className="w-full text-left font-black uppercase italic">
                        <thead className="bg-[#0c3740] text-white">
                            <tr className="text-[7.5px] tracking-widest opacity-70">
                                <th className="px-8 py-5 italic font-black uppercase">operational cycle Identifier</th>
                                <th className="px-8 py-5 text-center italic font-black uppercase">Protocol stakeholder Name</th>
                                <th className="px-8 py-5 text-center italic font-black uppercase italic font-black">Payment vector logic</th>
                                <th className="px-8 py-5 text-right font-black italic uppercase italic font-black">Record risk State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic font-black text-[#000000] text-[11px]">
                            {projects.map((p, x) => (
                                <tr key={x} className="hover:bg-[#fafcfc]">
                                   <td className="px-8 py-5 text-[11px] font-mono tracking-widest italic opacity-20 uppercase font-black">CY-2025/12 RMN-0${x}</td>
                                   <td className="px-8 py-5 text-[#000000] font-black text-center italic font-black uppercase">{p.client_name}</td>
                                   <td className="px-8 py-5 text-center text-cnDarkGreen opacity-40 font-black italic uppercase font-black italic font-black uppercase italic font-black uppercase italic font-black">Wait Protocol : clearance in Dec</td>
                                   <td className="px-8 py-5 text-right italic font-black">
                                       <span className={`text-[8.5px] p-2 py-0.5 rounded border italic ${checkMaintenanceAlert(p.last_report_date) ? 'text-red-500 border-red-500/20' : 'text-cnLightGreen border-cnLightGreen/20 opacity-40 font-black italic font-black italic font-black'}`}>
                                         {checkMaintenanceAlert(p.last_report_date) ? "SIGNAL FAILURE REQ AUDIT" : "SYCHRONIZATION ACTIVE"}
                                       </span>
                                   </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {/* TAB 6: HQ SETTINGS (FULL RESTORE) */}
          {activeTab === 'settings' && (
             <div className="animate-in space-y-12 pb-20">
                <div className="flex justify-between items-start border-b-8 border-slate-50 pb-8 italic font-black uppercase">
                    <div>
                        <h2 className="text-4xl text-[#000000] tracking-tighter italic underline decoration-[#1a1a1a]/10 underline-offset-4 italic font-black uppercase">HQ Commands parameters layer</h2>
                        <p className="text-[9.5px] opacity-40 tracking-[0.45em] mt-3 italic leading-none font-bold uppercase font-black">Administrator Access Layer v4.1 operational</p>
                    </div>
                    <button onClick={downloadSystemReport} className="bg-white text-cnDarkGreen p-4 border border-slate-200 rounded-3xl shadow-xl flex items-center gap-4 active:scale-95 transition-all font-black uppercase italic text-[9.5px]"><Printer size={18} className="animate-bounce" /> Audit PDF Report</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 italic uppercase font-black italic font-black">
                   <section className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-xl space-y-10 relative overflow-hidden italic font-black uppercase">
                      <h4 className="text-[12px] uppercase text-[#000000] tracking-widest underline decoration-cnLightGreen decoration-2 italic font-black italic font-black italic font-black">operational cycle modifiers logic</h4>
                      <div className="space-y-10 font-black uppercase italic">
                          <div className="space-y-4"><label className="text-[10.5px] opacity-50 block italic tracking-widest font-black uppercase">Node Timeout window (SPAN_DAYS)</label> <input type="number" value={gracePeriod} onChange={e=>setGracePeriod(e.target.value)} className="w-full bg-slate-50 p-6 rounded-[35px] text-2xl outline-none italic uppercase font-black"/></div>
                          <div className="space-y-4 pt-4"><label className="text-[10.5px] opacity-50 block italic tracking-widest font-black uppercase">USD/PKR EXCHANGE LOGIC UNIT</label> <div className="bg-slate-50 flex items-center p-6 rounded-[38px]"><p className="text-xs opacity-30 mr-6 font-black uppercase italic font-black">INDEX_RATE</p><input type="number" value={marketRate} onChange={e=>setMarketRate(e.target.value)} className="flex-1 bg-transparent text-2xl outline-none font-black italic uppercase font-black"/></div></div>
                      </div>
                      <button className="w-full bg-cnLightGreen py-6 rounded-3xl font-black italic text-lg shadow-cnLightGreen/20 shadow-xl border-b-8 border-cnDarkGreen">Authorize modification</button>
                   </section>
                   <div className="space-y-8 font-black uppercase italic italic font-black italic font-black uppercase">
                      <div className="bg-white rounded-[50px] p-10 border border-slate-100 shadow-xl space-y-6">
                           <h4 className="text-[10px] uppercase underline decoration-indigo-200 font-black italic">Local Currency disburasal calculator engine</h4>
                           <div className="bg-slate-50 p-8 rounded-[40px] font-black italic uppercase italic font-black italic font-black"><p className="text-[9px] opacity-40 mb-3 italic uppercase font-black font-black uppercase italic font-black italic">USD_IDENTIFIER</p><input type="number" onChange={e=>setCalcUsd(e.target.value)} value={calcUsd} className="bg-white border p-6 rounded-3xl w-full text-3xl font-black mb-6 italic outline-none uppercase font-black font-black font-black font-black italic font-black font-black"/><div className="h-px bg-slate-200 mb-6"></div><div className="bg-cnDarkGreen text-cnLightGreen p-10 rounded-[35px] text-center font-black italic"><p className="text-[9.5px] opacity-40 mb-4 italic uppercase">YIELD OUTPUT PAKISTANI_PKR</p><p className="text-3xl font-black">{(calcUsd * marketRate).toLocaleString()}.00 PKR</p></div></div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* PROJECT MATRIX (RETAINED FROM ORIGINAL) */}
          {activeTab === 'projects' && (
             <div className="animate-in space-y-6 italic uppercase font-black italic font-black">
                <h2 className="text-2xl font-black tracking-tighter pb-10 border-b">Active project subscription Matrix</h2>
                <div className="grid md:grid-cols-4 gap-6 font-black italic">
                   {filteredProjects.map(proj => (
                      <div key={proj.id} className="bg-white rounded-[40px] p-8 border hover:shadow-2xl transition-all cursor-pointer group">
                          <h4 className="text-black mb-2 text-base uppercase font-black">{proj.project_name}</h4>
                          <p className="text-cnLightGreen text-[9.5px] italic mb-10 opacity-60">CLIENT ID: {proj.client_name}</p>
                          <div className="border-t pt-5"><button onClick={()=>setIsProjectModalOpen(true)} className="p-3 bg-black text-white rounded-xl shadow-lg transition-transform active:rotate-180 duration-500 group-hover:bg-cnLightGreen group-hover:text-black transition-all"><RefreshCcw size={16}/></button></div>
                      </div>
                   ))}
                </div>
             </div>
          )}

        </div>
      </main>

      {/* MODAL ID HANDSHAKE (RETAINED FROM ORIGINAL) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/95 backdrop-blur-2xl z-[999] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-[38px] overflow-hidden border-4 border-cnLightGreen">
              <div className="bg-[#000000] p-10 text-cnLightGreen flex justify-between font-black uppercase italic italic"><h4>HQ ID Handshake</h4><X onClick={()=>setIsModalOpen(false)} size={20} className="text-red-500 cursor-pointer"/></div>
              <form onSubmit={handleAddEmployee} className="p-10 space-y-6 uppercase italic italic uppercase font-black italic font-black"> <input placeholder="CORE NAME" className="w-full bg-slate-50 p-6 rounded-3xl outline-none" onChange={e=>setNewEmp({...newEmp, full_name: e.target.value})}/><button className="w-full bg-[#000000] text-cnLightGreen py-6 rounded-[30px] font-black italic border-b-8 border-cnLightGreen">REGISTER CORE NODE</button></form>
           </div>
        </div>
      )}

    </div>
  );
}

// SHARED INTERFACE NODES
function NavButton({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all relative
    ${active ? 'bg-cnLightGreen text-[#000000] shadow-[0_20px_40px_-10px_#2b945fcc] scale-105 translate-x-2' : 'text-white/30 hover:text-white/60 opacity-80 italic'}`}>
      <span className={active ? 'bg-white p-1.5 rounded-xl' : 'opacity-40'}>{icon}</span> {label}
    </button>
  );
}

function ModernCard({ label, value, icon, color, onClick }) {
  return (
    <div onClick={onClick} className="bg-white p-8 rounded-[32px] border shadow-sm hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-2 relative duration-300">
       <div className="flex justify-between w-full mb-6">
         <div className={`p-4 ${color} rounded-[22px] transition-all group-hover:scale-110 duration-500`}>{icon}</div>
         <p className="text-[8px] text-slate-300 font-black italic tracking-widest group-hover:text-black uppercase">VIEW DETAIL</p>
       </div>
       <h4 className="text-4xl text-black font-black italic uppercase leading-none font-black uppercase">{value}</h4>
       <p className="text-[10px] text-slate-400 font-black mt-2 italic uppercase font-black uppercase">{label}</p>
    </div>
  );
}

function WideCard({ label, value, sub, icon, color, onClick }) {
    return (
      <div onClick={onClick} className={`${color} p-8 rounded-[35px] shadow-xl flex items-center justify-between group overflow-hidden active:scale-95 transition-all cursor-pointer`}>
         <div className="relative z-10 font-black uppercase italic italic font-black uppercase">
            <p className="text-[8.5px] opacity-40 mb-2 uppercase tracking-[0.2em]">{label}</p>
            <h4 className="text-2xl font-black uppercase tracking-tighter italic">{value}</h4>
            <p className="text-[9px] opacity-20 uppercase tracking-[0.4em] font-mono mt-2 italic">{sub}</p>
         </div>
         <div className="bg-white/10 p-5 rounded-full transition-all group-hover:rotate-12">{icon}</div>
      </div>
    );
}