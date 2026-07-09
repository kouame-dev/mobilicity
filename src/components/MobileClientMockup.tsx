import React, { useState, useEffect } from 'react';
import { Vehicle, BookingRequest, Livreur, ClientCourse } from '../types';
import { Smartphone, Lock, Unlock, Phone, Navigation, Wifi, ShieldAlert, Sparkles, Send, BatteryCharging, QrCode, RefreshCw, ShieldCheck, User, Eye, EyeOff, LogOut, CheckCircle, MapPin, Bike, Car, ShoppingBag, CreditCard, DollarSign } from 'lucide-react';

interface MobileClientMockupProps {
  vehicles: Vehicle[];
  livreurs: Livreur[];
  onToggleLock: (id: string) => void;
  onSpeedChange: (id: string, newSpeed: number) => void;
  onAddBookingRequest: (booking: Omit<BookingRequest, 'id'>) => void;
  clientCourses: ClientCourse[];
  setClientCourses: React.Dispatch<React.SetStateAction<ClientCourse[]>>;
}

export default function MobileClientMockup({
  vehicles,
  livreurs,
  onToggleLock,
  onSpeedChange,
  onAddBookingRequest,
  clientCourses,
  setClientCourses
}: MobileClientMockupProps) {
  // Mobile active mode: 'driver' or 'client'
  const [mobileMode, setMobileMode] = useState<'driver' | 'client'>('client');
  const [clientSubTab, setClientSubTab] = useState<'order' | 'list'>('order');
  const [driverSubTab, setDriverSubTab] = useState<'control' | 'deliveries'>('control');

  // --- CLIENT ORDERING FORM STATE ---
  const [clientName, setClientName] = useState('');
  const [clientTypeEngin, setClientTypeEngin] = useState<'Vélo' | 'Moto' | 'Tricycle'>('Moto');
  const [clientZone, setClientZone] = useState('Cocody');
  const [clientTarif, setClientTarif] = useState(1500);
  const [clientDateHeure, setClientDateHeure] = useState('2026-07-09T16:15');
  const [clientPaymentMethod, setClientPaymentMethod] = useState<'Cash' | 'MTN Money' | 'Orange Money' | 'Moov Money' | 'Wave'>('Wave');
  const [clientOrderSuccess, setClientOrderSuccess] = useState<string | null>(null);

  // Auto-set reasonable pricing tariff when engin/zone changes
  useEffect(() => {
    let base = 1000;
    if (clientTypeEngin === 'Moto') base = 2500;
    if (clientTypeEngin === 'Tricycle') base = 4000;

    let multiplier = 1;
    if (clientZone === 'Yopougon' || clientZone === 'Adjamé') multiplier = 1.2;
    if (clientZone === 'Plateau' || clientZone === 'Riviera') multiplier = 1.5;

    setClientTarif(Math.round(base * multiplier));
  }, [clientTypeEngin, clientZone]);

  // Handle mobile client course order submit
  const handleClientCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert("Veuillez saisir votre nom.");
      return;
    }

    const newCourse: ClientCourse = {
      id: `CMD-${Math.floor(200 + Math.random() * 800)}`,
      tarifs: Number(clientTarif),
      clientName: clientName.trim(),
      typeEngin: clientTypeEngin,
      zoneParcours: clientZone,
      dateHeure: clientDateHeure,
      modePaiement: clientPaymentMethod,
      status: 'pending',
      source: 'mobile'
    };

    setClientCourses(prev => [newCourse, ...prev]);
    setClientOrderSuccess(`🎉 Commande ${newCourse.id} enregistrée ! Solde de ${newCourse.tarifs} FCFA initié via ${clientPaymentMethod}.`);
    
    // Reset Form
    setClientName('');
    setTimeout(() => {
      setClientOrderSuccess(null);
    }, 5000);
  };

  // --- DRIVER SIMULATOR STATES ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState('yalami');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggedInDriver, setLoggedInDriver] = useState<Livreur | null>(null);

  // Active vehicle selection state
  const [selectedMobileVehicleId, setSelectedMobileVehicleId] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [otpToken, setOtpToken] = useState('FT-9842-SEC');
  const [timeLeft, setTimeLeft] = useState(15);

  // Form states for booking inside mobile application (Driver Mode)
  const [driverName, setDriverName] = useState('');
  const [vehicleType, setVehicleType] = useState('Vélo');
  const [purpose, setPurpose] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [showBookingResultMsg, setShowBookingResultMsg] = useState(false);

  // Dynamic QR OTP simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const rand = Math.floor(1000 + Math.random() * 9000);
          setOtpToken(`FT-${rand}-SEC`);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync assigned vehicle when user logs in
  useEffect(() => {
    if (loggedInDriver) {
      setDriverName(loggedInDriver.name);
      if (loggedInDriver.assignedVehicleId) {
        setSelectedMobileVehicleId(loggedInDriver.assignedVehicleId);
      } else {
        const firstId = vehicles[0]?.id || '';
        setSelectedMobileVehicleId(firstId);
      }
    }
  }, [loggedInDriver, vehicles]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const matched = livreurs.find(l => 
      (l.email.toLowerCase() === loginInput.trim().toLowerCase() || 
       (l.login && l.login.toLowerCase() === loginInput.trim().toLowerCase())) &&
      (l.password || 'password123') === passwordInput
    );

    if (matched) {
      if (matched.status === 'inactive') {
        setLoginError('Ce compte conducteur est désactivé par l\'administrateur.');
        return;
      }
      setLoggedInDriver(matched);
      setIsAuthenticated(true);
    } else {
      setLoginError('Identifiants conducteur invalides.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInDriver(null);
    setPurpose('');
  };

  const matchedVehicle = vehicles.find(v => v.id === selectedMobileVehicleId) || vehicles[0];

  const handleToggleMobileLock = () => {
    if (!matchedVehicle) return;
    onToggleLock(matchedVehicle.id);
  };

  const handleSpeedSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!matchedVehicle) return;
    onSpeedChange(matchedVehicle.id, Number(e.target.value));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    onAddBookingRequest({
      driverName: driverName || loggedInDriver?.name || 'Conducteur Simulé',
      vehicleType,
      startDate,
      endDate,
      purpose,
      status: 'pending'
    });

    setPurpose('');
    setShowBookingResultMsg(true);
    setTimeout(() => {
      setShowBookingResultMsg(false);
    }, 4000);
  };

  const isSpeeding = matchedVehicle ? (matchedVehicle.currentSpeed > matchedVehicle.maxAllowedSpeed) : false;
  const driverCourses = clientCourses.filter(c => c.typeEngin === (loggedInDriver?.vehicleType || 'Moto'));

  return (
    <div id="driver-app-simulation-frame" className="bg-slate-950 border-4 border-slate-800 rounded-[40px] p-4 shadow-2xl relative max-w-sm mx-auto space-y-3 font-sans min-h-[640px] flex flex-col justify-between overflow-hidden">
      
      {/* Smartphone notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl flex items-center justify-center gap-1.5 z-20">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
        <div className="w-10 h-1 bg-slate-900 rounded"></div>
      </div>

      <div>
        {/* Mobile status bar */}
        <div className="flex items-center justify-between border-b border-slate-850 pb-2 pt-2.5 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1">
            <span>16:15</span>
            <Phone className="w-2.5 h-2.5 text-slate-500" />
          </div>
          <div className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
            <Smartphone className="w-3 h-3 text-indigo-400" /> CI Mobile Portal
          </div>
          <div className="flex items-center gap-1 text-[9px]">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>Orange-CI</span>
          </div>
        </div>

        {/* Dual Mode Selector (Client vs Driver) */}
        <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl mt-3">
          <button
            type="button"
            onClick={() => setMobileMode('client')}
            className={`py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1 ${
              mobileMode === 'client'
                ? 'bg-emerald-600 text-white font-extrabold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Commander (Client)
          </button>
          <button
            type="button"
            onClick={() => setMobileMode('driver')}
            className={`py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1 ${
              mobileMode === 'driver'
                ? 'bg-indigo-600 text-white font-extrabold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Livreur / Clés GPS
          </button>
        </div>
      </div>

      {/* Dynamic Screen Area */}
      <div className="flex-1 overflow-y-auto max-h-[480px] scrollbar-none py-1">
        
        {/* --- MODE CLIENT: ORDER A RIDE (COMMANDE DE COURSE) --- */}
        {mobileMode === 'client' && (
          <div className="space-y-3 animate-fade-in text-xs">
            
            {/* Client Sub-Navigation */}
            <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-850">
              <button
                type="button"
                onClick={() => setClientSubTab('order')}
                className={`py-1 rounded-lg text-[9.5px] font-bold tracking-wider transition-all uppercase flex items-center justify-center gap-1 ${
                  clientSubTab === 'order'
                    ? 'bg-emerald-600 text-white font-extrabold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📝 Commander
              </button>
              <button
                type="button"
                onClick={() => setClientSubTab('list')}
                className={`py-1 rounded-lg text-[9.5px] font-bold tracking-wider transition-all uppercase flex items-center justify-center gap-1 ${
                  clientSubTab === 'list'
                    ? 'bg-emerald-600 text-white font-extrabold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📦 Mes Commandes ({clientCourses.length})
              </button>
            </div>

            {clientSubTab === 'order' && (
              <div className="space-y-3 animate-fade-in">
                <div className="text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-900/40 inline-block font-mono">
                    🇨🇮 Taxi Vert Abidjan
                  </span>
                  <h3 className="text-xs font-bold text-white mt-1">Saisie Commande Course</h3>
                  <p className="text-[9.5px] text-slate-400">Commandez un transporteur écologique (Vélo, Moto, Tricycle) instantanément.</p>
                </div>

                {clientOrderSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 rounded-xl text-[10px] font-medium leading-normal animate-pulse">
                    {clientOrderSuccess}
                  </div>
                )}

                <form onSubmit={handleClientCourseSubmit} className="space-y-3 bg-slate-900 p-3 rounded-2xl border border-slate-800/60">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Votre Nom Complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Koffi Yao"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Type d'engin</label>
                      <select
                        value={clientTypeEngin}
                        onChange={(e) => setClientTypeEngin(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 outline-none focus:border-emerald-500 font-medium"
                      >
                        <option value="Vélo">🚲 Vélo Élec</option>
                        <option value="Moto">🏍️ Moto Élec</option>
                        <option value="Tricycle">🛺 Tricycle</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Zone parcours</label>
                      <select
                        value={clientZone}
                        onChange={(e) => setClientZone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 outline-none focus:border-emerald-500 font-medium"
                      >
                        <option value="Cocody">Cocody</option>
                        <option value="Marcory">Marcory</option>
                        <option value="Yopougon">Yopougon</option>
                        <option value="Plateau">Plateau</option>
                        <option value="Riviera">Riviera</option>
                        <option value="Adjamé">Adjamé</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Date & Heure</label>
                      <input
                        type="datetime-local"
                        required
                        value={clientDateHeure}
                        onChange={(e) => setClientDateHeure(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1 text-[10px] text-slate-300 font-mono focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Tarif Estimé (CFA)</label>
                      <input
                        type="number"
                        required
                        value={clientTarif}
                        onChange={(e) => setClientTarif(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-[10px] text-white font-mono font-bold focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Mode de Règlement Mobile</label>
                    <select
                      value={clientPaymentMethod}
                      onChange={(e) => setClientPaymentMethod(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 outline-none focus:border-emerald-500 font-semibold text-[11px]"
                    >
                      <option value="Wave">🌊 Wave Côte d'Ivoire</option>
                      <option value="Orange Money">🍊 Orange Money</option>
                      <option value="MTN Money">🟡 MTN Mobile Money</option>
                      <option value="Moov Money">🟢 Moov Flooz</option>
                      <option value="Cash">💵 Espèces (Remis au pilote)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow tracking-wider transition-all uppercase mt-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Enregistrer la commande
                  </button>
                </form>

                <div className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-[9.5px] text-slate-400 leading-normal flex items-start gap-1.5">
                  <span>💡</span>
                  <span>Les paiements initiés via Orange, MTN, Wave ou Moov interrogent directement les passerelles d'API Ivoiriennes.</span>
                </div>
              </div>
            )}

            {clientSubTab === 'list' && (
              <div className="space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <h4 className="text-[11px] font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> Historique Commandes
                  </h4>
                  <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded text-emerald-400 font-mono font-bold">
                    {clientCourses.length} total
                  </span>
                </div>

                {clientCourses.length === 0 ? (
                  <div className="text-center py-8 bg-slate-900 border border-slate-850 rounded-2xl space-y-2 text-slate-500">
                    <ShoppingBag className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
                    <p className="text-[10px]">Aucune commande enregistrée pour le moment.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                    {clientCourses.map(course => {
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'completed': return 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/20';
                          case 'cancelled': return 'bg-rose-950/80 text-rose-400 border border-rose-500/20';
                          default: return 'bg-amber-950/80 text-amber-400 border border-amber-500/20';
                        }
                      };
                      const getEngineIcon = (engine: string) => {
                        switch (engine) {
                          case 'Vélo': return '🚲';
                          case 'Tricycle': return '🛺';
                          default: return '🏍️';
                        }
                      };

                      return (
                        <div key={course.id} className="bg-slate-900 border border-slate-850 rounded-xl p-3 space-y-2.5 hover:border-slate-800 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                              {course.id}
                            </span>
                            <span className={`text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.25 rounded-full border ${getStatusColor(course.status)}`}>
                              {course.status === 'pending' ? 'En attente ⏳' : course.status === 'completed' ? 'Livré ✅' : 'Annulé 🔴'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                            <div className="space-y-0.5">
                              <span className="text-[8px] text-slate-500 uppercase block font-bold">Parcours / Client</span>
                              <span className="text-slate-200 font-bold block truncate">{course.clientName}</span>
                            </div>
                            <div className="space-y-0.5 text-right">
                              <span className="text-[8px] text-slate-500 uppercase block font-bold">Tarif Mobile</span>
                              <span className="text-emerald-400 font-mono font-bold block">{course.tarifs.toLocaleString()} FCFA</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[9.5px] pt-2 border-t border-slate-950">
                            <div>
                              <span className="text-slate-300 font-semibold block">{getEngineIcon(course.typeEngin)} {course.typeEngin}</span>
                              <span className="text-slate-500 text-[9px] block">📍 Zone: {course.zoneParcours}</span>
                            </div>
                            <div className="text-right flex flex-col justify-end items-end">
                              <span className="text-slate-400 text-[9px] font-mono block">
                                {course.dateHeure ? new Date(course.dateHeure).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'Instantané'}
                              </span>
                              <span className="text-slate-500 text-[8.5px] font-mono">💳 {course.modePaiement}</span>
                            </div>
                          </div>

                          {course.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => {
                                setClientCourses(prev => prev.map(c => c.id === course.id ? { ...c, status: 'cancelled' } : c));
                              }}
                              className="w-full py-1 bg-red-950/40 hover:bg-red-950/80 text-red-400 border border-red-900/30 rounded-lg text-[9px] font-bold transition-all uppercase"
                            >
                              Annuler ma commande
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* --- MODE DRIVER: VEHICLE SIMULATION KEYS & OTP (Original) --- */}
        {mobileMode === 'driver' && (
          <div className="animate-fade-in text-xs">
            {!isAuthenticated ? (
              /* LOGIN INTERFACE FOR DRIVER */
              <div className="space-y-4 py-2 text-xs">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 shadow shadow-indigo-500/10">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Espace Conducteur</h3>
                  <p className="text-[10px] text-slate-400">Authentifiez-vous pour contrôler l'engin assigné.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Identifiant conducteur</label>
                    <input
                      type="text"
                      required
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-[11px] text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1 relative">
                    <label className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-[11px] text-slate-200 rounded-lg pl-2.5 pr-8 py-1.5 outline-none focus:border-indigo-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-2 border border-red-900/60 bg-red-950/40 text-red-400 rounded-lg text-[9.5px]">
                      ⚠️ {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider"
                  >
                    Connexion Portative
                  </button>
                </form>

                {/* Quick Help Credentials */}
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-850 text-[9.5px] text-slate-400 space-y-1">
                  <span className="font-bold text-indigo-400 block font-mono">Conducteurs d'exemples :</span>
                  <div className="flex justify-between">
                    <span>Yassin (Moto):</span>
                    <span className="font-mono text-slate-300 font-bold">yalami / password123</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chloé (Vélo):</span>
                    <span className="font-mono text-slate-300 font-bold">chloe / password123</span>
                  </div>
                </div>
              </div>
            ) : (
              /* LOGGED IN INTERFACE FOR DRIVER */
              <div className="space-y-3 text-xs">
                
                {/* Driver identity banner */}
                <div className="bg-indigo-950/45 border border-indigo-900/40 px-3 py-1.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6.5 h-6.5 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-xs text-white uppercase">
                      {loggedInDriver?.name.slice(0, 2)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white block leading-none">{loggedInDriver?.name}</span>
                      <span className="text-[8.5px] font-mono text-slate-400">{loggedInDriver?.vehicleType} • {loggedInDriver?.id}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="p-1 rounded hover:bg-red-950/60 text-slate-400 hover:text-red-400"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Driver Sub-Tabs Navigation */}
                <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-850">
                  <button
                    type="button"
                    onClick={() => setDriverSubTab('control')}
                    className={`py-1 rounded-lg text-[9.5px] font-bold tracking-wider transition-all uppercase flex items-center justify-center gap-1 ${
                      driverSubTab === 'control'
                        ? 'bg-indigo-600 text-white font-extrabold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🔑 Clés & GPS
                  </button>
                  <button
                    type="button"
                    onClick={() => setDriverSubTab('deliveries')}
                    className={`py-1 rounded-lg text-[9.5px] font-bold tracking-wider transition-all uppercase flex items-center justify-center gap-1 ${
                      driverSubTab === 'deliveries'
                        ? 'bg-indigo-600 text-white font-extrabold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    📦 Mes Livraisons ({driverCourses.length})
                  </button>
                </div>

                {/* DRIVER CONTROL SUB-TAB */}
                {driverSubTab === 'control' && (
                  <div className="space-y-3 animate-fade-in">
                    {/* Select active vehicle */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Engin connecté</label>
                      <select
                        value={selectedMobileVehicleId}
                        onChange={(e) => setSelectedMobileVehicleId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-[11px] text-slate-200 rounded-lg px-2 py-1.5 focus:border-indigo-500 outline-none"
                      >
                        <option value="">-- Choisir un engin --</option>
                        {vehicles.map(v => (
                          <option key={v.id} value={v.id}>
                            🔑 {v.id} - {v.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {matchedVehicle ? (
                      <div className="space-y-3">
                        {/* Live Vehicle Lock / Unlock Panel */}
                        <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl text-center space-y-2 shadow-inner">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-400 block uppercase font-bold">Verrouillage</span>
                            <span className="text-[8.5px] text-indigo-400 flex items-center gap-0.5 font-mono">
                              <ShieldCheck className="w-3 h-3" /> Securisé
                            </span>
                          </div>
                          
                          {/* Giant Lock Circle Button */}
                          <div className="flex items-center justify-center gap-3 py-1">
                            <button
                              type="button"
                              onClick={handleToggleMobileLock}
                              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all transform active:scale-95 ${
                                matchedVehicle.isLocked
                                  ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-400 shadow-emerald-900/30'
                                  : 'bg-amber-950/80 border-amber-500/80 text-amber-500 shadow-amber-900/30'
                              }`}
                            >
                              {matchedVehicle.isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => setShowQrCode(!showQrCode)}
                              className={`p-2 rounded-lg border ${
                                showQrCode ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'
                              }`}
                            >
                              <QrCode className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="space-y-0.5">
                            <span className={`text-[11px] font-bold block ${matchedVehicle.isLocked ? 'text-emerald-400' : 'text-amber-500'}`}>
                              {matchedVehicle.isLocked ? 'Verrouillé' : 'Déverrouillé'}
                            </span>
                          </div>

                          {/* Secure Dynamic QR Code UI section */}
                          {showQrCode && (
                            <div className="mt-2 p-2 bg-white text-slate-950 rounded-lg space-y-1 inline-block mx-auto border border-indigo-500">
                              <span className="text-[7.5px] font-bold text-slate-500 block uppercase tracking-wider font-mono">OTP ACCESS</span>
                              
                              <svg className="w-16 h-16 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                                <rect x="0" y="0" width="30" height="30" fill="black" />
                                <rect x="5" y="5" width="20" height="20" fill="white" />
                                <rect x="10" y="10" width="10" height="10" fill="black" />
                                <rect x="70" y="0" width="30" height="30" fill="black" />
                                <rect x="75" y="5" width="20" height="20" fill="white" />
                                <rect x="0" y="70" width="30" height="30" fill="black" />
                                <rect x="40" y="40" width="20" height="20" fill="indigo" />
                                {timeLeft % 2 === 0 ? <rect x="35" y="15" width="10" height="10" fill="black" /> : <rect x="15" y="35" width="10" height="10" fill="black" />}
                              </svg>

                              <div className="space-y-0.5">
                                <span className="text-[8px] font-mono font-bold bg-slate-100 px-1 py-0.25 text-indigo-700 rounded block">
                                  {otpToken}
                                </span>
                                <span className="text-[7px] text-slate-500 block">
                                  {timeLeft}s restante
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Simulated Live Drive controls */}
                        <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-400 block uppercase font-bold font-mono">Télémétrie Vitesse</span>
                            {isSpeeding && (
                              <span className="px-1 bg-red-950/95 text-red-500 rounded text-[8px] font-bold animate-pulse">EXCÈS</span>
                            )}
                          </div>

                          <div className="text-center py-1">
                            <span className={`text-2xl font-bold font-mono block ${isSpeeding ? 'text-red-400' : 'text-indigo-400'}`}>
                              {matchedVehicle.currentSpeed}
                              <span className="text-xs font-normal text-slate-500 font-sans ml-0.5">km/h</span>
                            </span>
                            <span className="text-[8.5px] text-slate-500">Limiteur : {matchedVehicle.maxAllowedSpeed} km/h</span>
                          </div>

                          <div className="space-y-0.5">
                            <input
                              type="range"
                              min="0"
                              max="140"
                              step="5"
                              value={matchedVehicle.currentSpeed}
                              onChange={handleSpeedSlider}
                              className="w-full accent-indigo-500 outline-none cursor-ew-resize bg-slate-800 h-1 rounded"
                            />
                          </div>
                        </div>

                        {/* Battery telemetry info */}
                        <div className="bg-slate-950 border border-slate-800/80 p-2 rounded-lg flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1">
                            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-slate-400">Batterie restante</span>
                          </div>
                          <div className="flex items-center gap-1 font-mono font-bold text-slate-100">
                            <span>{matchedVehicle ? Math.round((matchedVehicle.powerAvailableWh / matchedVehicle.batteryCapacityWh) * 100) : 0}%</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic text-center py-2">Aucun véhicule actif assigné.</p>
                    )}

                    {/* Quick booking driver request form */}
                    <div className="border-t border-slate-850 pt-2 space-y-1.5">
                      <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">Réserver un autre engin</span>
                      
                      <form onSubmit={handleBookingSubmit} className="space-y-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] text-slate-500">Conducteur</span>
                            <div className="bg-slate-900 text-[10px] text-slate-300 rounded p-1 font-semibold overflow-hidden">
                              {loggedInDriver?.name}
                            </div>
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] text-slate-500">Type</span>
                            <select
                              value={vehicleType}
                              onChange={(e) => setVehicleType(e.target.value)}
                              className="bg-slate-900 text-[10px] text-slate-200 rounded p-1 outline-none font-medium w-full"
                            >
                              <option value="Vélo">Vélo élec</option>
                              <option value="Moto">Moto élec</option>
                              <option value="Tricycle">Tricycle</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <span className="text-[8px] text-slate-500">Motif de trajet</span>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Livrer Cocody"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="bg-slate-900 text-[10px] text-slate-200 rounded p-1.5 outline-none w-full"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[9px] font-bold"
                        >
                          Soumettre Demande
                        </button>
                      </form>

                      {showBookingResultMsg && (
                        <div className="p-1.5 border border-emerald-900/60 bg-emerald-950/60 text-emerald-400 rounded text-[9px] text-center animate-bounce">
                          Demande transmise au manager !
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* DRIVER DELIVERIES SUB-TAB */}
                {driverSubTab === 'deliveries' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                      <div>
                        <h4 className="text-xs font-bold text-indigo-400 font-mono uppercase tracking-wider">
                          📦 Courses de ma Catégorie
                        </h4>
                        <p className="text-[9.5px] text-slate-500">Missions disponibles en {loggedInDriver?.vehicleType}</p>
                      </div>
                      <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded text-indigo-400 font-mono font-bold">
                        {driverCourses.length}
                      </span>
                    </div>

                    {driverCourses.length === 0 ? (
                      <div className="text-center py-8 bg-slate-900 border border-slate-850 rounded-2xl space-y-2 text-slate-500">
                        <ShoppingBag className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
                        <p className="text-[10px]">Aucune livraison de catégorie {loggedInDriver?.vehicleType || 'Moto'}.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                        {driverCourses.map(course => {
                          const isPending = course.status === 'pending';
                          const isCompleted = course.status === 'completed';
                          const isCancelled = course.status === 'cancelled';
                          
                          return (
                            <div key={course.id} className="bg-slate-900 border border-slate-850 rounded-xl p-3 space-y-2 hover:border-slate-800 transition-all">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] font-bold text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850">
                                  {course.id}
                                </span>
                                <span className={`text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.25 rounded border ${
                                  isCompleted ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/20' :
                                  isCancelled ? 'bg-rose-950/80 text-rose-400 border-rose-500/20' :
                                  'bg-amber-950/80 text-amber-400 border-amber-500/20'
                                }`}>
                                  {isPending ? 'Disponible ⚡' : isCompleted ? 'Livré ✅' : 'Annulé 🔴'}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                                <div>
                                  <span className="text-[8px] text-slate-500 block uppercase">Client</span>
                                  <span className="text-slate-200 font-bold block truncate">{course.clientName}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[8px] text-slate-500 block uppercase font-bold">Gain de course</span>
                                  <span className="text-emerald-400 font-mono font-bold block">+{course.tarifs.toLocaleString()} FCFA</span>
                                </div>
                              </div>

                              <div className="text-[9.5px] text-slate-400 space-y-0.5 pt-1.5 border-t border-slate-950">
                                <div className="flex items-center justify-between">
                                  <span>📍 Destination : <strong>{course.zoneParcours}</strong></span>
                                  <span className="text-slate-500 font-mono text-[8.5px]">{course.modePaiement}</span>
                                </div>
                                <div className="text-[8.5px] text-slate-500 font-mono">
                                  ⏱️ {course.dateHeure ? new Date(course.dateHeure).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'Immédiat'}
                                </div>
                              </div>

                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setClientCourses(prev => prev.map(c => c.id === course.id ? { ...c, status: 'completed' } : c));
                                  }}
                                  className="w-full mt-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[9.5px] font-bold transition-colors uppercase tracking-wider flex items-center justify-center gap-1 shadow"
                                >
                                  <CheckCircle className="w-3 h-3" /> Accepter & Livrer
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        )}

      </div>

      {/* Mobile home line bar */}
      <div className="w-20 h-1 bg-slate-800 rounded-full mx-auto shrink-0 mt-1"></div>
    </div>
  );
}
