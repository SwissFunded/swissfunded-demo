import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import DetailedStats from './components/statistics/DetailedStats';
import Tutorials from './components/tutorials/Tutorials';
import Logo from './components/Logo';

const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="navbar">
        <div className="flex-1 flex justify-center items-center gap-3">
          <Logo className="h-10" />
          <h1 className="text-2xl font-heading font-bold text-text">SwissFunded</h1>
        </div>
      </div>
      <div className="relative flex">
        <Sidebar />
        <div className="flex-1 ml-64 mt-[72px]">
          <AnimatePresence>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard />
                </motion.div>
              } />
              <Route path="/statistics" element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DetailedStats />
                </motion.div>
              } />
              <Route path="/tutorials" element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Tutorials />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
