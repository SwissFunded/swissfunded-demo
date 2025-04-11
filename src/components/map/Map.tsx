import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Feature, GeometryObject } from 'geojson';
import worldData from '../../data/world-110m.json';

interface CountryData {
  code: string;
  name: string;
  users: number;
  region: string;
  coordinates: [number, number];
}

const Map: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Generate random signup data
  useEffect(() => {
    const countryData: CountryData[] = [
      { code: 'US', name: 'United States', region: 'Americas', coordinates: [-95.7129, 37.0902] as [number, number] },
      { code: 'GB', name: 'United Kingdom', region: 'Europe', coordinates: [-0.1278, 51.5074] as [number, number] },
      { code: 'DE', name: 'Germany', region: 'Europe', coordinates: [10.4515, 51.1657] as [number, number] },
      { code: 'JP', name: 'Japan', region: 'Asia', coordinates: [138.2529, 36.2048] as [number, number] },
      { code: 'AU', name: 'Australia', region: 'Oceania', coordinates: [133.7751, -25.2744] as [number, number] },
      { code: 'CA', name: 'Canada', region: 'Americas', coordinates: [-106.3468, 56.1304] as [number, number] },
      { code: 'CH', name: 'Switzerland', region: 'Europe', coordinates: [8.2275, 46.8182] as [number, number] },
      { code: 'SG', name: 'Singapore', region: 'Asia', coordinates: [103.8198, 1.3521] as [number, number] },
      { code: 'FR', name: 'France', region: 'Europe', coordinates: [2.2137, 46.2276] as [number, number] },
      { code: 'ES', name: 'Spain', region: 'Europe', coordinates: [-3.7492, 40.4637] as [number, number] }
    ].map(country => ({
      ...country,
      users: Math.floor(Math.random() * 100) + 20 // Random number between 20-120
    }));

    setCountries(countryData);
  }, []);

  const colorScale = useMemo(() => {
    return scaleLinear<string>()
      .domain([20, 120])
      .range([isDarkMode ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)", "rgba(239, 68, 68, 0.8)"]);
  }, [isDarkMode]);

  const getCountryColor = (geo: Feature<GeometryObject>) => {
    const country = countries.find(c => c.name === geo.properties?.name);
    if (country && (!selectedRegion || country.region === selectedRegion)) {
      return colorScale(country.users);
    }
    return isDarkMode ? "#333333" : "#e5e5e5";
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

      {/* Map */}
      <div className={`relative w-full h-[600px] rounded-lg overflow-hidden border ${
        isDarkMode ? 'bg-background border-background-lighter' : 'bg-background-lightMode border-background-lightMode-lighter'
      }`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 bg-background z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-75 bg-background z-10">
            <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>
              <p className="text-lg font-semibold mb-2">Error loading map data</p>
              <p className="text-sm text-text-muted">{error}</p>
            </div>
          </div>
        )}
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 130,
            center: [0, 30]
          }}
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          <ZoomableGroup>
            <Geographies geography={worldData}>
              {({ geographies, error }: { geographies: Array<Feature<GeometryObject>>, error?: Error }) => {
                if (error) {
                  setError(error.message);
                  setIsLoading(false);
                  return null;
                }
                setIsLoading(false);
                return geographies.map((geo) => {
                  const country = countries.find(c => c.name === geo.properties?.name);
                  return (
                    <Geography
                      key={geo.properties?.name || Math.random()}
                      geography={geo}
                      fill={getCountryColor(geo)}
                      stroke={isDarkMode ? "#444444" : "#d1d1d1"}
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { 
                          fill: country ? colorScale(country.users + 20) : (isDarkMode ? "#444444" : "#d1d1d1"),
                          transition: "all 0.3s ease"
                        },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={(e) => {
                        if (country) {
                          const bounds = (e.target as SVGElement).getBoundingClientRect();
                          setTooltipContent(`${country.name}: ${country.users} users`);
                          setTooltipPosition({ x: bounds.left, y: bounds.top });
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                        setTooltipPosition(null);
                      }}
                    />
                  );
                });
              }}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltipContent && tooltipPosition && (
          <div
            className={`absolute px-3 py-2 rounded-lg text-sm ${
              isDarkMode ? 'bg-background text-text' : 'bg-background-lightMode text-text-lightMode'
            } shadow-lg pointer-events-none z-50`}
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y - 40,
            }}
          >
            {tooltipContent}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'}`}>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-12 h-3 rounded bg-red-500 opacity-20"></div>
            <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>{'< 40 users'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-12 h-3 rounded bg-red-500 opacity-50"></div>
            <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>40-80 users</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-12 h-3 rounded bg-red-500 opacity-80"></div>
            <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>{'>80 users'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Map; 