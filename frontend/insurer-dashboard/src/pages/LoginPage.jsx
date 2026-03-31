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
      console.log("Login attempt:", { username, password });
      navigate("/claims");
    }, 800);
  };

  return (
    <div style={styles.wrapper}>
      {/* Animated background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      {/* Login card */}
      <div style={styles.card}>
        {/* Logo / Brand */}
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 style={styles.brandName}>GigShield</h1>
          <p style={styles.brandSub}>Insurer Dashboard</p>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="Enter your username"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#f59e0b";
                  e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter your password"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#f59e0b";
                  e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 8px 25px rgba(245, 158, 11, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(245, 158, 11, 0.3)";
            }}
          >
            {isLoading ? (
              <span style={styles.spinner} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p style={styles.footer}>
          Protected by <span style={{ color: "#f59e0b", fontWeight: 600 }}>GigShield</span> Security
        </p>
      </div>

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes blob1Move {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes blob2Move {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.15); }
          66% { transform: translate(25px, -40px) scale(0.95); }
        }
        @keyframes blob3Move {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, 40px) scale(1.05); }
          66% { transform: translate(-30px, -30px) scale(1.1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 30%, #fde68a 60%, #fcd34d 100%)",
    overflow: "hidden",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  blob1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)",
    top: "-100px",
    right: "-80px",
    animation: "blob1Move 8s ease-in-out infinite",
  },
  blob2: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)",
    bottom: "-120px",
    left: "-60px",
    animation: "blob2Move 10s ease-in-out infinite",
  },
  blob3: {
    position: "absolute",
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(252,211,77,0.2) 0%, transparent 70%)",
    top: "50%",
    left: "15%",
    animation: "blob3Move 12s ease-in-out infinite",
  },
  card: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "420px",
    padding: "40px",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(0, 0, 0, 0.04)",
    animation: "fadeInUp 0.6s ease-out",
    boxSizing: "border-box",
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "8px",
  },
  logoIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
  },
  brandName: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 4px",
    letterSpacing: "-0.5px",
  },
  brandSub: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
    fontWeight: 400,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(to right, transparent, #e2e8f0, transparent)",
    margin: "24px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    letterSpacing: "0.3px",
    textTransform: "uppercase",
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "12px 14px 12px 44px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    fontSize: "15px",
    color: "#1e293b",
    background: "rgba(255, 255, 255, 0.8)",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    letterSpacing: "0.3px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)",
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "48px",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.6s linear infinite",
  },
  footer: {
    textAlign: "center",
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "24px",
    marginBottom: 0,
  },
};
