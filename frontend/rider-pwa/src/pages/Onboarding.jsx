import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import CONFIG from '../config';
import { useToast } from '../components/Toast';

export default function Onboarding() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [view, setView] = useState('initial'); // 'initial' | 'login' | 'register'

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    platform: 'blinkit',
    platform_id: '',
    dark_store_pincode: '',
    income_tier: 'mid',
    upi_id: '',
    shift_window: 'morning',
    firebase_token: ''
  });

  const [loginData, setLoginData] = useState({ phone: '', otp: '' });
  const [isRegistering, setIsRegistering] = useState(false);

  const updateForm = (key, value) => {
    // Basic validation on input
    if (key === 'phone' || key === 'dark_store_pincode') {
      if (value !== '' && !/^\d+$/.test(value)) return;
    }
    
    setFormData(prev => {
      const newState = { ...prev, [key]: value };
      if (key === 'phone') newState.firebase_token = value;
      localStorage.setItem('onboarding_form', JSON.stringify(newState));
      return newState;
    });
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('onboarding_form');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved form:', e);
      }
    }
  }, []);

  const updateLogin = (key, value) => {
    if (key === 'phone' || key === 'otp') {
      if (value !== '' && !/^\d+$/.test(value)) return;
    }
    setLoginData(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (formData.phone.length !== 10) {
      addToast('Please enter a valid 10-digit phone number', 'error');
      return false;
    }
    if (formData.dark_store_pincode.length !== 6) {
      addToast('Pincode must be exactly 6 digits', 'error');
      return false;
    }
    if (!formData.upi_id.includes('@')) {
      addToast('Please enter a valid UPI ID (e.g. name@okhdfc)', 'error');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsRegistering(true);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      firebase_token: formData.firebase_token || formData.phone,
      platform: formData.platform,
      platform_id: formData.platform_id,
      dark_store_pincode: formData.dark_store_pincode,
      upi_id: formData.upi_id,
      income_tier: formData.income_tier,
      shift_window: formData.shift_window
    };

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/riders/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      addToast('Account created successfully!', 'success');
      localStorage.setItem('rider_id', data.rider_id);
      navigate('/risk-profile');

    } catch (err) {
      console.error('Registration Error:', err);
      setIsRegistering(false);
      addToast(err.message, 'error');
    }
  };

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    const phone = loginData.phone.trim();
    const otp = loginData.otp.trim();

    if (!phone || !otp) return;
    if (phone.length !== 10) {
       addToast('Invalid phone number', 'error');
       return;
    }

    setIsLoggingIn(true);
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/riders/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      addToast('Login successful!', 'success');
      localStorage.setItem('rider_id', data.rider_id);
      navigate('/dashboard');

    } catch (err) {
      console.error('Login Error:', err);
      addToast(err.message, 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-8 font-sans text-ui-black pb-8 animate-fade-in custom-scrollbar overflow-y-auto w-full px-1">

      {view === 'initial' && (
        <div className="flex-1 flex flex-col justify-center animate-fade-in px-4">
          <div className="text-center mb-12">
            <ShieldCheck className="text-brand-yellow w-16 h-16 mx-auto mb-4" strokeWidth={2.5} />
            <h1 className="text-4xl font-black tracking-tight mb-2">Coverent</h1>
            <p className="text-sm font-bold text-ui-gray-dark">Income Protection for Delivery Partners</p>
          </div>

          <div className="space-y-4 px-2 mt-8">
            <button
              onClick={() => setView('login')}
              className="btn-primary w-full py-4 text-lg"
            >
              Login
            </button>
            <button
              onClick={() => setView('register')}
              className="w-full bg-ui-white border-2 border-ui-gray-light text-ui-black rounded-xl py-4 px-6 font-black tracking-wide shadow-sm active:scale-95 transition-all text-center hover:bg-ui-gray-light/30"
            >
              Create New Account
            </button>
          </div>
        </div>
      )}

      {view === 'login' && (
        <div className="animate-slide-in flex-1 flex flex-col px-4">
          <button onClick={() => setView('initial')} className="text-sm font-bold text-ui-gray-dark mb-6 tracking-wider uppercase flex items-center w-fit hover:text-ui-black transition-colors">← Back</button>

          <div className="mb-8">
            <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
            <p className="text-sm font-bold text-ui-gray-dark">Enter your mobile number to login.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 flex-1 flex flex-col bg-ui-white rounded-2xl pb-6">
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Phone Number</label>
              <input
                type="tel"
                placeholder="10 digit mobile"
                className="clean-input"
                maxLength={10}
                value={loginData.phone}
                onChange={(e) => updateLogin('phone', e.target.value)}
                required
              />
            </div>

            {loginData.phone.length > 9 && (
              <div className="animate-slide-in">
                <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Enter OTP</label>
                <input
                  type="number"
                  placeholder=""
                  className="clean-input text-center tracking-[1em] font-mono text-xl font-bold"
                  maxLength={4}
                  value={loginData.otp}
                  onChange={(e) => updateLogin('otp', e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              onClick={handleLogin}
              disabled={loginData.otp.length < 4 || isLoggingIn}
              className={`btn-primary w-full mt-auto flex items-center justify-center ${(loginData.otp.length < 4 || isLoggingIn) ? 'opacity-50 grayscale cursor-not-allowed shadow-none' : ''}`}
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-4 border-ui-black/20 border-t-ui-black rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>Verify OTP & Login <ChevronRight className="w-5 h-5 ml-1" strokeWidth={3} /></>
              )}
            </button>
          </form>
        </div>
      )}

      {view === 'register' && (
        <div className="animate-slide-in flex-1 flex flex-col">
          <div className="px-4">
            <button onClick={() => setView('initial')} className="text-sm font-bold text-ui-gray-dark mb-6 tracking-wider uppercase flex items-center w-fit hover:text-ui-black transition-colors">← Back</button>
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tight mb-1">Rider Registration</h1>
              <p className="text-sm font-bold text-ui-gray-dark">Get income protection for your delivery zone</p>
            </div>
          </div>

          <div className="bg-brand-yellow rounded-2xl p-6 px-3 mb-8 shadow-sm mx-4 flex items-center justify-center gap-2 whitespace-nowrap">
            <span className="text-3xl shrink-0">🛵</span>
            <h2 className="text-xl font-black leading-tight">Earn. Protect. Deliver.</h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-6 flex-1 flex flex-col bg-ui-white rounded-2xl pb-6 px-4">
            {/* Full Name */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Ravi Kumar"
                className="clean-input"
                value={formData.name}
                onChange={(e) => updateForm('name', e.target.value)}
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Phone Number</label>
              <input
                type="tel"
                placeholder="10 digit mobile"
                className="clean-input"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                required
              />
            </div>

            {/* Platform Selector */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-3 block tracking-widest uppercase">Q-Commerce Platform</label>
              <div className="flex flex-wrap gap-3">
                {CONFIG.PLATFORMS.map(p => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => updateForm('platform', p.id)}
                    className={`py-2 px-5 rounded-full font-black text-sm transition-all border-2 ${formData.platform === p.id
                        ? 'bg-brand-yellow border-brand-yellow text-ui-black shadow-sm'
                        : 'bg-ui-white border-ui-gray-light text-ui-gray-dark hover:bg-ui-gray-light/30'
                      }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform ID */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Platform ID</label>
              <input
                type="text"
                placeholder="e.g. BLK-994521"
                className="clean-input"
                value={formData.platform_id}
                onChange={(e) => updateForm('platform_id', e.target.value)}
                required
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Delivery Zone Pincode</label>
              <input
                type="number"
                placeholder="e.g. 110001"
                className="clean-input"
                maxLength={6}
                value={formData.dark_store_pincode}
                onChange={(e) => updateForm('dark_store_pincode', e.target.value)}
                required
              />
            </div>

            {/* Income Tier */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-3 block tracking-widest uppercase">Income Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {CONFIG.TIERS.map(t => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => updateForm('income_tier', t.id)}
                    className={`py-2 px-3 rounded-full font-black text-sm transition-all border-2 ${formData.income_tier === t.id
                        ? 'bg-brand-yellow border-brand-yellow text-ui-black shadow-sm'
                        : 'bg-ui-white border-ui-gray-light text-ui-gray-dark hover:bg-ui-gray-light/30'
                      }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Shift Selector */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-3 block tracking-widest uppercase">Delivery Shift</label>
              <div className="flex flex-wrap gap-3">
                {CONFIG.SHIFTS.map(s => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => updateForm('shift_window', s.id)}
                    className={`py-2 px-5 rounded-full font-black text-sm transition-all border-2 ${formData.shift_window === s.id
                        ? 'bg-brand-yellow border-brand-yellow text-ui-black shadow-sm'
                        : 'bg-ui-white border-ui-gray-light text-ui-gray-dark hover:bg-ui-gray-light/30'
                      }`}
                  >
                    {s.name} <span className="text-[10px] opacity-60 ml-1">({s.time})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI ID */}
            <div className="mb-4">
              <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">UPI ID (For Auto-Payouts)</label>
              <input
                type="text"
                placeholder="e.g. name@okhdfc"
                className="clean-input"
                value={formData.upi_id}
                onChange={(e) => updateForm('upi_id', e.target.value)}
                required
              />
            </div>

            <div className="mt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isRegistering}
                className={`btn-primary w-full ${isRegistering ? 'opacity-50 grayscale cursor-not-allowed shadow-none hover:bg-brand-yellow' : ''}`}
              >
                {isRegistering ? 'Registering...' : 'Generate AI Risk Profile'}
                {!isRegistering && <ChevronRight className="w-5 h-5 ml-1" strokeWidth={3} />}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear all registration data?')) {
                    localStorage.removeItem('onboarding_form');
                    window.location.reload();
                  }
                }}
                className="text-[10px] font-black text-ui-gray-dark uppercase tracking-widest mt-2 opacity-50 hover:opacity-100 transition-opacity"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
