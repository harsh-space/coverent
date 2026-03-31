import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import RiskProfile from './pages/RiskProfile';
import Purchase from './pages/Purchase';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen sm:max-w-md sm:mx-auto relative overflow-hidden bg-ui-white text-ui-black">
        <div className="relative z-10 min-h-screen flex flex-col p-5">
          <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/risk-profile" element={<RiskProfile />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
