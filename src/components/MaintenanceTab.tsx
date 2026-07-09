import React, { useState } from 'react';
import { MaintenanceRecord, Vehicle } from '../types';
import { Wrench, Plus, CircleDot, AlertCircle, History, Clock, CheckCircle2, User, Euro } from 'lucide-react';

interface MaintenanceTabProps {
  maintenance: MaintenanceRecord[];
  vehicles: Vehicle[];
  onAddMaintenance: (record: Omit<MaintenanceRecord, 'id'>) => void;
  onUpdateStatus: (id: string, status: MaintenanceRecord['status']) => void;
}

export default function MaintenanceTab({
  maintenance,
  vehicles,
  onAddMaintenance,
  onUpdateStatus
}: MaintenanceTabProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [issue, setIssue] = useState('');
  const [type, setType] = useState<'Préventif' | 'Correctif'>('Préventif');
  const [dateScheduled, setDateScheduled] = useState(new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState('');
  const [technician, setTechnician] = useState('');

  const filteredRecords = maintenance.filter(record => {
    if (filter === 'all') return true;
    return record.status === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !issue.trim() || !technician.trim()) return;

    const matchedVehicle = vehicles.find(v => v.id === vehicleId);
    if (!matchedVehicle) return;

    onAddMaintenance({
      vehicleId,
      vehicleName: matchedVehicle.name,
      issue,
      type,
      status: 'pending',
      dateScheduled,
      cost: Number(cost) || 0,
      technician
    });

    // Reset Form
    setIssue('');
    setCost('');
    setTechnician('');
    setShowForm(false);
  };

  return (
    <div id="maintenance-panel" className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-400" />
            Gestion des Maintenances & Réparations Flotte
          </h2>
          <p className="text-xs text-slate-400">
            Planifiez, inspectez et validez en temps réel les cycles de maintenance de vos véhicules connectés.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          Planifier un Entretien
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-semibold text-slate-200">Nouvel Ordre de Maintenance (Fictivement stocké)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vehicle Selection */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-medium">Véhicule concerné</label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:border-indigo-500 outline-none"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.licensePlate})
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-medium">Type d'entretien</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:border-indigo-500 outline-none"
              >
                <option value="Préventif">Préventif (Vidange, filtres, contrôle)</option>
                <option value="Correctif">Correctif (Panne, embrayage, freins)</option>
              </select>
            </div>

            {/* Price cost estimation */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-medium">Coût estimé (€)</label>
              <input
                type="number"
                placeholder="250"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Action / issue description */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[11px] text-slate-400 font-medium font-sans">Nature du problème ou de l'intervention</label>
              <input
                type="text"
                required
                placeholder="Ex. Remplacement du liquide de frein et vérification des disques"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 font-medium">Date planifiée</label>
              <input
                type="date"
                required
                value={dateScheduled}
                onChange={(e) => setDateScheduled(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col gap-1 w-72">
              <label className="text-[11px] text-slate-400 font-medium">Technicien / Garage prestataire</label>
              <input
                type="text"
                required
                placeholder="Ex. Norauto Mérignac ou Garage Maréchal"
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Soumettre l'ordre
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Toggles */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {(['all', 'pending', 'in_progress', 'completed'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === type
                ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-200'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-transparent'
            }`}
          >
            {type === 'all' && 'Tous'}
            {type === 'pending' && 'En Attente'}
            {type === 'in_progress' && 'En Cours'}
            {type === 'completed' && 'Terminés'}
          </button>
        ))}
      </div>

      {/* Maintenance Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => {
            return (
              <div
                key={record.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-md font-mono text-indigo-300 border border-slate-800">
                      {record.id}
                    </span>
                    
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                      record.status === 'completed' ? 'bg-emerald-900/40 text-emerald-300' :
                      record.status === 'in_progress' ? 'bg-indigo-900/40 text-indigo-300' :
                      'bg-amber-900/40 text-amber-300'
                    }`}>
                      {record.status === 'completed' ? 'Terminé' :
                       record.status === 'in_progress' ? 'En Cours' : 'En Attente'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300">{record.vehicleName}</h4>
                    <p className="text-xs font-medium text-slate-100 mt-1 lines-clamp-2">{record.issue}</p>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Planifié : {record.dateScheduled}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {record.technician}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
                      <Euro className="w-3.5 h-3.5 text-emerald-500" />
                      {record.cost} €
                    </span>
                    <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold ${
                      record.type === 'Préventif' ? 'bg-blue-950 text-blue-300' : 'bg-rose-950 text-rose-300'
                    }`}>
                      {record.type}
                    </span>
                  </div>
                </div>

                {record.status !== 'completed' && (
                  <div className="mt-4 pt-2.5 border-t border-slate-800 flex gap-2 justify-end">
                    {record.status === 'pending' && (
                      <button
                        onClick={() => onUpdateStatus(record.id, 'in_progress')}
                        className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 rounded-lg text-[10px] font-semibold transition-all"
                      >
                        Démarrer l'intervention
                      </button>
                    )}
                    <button
                      onClick={() => onUpdateStatus(record.id, 'completed')}
                      className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Marquer comme terminé
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-2 py-10 px-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">Aucun ordre de maintenance ne correspond à ce filtre.</p>
          </div>
        )}
      </div>
    </div>
  );
}
