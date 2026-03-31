import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const adminName = localStorage.getItem("adminName") || "Admin";
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-ui-white text-ui-black font-sans antialiased overflow-hidden w-full">
      {/* Sidebar - Matching PWA's light, clean branding */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 bg-ui-white" style={{ backgroundColor: "#FAFAFA" }}>
        {/* Cleaner PWA-inspired Header */}
        <header className="h-20 bg-ui-white border-b border-ui-gray-light flex items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center">
            <h1 className="text-3xl font-black tracking-tight text-ui-black">Insurer Dashboard</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold tracking-tight text-ui-black leading-none mb-1">{adminName}</p>
                <p className="text-[10px] font-black tracking-widest text-brand-dark uppercase leading-none">Security Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-ui-gray-light flex items-center justify-center border-2 border-brand-yellow font-black text-ui-black">
                {adminName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Scrolling Content Area - Clean Gray/White */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
