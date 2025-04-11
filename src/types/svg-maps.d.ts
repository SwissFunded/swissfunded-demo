declare module '@svg-maps/world' {
  const content: {
    label: string;
    locations: Array<{
      id: string;
      path: string;
      name: string;
    }>;
  };
  export default content;
}

declare module 'react-svg-map' {
  import { FC, CSSProperties } from 'react';

  interface SVGMapProps {
    map: {
      label: string;
      locations: Array<{
        id: string;
        path: string;
        name: string;
      }>;
    };
    className?: string;
    locationClassName?: string;
    onLocationMouseOver?: (event: any) => void;
    onLocationMouseOut?: () => void;
    locationStyle?: (location: { id: string; path: string; name: string }) => CSSProperties;
  }

  export const SVGMap: FC<SVGMapProps>;
} 