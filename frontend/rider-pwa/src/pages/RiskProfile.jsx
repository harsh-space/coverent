import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Activity, CloudRain, Wind, CheckCircle, Zap, Navigation } from 'lucide-react';
import CONFIG from '../config';
import { useToast } from '../components/Toast';

export default function RiskProfile() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [riskScore, setRiskScore] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let animationDone = false;
    let dataReady = false;
    let finalData = null;

    const checkSync = () => {
      if (animationDone && dataReady) {
        setRiskScore(finalData.risk_score);
        setRiskData(finalData);
        setTimeout(() => setAnalyzing(false), 500);
      }
    };

    const fetchRisk = async () => {
      const riderId = localStorage.getItem('rider_id');
      
      const timeoutToken = setTimeout(() => {
        if (!dataReady) {
            finalData = { risk_score: 74, features: { zone_flood_score: 3, zone_aqi_score: 4 }, pricing: { plus: 45 } };
            dataReady = true;
            checkSync();
        }
      }, 10000);

      try {
          const res = await fetch(`${CONFIG.API_BASE_URL}/riders/pricing-logic/${riderId}`);
          if (res.ok) {
              const data = await res.json();
              clearTimeout(timeoutToken);
              
              if (data && data.risk_score !== undefined) {
                finalData = data;
                dataReady = true;
                checkSync();
              } else {
                setError("Invalid data from server.");
              }
          } else {
              setError(`Server Error (${res.status})`);
          }
      } catch (err) {
          setError("Check your internet connection.");
          addToast("Risk profile sync failed", "error");
      }
    };
    fetchRisk();

    const duration = 2800; // Slightly longer for premium feel
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min((currentStep / steps) * 100, 100));
      if (currentStep >= steps) {
        clearInterval(timer);
        animationDone = true;
        console.log("DEBUG: [PWA] Animation Done. Waiting for Data...");
        checkSync();
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col pt-8 animate-fade-in relative text-ui-black px-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-12 h-12 bg-ui-black rounded-xl flex items-center justify-center shadow-[0_10px_20px_rgb(0,0,0,0.15)] transform -rotate-3">
          <ShieldCheck className="text-brand-yellow w-6 h-6" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Coverent</h1>
      </div>

      {analyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in absolute inset-0 pt-20">
          <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            <div className="absolute inset-0 border-[6px] border-ui-gray-light rounded-full" />
            <div className="absolute inset-0 border-[6px] border-brand-yellow rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-5 border-[4px] border-status-orange/30 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
            <Zap className="w-12 h-12 text-ui-black animate-pulse" strokeWidth={2.5} fill="currentColor" />
          </div>
          
          <h2 className="text-2xl font-black mb-2">{error ? "Wait, something went wrong" : "Analyzing Zone Risk"}</h2>
          <p className="text-ui-gray-dark font-bold mb-8 text-center px-4">
            {error ? error : "Processing 3-year historical weather & AQI data around your dark store..."}
          </p>

          {!error && (
            <div className="w-full max-w-xs bg-ui-gray-light rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-brand-yellow h-full rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          {error && (
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry Prediction
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-slide-in">
          <div className="glass-card border-none shadow-[0_10px_40px_rgb(0,0,0,0.06)] p-8 mb-6 relative overflow-hidden">
            <h2 className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-2">Zone Composite Score</h2>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-7xl font-black tracking-tighter">{riskScore}</span>
              <span className="text-2xl font-bold text-ui-gray-dark mb-2">/100</span>
            </div>
          ...

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                  <CloudRain className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1 font-bold">
                    <span>Waterlogging Risk</span>
                    <span className={(riskData?.features?.zone_flood_score || 0) > 7 ? "text-status-red" : (riskData?.features?.zone_flood_score  || 0) > 4 ? "text-status-orange" : "text-status-green"}>
                      {(riskData?.features?.zone_flood_score || 0) > 7 ? 'High' : (riskData?.features?.zone_flood_score || 0) > 4 ? 'Moderate' : 'Low'}
                    </span>
                  </div>
                  <div className="w-full bg-ui-gray-light rounded-full h-2.5">
                    <div className={`${(riskData?.features?.zone_flood_score || 0) > 7 ? "bg-status-red" : (riskData?.features?.zone_flood_score || 0) > 4 ? "bg-status-orange" : "bg-status-green"} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${Math.min((riskData?.features?.zone_flood_score || 0) * 10, 100)}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-ui-gray-dark rounded-lg border border-ui-gray-light">
                  <Wind className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1 font-bold">
                    <span>Severe AQI Risk</span>
                    <span className={(riskData?.features?.zone_aqi_score || 0) > 7 ? "text-status-red" : (riskData?.features?.zone_aqi_score || 0) > 4 ? "text-status-orange" : "text-status-green"}>
                      {(riskData?.features?.zone_aqi_score || 0) > 7 ? 'Critical' : (riskData?.features?.zone_aqi_score || 0) > 4 ? 'High' : 'Moderate'}
                    </span>
                  </div>
                  <div className="w-full bg-ui-gray-light rounded-full h-2.5">
                    <div className={`${(riskData?.features?.zone_aqi_score || 0) > 7 ? "bg-status-red" : (riskData?.features?.zone_aqi_score || 0) > 4 ? "bg-status-orange" : "bg-status-green"} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${Math.min((riskData?.features?.zone_aqi_score || 0) * 10, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card bg-ui-white/40 border border-status-green/20 p-5 mb-auto flex gap-4">
            <div className="w-10 h-10 bg-status-green/10 rounded-full flex items-center justify-center shrink-0">
               <CheckCircle className="w-5 h-5 text-status-green" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-ui-black mb-1">AI Recommendation</h3>
              <p className="text-sm text-ui-gray-dark leading-relaxed font-bold">Based on your zone profile, we strongly recommend the <strong>{riskScore > 60 ? 'Suraksha Max' : riskScore > 40 ? 'Suraksha Plus' : 'Suraksha Lite'}</strong> plan to cover ~{riskScore > 60 ? '3' : riskScore > 40 ? '2' : '1'} disruption days per week.</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/purchase')}
            className="btn-primary w-full mt-6 mb-4"
          >
            View Tailored Plans <Navigation className="w-5 h-5 ml-2" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}
