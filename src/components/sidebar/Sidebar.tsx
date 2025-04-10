import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import Logo from '../Logo';

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-background-light border-r border-white/[0.02] mt-[72px]">
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center gap-3">
          <Logo className="h-8" />
          <div>
            <h2 className="text-lg font-heading font-bold text-text">SwissFunded</h2>
            <p className="text-text-muted text-sm">Trading Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link 
            to="/" 
            className={`sidebar-item group ${location.pathname === '/' ? 'active' : ''}`}
          >
            <HomeIcon className="h-6 w-6 transition-colors" />
            <span>Home</span>
          </Link>
          <Link 
            to="/statistics" 
            className={`sidebar-item group ${location.pathname === '/statistics' ? 'active' : ''}`}
          >
            <ChartBarIcon className="h-6 w-6 transition-colors group-hover:text-primary" />
            <span>Statistics</span>
          </Link>
          <Link 
            to="/tutorials" 
            className={`sidebar-item group ${location.pathname === '/tutorials' ? 'active' : ''}`}
          >
            <AcademicCapIcon className="h-6 w-6 transition-colors group-hover:text-primary" />
            <span>Tutorials</span>
          </Link>
          <Link 
            to="/leaderboard" 
            className={`sidebar-item group ${location.pathname === '/leaderboard' ? 'active' : ''}`}
          >
            <TrophyIcon className="h-6 w-6 transition-colors group-hover:text-primary" />
            <span>Leaderboard</span>
          </Link>
          <Link 
            to="/calendar" 
            className={`sidebar-item group ${location.pathname === '/calendar' ? 'active' : ''}`}
          >
            <CalendarIcon className="h-6 w-6 transition-colors group-hover:text-primary" />
            <span>Calendar</span>
          </Link>
          <Link 
            to="/settings" 
            className={`sidebar-item group ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            <Cog6ToothIcon className="h-6 w-6 transition-colors group-hover:text-primary" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/[0.02]">
          <button className="sidebar-item w-full justify-center group">
            <ChatBubbleLeftRightIcon className="h-6 w-6 group-hover:text-primary transition-colors" />
            <span>Support Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 