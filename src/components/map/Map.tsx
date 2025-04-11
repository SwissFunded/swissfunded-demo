import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Map: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [signupData, setSignupData] = useState<Record<string, number>>({});

  // Generate random signup data
  useEffect(() => {
    const countries = {
      US: 'United States',
      GB: 'United Kingdom',
      DE: 'Germany',
      JP: 'Japan',
      AU: 'Australia',
      CA: 'Canada',
      CH: 'Switzerland',
      SG: 'Singapore',
      FR: 'France',
      ES: 'Spain'
    };

    const randomData: Record<string, number> = {};
    Object.keys(countries).forEach(code => {
      randomData[code] = Math.floor(Math.random() * 100) + 20; // Random number between 20-120
    });

    setSignupData(randomData);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg ${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'}`}
    >
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>
        Global User Distribution
      </h2>
      
      <div className="relative">
        <div className={`w-full h-[600px] rounded-lg overflow-hidden ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-lg ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>
              Loading map data...
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className={`absolute bottom-4 right-4 p-4 rounded-lg ${isDarkMode ? 'bg-background/80' : 'bg-background-lightMode/80'} backdrop-blur-sm`}>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500 opacity-20"></div>
              <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500 opacity-60"></div>
              <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>High</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Map; 