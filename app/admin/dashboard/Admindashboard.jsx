"use client";

import React, { useState } from "react";
import { Briefcase, Package, LayoutGrid, Settings, LogOut, ChevronRight } from "lucide-react";
import ProductsTab from "./Productstab";
import ProjectsTab from "./Projectstab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="flex min-h-screen  text-slate-900 font-sans antialiased">

      {/* --- SIDEBAR --- */}
      <aside className="w-80 bg-white border-r border-slate-200 fixed h-full z-20 hidden lg:flex flex-col shadow-xl shadow-slate-200/50">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Briefcase className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800">STUDIO<span className="text-indigo-600">.</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control Panel v2.5</p>
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarItem
              icon={<Package size={20} />}
              label="Shop Products"
              active={activeTab === "products"}
              onClick={() => setActiveTab("products")}
            />
            <SidebarItem
              icon={<LayoutGrid size={20} />}
              label="Portfolio Projects"
              active={activeTab === "projects"}
              onClick={() => setActiveTab("projects")}
            />
            <div className="pt-6 pb-2 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">System</div>
            <SidebarItem icon={<Settings size={20} />} label="Settings" />
            <SidebarItem icon={<LogOut size={20} />} label="Logout" danger />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">API Server Online</span>
          </div>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="flex-1 lg:ml-80 p-6 lg:p-12">
        {activeTab === "products" ? <ProductsTab /> : <ProjectsTab />}
      </main>

      {/* Global CSS for Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
        active
          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
          : danger
            ? "text-red-400 hover:bg-red-50"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className={active ? "text-white" : danger ? "text-red-400" : "text-indigo-400"}>{icon}</span>
      {label}
      {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
    </button>
  );
}