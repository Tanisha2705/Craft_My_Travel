import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ItineraryPage from './pages/ItineraryPage';
import PreferencesPage from './pages/PreferencesPage';
import SchedulePage from './pages/SchedulePage';
import AboutUsPage from './pages/AboutUsPage';
import HelpSupportPage from './pages/HelpSupportPage';
import AdminPanel from './pages/AdminPanel';
// import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} /> {/* ✅ Corrected path */}
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/support" element={<HelpSupportPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        {/* <PrivateRoute path="/admin" component={AdminPanel} /> */}
      </Routes>
    </Router>
  );
}

export default App;
