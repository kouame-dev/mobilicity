import { Vehicle, Alert, MaintenanceRecord } from '../types';
import { Bike, ShieldAlert, BadgeInfo, Flame, Wrench, Activity, Sparkles, BatteryCharging } from 'lucide-react';

interface DashboardStatsProps {
  vehicles: Vehicle[];
  alerts: Alert[];
  maintenance: MaintenanceRecord[];
}

export default function DashboardStats({ vehicles, alerts, maintenance }: DashboardStatsProps) {
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const unreadAlerts = alerts.filter(a => !a.isRead).length;
  const maintenancePending = maintenance.filter(m => m.status !== 'completed').length;

  // Calculate Average Power Consumed across the fleet
  const averagePowerWh = (vehicles.reduce((acc, v) => acc + v.powerConsumedWh, 0) / totalVehicles).toFixed(0);

  // Total investment inside active maintenance
  const activeMaintenanceCost = maintenance
    .filter(m => m.status !== 'completed')
    .reduce((acc, m) => acc + m.cost, 0);

  return (
    <div id="dashboard-statistics-grid" className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Total Vehicles Card */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Flotte Totale</span>
          <div className="p-1.5 bg-indigo-900/30 text-indigo-400 rounded-lg">
            <Bike className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-slate-100 font-mono block">{totalVehicles}</span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {activeVehicles} actifs aujourd'hui
          </span>
        </div>
      </div>

      {/* Active Alerts Count */}
      <div className={`border p-4 rounded-2xl flex flex-col justify-between transition-all shadow-sm ${
        unreadAlerts > 0 ? 'bg-red-950/20 border-red-900/60 hover:border-red-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium font-sans">Alertes Critiques</span>
          <div className={`p-1.5 rounded-lg ${unreadAlerts > 0 ? 'bg-red-900/30 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-slate-100 font-mono block">{unreadAlerts}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {unreadAlerts > 0 ? 'Action immédiate requise' : 'Aucun incident grave'}
          </span>
        </div>
      </div>

      {/* Speeding specific or average speed indicator */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-teal-500/50 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Puissance Moy. Consommé</span>
          <div className="p-1.5 bg-amber-900/30 text-amber-500 rounded-lg">
            <BatteryCharging className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-slate-100 font-mono block">{averagePowerWh} Wh</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Énergie consommée moyenne
          </span>
        </div>
      </div>

      {/* Maintenance Needed Tracker */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Maintenances</span>
          <div className="p-1.5 bg-rose-900/30 text-rose-400 rounded-lg">
            <Wrench className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-slate-100 font-mono block">{maintenancePending}</span>
          <span className="text-[10px] text-rose-400 font-semibold block mt-0.5">
            {activeMaintenanceCost.toLocaleString()} € budget engagé
          </span>
        </div>
      </div>

      {/* Real-time sync tracker */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl col-span-2 flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Télémétrie & Flux GPS</span>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-full font-mono text-[9px] font-bold uppercase animate-pulse">
            ● SIMULATEUR LIVE
          </span>
        </div>
        <div className="mt-2.5">
          <p className="text-xs text-slate-400 leading-snug">
            Flux de coordonnées <span className="font-semibold text-slate-200">GPS fictif</span> cadencé à 4Hz. Prêt pour l'intégration de boîtiers OBD-II ou d'API Over-The-Air (Samsara/Webfleet).
          </p>
        </div>
      </div>
    </div>
  );
}
