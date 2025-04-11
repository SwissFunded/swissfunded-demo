import React, { useState, useEffect, useMemo } from 'react';
import { LazyMotion, domMax, m, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { GlobeAltIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Position
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
  const [zoom, setZoom] = useState<number>(1);

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
        isDarkMode ? "rgba(255, 51, 75, 0.15)" : "rgba(255, 51, 75, 0.15)",
        isDarkMode ? "rgba(255, 51, 75, 0.25)" : "rgba(255, 51, 75, 0.25)",
        isDarkMode ? "rgba(255, 51, 75, 0.35)" : "rgba(255, 51, 75, 0.35)",
        isDarkMode ? "rgba(255, 51, 75, 0.45)" : "rgba(255, 51, 75, 0.45)",
        isDarkMode ? "rgba(255, 51, 75, 0.55)" : "rgba(255, 51, 75, 0.55)"
      ]);
  }, [isDarkMode]);

  const getCountryColor = (geo: Feature<GeometryObject>) => {
    const country = countries.find(c => c.name === geo.properties?.name);
    if (country && (!selectedRegion || country.region === selectedRegion)) {
      return colorScale(country.users);
    }
    return isDarkMode ? "rgba(26, 26, 26, 0.6)" : "rgba(245, 245, 245, 0.6)";
  };

  const regions = Array.from(new Set(countries.map(c => c.region)));

  return (
    <LazyMotion features={domMax}>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-8 rounded-xl ${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} shadow-lg`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'}`}>
              <GlobeAltIcon className={`h-6 w-6 ${isDarkMode ? 'text-primary' : 'text-primary'}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`}>
                Global User Distribution
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>
                {selectedRegion ? `Showing ${selectedRegion} region` : 'Showing all regions'}
              </p>
            </div>
          </div>
        </div>

        {/* Region filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <m.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRegion(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedRegion === null
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : `${isDarkMode ? 'bg-background hover:bg-background-lighter' : 'bg-background-lightMode hover:bg-background-lightMode-lighter'} ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`
            }`}
          >
            All Regions
          </m.button>
          {regions.map(region => (
            <m.button
              key={region}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedRegion === region
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : `${isDarkMode ? 'bg-background hover:bg-background-lighter' : 'bg-background-lightMode hover:bg-background-lightMode-lighter'} ${isDarkMode ? 'text-text' : 'text-text-lightMode'}`
              }`}
            >
              {region}
            </m.button>
          ))}
        </div>

        {/* Map */}
        <div className={`relative w-full h-[600px] rounded-xl overflow-hidden ${
          isDarkMode ? 'bg-background' : 'bg-background-lightMode'
        } shadow-inner`}>
          {isLoading && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-opacity-90 bg-background z-10"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </m.div>
          )}
          {error && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-opacity-90 bg-background z-10"
            >
              <div className={`text-center p-6 rounded-lg ${isDarkMode ? 'bg-background-light' : 'bg-background-lightMode-light'} shadow-lg`}>
                <p className="text-lg font-semibold mb-2 text-primary">Error loading map data</p>
                <p className="text-sm text-text-muted">{error}</p>
              </div>
            </m.div>
          )}
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 130,
              center: [0, 30]
            }}
            style={{
              width: "100%",
              height: "100%",
              background: isDarkMode ? "#1a1a1a" : "#f5f5f5"
            }}
          >
            <ZoomableGroup
              zoom={zoom}
              onMoveEnd={(position: { coordinates: [number, number]; zoom: number }) => {
                setZoom(position.zoom);
              }}
              minZoom={1}
              maxZoom={4}
              center={[0, 30]}
            >
              <Geographies geography={worldData}>
                {({ geographies }) => 
                  geographies.map((geo) => {
                    const country = countries.find(c => c.name === geo.properties?.name);
                    return (
                      <Geography
                        key={geo.properties?.name || Math.random()}
                        geography={geo}
                        fill={getCountryColor(geo)}
                        stroke={isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { 
                            fill: country ? colorScale(country.users + 50) : (isDarkMode ? "#2a2a2a" : "#e5e5e5"),
                            transition: "all 0.3s ease",
                            cursor: "pointer"
                          },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={(e) => {
                          if (country) {
                            const bounds = (e.target as SVGElement).getBoundingClientRect();
                            setTooltipContent(`${country.name}: ${country.users.toLocaleString()} users`);
                            setTooltipPosition({ x: bounds.left, y: bounds.top });
                          }
                        }}
                        onMouseLeave={() => {
                          setTooltipContent('');
                          setTooltipPosition(null);
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Enhanced Tooltip */}
          <AnimatePresence mode="wait">
            {tooltipContent && tooltipPosition && (
              <m.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className={`absolute px-4 py-2.5 rounded-lg ${
                  isDarkMode ? 'bg-background-light text-text' : 'bg-background-lightMode-light text-text-lightMode'
                } shadow-xl pointer-events-none z-50 backdrop-blur-sm`}
                style={{
                  left: tooltipPosition.x,
                  top: tooltipPosition.y - 50,
                }}
              >
                {tooltipContent}
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modern Legend */}
        <div className={`mt-8 p-6 rounded-xl ${isDarkMode ? 'bg-background' : 'bg-background-lightMode'}`}>
          <h3 className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>
            User Density
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {[
              { range: '< 50', opacity: 0.15 },
              { range: '50-100', opacity: 0.25 },
              { range: '100-150', opacity: 0.35 },
              { range: '150-200', opacity: 0.45 },
              { range: '200+', opacity: 0.55 }
            ].map((item) => (
              <div key={item.range} className="flex flex-col items-center gap-2">
                <div 
                  className="w-full h-2 rounded-full bg-primary"
                  style={{ opacity: item.opacity }}
                />
                <span className={`text-xs ${isDarkMode ? 'text-text-muted' : 'text-text-lightMode-muted'}`}>
                  {item.range}
                </span>
              </div>
            ))}
          </div>
        </div>
      </m.div>
    </LazyMotion>
  );
};

export default Map; 