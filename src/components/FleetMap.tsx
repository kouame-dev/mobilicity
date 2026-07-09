import { useState } from 'react';
import { Vehicle, Coordinates, Trip } from '../types';
import { Play, Square, MapPin, Navigation, Info, ShieldAlert, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

interface FleetMapProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string | null) => void;
  onToggleLock: (id: string) => void;
  activeHistoricalTrip: Trip | null;
  onClearHistoricalTrip: () => void;
}

export default function FleetMap({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  onToggleLock,
  activeHistoricalTrip,
  onClearHistoricalTrip
}: FleetMapProps) {
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [showTerrain, setShowTerrain] = useState<'streets' | 'radar'>('streets');

  // Find selected vehicle
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  // Hardcoded locations of interest on the virtual map (mapped on 100x100 grid)
  const POIS = [
    { name: "Paris Centre (Dépôt Principal)", x: 15, y: 35, color: "bg-blue-500" },
    { name: "Versailles (Livraison A)", x: 35, y: 30, color: "bg-amber-500" },
    { name: "Atelier de Maintenance", x: 30, y: 70, color: "bg-rose-500" },
    { name: "Rungis Intégrateur", x: 80, y: 55, color: "bg-green-500" },
    { name: "Aéroport Orly (Point Relais B)", x: 70, y: 75, color: "bg-indigo-500" },
  ];

  return (
    <div id="fleet-map-container" className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden h-[540px] shadow-2xl flex flex-col">
      {/* Top Map Control Bar */}
      <div id="map-control-bar" className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2 items-center justify-between pointer-events-none">
        <div className="flex gap-2 pointer-events-auto bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-md">
          <button
            onClick={() => setShowTerrain('streets')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              showTerrain === 'streets' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vue Cartographique
          </button>
          <button
            onClick={() => setShowTerrain('radar')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              showTerrain === 'radar' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vue Radar Télémétrique
          </button>
        </div>

        {activeHistoricalTrip && (
          <div className="flex items-center gap-3 pointer-events-auto bg-emerald-950/95 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-800 animate-pulse text-emerald-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <div className="text-xs">
              <span className="font-semibold block">Historique affiché : {activeHistoricalTrip.routeName}</span>
              <span className="text-[10px] text-emerald-400/90">{activeHistoricalTrip.distanceKm} km parcourus • {activeHistoricalTrip.avgSpeedKmH} km/h moy.</span>
            </div>
            <button
              onClick={onClearHistoricalTrip}
              className="text-xs hover:text-white bg-emerald-800/80 hover:bg-emerald-800 px-2 py-1 rounded-md transition-all ml-1 text-emerald-100 font-medium"
            >
              Fermer l'historique
            </button>
          </div>
        )}
      </div>

      {/* Main Vector Grid Stage */}
      <div id="gps-vector-stage" className="relative flex-1 w-full overflow-hidden select-none cursor-crosshair">
        {/* Background Grid Lines representing street maps */}
        <div className={`absolute inset-0 transition-all duration-500 ${showTerrain === 'radar' ? 'bg-slate-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]' : 'bg-slate-900 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [background-size:40px_40px]'}`}>
          {/* Simulated Street Outlines */}
          {showTerrain === 'streets' && (
            <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
              {/* Primary Street grid highways */}
              <line x1="0%" y1="35%" x2="100%" y2="35%" stroke="#475569" strokeWidth="4" strokeDasharray="6 4" />
              <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#475569" strokeWidth="4" />
              <path d="M 10 90 Q 50 80 90 70" fill="transparent" stroke="#334155" strokeWidth="12" />
              <path d="M 10 90 Q 50 80 90 70" fill="transparent" stroke="#1e293b" strokeWidth="6" />

              <path d="M 5 80 Q 50 40 95 68" fill="transparent" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 6" />

              {/* Diagonal Avenue */}
              <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="#334155" strokeWidth="3" />
              <line x1="100%" y1="0%" x2="0%" y2="100%" stroke="#1e293b" strokeWidth="2" />
            </svg>
          )}

          {/* Simulated Radar Circular concentric circles */}
          {showTerrain === 'radar' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="w-[100px] h-[100px] rounded-full border border-teal-500/25 animate-ping"></div>
              <div className="w-[200px] h-[200px] rounded-full border border-teal-500/30 absolute"></div>
              <div className="w-[400px] h-[400px] rounded-full border border-teal-500/20 absolute"></div>
              <div className="w-[600px] h-[600px] rounded-full border border-teal-500/10 absolute"></div>
              {/* Spinning Radar sweep beam */}
              <div className="absolute w-[50%] h-[2px] bg-gradient-to-r from-teal-500/60 to-transparent origin-left rotate-45 animate-[spin_5s_linear_infinite]"></div>
            </div>
          )}
        </div>

        {/* Draw Points of Interest (POIs) */}
        {POIS.map((poi, idx) => (
          <div
            key={idx}
            className="absolute transition-transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-auto"
            style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
          >
            <div className="p-1 rounded-full bg-slate-900 border border-slate-700 hover:border-indigo-400 transition-colors shadow-lg pointer-events-auto">
              <div className={`w-2 h-2 rounded-full ${poi.color}`}></div>
            </div>
            <span className="scale-75 origin-top opacity-0 group-hover:opacity-100 group-hover:scale-90 transition-all duration-200 mt-1 whitespace-nowrap bg-slate-900/90 text-slate-200 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 z-30 font-medium">
              {poi.name}
            </span>
          </div>
        ))}

        {/* Draw Active Historical Trip (If Selected) */}
        {activeHistoricalTrip && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tripGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            {/* Outline route */}
            <path
              d={`M ${activeHistoricalTrip.routePath.map(p => `${p.x * 10} ${p.y * 5}`).join(' L ')}`}
              fill="transparent"
              stroke="url(#tripGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-[dash_2s_linear_infinite] opacity-80"
              strokeDasharray="10 5"
            />
            {/* Draw flags for start and finish */}
            {activeHistoricalTrip.routePath.length > 0 && (
              <>
                {/* Start Flag visual */}
                <circle
                  cx={activeHistoricalTrip.routePath[0].x * 10}
                  cy={activeHistoricalTrip.routePath[0].y * 5}
                  r="6"
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                {/* Finish Flag visual */}
                <circle
                  cx={activeHistoricalTrip.routePath[activeHistoricalTrip.routePath.length - 1].x * 10}
                  cy={activeHistoricalTrip.routePath[activeHistoricalTrip.routePath.length - 1].y * 5}
                  r="7"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>
        )}

        {/* Draw Vehicles and GPS status indicators */}
        {vehicles.map((vehicle) => {
          const isSelected = vehicle.id === selectedVehicleId;
          const isSpeeding = vehicle.currentSpeed > vehicle.maxAllowedSpeed;
          const mapX = vehicle.lng; // map lng to X grid percentage
          const mapY = vehicle.lat; // map lat to Y grid percentage

          // Vehicle marker color based on status and speed
          let markerColor = "bg-indigo-500 shadow-indigo-500/50";
          if (vehicle.status === "maintenance") {
            markerColor = "bg-rose-500 shadow-rose-500/50";
          } else if (isSpeeding && vehicle.currentSpeed > 0) {
            markerColor = "bg-red-500 animate-pulse shadow-red-500/70";
          } else if (vehicle.status === "idle") {
            markerColor = "bg-slate-500 shadow-slate-500/50";
          } else {
            markerColor = "bg-emerald-500 shadow-emerald-500/50";
          }

          return (
            <div
              key={vehicle.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-20 cursor-pointer pointer-events-auto group ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
              style={{ left: `${mapX}%`, top: `${mapY}%` }}
              onClick={() => onSelectVehicle(isSelected ? null : vehicle.id)}
            >
              {/* Dynamic Speed Ping waves */}
              {isSpeeding && vehicle.currentSpeed > 0 && (
                <span className="absolute -inset-2.5 rounded-full bg-red-500/40 animate-ping"></span>
              )}
              {vehicle.status === 'active' && !isSpeeding && (
                <span className="absolute -inset-1.5 rounded-full bg-emerald-400/20 animate-pulse"></span>
              )}

              {/* Angle Direction Marker */}
              <div
                className="absolute -top-3 left-[calc(50%-4px)] transition-transform duration-500"
                style={{ transform: `rotate(${vehicle.angle}deg)`, transformOrigin: "bottom center" }}
              >
                <div className={`w-2 h-2 border-l-2 border-t-2 ${isSpeeding ? 'border-red-400' : 'border-indigo-400'} rotate-45`}></div>
              </div>

              {/* Core Vehicle Badge Indicator */}
              <div className={`p-1.5 rounded-xl border border-slate-900 shadow-xl ${markerColor} text-white flex items-center justify-center transition-all`}>
                <Navigation
                  className="w-4 h-4"
                  style={{ transform: `rotate(${vehicle.angle}deg)` }}
                />
              </div>

              {/* Vehicle Mini Tag Hover */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/95 border border-slate-800 text-slate-100 rounded-lg px-2 py-1 text-[10px] font-semibold flex items-center gap-1.5 shadow-lg group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="block">{vehicle.name}</span>
                <span className="text-slate-400 px-1 py-0.25 bg-slate-900 rounded font-mono text-[9px]">
                  {vehicle.currentSpeed} km/h
                </span>
                {vehicle.isLocked ? (
                  <span className="text-emerald-400 text-[10px]">🔒</span>
                ) : (
                  <span className="text-amber-400 text-[10px]">🔓</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Footer status drawer */}
      <div id="map-drawer-details" className="bg-slate-900 border-t border-slate-800 p-4 transition-all z-10">
        {selectedVehicle ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center">
                <Navigation className={`w-6 h-6 text-indigo-400 animate-pulse`} style={{ transform: `rotate(${selectedVehicle.angle}deg)` }} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-100">{selectedVehicle.name}</h3>
                  <span className="px-2 py-0.5 text-[10px] bg-slate-950 border border-slate-800 rounded font-mono text-indigo-300">
                    {selectedVehicle.licensePlate}
                  </span>
                  <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold uppercase tracking-wider ${
                    selectedVehicle.type === 'Moto' ? 'bg-amber-900/40 text-amber-300' : 
                    selectedVehicle.type === 'Tricycle' ? 'bg-cyan-900/40 text-cyan-300' : 'bg-indigo-900/40 text-indigo-300'
                  }`}>
                    {selectedVehicle.type}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  Chauffeur attitré : <span className="font-semibold text-slate-300">{selectedVehicle.driverName || 'Non assigné'}</span> •
                  Kilométrage : <span className="font-mono">{selectedVehicle.mileage.toLocaleString()} km</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 ml-1 md:ml-0">
              {/* Speed telematics metric */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Vitesse</span>
                <span className={`text-sm font-semibold font-mono ${selectedVehicle.currentSpeed > selectedVehicle.maxAllowedSpeed ? 'text-red-400' : 'text-slate-100'}`}>
                  {selectedVehicle.currentSpeed} / {selectedVehicle.maxAllowedSpeed} km/h
                </span>
              </div>

              {/* Battery Level metrics */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Batterie / Énergie</span>
                <div className="flex items-center gap-1.5 justify-center mt-0.5">
                  <div className="w-12 bg-slate-800 h-2 rounded overflow-hidden">
                    <div
                      className={`h-full rounded ${Math.round((selectedVehicle.powerAvailableWh / selectedVehicle.batteryCapacityWh) * 100) < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.round((selectedVehicle.powerAvailableWh / selectedVehicle.batteryCapacityWh) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-200">
                    {Math.round((selectedVehicle.powerAvailableWh / selectedVehicle.batteryCapacityWh) * 100)}%
                  </span>
                </div>
              </div>

              {/* Puissances (Disponible, Consommée, Reçue) */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Puis. Électrique (Cons • Rec • Disp)</span>
                <span className="text-xs font-semibold font-mono text-slate-100 block mt-0.5">
                  {selectedVehicle.powerConsumedWh} Wh • {selectedVehicle.powerReceivedWh} Wh • {selectedVehicle.powerAvailableWh} Wh
                </span>
              </div>

              {/* Tension / Intensité */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Tension / Intensité</span>
                <span className="text-xs font-semibold font-mono text-indigo-400 block mt-0.5">
                  {selectedVehicle.voltage}V • {selectedVehicle.intensity}A
                </span>
              </div>

              {/* Remote Lock toggle button action */}
              <button
                onClick={() => onToggleLock(selectedVehicle.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all shadow ${
                  selectedVehicle.isLocked
                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-400 hover:bg-emerald-900'
                    : 'bg-amber-950 border border-amber-800 text-amber-500 hover:bg-amber-900'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                {selectedVehicle.isLocked ? 'Verrouillé (Déverrouiller)' : 'Déverrouillé (Verrouiller)'}
              </button>

              <button
                onClick={() => onSelectVehicle(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 underline font-medium"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        ) : (
          <div className="h-10 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>Cliquez sur une icône de véhicule mobile sur la carte pour suivre son itinéraire, gérer son verrouillage de portes ou voir sa vitesse.</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Actif</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500 animate-pulse"></span> Excès Vitesse</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-500"></span> Au Dépôt</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Maintenance</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
