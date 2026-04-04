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
    <div className="fixed inset-0 flex items-center justify-center font-sans text-ui-black bg-brand-light animate-fade-in">
      
      {/* Background Blobs (Kept as simple clean solid shapes to avoid 'glassmorphism' blurry look) */}
      <div className="absolute w-[600px] h-[600px] rounded-full top-[-150px] right-[-100px] opacity-20 bg-brand-yellow pointer-events-none animate-pulse" />
      <div className="absolute w-[500px] h-[500px] rounded-full bottom-[-200px] left-[-100px] opacity-10 bg-brand-dark pointer-events-none animate-pulse delay-700" />

      {/* Main Login UI - Proper Web Page Card Layout */}
      <div className="relative z-10 w-full max-w-[440px] px-8 py-10 bg-ui-white rounded-[2.5rem] shadow-xl border border-ui-gray-light/50 flex flex-col items-center">
        
        {/* Logo Section - Consistent with Rider PWA Design */}
        <div className="text-center mb-10 w-full">
          <div className="text-brand-yellow w-16 h-16 mx-auto mb-4 flex items-center justify-center">
             <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
             </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-1 text-ui-black">Coverent</h1>
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
            className={`btn-primary w-full mt-4 ${(!username || !password) ? 'opacity-50 grayscale cursor-not-allowed shadow-none' : ''}`}
          >
            {isLoading ? "Verifying..." : "Authorize Access →"}
          </button>
        </form>

        <p className="mt-8 text-[10px] font-black uppercase text-ui-gray-dark/40 tracking-widest">
          End-to-End Encryption <span className="text-status-green ml-1">Active</span>
        </p>
      </div>
    </div>
  );
}
