import { ShieldAlert, ShieldCheck, CloudRain, Clock, MapPin, Activity, Navigation, CheckCircle2, AlertCircle, LogOut, Radio, Wifi, Globe, Shield, Thermometer, Gauge, Zap, RotateCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CONFIG from '../config';
import { useToast } from '../components/Toast';
import { requestForToken, onMessageListener } from '../firebase';

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newClaimNotify, setNewClaimNotify] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [expandedClaim, setExpandedClaim] = useState(null);

  // Auto-dismiss the claim notification after 8 seconds
  useEffect(() => {
    if (newClaimNotify) {
      const timer = setTimeout(() => {
        setNewClaimNotify(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [newClaimNotify]);

  // Refs for background interval stability
  const payoutCountRef = useRef(-1);
  const riderIdRef = useRef(localStorage.getItem('rider_id'));

  useEffect(() => {
    const fetchProfile = async () => {
      const rider_id = riderIdRef.current;

      if (!rider_id) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/riders/profile/${rider_id}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch rider profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Dashboard: Fetch error:', err);
        setError(err.message);
        addToast('Sync failed: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    const pollPayouts = setInterval(async () => {
      const r_id = riderIdRef.current;
      if (!r_id) return;

      try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/riders/profile/${r_id}`);
        if (res.ok) {
          const data = await res.json();
          setIsOffline(false);
          const history = data.payout_history || [];
          const currentCount = history.length;

          if (payoutCountRef.current === -1) {
            payoutCountRef.current = currentCount;
            setProfile(data); // Initial sync
          } else if (currentCount > payoutCountRef.current) {
            // New claim detected!
            setNewClaimNotify(history[0]);
            setProfile(data); 
            payoutCountRef.current = currentCount;
          }
        } else {
          setIsOffline(true);
        }
      } catch (e) {
        setIsOffline(true);
      }
    }, 10000);

    return () => clearInterval(pollPayouts);
  }, [navigate]);

  // Setup Firebase Cloud Messaging (FCM)
  useEffect(() => {
    const setupFCM = async () => {
      const rider_id = riderIdRef.current;
      if (!rider_id) return;
      
      try {
        // This will trigger the browser's Notification Permission prompt
        const token = await requestForToken();
        if (token) {
          console.log("FCM Token retrieved, syncing to backend...");
          await fetch(`${CONFIG.API_BASE_URL}/riders/profile/${rider_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fcm_token: token })
          });
        }
      } catch (err) {
        console.warn("FCM Setup failed (Check placeholder keys):", err);
      }
    };
    
    setupFCM();

    // Listen for foreground messages
    const listenForeground = async () => {
      try {
        const payload = await onMessageListener();
        console.log("Foreground message received:", payload);
        if (payload?.notification) {
          addToast(payload.notification.title, 'success');
        }
        // Rekey listener for the next message
        listenForeground();
      } catch (err) {
        console.log('FCM listen error: ', err);
      }
    };
    listenForeground();
  }, [addToast]);

  const handleLogout = () => {
    localStorage.removeItem('rider_id');
    navigate('/');
  };

  // Helper to format the valid_until date
  const formatValidUntil = (isoString) => {
    if (isoString) {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-IN', { weekday: 'long' }) + ', 11:59 PM';
    }
    // Default to the upcoming Sunday
    const now = new Date();
    const nextSunday = new Date();
    nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
    if (now.getDay() === 0) nextSunday.setDate(now.getDate() + 7); // If today is Sunday, move to next
    return nextSunday.toLocaleDateString('en-IN', { weekday: 'long' }) + ', 11:59 PM';
  };

  const isPolicyExpired = () => {
    if (!profile?.active_policy || !profile?.valid_until) return true;
    return new Date() > new Date(profile.valid_until);
  };

  const getPolicyName = (type) => {
    if (type === 'suraksha_basic') return 'Suraksha Lite';
    if (type === 'suraksha_plus') return 'Suraksha Plus';
    if (type === 'bima_elite') return 'Suraksha Max';
    return type || 'No Active Policy';
  };

  const activePolicy = {
    plan: isPolicyExpired() ? 'No Active Policy' : getPolicyName(profile?.policy_type),
    status: (profile?.active_policy && !isPolicyExpired()) ? 'ACTIVE' : 'INACTIVE',
    validUntil: formatValidUntil(profile?.valid_until),
    zone: profile?.dark_store_pincode ? `Zone ${profile.dark_store_pincode}` : 'Not Set',
    coverage: profile?.policy_type === 'suraksha_basic' ? 420 : profile?.policy_type === 'suraksha_plus' ? 630 : 805,
  };

  // Direct mapping to ensure no data loss between renders, limited to latest 5
  const claims = Array.isArray(profile?.payout_history) ? profile.payout_history.slice(0, 5) : [];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center font-black animate-pulse bg-ui-white p-6">
        <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg">Loading Coverent Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-ui-white text-center">
        <AlertCircle className="w-16 h-16 text-status-red mb-4" strokeWidth={2.5} />
        <h2 className="text-2xl font-black mb-2">Sync Error</h2>
        <p className="text-ui-gray-dark font-bold mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary w-full"
        >
          Try Again
        </button>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm font-black text-ui-gray-dark uppercase tracking-widest"
        >
          Back to Login
        </button>
      </div>
    );
  }

  const displayName = profile?.name || 'Rider';
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex-1 flex flex-col pt-8 px-4 animate-fade-in relative min-h-[100dvh] text-ui-black bg-transparent">
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-status-red text-ui-white py-1 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-center z-[200] animate-pulse">
          ⚠️ Oracle Network Offline - Link Lost
        </div>
      )}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">{displayName}</h1>
          <p className="text-sm font-bold text-ui-gray-dark uppercase tracking-widest">Rider Dashboard</p>
        </div>
        <div className="w-14 h-14 bg-brand-yellow rounded-2xl flex items-center justify-center font-black text-2xl shadow-[0_8px_30px_rgb(255,222,0,0.3)] border border-brand-dark/20 text-ui-black">
          {displayInitial}
        </div>
      </div>

      {newClaimNotify && (
        <div 
          className="fixed inset-x-4 top-8 z-[200] animate-bounce-in cursor-pointer"
          onClick={() => setNewClaimNotify(null)}
        >
          <div className="bg-status-green p-5 rounded-3xl shadow-[0_20px_50px_rgba(40,199,111,0.3)] border-2 border-ui-white/20 flex items-center gap-4 relative overflow-hidden backdrop-blur-md">
            {/* Animated progress bar for auto-dismiss */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-shrink-width" style={{ width: '100%' }}></div>
            
            <div className="p-3 bg-ui-white/20 rounded-2xl">
              <CheckCircle2 className="text-ui-white w-7 h-7" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <p className="text-ui-white text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-0.5">Instant Payout Settled</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-ui-white text-2xl font-black tracking-tight">₹{newClaimNotify.amount}</span>
                <span className="text-ui-white/80 text-[10px] font-bold uppercase tracking-tight">to UPI</span>
              </div>
              <p className="text-ui-white/90 text-xs font-bold mt-1 decoration-ui-white/30 truncate max-w-[200px]">
                Reason: {newClaimNotify.trigger_type.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <div className="p-2 hover:bg-ui-white/10 rounded-full transition-colors shrink-0">
               <Radio className="text-ui-white/40 w-5 h-5 animate-pulse" strokeWidth={3} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-6 space-y-6 custom-scrollbar pr-1">

        {/* Active Policy Card */}
        <section>
          <div className="bg-ui-black text-ui-white rounded-3xl p-6 shadow-[0_20px_40px_rgb(0,0,0,0.15)] relative overflow-hidden transition-all hover:shadow-[0_20px_50px_rgb(0,0,0,0.25)] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <span className="text-[10px] font-black text-ui-white/50 tracking-widest uppercase mb-1.5 block">Active Coverage</span>
                <h2 className="text-3xl font-black mb-1">{activePolicy.plan}</h2>
                <p className="text-sm font-medium text-ui-white/80">Valid till {activePolicy.validUntil}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-status-green/10 text-status-green px-3 py-1.5 rounded-full text-xs font-black shadow-inner shrink-0 border border-status-green/20">
                <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
                {activePolicy.status}
              </div>
            </div>

            <div className="bg-ui-white/5 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 relative z-10 border border-ui-white/10 mt-6 group">
              <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-yellow group-hover:scale-110 transition-transform">
                 <MapPin className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-ui-white/50 uppercase tracking-widest mb-0.5">Monitoring Zone</p>
                <p className="text-lg font-black leading-tight text-ui-white">{activePolicy.zone}</p>
              </div>
            </div>

            {/* Premium decorative shapes instead of simple icon */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <ShieldCheck className="absolute -bottom-6 -right-6 w-36 h-36 text-ui-white opacity-[0.03] pointer-events-none" />
          </div>

          {profile && !profile.is_eligible_for_policy && (
            <div className="bg-ui-white border border-[#FF3B30] p-3 rounded-xl mt-3 shadow-sm flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-[#FF3B30] shrink-0" strokeWidth={2.5} />
              <div>
                <p className="text-sm font-black text-[#FF3B30] leading-tight mb-1">Claim Payouts Restricted</p>
                <p className="text-xs font-bold text-ui-gray-dark">
                  You need <strong className="text-ui-black">{7 - (profile.active_days_count || 0)} more active days</strong> on the platform before auto-claims will trigger. Complete your shifts to unlock full protection.
                </p>
              </div>
            </div>
          )}

          {profile && !profile.active_policy && (
            <div className="glass-card border-2 border-brand-yellow/30 p-5 rounded-3xl mt-4 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-black text-xl mb-2 flex justify-center items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-status-orange" strokeWidth={2.5} />
                  You're Unprotected
                </h3>
                <p className="text-sm font-medium text-ui-gray-dark mb-5 px-2">
                  Set up your customizable gig insurance policy now to lock in your tailored premium based on your zone profile.
                </p>
                <button
                  onClick={() => navigate('/risk-profile')}
                  className="btn-accent w-full text-sm py-4 flex justify-center items-center gap-2"
                >
                  Set Up Insurance Now <Zap className="w-4 h-4" fill="currentColor" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Live System Status */}
        <section className="mt-8">
          <h3 className="text-sm font-black mb-4 text-ui-gray-dark uppercase tracking-widest flex items-center gap-2">
            <Gauge className="w-4 h-4" strokeWidth={3} /> System Diagnostics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Weather */}
            <div className="glass-card p-4 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)]">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                  <CloudRain className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
              </div>
              <p className="text-[10px] font-bold text-ui-gray-dark uppercase tracking-widest mb-1">Env Node</p>
              <p className="text-base font-black flex items-center gap-1">
                Clear Sky
              </p>
            </div>

            {/* Card 2: Platform */}
            <div className="glass-card p-4 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)]">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Globe className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
              </div>
              <p className="text-[10px] font-bold text-ui-gray-dark uppercase tracking-widest mb-1">Platform API</p>
              <p className="text-base font-black flex items-center gap-1 leading-tight">
                {profile?.platform?.replace('swiggy_', '').replace('_', ' ').toUpperCase() || 'SYNCING'}
              </p>
            </div>

            {/* Card 3: Zone Risk Score */}
            <div className="glass-card p-4 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] group">
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${(profile?.risk_score || 0) < 40 ? 'bg-status-green/10 text-status-green' : (profile?.risk_score || 0) < 80 ? 'bg-status-orange/10 text-status-orange' : 'bg-status-red/10 text-status-red'}`}>
                  <Activity className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className={`w-2 h-2 rounded-full ${(profile?.risk_score || 0) < 80 ? 'bg-status-green' : 'bg-status-orange'} animate-pulse`} />
              </div>
              <p className="text-[10px] font-bold text-ui-gray-dark uppercase tracking-widest mb-1">Risk Rating</p>
              <div className={`text-base font-black flex items-center gap-2 group-hover:scale-105 transition-transform`}>
                {profile?.risk_score || 74}<span className="text-xs font-medium text-ui-gray-dark">/100</span>
              </div>
            </div>

            {/* Card 4: Regional Risk */}
            <div className="glass-card p-4 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)]">
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${profile?.active_policy ? 'bg-brand-yellow/20 text-brand-dark' : 'bg-ui-gray-light text-ui-gray-dark'}`}>
                  <Shield className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className={`w-2 h-2 rounded-full ${profile?.active_policy ? 'bg-status-green' : 'bg-status-orange'} animate-pulse`} />
              </div>
              <p className="text-[10px] font-bold text-ui-gray-dark uppercase tracking-widest mb-1">Zone Status</p>
              <p className="text-base font-black flex items-center gap-1">
                {profile?.active_policy ? 'Protected' : 'Low'}
              </p>
            </div>
          </div>
        </section>

        {/* Claim History */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-ui-gray-dark uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4" strokeWidth={3} /> Recent Payouts
            </h3>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const rider_id = localStorage.getItem('rider_id');
                  const res = await fetch(`${CONFIG.API_BASE_URL}/riders/profile/${rider_id}`);
                  if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    addToast('Synced successfully', 'success');
                  }
                } catch (err) {
                  addToast('Manual sync failed', 'error');
                } finally {
                  setLoading(false);
                }
              }}
              className="p-2 hover:bg-ui-gray-light/50 rounded-full transition-all"
              title="Sync Claims"
            >
              <RotateCw className="w-4 h-4 text-ui-gray-dark hover:rotate-180 transition-transform duration-500" strokeWidth={3} />
            </button>
          </div>

          <div className="space-y-3">
            {claims.length > 0 ? (
              claims.map(claim => (
                <div
                  key={claim.payout_id}
                  onClick={() => setExpandedClaim(expandedClaim === claim.payout_id ? null : claim.payout_id)}
                  className={`glass-card p-0 flex flex-col overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] ${expandedClaim === claim.payout_id ? 'ring-2 ring-ui-black/10' : ''}`}
                >
                  <div className="p-4 flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-xl ${expandedClaim === claim.payout_id ? 'bg-ui-black text-ui-white' : 'bg-status-green/10 text-status-green'} flex items-center justify-center shrink-0 transition-colors duration-300`}>
                      <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-black text-sm uppercase tracking-tight">{claim.trigger_type.replace('_', ' ')}</h4>
                        <span className="font-black text-status-green text-lg shrink-0">+₹{claim.amount}</span>
                      </div>
                      <p className="text-[11px] font-medium text-ui-gray-dark">
                        Instant Settlement via UPI
                      </p>
                    </div>
                  </div>

                  {/* Expandable Tray */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedClaim === claim.payout_id ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pb-4 bg-ui-white/50 border-t border-ui-black/5">
                      <div className="pt-4 pb-2 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-ui-gray-dark font-medium">Reference ID</span>
                          <span className="font-mono font-bold text-ui-black">TXN-{claim.payout_id.split('-')[0].toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-ui-gray-dark font-medium">Settled On</span>
                          <span className="font-bold text-ui-black">{new Date(claim.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-ui-gray-dark font-medium">Severity Log</span>
                          <span className="font-bold text-ui-black">{claim.tier_percentage}% Payout Triggered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card p-8 text-center border-dashed">
                <p className="text-sm font-medium text-ui-gray-dark opacity-60">No recent claims detected in your zone.</p>
              </div>
            )}
          </div>
        </section>

        {/* Logout Option */}
        <section className="pt-4 pb-8">
          <button
            onClick={handleLogout}
            className="w-full bg-[#FF3B30]/5 border-2 border-[#FF3B30]/20 text-[#FF3B30] py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#FF3B30]/10 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" strokeWidth={3} />
            Logout Session
          </button>
          <p className="text-[10px] text-center text-ui-gray-dark font-bold mt-4 uppercase tracking-tighter opacity-40">
            Coverent v1.0.4 • Secure Session
          </p>
        </section>
      </div>
    </div>
  );
}
