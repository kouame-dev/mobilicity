import { useState } from 'react';
import { BookingRequest, Vehicle } from '../types';
import { Calendar, UserCheck, Check, X, ShieldAlert, AlertCircle, HelpCircle, Briefcase, Bike } from 'lucide-react';

interface ReservationsTabProps {
  bookings: BookingRequest[];
  vehicles: Vehicle[];
  onApproveBooking: (id: string, vehicleId: string) => void;
  onRejectBooking: (id: string) => void;
}

export default function ReservationsTab({
  bookings,
  vehicles,
  onApproveBooking,
  onRejectBooking
}: ReservationsTabProps) {
  // Store matching vehicle selection for each booking id
  const [selectedMatch, setSelectedMatch] = useState<Record<string, string>>({});

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const processedBookings = bookings.filter(b => b.status !== 'pending');

  const availableVehicles = vehicles.filter(v => v.status === 'idle');

  return (
    <div id="booking-reservations-panel" className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Commandes de Véhicules & Réservations Client Actives
        </h2>
        <p className="text-xs text-slate-400">
          Validez les demandes des collaborateurs pour des déplacements d'affaires et assignez-leur un véhicule disponible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Pending Orders */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Demandes en Attente ({pendingBookings.length})</h3>

          {pendingBookings.length > 0 ? (
            <div className="space-y-3">
              {pendingBookings.map((req) => {
                const preselectedVehicleId = selectedMatch[req.id] || "";
                
                // Keep only vehicles that correspond to the requested type (Berline, SUV, etc)
                const suitableVehicles = availableVehicles.filter(v => v.type === req.vehicleType);

                return (
                  <div
                    key={req.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-indigo-500/30 transition-all shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] bg-indigo-950 px-2 py-0.5 rounded-md font-mono text-indigo-300 font-bold border border-indigo-900/40 mr-2">
                          {req.id}
                        </span>
                        <span className="text-slate-100 text-xs font-bold leading-normal">{req.driverName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Requis :</span>
                        <span className="px-2 py-0.5 text-[10px] bg-slate-950 text-indigo-400 border border-slate-800 rounded font-semibold font-mono">
                          {req.vehicleType}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 p-3 bg-slate-950 border border-slate-800/60 rounded-xl space-y-1">
                      <p className="flex items-center gap-2 text-slate-200">
                        <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Motif : {req.purpose}</span>
                      </p>
                      <p className="flex items-center gap-2 text-slate-400 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Dates d'emprunt : Du <strong className="text-slate-200">{req.startDate}</strong> au <strong className="text-slate-200">{req.endDate}</strong></span>
                      </p>
                    </div>

                    {/* Vehicle Assignment Area */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] text-slate-400 font-medium">Assigner un véhicule libre :</label>
                        {suitableVehicles.length > 0 ? (
                          <select
                            value={preselectedVehicleId}
                            onChange={(e) => setSelectedMatch({ ...selectedMatch, [req.id]: e.target.value })}
                            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:border-indigo-500 outline-none w-full"
                          >
                            <option value="">-- Sélectionner un véhicule --</option>
                            {suitableVehicles.map(v => (
                              <option key={v.id} value={v.id}>
                                {v.name} ({v.licensePlate}) - {Math.round((v.powerAvailableWh / v.batteryCapacityWh) * 100)}% bat ({v.powerAvailableWh} Wh)
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-[11px] text-rose-400 font-medium">
                            ⚠️ Aucun(e) {req.vehicleType} disponible. Mettre à l'arrêt ou attendre un retour de trajet.
                          </div>
                        )}
                      </div>

                      <div className="flex items-end gap-2 shrink-0 h-full self-end sm:self-auto">
                        <button
                          onClick={() => onRejectBooking(req.id)}
                          className="p-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-400 hover:text-rose-300 rounded-xl transition-all"
                          title="Refuser la commande"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (!preselectedVehicleId) {
                              alert("Veuillez sélectionner un véhicule pour valider.");
                              return;
                            }
                            onApproveBooking(req.id, preselectedVehicleId);
                          }}
                          disabled={!preselectedVehicleId}
                          className={`px-3 py-1.5 gap-1.5 text-xs font-semibold rounded-xl transition-all flex items-center shadow-md ${
                            preselectedVehicleId
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          Approuver
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 px-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs text-slate-400 font-sans">Toutes les réservations utilisateurs ont été traitées !</p>
            </div>
          )}
        </div>

        {/* Right Col: Processed Log */}
        <div id="processed-booking-log" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Historique des Validations</h3>

          {processedBookings.length > 0 ? (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {processedBookings.map((req) => {
                const isApproved = req.status === 'approved';
                return (
                  <div
                    key={req.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{req.driverName}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        isApproved ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {isApproved ? 'Accepté' : 'Refusé'}
                      </span>
                    </div>

                    <p className="text-slate-400 text-[11px] leading-tight">
                      Intention : {req.purpose} ({req.startDate})
                    </p>

                    {isApproved && req.vehicleId && (
                      <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold bg-emerald-950/40 p-1 rounded border border-emerald-900/35">
                        <Bike className="w-3 h-3 text-emerald-400" />
                        <span>Véhicule assigné : {req.vehicleId}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic text-center py-6">Aucun log de traitement encore disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
}
