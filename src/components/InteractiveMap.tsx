import { useEffect, useRef, useState } from 'react';

interface MapMarker {
  id: string;
  name: string;
  lat: number; // 0-100 virtual coordinate
  lng: number; // 0-100 virtual coordinate
  type?: string;
  angle?: number;
  currentSpeed: number;
  isLocked?: boolean;
  batteryPercent: number;
}

interface InteractiveMapProps {
  markers: MapMarker[];
  selectedMarkerId?: string | null;
  onSelectMarker?: (id: string | null) => void;
  mapType: 'streets' | 'satellite' | 'relief';
}

// Convert Abidjan virtual grid (0-100) to actual geographic coordinates
// Cocody/Plateau center around Lat: 5.3484, Lng: -3.9785
const virtualToGeographic = (vLat: number, vLng: number): [number, number] => {
  const centerLat = 5.3484;
  const centerLng = -3.9785;
  // Map 0-100 to about ~15km range
  const lat = centerLat - (vLat - 50) * 0.0018;
  const lng = centerLng + (vLng - 50) * 0.0022;
  return [lat, lng];
};

export default function InteractiveMap({
  markers,
  selectedMarkerId,
  onSelectMarker,
  mapType
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  const mapInstanceRef = useRef<any>(null);
  const leafletMarkersRef = useRef<Record<string, any>>({});
  const activeTileLayerRef = useRef<any>(null);

  // 1. Dynamic CDN Loading of Leaflet
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Insert stylesheet
    const cssId = 'leaflet-cdn-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Insert script
    const scriptId = 'leaflet-cdn-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        setLeafletLoaded(true);
      };
      script.onerror = () => {
        setLoadError(true);
      };
      document.head.appendChild(script);
    } else {
      // Script exists but maybe not fully loaded yet
      const interval = setInterval(() => {
        if ((window as any).L) {
          setLeafletLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // 2. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    // Center coordinates for map (Abidjan)
    const defaultCenter = virtualToGeographic(50, 50);

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: true,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Force resize triggering
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        leafletMarkersRef.current = {};
      }
    };
  }, [leafletLoaded]);

  // 3. Update Tile Layers based on Map Type
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let options: any = { maxZoom: 19 };

    if (mapType === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}';
      options = { maxZoom: 19 };
    } else if (mapType === 'relief') {
      // OpenTopoMap for Relief
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      options = { maxZoom: 17 };
    }

    const tileLayer = L.tileLayer(url, options);
    tileLayer.addTo(map);
    activeTileLayerRef.current = tileLayer;
  }, [leafletLoaded, mapType]);

  // 4. Update Markers in Real Time
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    // Keep track of current marker IDs to delete stale ones
    const activeIds = new Set(markers.map(m => m.id));

    // Delete removed markers
    Object.keys(leafletMarkersRef.current).forEach(id => {
      if (!activeIds.has(id)) {
        leafletMarkersRef.current[id].remove();
        delete leafletMarkersRef.current[id];
      }
    });

    // Draw/Update markers
    markers.forEach(marker => {
      const coords = virtualToGeographic(marker.lat, marker.lng);
      const isSelected = marker.id === selectedMarkerId;

      // HTML custom element for vehicle icon
      const rotation = marker.angle || 0;
      const isSpeeding = marker.currentSpeed > 60; // Example speed threshold
      
      let markerColor = 'bg-emerald-500';
      if (marker.currentSpeed === 0) markerColor = 'bg-slate-500';
      if (isSpeeding) markerColor = 'bg-red-500 animate-pulse';

      const iconHtml = `
        <div class="relative flex items-center justify-center pointer-events-auto" style="transform: rotate(${rotation}deg); width: 36px; height: 36px;">
          ${isSpeeding ? '<span class="absolute -inset-1.5 rounded-full bg-red-500/40 animate-ping"></span>' : ''}
          <div class="p-1.5 rounded-xl border border-slate-900 shadow-lg ${markerColor} text-white flex items-center justify-center transition-all ${isSelected ? 'scale-125 border-white ring-2 ring-indigo-500' : ''}">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-navigation">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white font-bold text-[8.5px] px-1.5 py-0.25 rounded border border-slate-800 shadow-md">
            ${marker.name.split(' ')[0]} (${marker.currentSpeed} km/h)
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-div-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      if (leafletMarkersRef.current[marker.id]) {
        // Update existing marker
        const existingMarker = leafletMarkersRef.current[marker.id];
        existingMarker.setLatLng(coords);
        existingMarker.setIcon(customIcon);
      } else {
        // Create new marker
        const newMarker = L.marker(coords, { icon: customIcon }).addTo(map);
        
        // Marker Click Action
        newMarker.on('click', () => {
          if (onSelectMarker) {
            onSelectMarker(marker.id);
          }
        });

        leafletMarkersRef.current[marker.id] = newMarker;
      }

      // If selected, pan map to this marker
      if (isSelected && mapInstanceRef.current) {
        mapInstanceRef.current.setView(coords, mapInstanceRef.current.getZoom(), { animate: true });
      }
    });

  }, [markers, selectedMarkerId, leafletLoaded]);

  if (loadError) {
    return (
      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-400 p-4 font-sans text-center">
        <span className="text-2xl mb-2">🗺️</span>
        <p className="text-xs">Impossible de charger le service de cartographie en ligne.</p>
        <p className="text-[10px] text-slate-500 mt-1">Vérifiez votre connexion ou utilisez la vue radar télémétrique.</p>
      </div>
    );
  }

  if (!leafletLoaded) {
    return (
      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-400 p-4 font-sans">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <span className="text-[10px] uppercase font-bold tracking-wider font-mono animate-pulse">Initialisation de la carte Live...</span>
      </div>
    );
  }

  return (
    <div id="leaflet-interactive-map" ref={mapContainerRef} className="w-full h-full min-h-[250px] bg-slate-900" />
  );
}
