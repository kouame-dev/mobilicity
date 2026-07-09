import { useState } from 'react';
import { Vehicle, Trip } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Compass, Euro, Leaf, BatteryCharging, Activity, ListOrdered } from 'lucide-react';

interface AnalyticsTabProps {
  vehicles: Vehicle[];
  tripsHistory: Trip[];
}

export default function AnalyticsTab({ vehicles, tripsHistory }: AnalyticsTabProps) {
  const [selectedAnalysisTripId, setSelectedAnalysisTripId] = useState<string | null>(null);

  // 1. Map data for average power efficiency (Wh)
  const powerEfficiencyData = vehicles.map(v => ({
    name: v.name.split(' ')[0] + ' (' + v.id + ')',
    'Conso Moyenne (Wh)': v.powerConsumedWh,
    'Batterie Disponible (%)': Math.round((v.powerAvailableWh / v.batteryCapacityWh) * 100)
  }));

  // 2. Map trips data for route comparison
  const tripsPerformanceData = tripsHistory.map(t => ({
    name: t.routeName.split(' - ')[0],
    'Distance (km)': t.distanceKm,
    'CO2 Économisé (kg)': t.co2SavedKg,
    'Puissance Consommée (Wh)': Number(t.powerConsumedWh.toFixed(0)),
    'Efficacité Énergétique (Wh/km)': Number((t.powerConsumedWh / t.distanceKm).toFixed(1))
  }));

  // Selected Trip details for the specific report
  const selectedTrip = tripsHistory.find(t => t.id === selectedAnalysisTripId) || tripsHistory[0];

  return (
    <div id="analytics-performance-panel" className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          Rapports Analytiques Opérationnels & Consommation Électrique
        </h2>
        <p className="text-xs text-slate-400">
          Visualisez l'efficacité énergétique de la flotte électrique (Wh/km), les économies de carbone (CO₂ évité) et la performance de chaque trajet.
        </p>
      </div>

      {/* Main Grid: charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Average power consumption par vehicle type */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-amber-500" />
              Consommation Électrique Moyenne des Engins Connectés (Wh)
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">Télémétrie Can-Bus</span>
          </div>

          <div className="h-[240px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={powerEfficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconSize={10} verticalAlign="top" height={36} />
                {/* Consommation bar */}
                <Bar dataKey="Conso Moyenne (Wh)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 text-center leading-normal">
            Les consommations en Wh varient selon la charge transportée et le profil de l'engin cyclable. Les tricycles et motos électriques sollicitent plus de puissance disponible que les vélos électriques légers.
          </p>
        </div>

        {/* Chart 2: Distance travelled vs CO2 Saved */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-500" />
              Impact Écologique : Émissions de CO₂ Évitées par Trajet (kg CO₂)
            </h3>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono">Éco-Conduite</span>
          </div>

          <div className="h-[240px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tripsPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Legend iconSize={10} verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="CO2 Économisé (kg)" stroke="#10b981" fillOpacity={1} fill="url(#colorCo2)" />
                <Line type="monotone" dataKey="Distance (km)" stroke="#3b82f6" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 text-center leading-normal">
            Corrélation directe entre la distance parcourue et l'économie carbone. Chaque kilomètre en livraison électrique évite d'émettre des gaz à effet de serre par rapport au thermique.
          </p>
        </div>
      </div>

      {/* Fuel/Electricity Consumption Analytical Focus Block for each trip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Rapports détaillés d'Économat et Audit Énergétique par Trajet
            </h3>
            <p className="text-[11px] text-slate-400">
              Cliquez sur un trajet ci-dessous pour générer l'audit énergétique interactif correspondant.
            </p>
          </div>
          <div className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-indigo-400">
            {tripsHistory.length} trajets archivés
          </div>
        </div>

        {/* Horizontal selections for analysis */}
        <div className="flex flex-wrap gap-2.5">
          {tripsHistory.map((trip) => (
            <button
              key={trip.id}
              onClick={() => setSelectedAnalysisTripId(trip.id)}
              className={`px-3.5 py-2 font-semibold text-xs rounded-xl border transition-all text-left ${
                selectedTrip?.id === trip.id
                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-200 shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-500">{trip.id}</div>
              <div className="font-bold">{trip.routeName}</div>
            </button>
          ))}
        </div>

        {/* Selected audit focus visual */}
        {selectedTrip && (
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* KPI 1 : Power consumed */}
            <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Énergie Consommée</span>
              <div className="mt-3">
                <span className="text-xl font-bold font-mono text-slate-100">{selectedTrip.powerConsumedWh.toFixed(0)} Wh</span>
                <span className="text-[9px] text-slate-500 block mt-1">Estimé via télémétrie BMS</span>
              </div>
            </div>

            {/* KPI 2 : Calculated efficiency index */}
            <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Indice d'Efficacité Énergétique</span>
              <div className="mt-3">
                <span className="text-xl font-bold font-mono text-slate-100">
                  {(selectedTrip.powerConsumedWh / selectedTrip.distanceKm).toFixed(1)} Wh/km
                </span>
                <span className="text-[9px] text-emerald-400 block mt-1 font-semibold">Consommation moyenne au km</span>
              </div>
            </div>

            {/* KPI 3 : Co2 Saved */}
            <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">CO₂ Évité (Économisé)</span>
              <div className="mt-3">
                <span className="text-xl font-bold font-mono text-slate-100">{selectedTrip.co2SavedKg} kg CO₂</span>
                <span className="text-[9px] text-emerald-400 block mt-1">Comparé à un moteur thermique</span>
              </div>
            </div>

            {/* KPI 4 : Financial Cost estimation */}
            <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Coût de la Charge Électrique</span>
              <div className="mt-3">
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {((selectedTrip.powerConsumedWh / 1000) * 0.25).toFixed(3)} €
                </span>
                <span className="text-[9px] text-slate-500 block mt-1">Calculé au tarif moyen d'environ 0,25 € / kWh</span>
              </div>
            </div>

            {/* Micro Details table comparison */}
            <div className="md:col-span-4 border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-3">
              <div>
                Rapport de trajet de <strong className="text-slate-200">{selectedTrip.vehicleName}</strong> ({selectedTrip.licensePlate}) le <span className="font-mono text-indigo-400">{selectedTrip.date}</span>
              </div>
              <div>
                Distance: <span className="font-mono text-slate-200">{selectedTrip.distanceKm} km</span> • 
                Durée: <span className="font-mono text-slate-200">{selectedTrip.durationMin} minutes</span> • 
                Vitesse moyenne: <span className="font-mono text-slate-200">{selectedTrip.avgSpeedKmH} km/h</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
