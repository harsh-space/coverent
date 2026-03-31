import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import ClaimsPage from "./pages/ClaimsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TriggerLogPage from "./pages/TriggerLogPage";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Authenticated Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/trigger-log" element={<TriggerLogPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
