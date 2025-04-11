import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

interface CountryData {
  code: string;
  name: string;
  users: number;
  region: string;
}

const Map: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Generate random signup data
  useEffect(() => {
    const countryData: CountryData[] = [
      { code: 'US', name: 'United States', region: 'Americas' },
      { code: 'GB', name: 'United Kingdom', region: 'Europe' },
      { code: 'DE', name: 'Germany', region: 'Europe' },
      { code: 'JP', name: 'Japan', region: 'Asia' },
      { code: 'AU', name: 'Australia', region: 'Oceania' },
      { code: 'CA', name: 'Canada', region: 'Americas' },
      { code: 'CH', name: 'Switzerland', region: 'Europe' },
      { code: 'SG', name: 'Singapore', region: 'Asia' },
      { code: 'FR', name: 'France', region: 'Europe' },
      { code: 'ES', name: 'Spain', region: 'Europe' }
    ].map(country => ({
      ...country,
      users: Math.floor(Math.random() * 100) + 20 // Random number between 20-120
    }));

    setCountries(countryData);
  }, []);

  const getOpacityByUsers = (users: number) => {
    return Math.min(0.2 + (users / 120) * 0.8, 1);
  };

  const regions = Array.from(new Set(countries.map(c => c.region)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg ${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <GlobeAltIcon className={`h-8 w-8 ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`} />
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>
          Global User Distribution
        </h2>
      </div>

      {/* Region filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedRegion(null)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            selectedRegion === null
              ? 'bg-primary text-white'
              : `${isDarkMode ? 'bg-background hover:bg-background-lighter' : 'bg-background-lightMode hover:bg-background-lightMode-lighter'} ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`
          }`}
        >
          All Regions
        </button>
        {regions.map(region => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              selectedRegion === region
                ? 'bg-primary text-white'
                : `${isDarkMode ? 'bg-background hover:bg-background-lighter' : 'bg-background-lightMode hover:bg-background-lightMode-lighter'} ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`
            }`}
          >
            {region}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries
          .filter(country => !selectedRegion || country.region === selectedRegion)
          .map(country => (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-lg ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'} relative overflow-hidden group`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-medium ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>
                    {country.name}
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>
                    {country.code}
                  </span>
                </div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>
                  {country.users}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>
                  Active Users
                </div>
              </div>
              <div 
                className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-5 transition-opacity"
                style={{ opacity: getOpacityByUsers(country.users) }}
              />
            </motion.div>
          ))}
      </div>

      {/* Legend */}
      <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'}`}>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-20"></div>
            <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>{'< 40 users'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-60"></div>
            <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>40-80 users</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>{'>80 users'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Map; 