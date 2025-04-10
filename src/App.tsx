import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import DetailedStats from './components/statistics/DetailedStats';
import Tutorials from './components/tutorials/Tutorials';
import Logo from './components/Logo';

const App: React.FC = () => {
  return (
    <Router>
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
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/statistics" element={<DetailedStats />} />
              <Route path="/tutorials" element={<Tutorials />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
