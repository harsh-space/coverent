import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("adminName", username || "Admin");
      navigate("/claims");
    }, 800);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center font-sans text-ui-black bg-transparent animate-fade-in">
      
      {/* Main Login UI - Proper Web Page Card Layout */}
      <div className="relative z-10 w-full max-w-[440px] px-8 py-10 glass-card bg-ui-white/90 border border-ui-black/10 flex flex-col items-center">
        
        {/* Logo Section - Consistent with Rider PWA Design */}
        <div className="text-center mb-10 w-full flex flex-col items-center">
          <div className="w-20 h-20 bg-ui-black rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgb(0,0,0,0.15)] transform -rotate-3 mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-ui-black mb-2">Coverent</h1>
          <p className="text-sm font-bold text-ui-gray-dark">Insurer Gateway Authentication</p>
        </div>

        {/* Login Form - Username/Password as requested */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-1">
            <label className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest pl-1">Operator ID</label>
            <input 
              type="text" 
              placeholder="e.g. ADM-8821" 
              className="clean-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest pl-1">Secure Passkey</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="clean-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading || !username || !password}
            className={`btn-primary w-full mt-4 flex items-center justify-center gap-2 ${(!username || !password) ? 'opacity-50 grayscale cursor-not-allowed shadow-none border-ui-gray-light' : ''}`}
          >
            {isLoading ? (
               <><div className="w-5 h-5 border-2 border-ui-white border-t-transparent rounded-full animate-spin"></div> Verifying...</>
            ) : "Authorize Access →"}
          </button>
        </form>

        <p className="mt-8 text-[10px] font-black uppercase text-ui-gray-dark/40 tracking-widest">
          End-to-End Encryption <span className="text-status-green ml-1">Active</span>
        </p>
      </div>
    </div>
  );
}
