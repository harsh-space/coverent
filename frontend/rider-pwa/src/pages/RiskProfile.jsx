import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Activity, CloudRain, Wind, CheckCircle } from 'lucide-react';

export default function RiskProfile() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min((currentStep / steps) * 100, 100));
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setAnalyzing(false), 400);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col pt-8 animate-fade-in relative text-ui-black">
      <div className="flex items-center gap-2 mb-8">
        <ShieldCheck className="text-brand-yellow w-8 h-8" strokeWidth={2.5} />
        <h1 className="text-2xl font-black tracking-tight">GigShield</h1>
      </div>

      {analyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in absolute inset-0 pt-20">
          <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            <div className="absolute inset-0 border-[6px] border-ui-gray-light rounded-full" />
            <div className="absolute inset-0 border-[6px] border-brand-yellow rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-5 border-[4px] border-status-orange/30 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
            <Activity className="w-12 h-12 text-ui-black animate-pulse" strokeWidth={2.5} />
          </div>
          
          <h2 className="text-2xl font-black mb-2">Analyzing Zone Risk</h2>
          <p className="text-ui-gray-dark font-bold mb-8 text-center px-4">
            Processing 3-year historical weather & AQI data around your dark store...
          </p>

          <div className="w-full max-w-xs bg-ui-gray-light rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className="bg-brand-yellow h-full rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-slide-in">
          <div className="bg-ui-white border-2 border-ui-gray-light rounded-2xl p-6 mb-6 shadow-sm relative overflow-hidden">
            <h2 className="text-xs font-black text-ui-gray-dark uppercase tracking-wider mb-2">Zone Composite Score</h2>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-6xl font-black">74</span>
              <span className="text-xl font-bold text-ui-gray-dark mb-1">/100</span>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                  <CloudRain className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1 font-bold">
                    <span>Waterlogging Risk</span>
                    <span className="text-status-orange">High</span>
                  </div>
                  <div className="w-full bg-ui-gray-light rounded-full h-2.5"><div className="bg-status-orange h-2.5 rounded-full w-[80%]" /></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-ui-gray-dark rounded-lg border border-ui-gray-light">
                  <Wind className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1 font-bold">
                    <span>Severe AQI Risk</span>
                    <span className="text-status-red">Critical</span>
                  </div>
                  <div className="w-full bg-ui-gray-light rounded-full h-2.5"><div className="bg-status-red h-2.5 rounded-full w-[95%]" /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-status-green/10 border-2 border-status-green/30 rounded-xl p-4 mb-auto flex gap-3 shadow-sm">
            <CheckCircle className="w-6 h-6 text-status-green shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <h3 className="font-black text-status-green mb-1">AI Recommendation</h3>
              <p className="text-sm text-ui-gray-dark leading-relaxed font-bold">Based on your zone profile, we strongly recommend the <strong>Suraksha Plus</strong> plan to cover ~2 disruption days per week.</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/purchase')}
            className="btn-primary w-full mt-6 mb-4"
          >
            View Tailored Plans <Activity className="w-5 h-5 ml-2" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}
