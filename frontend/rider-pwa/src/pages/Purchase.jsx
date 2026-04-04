import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldAlert, Zap } from 'lucide-react';
import CONFIG from '../config';
import { useToast } from '../components/Toast';

export default function Purchase() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('plus');
  const [paying, setPaying] = useState(false);
  const [pricingData, setPricingData] = useState(null);

  useEffect(() => {
    const fetchPricing = async () => {
      const riderId = localStorage.getItem('rider_id');
      try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/riders/pricing-logic/${riderId}`);
        if (res.ok) {
            const data = await res.json();
            setPricingData(data);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic pricing:", err);
      }
    };
    fetchPricing();
  }, []);

  const getBaseDailyPayout = () => {
    const tier = str(pricingData?.income_tier || 'mid').toLowerCase();
    if (tier === 'low') return 420;
    if (tier === 'high') return 805;
    return 630;
  };

  const str = (val) => String(val || '');

  const dailyBase = getBaseDailyPayout();

  const plans = [
    { id: 'lite', name: 'Suraksha Lite', coveredDays: 1, maxPayout: dailyBase * 1, price: pricingData?.pricing?.lite || 119, recommended: (pricingData?.risk_score || 0) <= 40, color: 'bg-blue-400' },
    { id: 'plus', name: 'Suraksha Plus', coveredDays: 2, maxPayout: dailyBase * 2, price: pricingData?.pricing?.plus || 169, recommended: (pricingData?.risk_score || 0) > 40 && (pricingData?.risk_score || 0) <= 60, color: 'bg-brand-yellow' },
    { id: 'max', name: 'Suraksha Max', coveredDays: 3, maxPayout: dailyBase * 3, price: pricingData?.pricing?.max || 249, recommended: (pricingData?.risk_score || 0) > 60, color: 'bg-purple-500' }
  ];

  const handlePurchase = async () => {
    const riderId = localStorage.getItem('rider_id');
    if (!riderId) {
      addToast('Session expired. Please login again.', 'error');
      navigate('/');
      return;
    }

    // Map UI plan IDs to Backend PolicyType enum
    const planMapping = {
      lite: 'suraksha_basic',
      plus: 'suraksha_plus',
      max: 'bima_elite'
    };

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/riders/purchase-policy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rider_id: riderId,
          policy_type: planMapping[selectedPlan]
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Policy purchase failed');
      }

      addToast(`Policy ${selectedPlan.toUpperCase()} activated!`, 'success');
      setTimeout(() => { navigate('/dashboard'); }, 1200);

    } catch (err) {
      console.error('Purchase Error:', err);
      addToast(err.message, 'error');
      setPaying(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-6 font-sans text-ui-black animate-fade-in w-full overflow-hidden">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="text-sm font-bold text-ui-gray-dark mb-6 tracking-wider uppercase flex items-center w-fit hover:text-ui-black transition-colors px-1 shrink-0"
      >
        ← Back
      </button>

      <div className="mb-6 shrink-0 text-center">
        <h1 className="text-3xl font-black tracking-tight mb-1">Weekly Premium</h1>
        <p className="text-sm font-bold text-ui-gray-dark mt-2">Tailored for your Zone & Income</p>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pb-4 custom-scrollbar px-1">
        
        {pricingData && pricingData.is_restricted && (
          <div className="bg-ui-black p-5 rounded-2xl mb-4 border-2 border-status-red/50 shadow-2xl animate-pulse">
            <div className="flex items-start gap-4">
              <div className="bg-status-red p-2 rounded-full shrink-0">
                <ShieldAlert className="w-6 h-6 text-ui-white" strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-ui-white font-black text-lg leading-tight mb-1 uppercase tracking-tighter">Pincode Pool at Capacity</h3>
                <p className="text-ui-white/80 text-xs font-bold leading-relaxed">
                  The insurance pool for Zone <strong>{pricingData.pincode || '400099'}</strong> is currently at <strong>{pricingData.features?.pincode_loss_ratio}%</strong> payout capacity. 
                  <br /><br />
                  Registration is temporarily paused in this pincode to guarantee settlement funds for existing riders.
                </p>
              </div>
            </div>
          </div>
        )}

        {pricingData && !pricingData.is_eligible_for_policy && !pricingData.is_restricted && (
          <div className="bg-[#FFF3E0] border border-[#FFB74D] p-3 rounded-xl mb-2 text-xs font-bold shadow-sm">
            <span className="text-[#E65100] block mb-1">⚠️ Restricted Claim Access</span>
            You currently have {pricingData.active_days_count} active days. You may purchase a plan, but claim payouts will only activate after you complete 7 active days on the platform.
          </div>
        )}

        {plans.map(plan => (
          <div 
            key={plan.id}
            onClick={() => !pricingData?.is_restricted && setSelectedPlan(plan.id)}
            className={`relative p-5 rounded-2xl transition-all cursor-pointer shadow-sm border-2 overflow-hidden ${
                pricingData?.is_restricted ? 'opacity-40 grayscale pointer-events-none' :
                selectedPlan === plan.id 
                  ? 'bg-brand-light border-brand-yellow scale-[1.01]' 
                  : 'bg-ui-white border-ui-gray-light hover:bg-ui-gray-light/30'
              }`}
          >
            {/* White with colored top border logic */}
            {selectedPlan !== plan.id && (
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${plan.color}`} />
            )}

            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-brand-yellow text-[10px] font-black px-3 py-1.5 rounded-bl-xl text-ui-black tracking-wider shadow-sm flex items-center gap-1 z-10">
                <Zap className="w-3 h-3" fill="currentColor" /> RECOMMENDED
              </div>
            )}
            
            <div className="flex justify-between items-start mb-3 mt-1">
              <div>
                <h3 className="text-xl font-black">{plan.name}</h3>
                <p className="text-sm font-bold text-ui-gray-dark">Covers {plan.coveredDays} {plan.coveredDays === 1 ? 'day' : 'days'} a week</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black">₹{plan.price}</span>
                <span className="text-xs text-ui-gray-dark font-bold block bg-ui-gray-light/50 px-2 py-0.5 rounded-md mt-1">/ week</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-ui-gray-light space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-ui-black">
                <Check className="w-4 h-4 text-ui-white bg-status-green p-1 rounded-full shrink-0" strokeWidth={4} />
                <span>Max payout <strong>₹{plan.maxPayout}</strong></span>
              </div>
              <div className="flex items-start gap-2 text-sm text-ui-gray-dark font-bold leading-tight">
                <Check className="w-4 h-4 text-ui-white bg-status-green p-1 rounded-full shrink-0 mt-0.5" strokeWidth={4} />
                <span>Auto-triggers on blockages, heat, AQI & outages</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto shrink-0 pb-6 pt-2">
        {!pricingData?.is_restricted && (
          <div className="flex items-start gap-3 bg-[#FFF3E0] p-4 rounded-xl mb-4 border border-[#FFB74D] text-xs text-ui-black leading-relaxed font-bold shadow-sm">
            <ShieldAlert className="w-6 h-6 shrink-0 text-[#E65100]" strokeWidth={2.5} />
            <p>Premium is auto-deducted directly from platform clearing. Valid from Monday to Sunday.</p>
          </div>
        )}

        <button 
          onClick={() => {
            if (pricingData?.is_restricted) return;
            setPaying(true);
            handlePurchase();
          }}
          disabled={paying || pricingData?.is_restricted}
          className={`btn-primary w-full ${paying || pricingData?.is_restricted ? 'opacity-80 pointer-events-none shadow-none bg-ui-gray-dark border-ui-gray-dark text-white' : ''}`}
        >
          {pricingData?.is_restricted ? (
             'Enrollment Temporarily Suspended'
          ) : paying ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-4 border-ui-black/20 border-t-ui-black rounded-full animate-spin" /> 
              Setting up Auto-Mandate...
            </span>
          ) : (
            `Setup ₹${plans.find(p => p.id === selectedPlan)?.price} / week`
          )}
        </button>
      </div>
    </div>
  );
}
