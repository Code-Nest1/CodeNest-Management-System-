import React from 'react';
import { supabase } from '../supabaseClient';
import { Users, LayoutDashboard, Briefcase, DollarSign, LogOut, BellRing } from 'lucide-react';

export default function AdminDashboard() {
  const handleLogout = () => supabase.auth.signOut();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-cnDarkGreen text-cnWhite p-6 space-y-8">
        <h2 className="text-2xl font-bold border-b border-cnLightGreen pb-4">Code Nest</h2>
        <nav className="space-y-4">
          <div className="flex items-center space-x-3 text-cnLightGreen cursor-pointer p-2 rounded hover:bg-cnWhite hover:bg-opacity-10 transition">
            <LayoutDashboard size={20} />
            <span className="font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center space-x-3 text-cnGrey cursor-pointer p-2 hover:text-white transition">
            <Users size={20} />
            <span>Employees</span>
          </div>
          <div className="flex items-center space-x-3 text-cnGrey cursor-pointer p-2 hover:text-white transition">
            <Briefcase size={20} />
            <span>Projects</span>
          </div>
          <div className="flex items-center space-x-3 text-cnGrey cursor-pointer p-2 hover:text-white transition">
            <DollarSign size={20} />
            <span>Finance/Salaries</span>
          </div>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 text-red-400 mt-20 p-2 w-full hover:bg-red-500 hover:text-white rounded transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-cnDarkGreen">Admin Management</h1>
          <div className="relative">
             <BellRing className="text-cnGrey" size={28} />
             {/* This red dot appears if maintenance is due */}
             <span className="absolute -top-1 -right-1 bg-red-600 w-3 h-3 rounded-full border-2 border-white"></span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-cnLightGreen">
            <p className="text-cnGrey text-sm font-bold uppercase">Total Remote Staff</p>
            <h3 className="text-4xl font-bold text-cnDarkGreen mt-2">12</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-cnLightGreen">
            <p className="text-cnGrey text-sm font-bold uppercase">Pending Salaries</p>
            <h3 className="text-4xl font-bold text-red-600 mt-2">PKR 45k</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-cnLightGreen">
            <p className="text-cnGrey text-sm font-bold uppercase">Reports Due</p>
            <h3 className="text-4xl font-bold text-cnDarkGreen mt-2">3</h3>
          </div>
        </div>

        {/* This is where the specific features will go */}
        <div className="mt-10 bg-white p-8 rounded-2xl shadow-sm min-h-[400px]">
           <p className="text-cnGrey italic">Dashboard overview is ready. Sir Rabnawaz, select a category from the sidebar to manage data.</p>
        </div>
      </div>
    </div>
  );
}