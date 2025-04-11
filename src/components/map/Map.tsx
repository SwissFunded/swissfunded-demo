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

interface CountryData {
  code: string;
  name: string;
  users: number;
  region: string;
  coordinates: [number, number];
}

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const Map: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

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
      .range(["rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 1)"]);
  }, []);

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
      <div className={`relative w-full h-[600px] rounded-lg overflow-hidden ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'}`}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 150
          }}
        >
          <ZoomableGroup center={[0, 20]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: Array<Feature<GeometryObject>> }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.properties?.name || Math.random()}
                    geography={geo}
                    fill={isDarkMode ? "#2a2a2a" : "#f0f0f0"}
                    stroke={isDarkMode ? "#1a1a1a" : "#e5e5e5"}
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {countries
              .filter(country => !selectedRegion || country.region === selectedRegion)
              .map(({ name, coordinates, users }) => (
                <Marker
                  key={name}
                  coordinates={coordinates}
                  onMouseEnter={(e: React.MouseEvent<SVGElement>) => {
                    const bounds = (e.target as SVGElement).getBoundingClientRect();
                    setTooltipContent(`${name}: ${users} users`);
                    setTooltipPosition({ x: bounds.left, y: bounds.top });
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('');
                    setTooltipPosition(null);
                  }}
                >
                  <circle
                    r={Math.max(4, Math.min(users / 10, 8))}
                    fill={colorScale(users)}
                    stroke={isDarkMode ? "#1a1a1a" : "#e5e5e5"}
                    strokeWidth={1}
                    style={{
                      transition: "all 0.3s ease",
                    }}
                  />
                </Marker>
              ))}
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