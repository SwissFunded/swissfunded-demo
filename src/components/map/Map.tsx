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
      // Americas
      { code: 'US', name: 'United States of America', region: 'Americas', coordinates: [-95.7129, 37.0902] as [number, number], users: 180 },
      { code: 'CA', name: 'Canada', region: 'Americas', coordinates: [-106.3468, 56.1304] as [number, number], users: 85 },
      { code: 'BR', name: 'Brazil', region: 'Americas', coordinates: [-51.9253, -14.2350] as [number, number], users: 120 },
      { code: 'MX', name: 'Mexico', region: 'Americas', coordinates: [-102.5528, 23.6345] as [number, number], users: 75 },
      { code: 'AR', name: 'Argentina', region: 'Americas', coordinates: [-63.6167, -38.4161] as [number, number], users: 45 },
      
      // Europe
      { code: 'GB', name: 'United Kingdom', region: 'Europe', coordinates: [-0.1278, 51.5074] as [number, number], users: 165 },
      { code: 'DE', name: 'Germany', region: 'Europe', coordinates: [10.4515, 51.1657] as [number, number], users: 145 },
      { code: 'FR', name: 'France', region: 'Europe', coordinates: [2.2137, 46.2276] as [number, number], users: 110 },
      { code: 'CH', name: 'Switzerland', region: 'Europe', coordinates: [8.2275, 46.8182] as [number, number], users: 95 },
      { code: 'ES', name: 'Spain', region: 'Europe', coordinates: [-3.7492, 40.4637] as [number, number], users: 80 },
      { code: 'IT', name: 'Italy', region: 'Europe', coordinates: [12.5674, 41.8719] as [number, number], users: 90 },
      { code: 'NL', name: 'Netherlands', region: 'Europe', coordinates: [5.2913, 52.1326] as [number, number], users: 70 },
      { code: 'SE', name: 'Sweden', region: 'Europe', coordinates: [18.6435, 60.1282] as [number, number], users: 55 },
      { code: 'NO', name: 'Norway', region: 'Europe', coordinates: [8.4689, 60.4720] as [number, number], users: 40 },
      
      // Asia
      { code: 'JP', name: 'Japan', region: 'Asia', coordinates: [138.2529, 36.2048] as [number, number], users: 155 },
      { code: 'SG', name: 'Singapore', region: 'Asia', coordinates: [103.8198, 1.3521] as [number, number], users: 125 },
      { code: 'KR', name: 'South Korea', region: 'Asia', coordinates: [127.7669, 35.9078] as [number, number], users: 95 },
      { code: 'CN', name: 'China', region: 'Asia', coordinates: [104.1954, 35.8617] as [number, number], users: 140 },
      { code: 'IN', name: 'India', region: 'Asia', coordinates: [78.9629, 20.5937] as [number, number], users: 130 },
      { code: 'AE', name: 'UAE', region: 'Asia', coordinates: [53.8478, 23.4241] as [number, number], users: 85 },
      { code: 'HK', name: 'Hong Kong', region: 'Asia', coordinates: [114.1694, 22.3193] as [number, number], users: 75 },
      
      // Oceania
      { code: 'AU', name: 'Australia', region: 'Oceania', coordinates: [133.7751, -25.2744] as [number, number], users: 110 },
      { code: 'NZ', name: 'New Zealand', region: 'Oceania', coordinates: [174.8860, -40.9006] as [number, number], users: 45 },
      
      // Africa
      { code: 'ZA', name: 'South Africa', region: 'Africa', coordinates: [22.9375, -30.5595] as [number, number], users: 65 },
      { code: 'EG', name: 'Egypt', region: 'Africa', coordinates: [30.8025, 26.8206] as [number, number], users: 55 },
      { code: 'NG', name: 'Nigeria', region: 'Africa', coordinates: [8.6753, 9.0820] as [number, number], users: 40 },
      { code: 'KE', name: 'Kenya', region: 'Africa', coordinates: [37.9062, -0.0236] as [number, number], users: 35 },
      { code: 'MA', name: 'Morocco', region: 'Africa', coordinates: [-7.0926, 31.7917] as [number, number], users: 30 },
      { code: 'DZ', name: 'Algeria', region: 'Africa', coordinates: [2.6327, 28.0339] as [number, number], users: 25 }
    ];

    setCountries(countryData);
  }, []);

  const colorScale = useMemo(() => {
    return scaleLinear<string>()
      .domain([20, 50, 100, 150, 200])
      .range([
        isDarkMode ? "rgba(99, 102, 241, 0.1)" : "rgba(99, 102, 241, 0.05)",
        isDarkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.15)",
        isDarkMode ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.25)",
        isDarkMode ? "rgba(99, 102, 241, 0.4)" : "rgba(99, 102, 241, 0.35)",
        isDarkMode ? "rgba(99, 102, 241, 0.5)" : "rgba(99, 102, 241, 0.45)"
      ]);
  }, [isDarkMode]);

  const getCountryColor = (geo: Feature<GeometryObject>) => {
    const country = countries.find(c => c.name === geo.properties?.name);
    if (country && (!selectedRegion || country.region === selectedRegion)) {
      return colorScale(country.users);
    }
    // Debug logging
    if (geo.properties?.name?.includes('United States')) {
      console.log('Found US in GeoJSON:', geo.properties.name);
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
            <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>{'< 100 users'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-12 h-3 rounded bg-red-500 opacity-40"></div>
            <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>100-200 users</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-12 h-3 rounded bg-red-500 opacity-60"></div>
            <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>200-300 users</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-12 h-3 rounded bg-red-500 opacity-80"></div>
            <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>300-400 users</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-12 h-3 rounded bg-red-500 opacity-90"></div>
            <span className={isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}>{'>400 users'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Map; 