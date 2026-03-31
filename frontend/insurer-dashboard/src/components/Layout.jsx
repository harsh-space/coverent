import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const location = useLocation();
  const adminName = localStorage.getItem("adminName") || "Admin";
  return (
    <div style={styles.wrapper}>
      {/* Animated background blobs from login page */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div className="flex h-screen w-full relative z-10 overflow-hidden font-sans">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Top Header */}
          <header className="bg-white/70 backdrop-blur-xl border-b border-white/40 h-20 flex items-center justify-between px-8 shrink-0 shadow-sm z-20">
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
              Insurer Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/60 border border-white/80 px-4 py-2 rounded-2xl shadow-sm">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-800 leading-tight">
                    {adminName}
                  </span>
                  <span className="text-xs font-medium text-amber-600 leading-tight">Admin</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 relative z-10">
            <div className="max-w-7xl mx-auto min-h-full pb-12">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <style>{`
        @keyframes layoutBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes layoutBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.15); }
          66% { transform: translate(25px, -40px) scale(0.95); }
        }
        @keyframes layoutBlob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, 40px) scale(1.05); }
          66% { transform: translate(-30px, -30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 30%, #fde68a 60%, #fcd34d 100%)",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)",
    top: "-150px",
    right: "-100px",
    animation: "layoutBlob1 15s ease-in-out infinite",
  },
  blob2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)",
    bottom: "-200px",
    left: "10%",
    animation: "layoutBlob2 18s ease-in-out infinite",
  },
  blob3: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(252,211,77,0.2) 0%, transparent 70%)",
    top: "40%",
    left: "40%",
    animation: "layoutBlob3 20s ease-in-out infinite",
  }
};
