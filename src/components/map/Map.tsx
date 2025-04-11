import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import WorldMap from '@svg-maps/world';
import { SVGMap } from 'react-svg-map';
import 'react-svg-map/lib/index.css';

interface SignupData {
  country: string;
  count: number;
  id: string;
}

interface Location {
  id: string;
  path: string;
  name: string;
}

interface MapEvent extends React.MouseEvent<SVGElement> {
  target: SVGElement & { id: string };
}

const Map: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [signupData, setSignupData] = useState<SignupData[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Generate random signup data
  useEffect(() => {
    const countries = [
      { country: 'United States', id: 'usa' },
      { country: 'United Kingdom', id: 'gbr' },
      { country: 'Germany', id: 'deu' },
      { country: 'Japan', id: 'jpn' },
      { country: 'Australia', id: 'aus' },
      { country: 'Canada', id: 'can' },
      { country: 'Switzerland', id: 'che' },
      { country: 'Singapore', id: 'sgp' },
      { country: 'France', id: 'fra' },
      { country: 'Spain', id: 'esp' }
    ];

    const randomData = countries.map(country => ({
      ...country,
      count: Math.floor(Math.random() * 100) + 20 // Random number between 20-120
    }));

    setSignupData(randomData);
  }, []);

  const getCountryColor = (countryId: string) => {
    const country = signupData.find(data => data.id === countryId);
    if (!country) return isDarkMode ? '#2a2a2a' : '#f0f0f0';
    
    const opacity = Math.min(0.2 + (country.count / 120) * 0.8, 1);
    return `rgba(239, 68, 68, ${opacity})`; // Using red (primary color) with varying opacity
  };

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
        <SVGMap
          map={WorldMap}
          className={`w-full h-auto ${isDarkMode ? 'text-background-lighter' : 'text-background-lightMode-lighter'}`}
          locationClassName="cursor-pointer transition-colors duration-200"
          onLocationMouseOver={(event: MapEvent) => {
            const countryId = event.target.id;
            setHoveredCountry(countryId);
          }}
          onLocationMouseOut={() => setHoveredCountry(null)}
          locationStyle={(location: Location) => ({
            fill: getCountryColor(location.id),
            stroke: isDarkMode ? '#1a1a1a' : '#e5e5e5',
            strokeWidth: 0.5
          })}
        />

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

        {/* Tooltip */}
        {hoveredCountry && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute pointer-events-none px-3 py-2 rounded-lg text-sm ${
              isDarkMode ? 'bg-background text-text' : 'bg-background-lightMode text-text-lightMode'
            } shadow-lg`}
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {signupData.find(data => data.id === hoveredCountry)?.country || 'Unknown'}:{' '}
            {signupData.find(data => data.id === hoveredCountry)?.count || 0} users
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Map; 