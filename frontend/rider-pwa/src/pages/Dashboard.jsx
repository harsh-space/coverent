import { ShieldAlert, ShieldCheck, CloudRain, Clock, MapPin, Activity, Navigation, CheckCircle2, AlertCircle, LogOut, Radio, Wifi, Globe, Shield, Thermometer, Gauge, Zap, RotateCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CONFIG from '../config';
import { useToast } from '../components/Toast';

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

  const activePolicy = {
    plan: isPolicyExpired() ? 'No Active Policy' : (profile?.policy_name || 'No Active Policy'),
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
    <div className="flex-1 flex flex-col pt-8 animate-fade-in relative min-h-[100dvh] text-ui-black bg-ui-white">
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-status-red text-ui-white py-1 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-center z-[200] animate-pulse">
          ⚠️ Oracle Network Offline - Link Lost
        </div>
      )}
      <div className="flex items-center justify-between mb-8 shrink-0 px-1">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1">{displayName}</h1>
          <div className="flex items-center gap-3">
            {/* Minimalist status icons only if desired - removing text for now as requested */}
          </div>
        </div>
        <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center font-black text-xl shadow-sm border-2 border-ui-black/5">
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
          <div className="bg-brand-yellow rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <span className="text-[10px] font-black text-ui-black/70 tracking-widest uppercase mb-1 block">Active Policy</span>
                <h2 className="text-2xl font-black mb-1">{activePolicy.plan}</h2>
                <p className="text-sm font-bold text-ui-black/80">Valid till {activePolicy.validUntil}</p>
              </div>
              <div className="flex items-center gap-1 bg-ui-white border border-ui-black/10 text-status-green px-3 py-1 rounded-full text-xs font-black shadow-sm shrink-0">
                <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
                {activePolicy.status}
              </div>
            </div>

            <div className="bg-ui-white/90 rounded-xl p-3 flex items-center gap-3 relative z-10 border border-ui-black/5 mt-4 shadow-sm">
              <MapPin className="w-5 h-5 text-ui-gray-dark shrink-0" strokeWidth={2.5} />
              <div>
                <p className="text-xs font-bold text-ui-gray-dark mb-0.5">Monitoring Zone</p>
                <p className="text-sm font-black leading-tight">{activePolicy.zone}</p>
              </div>
            </div>

            <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-brand-dark opacity-30 pointer-events-none" />
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
            <div className="bg-ui-white border-2 border-brand-yellow p-4 rounded-xl mt-3 shadow-sm text-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-black text-lg mb-1 flex justify-center items-center gap-1.5">
                  <ShieldAlert className="w-5 h-5 text-status-orange" strokeWidth={2.5} />
                  You're Unprotected
                </h3>
                <p className="text-xs font-bold text-ui-gray-dark mb-4 px-2">
                  Set up your customizable gig insurance policy now to lock in your tailored premium based on your zone profile.
                </p>
                <button
                  onClick={() => navigate('/risk-profile')}
                  className="btn-primary w-full text-sm py-3 flex justify-center items-center gap-2"
                >
                  Set Up Insurance Now <Zap className="w-4 h-4" fill="currentColor" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Live System Status */}
        <section>
          <h3 className="text-lg font-black mb-3 flex items-center gap-2 uppercase tracking-tight">
            <Zap className="w-5 h-5 text-brand-yellow" strokeWidth={2.5} fill="currentColor" /> System Diagnostics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Weather */}
            <div className="bg-ui-white border-2 border-ui-gray-light rounded-xl p-4 shadow-sm hover:border-brand-yellow transition-colors">
              <div className="flex justify-between items-start mb-2">
                <CloudRain className="w-6 h-6 text-blue-500" strokeWidth={2.5} />
                <div className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
              </div>
              <p className="text-[10px] font-black text-ui-gray-dark uppercase tracking-wider mb-0.5">Env Node</p>
              <p className="text-sm font-black flex items-center gap-1">
                Clear Sky
              </p>
            </div>

            {/* Card 2: Platform */}
            <div className="bg-ui-white border-2 border-ui-gray-light rounded-xl p-4 shadow-sm hover:border-brand-yellow transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Globe className="w-6 h-6 text-brand-dark" strokeWidth={2.5} />
                <div className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
              </div>
              <p className="text-[10px] font-black text-ui-gray-dark uppercase tracking-wider mb-0.5">Platform API</p>
              <p className="text-sm font-black flex items-center gap-1 leading-tight">
                {profile?.platform?.replace('swiggy_', '').replace('_', ' ').toUpperCase() || 'SYNCING'}
              </p>
            </div>

            {/* Card 3: Zone Risk Score */}
            <div className="bg-ui-white border-2 border-ui-gray-light rounded-xl p-4 shadow-sm hover:border-brand-yellow transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <Gauge className={`w-6 h-6 ${(profile?.risk_score || 0) < 40 ? 'text-status-green' : (profile?.risk_score || 0) < 80 ? 'text-status-orange' : 'text-status-red'}`} strokeWidth={2.5} />
                <div className={`w-1.5 h-1.5 rounded-full ${(profile?.risk_score || 0) < 80 ? 'bg-status-green' : 'bg-status-orange'} animate-pulse`} />
              </div>
              <p className="text-[10px] font-black text-ui-gray-dark uppercase tracking-wider mb-0.5">Risk Rating</p>
              <p className={`text-sm font-black flex items-center gap-1 group-hover:scale-105 transition-transform`}>
                {profile?.risk_score || 74}/100
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ml-1 ${(profile?.risk_score || 0) < 40 ? 'bg-status-green/10 text-status-green' : (profile?.risk_score || 0) < 80 ? 'bg-status-orange/10 text-status-orange' : 'bg-status-red/10 text-status-red'}`}>
                  {(profile?.risk_score || 0) < 40 ? 'LOW' : (profile?.risk_score || 0) < 80 ? 'MODERATE' : 'HIGH'}
                </span>
              </p>
            </div>

            {/* Card 4: Regional Risk */}
            <div className="bg-ui-white border-2 border-ui-gray-light rounded-xl p-4 shadow-sm hover:border-brand-yellow transition-colors">
              <div className="flex justify-between items-start mb-2">
                <Shield className={`w-6 h-6 ${profile?.active_policy ? 'text-status-green' : 'text-ui-gray-dark'}`} strokeWidth={2.5} />
                <div className={`w-1.5 h-1.5 rounded-full ${profile?.active_policy ? 'bg-status-green' : 'bg-status-orange'} animate-pulse`} />
              </div>
              <p className="text-[10px] font-black text-ui-gray-dark uppercase tracking-wider mb-0.5">Zone Risk</p>
              <p className="text-sm font-black flex items-center gap-1">
                {profile?.active_policy ? 'Covered' : 'Low'}
              </p>
            </div>
          </div>
        </section>

        {/* Claim History */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Clock className="w-5 h-5 text-ui-gray-dark" strokeWidth={2.5} /> Recent Activity
            </h3>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const rider_id = localStorage.getItem('rider_id');
                  const res = await fetch(`${CONFIG.API_BASE_URL}/riders/profile/${rider_id}`);
                  if (res.ok) {
                    const data = await res.json();
                    const history = data.payout_history || [];
                    if (payoutCountRef.current !== -1 && history.length > payoutCountRef.current) {
                       setNewClaimNotify(history[0]);
                    }
                    setProfile(data);
                    payoutCountRef.current = history.length;
                    addToast('Claims Synced', 'success');
                  }
                } catch (err) {
                  addToast('Manual sync failed', 'error');
                } finally {
                  setLoading(false);
                }
              }}
              className="group p-2 hover:bg-ui-gray-light/50 rounded-full transition-all flex items-center gap-1.5"
              title="Sync Claims"
            >
              <RotateCw className="w-4 h-4 text-ui-gray-dark group-active:rotate-180 transition-transform duration-500" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-tighter text-ui-gray-dark">Sync</span>
            </button>
          </div>

          <div className="space-y-3">
            {claims.length > 0 ? (
              claims.map(claim => (
                <div
                  key={claim.payout_id}
                  onClick={() => setExpandedClaim(expandedClaim === claim.payout_id ? null : claim.payout_id)}
                  className={`bg-ui-white border ${expandedClaim === claim.payout_id ? 'border-brand-yellow ring-1 ring-brand-yellow/30' : 'border-ui-gray-light'} rounded-xl p-0 flex flex-col shadow-sm transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.98]`}
                >
                  <div className="p-4 flex gap-4 items-start">
                    <div className={`w-10 h-10 rounded-full ${expandedClaim === claim.payout_id ? 'bg-brand-yellow text-ui-black' : 'bg-status-green/10 text-status-green'} flex items-center justify-center shrink-0 transition-colors duration-300`}>
                      <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black text-sm leading-snug pr-2 uppercase tracking-tight">{claim.trigger_type.replace('_', ' ')}</h4>
                        <span className="font-black text-status-green shrink-0">+₹{claim.amount}</span>
                      </div>
                      <p className="text-[11px] font-bold text-ui-gray-dark italic">
                        Instant Settlement via UPI
                      </p>
                    </div>
                  </div>

                  {/* Expandable Tray */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedClaim === claim.payout_id ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-4 pb-4 bg-ui-gray-light/10 border-t border-dashed border-ui-gray-light">
                      <div className="py-4 space-y-4">
                        {/* Status Timeline */}
                        <div className="flex items-center justify-between px-2">
                          <div className="flex flex-col items-center gap-1 group">
                            <div className="w-7 h-7 rounded-lg bg-ui-black text-brand-yellow flex items-center justify-center shadow-sm">
                              <CloudRain className="w-4 h-4" />
                            </div>
                            <span className="text-[8px] font-black uppercase text-ui-gray-dark">Trigger</span>
                          </div>
                          <div className="h-[2px] flex-1 bg-ui-black/5 mx-2" />
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-7 h-7 rounded-lg bg-ui-black text-brand-yellow flex items-center justify-center shadow-sm">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <span className="text-[8px] font-black uppercase text-ui-gray-dark">Verified</span>
                          </div>
                          <div className="h-[2px] flex-1 bg-ui-black/5 mx-2" />
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-7 h-7 rounded-lg bg-status-green text-ui-white flex items-center justify-center shadow-md">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-[8px] font-black uppercase text-status-green">Credited</span>
                          </div>
                        </div>

                        {/* Metadata Details */}
                        <div className="bg-ui-white/50 rounded-lg p-3 space-y-2 border border-ui-black/5">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-ui-gray-dark uppercase tracking-wider">Reference ID</span>
                            <span className="font-mono text-ui-black">TXN-{claim.payout_id.split('-')[0].toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-ui-gray-dark uppercase tracking-wider">Settled On</span>
                            <span className="text-ui-black">{new Date(claim.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-ui-gray-dark uppercase tracking-wider">Severity Log</span>
                            <span className="text-ui-black">{claim.tier_percentage}% Payout Triggered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-ui-gray-light/30 border border-ui-gray-light rounded-xl p-8 text-center">
                <p className="text-sm font-bold text-ui-gray-dark opacity-60">No recent claims detected in your zone.</p>
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
