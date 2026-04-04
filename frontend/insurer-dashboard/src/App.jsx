import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import ClaimsPage from "./pages/ClaimsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TriggerLogPage from "./pages/TriggerLogPage";
import MockTriggersPage from "./pages/MockTriggersPage";
import Layout from "./components/Layout";
import { DashboardProvider } from "./context/DashboardContext";

export default function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          
          {/* Authenticated Routes wrapped in Layout */}
          <Route element={<Layout />}>
            <Route path="/claims" element={<ClaimsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/trigger-log" element={<TriggerLogPage />} />
            <Route path="/mock-triggers" element={<MockTriggersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DashboardProvider>
  );
}
