import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import Logo from '../Logo';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/statistics', icon: ChartBarIcon, label: 'Statistics' },
    { path: '/tutorials', icon: AcademicCapIcon, label: 'Tutorials' },
    { path: '/leaderboard', icon: TrophyIcon, label: 'Leaderboard' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendar' },
    { path: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-y-0 left-0 w-64 bg-background-light border-r border-white/[0.02] mt-[72px]"
    >
      <div className="flex flex-col h-full">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-6 flex items-center gap-3"
        >
          <Logo className="h-8" />
          <div>
            <h2 className="text-lg font-heading font-bold text-text">SwissFunded</h2>
            <p className="text-text-muted text-sm">Trading Dashboard</p>
          </div>
        </motion.div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <Link 
                to={item.path} 
                className={`sidebar-item group ${location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon className="h-6 w-6 transition-colors group-hover:text-primary" />
                <span>{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="p-4 border-t border-white/[0.02] space-y-2"
        >
          <a 
            href="https://swissfunded.eu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="sidebar-item w-full justify-center group"
          >
            <ArrowTopRightOnSquareIcon className="h-6 w-6 group-hover:text-primary transition-colors" />
            <span>Visit SwissFunded</span>
          </a>
          <button className="sidebar-item w-full justify-center group">
            <ChatBubbleLeftRightIcon className="h-6 w-6 group-hover:text-primary transition-colors" />
            <span>Support Chat</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar; 