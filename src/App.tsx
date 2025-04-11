import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import DetailedStats from './components/statistics/DetailedStats';
import Tutorials from './components/tutorials/Tutorials';
import Calendar from './components/calendar/Calendar';
import Leaderboard from './components/leaderboard/Leaderboard';
import Settings from './components/settings/Settings';
import Logo from './components/Logo';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppContent: React.FC = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-background text-text' : 'bg-background-lightMode text-text-lightMode'}`}>
      <div className={`navbar ${isDarkMode ? 'bg-background/80' : 'bg-background-lightMode/80'}`}>
        <div className="flex-1 flex justify-center items-center gap-3">
          <Logo className="h-10" />
          <h1 className={`text-2xl font-heading font-bold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>SwissFunded</h1>
        </div>
      </div>
      <div className="relative flex">
        <Sidebar />
        <div className={`flex-1 ml-64 mt-[72px] ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'}`}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/statistics" element={<DetailedStats />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
};

export default App;
