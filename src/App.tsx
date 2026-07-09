import React, { useState, useEffect } from 'react';
import { Vehicle, Trip, Alert, MaintenanceRecord, BookingRequest, Coordinates, Livreur, TeamLeader, SystemParams, ClientCourse, Expense } from './types';
import {
  initialVehicles,
  initialTripsHistory,
  initialAlerts,
  initialMaintenance,
  initialBookings,
  PATH_CITY_ROUTE,
  PATH_HIGHWAY,
  PATH_UTILITY_RUN
} from './data/mockData';

import FleetMap from './components/FleetMap';
import DashboardStats from './components/DashboardStats';
import MaintenanceTab from './components/MaintenanceTab';
import ReservationsTab from './components/ReservationsTab';
import AnalyticsTab from './components/AnalyticsTab';
import MobileClientMockup from './components/MobileClientMockup';
import ArchitectureTab from './components/ArchitectureTab';
import AdministrationTab from './components/AdministrationTab';
import ReportsTab from './components/ReportsTab';

import {
  Car,
  Bell,
  Wrench,
  Calendar,
  BarChart3,
  MapPin,
  Clock,
  User,
  ShieldAlert,
  HelpCircle,
  Menu,
  Activity,
  Plus,
  RefreshCw,
  Sparkles,
  Smartphone,
  Info,
  CheckCircle2,
  Trash,
  Cpu,
  Settings,
  ShieldCheck,
  Bike,
  LogOut,
  Shield
} from 'lucide-react';

export default function App() {
  // State management (acts as memory database mirroring database records)
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [tripsHistory, setTripsHistory] = useState<Trip[]>(initialTripsHistory);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(initialMaintenance);
  const [bookings, setBookings] = useState<BookingRequest[]>(initialBookings);

  // Shared state for delivery group configuration
  const [livreurs, setLivreurs] = useState<Livreur[]>([
    {
      id: 'LIV-301',
      name: 'Yassin Alami',
      phone: '+33 6 12 90 23 45',
      email: 'y.alami@fleettrack.com',
      status: 'active',
      vehicleType: 'Moto',
      assignedVehicleId: 'V-101',
      teamLeaderId: 'TL-201',
      joinDate: '2026-01-10',
      login: 'yalami',
      password: 'password123'
    },
    {
      id: 'LIV-302',
      name: 'Chloé Mercier',
      phone: '+33 7 34 56 12 89',
      email: 'c.mercier@fleettrack.com',
      status: 'active',
      vehicleType: 'Vélo',
      teamLeaderId: 'TL-201',
      joinDate: '2026-03-24',
      login: 'chloe',
      password: 'password123'
    },
    {
      id: 'LIV-303',
      name: 'Koffi Mensah',
      phone: '+33 6 89 23 41 55',
      email: 'k.mensah@fleettrack.com',
      status: 'active',
      vehicleType: 'Voiture',
      assignedVehicleId: 'V-103',
      teamLeaderId: 'TL-202',
      joinDate: '2026-02-15',
      login: 'koffi',
      password: 'password123'
    },
    {
      id: 'LIV-304',
      name: 'Mamadou Traoré',
      phone: '+33 6 01 78 89 54',
      email: 'm.traore@fleettrack.com',
      status: 'inactive',
      vehicleType: 'Moto',
      teamLeaderId: 'TL-202',
      joinDate: '2025-11-05',
      login: 'mamadou',
      password: 'password123'
    }
  ]);

  const [teamLeaders, setTeamLeaders] = useState<TeamLeader[]>([
    {
      id: 'TL-201',
      name: 'Alice Dubois',
      email: 'a.dubois@fleettrack.com',
      phone: '+33 6 52 14 78 96',
      status: 'active',
      department: 'Logistique Zone Nord',
      joinDate: '2024-05-12',
      login: 'alice',
      password: 'password123'
    },
    {
      id: 'TL-202',
      name: 'Benoît Legrand',
      email: 'b.legrand@fleettrack.com',
      phone: '+33 7 11 40 85 92',
      status: 'active',
      department: 'Livraisons Rapides Express',
      joinDate: '2025-01-20',
      login: 'benoit',
      password: 'password123'
    }
  ]);

  const [systemParams, setSystemParams] = useState<SystemParams>({
    appName: 'FLEETTRACK SYSTEMS',
    logoUrl: 'CarIcon',
    currency: 'EUR (€)',
    paymentMethods: [
      { id: 'pay_card', name: 'Carte Bancaire (Stripe/CB)', enabled: true, type: 'gateway' },
      { id: 'pay_momo', name: 'Mobile Money (Orange/MTN/Wave)', enabled: true, type: 'mobile_money' },
      { id: 'pay_cash', name: 'Paiement à la livraison (Espèces)', enabled: false, type: 'cash' }
    ],
    gpsApi: {
      providerId: 'TRACK-GPS-INT-001',
      appKey: 'gp_sk_live_903hnd8a9f3k4m2b8a7f',
      providerUrl: 'https://api.gpsprovider.net/v2/telemetry'
    },
    googleMaps: {
      apiKey: 'AIzaSyAs-GMapSec_8091h_Live92xKey',
      defaultCenterLat: 48.8566,
      defaultCenterLng: 2.3522,
      geocodingProvider: 'google'
    }
  });

  // Main Fleet portal auth
  const [isFleetLoggedIn, setIsFleetLoggedIn] = useState<boolean>(false);
  const [fleetUsername, setFleetUsername] = useState<string>('admin');
  const [fleetPassword, setFleetPassword] = useState<string>('password123');
  const [fleetLoginError, setFleetLoginError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<'admin' | 'lead' | 'cashier'>('admin');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('TL-201');

  // Ivory Coast mobile money networks API configurations
  const [mobileMoneyApis, setMobileMoneyApis] = useState({
    mtn: { apiKey: 'mtn_sk_live_902h3nd8y4m2', merchantId: 'MTN-CI-8892', url: 'https://api.mtn.ci/v1/payments', enabled: true },
    orange: { apiKey: 'om_sk_live_4831jd89f38a', merchantId: 'OM-CI-7741', url: 'https://api.orange.ci/om/v2/payment', enabled: true },
    moov: { apiKey: 'moov_sk_live_7382md82j19e', merchantId: 'MOOV-CI-3301', url: 'https://api.moov.ci/flooz/v1/pay', enabled: true },
    wave: { apiKey: 'wave_sk_live_3821nd82k49a', merchantId: 'WAVE-CI-9942', url: 'https://api.wave.com/v1/checkout', enabled: true },
  });

  // Client courses (commande de courses) state
  const [clientCourses, setClientCourses] = useState<ClientCourse[]>([
    {
      id: 'CMD-101',
      tarifs: 1500,
      clientName: 'Koffi Yao',
      typeEngin: 'Vélo',
      zoneParcours: 'Cocody',
      dateHeure: '2026-07-09T08:00',
      modePaiement: 'Wave',
      status: 'completed',
      source: 'mobile'
    },
    {
      id: 'CMD-102',
      tarifs: 3500,
      clientName: 'Amina Diop',
      typeEngin: 'Moto',
      zoneParcours: 'Marcory',
      dateHeure: '2026-07-08T14:30',
      modePaiement: 'Orange Money',
      status: 'completed',
      source: 'web'
    },
    {
      id: 'CMD-103',
      tarifs: 5000,
      clientName: 'Sékou Touré',
      typeEngin: 'Tricycle',
      zoneParcours: 'Yopougon',
      dateHeure: '2026-07-05T10:15',
      modePaiement: 'MTN Money',
      status: 'completed',
      source: 'web'
    },
    {
      id: 'CMD-104',
      tarifs: 2000,
      clientName: 'Jean Koffi',
      typeEngin: 'Vélo',
      zoneParcours: 'Plateau',
      dateHeure: '2026-07-09T09:20',
      modePaiement: 'Cash',
      status: 'pending',
      source: 'mobile'
    },
    {
      id: 'CMD-105',
      tarifs: 4000,
      clientName: 'Marie Diallo',
      typeEngin: 'Moto',
      zoneParcours: 'Riviera',
      dateHeure: '2026-06-25T17:45',
      modePaiement: 'Moov Money',
      status: 'completed',
      source: 'mobile'
    },
    {
      id: 'CMD-106',
      tarifs: 6000,
      clientName: 'Alassane Ouattara',
      typeEngin: 'Tricycle',
      zoneParcours: 'Adjamé',
      dateHeure: '2025-12-15T11:00',
      modePaiement: 'Wave',
      status: 'completed',
      source: 'web'
    }
  ]);

  // Expenses (dépenses) state
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 'DEP-001',
      title: 'Recharge Borne Solaire Cocody',
      amount: 15000,
      category: 'Énergie / Électricité',
      date: '2026-07-09',
      paymentMethod: 'Orange Money',
      reportedBy: 'lead',
      reportedByName: 'Alice Dubois'
    },
    {
      id: 'DEP-002',
      title: 'Achat plaquettes de frein Moto',
      amount: 8000,
      category: 'Maintenance',
      date: '2026-07-08',
      paymentMethod: 'Cash',
      reportedBy: 'admin',
      reportedByName: 'Admin'
    },
    {
      id: 'DEP-003',
      title: 'Assurance Flotte Annuelle Tricycles',
      amount: 120000,
      category: 'Assurance / Administratif',
      date: '2026-07-01',
      paymentMethod: 'Wave',
      reportedBy: 'admin',
      reportedByName: 'Admin'
    },
    {
      id: 'DEP-004',
      title: 'Pneu de rechange vélo électrique',
      amount: 12000,
      category: 'Maintenance',
      date: '2026-07-05',
      paymentMethod: 'MTN Money',
      reportedBy: 'lead',
      reportedByName: 'Benoît Legrand'
    },
    {
      id: 'DEP-005',
      title: 'Abonnement GPS Live',
      amount: 25000,
      category: 'Outils Numériques',
      date: '2026-06-15',
      paymentMethod: 'Moov Money',
      reportedBy: 'admin',
      reportedByName: 'Admin'
    }
  ]);

  // UI Active tabs & selections
  const [activeTab, setActiveTab] = useState<'tracking' | 'analytics' | 'maintenance' | 'bookings' | 'architecture' | 'administration' | 'reports'>('tracking');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [activeHistoricalTrip, setActiveHistoricalTrip] = useState<Trip | null>(null);
  
  // Simulation on/off controller
  const [isSimulatorRunning, setIsSimulatorRunning] = useState<boolean>(true);
  
  // Alerts notification dropdown visible
  const [showAlertDropdown, setShowAlertDropdown] = useState<boolean>(false);

  // Store indices for simulated moving vehicles along paths
  const [vehiclePathIndices, setVehiclePathIndices] = useState<Record<string, number>>({
    'V-101': 0,
    'V-102': 2,
    'V-104': 4,
  });

  // Redirect cashier role to reports tab
  useEffect(() => {
    if (activeRole === 'cashier') {
      setActiveTab('reports');
    }
  }, [activeRole]);

  // GPS Simulation Engine (runs on interval to update coordinates and check speed alerts)
  useEffect(() => {
    if (!isSimulatorRunning) return;

    const interval = setInterval(() => {
      setVehicles((prevVehicles) => {
        return prevVehicles.map((vehicle) => {
          if (vehicle.status !== 'active' || vehicle.currentSpeed === 0) return vehicle;

          // Figure out which route to follow
          let route: Coordinates[] = PATH_CITY_ROUTE;
          if (vehicle.id === 'V-102') route = PATH_HIGHWAY;
          if (vehicle.id === 'V-104') route = PATH_UTILITY_RUN;

          const currentIndex = vehiclePathIndices[vehicle.id] ?? 0;
          const nextIndex = (currentIndex + 1) % route.length;
          
          // Update index state
          setVehiclePathIndices(prev => ({
            ...prev,
            [vehicle.id]: nextIndex
          }));

          const currentPoint = route[currentIndex];
          const nextPoint = route[nextIndex];

          // Calculate trigonometric heading direction angle
          const dy = nextPoint.y - currentPoint.y;
          const dx = nextPoint.x - currentPoint.x;
          let newAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // offset by 90 for map grid

          // Simulate fuel decrease slightly
          const rawFuelLoss = (vehicle.currentSpeed / 100) * 0.4;
          const newFuel = Math.max(2, Number((vehicle.fuelLevel - rawFuelLoss).toFixed(1)));

          // Auto-triggering alerts in real-time if average consumption / speeding
          const isSpeedLimitExceeded = vehicle.currentSpeed > vehicle.maxAllowedSpeed;
          
          if (isSpeedLimitExceeded && Math.random() < 0.25) {
            // Push active Speed Alert to state
            const newAlertId = 'AL-GEN-' + Math.floor(Math.random() * 10000);
            const newAlert: Alert = {
              id: newAlertId,
              timestamp: 'À l\'instant',
              vehicleId: vehicle.id,
              vehicleName: vehicle.name,
              alertType: 'speeding',
              message: `Alerte : ${vehicle.name} roule à ${vehicle.currentSpeed} km/h (Limite : ${vehicle.maxAllowedSpeed} km/h)`,
              isRead: false,
              speedExceeded: vehicle.currentSpeed
            };

            // Avoid adding double speeding alerts at the exact same time
            setAlerts(prevAlerts => {
              const alreadyHasLive = prevAlerts.some(a => a.vehicleId === vehicle.id && !a.isRead && a.alertType === 'speeding');
              if (alreadyHasLive) return prevAlerts;
              return [newAlert, ...prevAlerts];
            });
          }

          return {
            ...vehicle,
            lat: nextPoint.y,
            lng: nextPoint.x,
            angle: Number(newAngle.toFixed(0)),
            fuelLevel: newFuel === 2 ? 98 : newFuel, // refuel if low to keep demo active
            mileage: vehicle.mileage + 0.3
          };
        });
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulatorRunning, vehiclePathIndices]);

  // Handler: Door lock/unlock action trigger
  const handleToggleLock = (id: string) => {
    setVehicles(prevVehicles =>
      prevVehicles.map(v => {
        if (v.id === id) {
          const nextLockState = !v.isLocked;
          
          // Log an alert event if unlocked
          if (!nextLockState) {
            const auditAlert: Alert = {
              id: 'AL-LOCK-' + Math.floor(Math.random() * 10000),
              timestamp: 'À l\'instant',
              vehicleId: v.id,
              vehicleName: v.name,
              alertType: 'door_unlocked',
              message: `Contrôle à distance : Portes déverrouillées pour ${v.name}`,
              isRead: false
            };
            setAlerts(prev => [auditAlert, ...prev]);
          } else {
            const auditAlert: Alert = {
              id: 'AL-LOCK-' + Math.floor(Math.random() * 10000),
              timestamp: 'À l\'instant',
              vehicleId: v.id,
              vehicleName: v.name,
              alertType: 'door_unlocked',
              message: `Sécurité : Portes verrouillées à distance pour ${v.name}`,
              isRead: false
            };
            setAlerts(prev => [auditAlert, ...prev]);
          }

          return { ...v, isLocked: nextLockState };
        }
        return v;
      })
    );
  };

  // Handler: Speed slider changed from drivers smartphone portal
  const handleSpeedChange = (id: string, newSpeed: number) => {
    setVehicles(prev =>
      prev.map(v => {
        if (v.id === id) {
          const nextStatus = newSpeed > 0 ? 'active' : 'idle';
          return {
            ...v,
            currentSpeed: newSpeed,
            status: nextStatus as any
          };
        }
        return v;
      })
    );
  };

  // Handler: Add maintenance order scheduled
  const handleAddMaintenance = (record: Omit<MaintenanceRecord, 'id'>) => {
    const newId = 'MT-' + (500 + maintenance.length + 1);
    const newRecord: MaintenanceRecord = {
      ...record,
      id: newId
    };

    setMaintenance(prev => [newRecord, ...prev]);

    // Push security notification
    const alertNotify: Alert = {
      id: 'AL-MT-' + Math.floor(Math.random() * 10000),
      timestamp: 'À l\'instant',
      vehicleId: record.vehicleId,
      vehicleName: record.vehicleName,
      alertType: 'maintenance',
      message: `Nouvel entretien planifié : ${record.issue} (${record.technician})`,
      isRead: false
    };
    setAlerts(prev => [alertNotify, ...prev]);
  };

  // Handler: Update status of maintenance
  const handleUpdateMaintenanceStatus = (id: string, nextStatus: MaintenanceRecord['status']) => {
    setMaintenance(prev =>
      prev.map(m => {
        if (m.id === id) {
          // If marked completed, we can change the vehicle state
          if (nextStatus === 'completed') {
            setVehicles(vPrev =>
              vPrev.map(v => v.id === m.vehicleId ? { ...v, status: 'idle' } : v)
            );
          } else if (nextStatus === 'in_progress') {
            setVehicles(vPrev =>
              vPrev.map(v => v.id === m.vehicleId ? { ...v, status: 'maintenance' } : v)
            );
          }
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  // Handler: Add Driver Booking Request
  const handleAddBookingRequest = (booking: Omit<BookingRequest, 'id'>) => {
    const newId = 'BK-' + (800 + bookings.length + 1);
    const newRequest: BookingRequest = {
      ...booking,
      id: newId
    };
    setBookings(prev => [newRequest, ...prev]);

    // Push manager alert
    const bAlert: Alert = {
      id: 'AL-BK-' + Math.floor(Math.random() * 10000),
      timestamp: 'À l\'instant',
      vehicleId: '',
      vehicleName: 'Demande Externe',
      alertType: 'maintenance',
      message: `Nouvelle réservation véhicule demandée par ${booking.driverName} (${booking.vehicleType})`,
      isRead: false
    };
    setAlerts(prev => [bAlert, ...prev]);
  };

  // Handler: Approve user authorization booking request
  const handleApproveBooking = (bookingId: string, assignedVehicleId: string) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'approved', vehicleId: assignedVehicleId } : b)
    );

    // Update the vehicle profile
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    setVehicles(prevVehicles =>
      prevVehicles.map(v => {
        if (v.id === assignedVehicleId) {
          return {
            ...v,
            status: 'active',
            driverName: targetBooking.driverName,
            isLocked: true,
            currentSpeed: 70 // starts simulated trip automatically!
          };
        }
        return v;
      })
    );

    // Push verification alert
    const okAlert: Alert = {
      id: 'AL-OK-' + Math.floor(Math.random() * 10000),
      timestamp: 'À l\'instant',
      vehicleId: assignedVehicleId,
      vehicleName: 'Réservation validée',
      alertType: 'door_unlocked',
      message: `Réservation validée pour ${targetBooking.driverName}. Véhicule ${assignedVehicleId} assigné.`,
      isRead: false
    };
    setAlerts(prev => [okAlert, ...prev]);
  };

  // Handler: Reject user reservation order
  const handleRejectBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'rejected' } : b)
    );
  };

  // Clear unread alerts badge
  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  // Delete specific alert
  const handleDeleteAlert = (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // Clicking an alert focus-map on vehicle helper
  const handleFocusOnAlertVehicle = (vehicleId: string) => {
    if (!vehicleId) return;
    setSelectedVehicleId(vehicleId);
    setActiveTab('tracking');
    setShowAlertDropdown(false);
  };

  // Show a historic trip on the map visualizer
  const handleShowHistoricalTripOnMap = (trip: Trip) => {
    setActiveHistoricalTrip(trip);
    setSelectedVehicleId(null);
    setActiveTab('tracking');
  };

  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  if (!isFleetLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none selection:bg-indigo-500 selection:text-white">
        
        {/* Animated grid lines in background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none"></div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 filter blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 filter blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative z-10 transition-all">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl shadow-indigo-500/20 transform hover:rotate-3 transition-transform">
              {systemParams.logoUrl === 'CarIcon' && <Car className="w-8 h-8" />}
              {systemParams.logoUrl === 'BikeIcon' && <Bike className="w-8 h-8" />}
              {systemParams.logoUrl === 'LogisticsEmblem' && <ShieldCheck className="w-8 h-8" />}
            </div>
            
            <div className="pt-2">
              <h2 className="text-lg font-bold tracking-tight text-white uppercase">{systemParams.appName}</h2>
              <p className="text-xs text-slate-400 font-medium">Système de Surveillance de Flotte & Télémétrie GPS</p>
            </div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            setFleetLoginError(null);
            
            // Check Admin Credentials
            if (fleetUsername.trim().toLowerCase() === 'admin' && fleetPassword === 'password123') {
              setActiveRole('admin');
              setIsFleetLoggedIn(true);
              return;
            }

            // Check Cashier/Gestionnaire Credentials
            if (fleetUsername.trim().toLowerCase() === 'caissier' && fleetPassword === 'password123') {
              setActiveRole('cashier');
              setIsFleetLoggedIn(true);
              return;
            }

            // Check Team Leader Credentials
            const matchedLeader = teamLeaders.find(tl => 
              ((tl.login && tl.login.toLowerCase() === fleetUsername.trim().toLowerCase()) || tl.email.toLowerCase() === fleetUsername.trim().toLowerCase()) &&
              (tl.password || 'password123') === fleetPassword
            );

            if (matchedLeader) {
              if (matchedLeader.status === 'inactive') {
                setFleetLoginError("Ce compte de gestionnaire est désactivé.");
                return;
              }
              setActiveRole('lead');
              setSelectedLeadId(matchedLeader.id);
              setIsFleetLoggedIn(true);
              return;
            }

            // Check Driver Credentials
            const matchedDriver = livreurs.find(l => 
              ((l.login && l.login.toLowerCase() === fleetUsername.trim().toLowerCase()) || l.email.toLowerCase() === fleetUsername.trim().toLowerCase()) &&
              (l.password || 'password123') === fleetPassword
            );

            if (matchedDriver) {
              if (matchedDriver.status === 'inactive') {
                setFleetLoginError("Ce compte de conducteur est désactivé.");
                return;
              }
              setFleetLoginError("Les conducteurs doivent utiliser le simulateur mobile à droite pour se connecter.");
              return;
            }

            setFleetLoginError("Identifiant ou mot de passe incorrect.");
          }} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Identifiant ou Email</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fleetUsername}
                  onChange={(e) => setFleetUsername(e.target.value)}
                  placeholder="Ex: admin, caissier ou alice"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-semibold transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Mot de passe sécurisé</label>
              <input
                type="password"
                required
                value={fleetPassword}
                onChange={(e) => setFleetPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-mono transition-all"
              />
            </div>

            {fleetLoginError && (
              <div className="p-3 bg-rose-950/45 border border-rose-900/40 text-rose-400 rounded-xl text-xs font-semibold leading-normal animate-pulse">
                ⚠️ {fleetLoginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 shadow shadow-indigo-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              S'authentifier sur la Console
            </button>
          </form>

          {/* Quick-select Demo accounts drawer */}
          <div className="border-t border-slate-800/80 pt-4 space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono text-center">Raccourcis de Connexion Démo</span>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFleetUsername('admin');
                  setFleetPassword('password123');
                }}
                className="p-2 px-3 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800/80 text-left space-y-0.5 transition-all cursor-pointer"
              >
                <span className="text-[10px] font-bold text-white block">Administrateur</span>
                <span className="text-[9px] font-mono text-slate-400 block">admin / p...123</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFleetUsername('alice');
                  setFleetPassword('password123');
                }}
                className="p-2 px-3 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800/80 text-left space-y-0.5 transition-all cursor-pointer"
              >
                <span className="text-[10px] font-bold text-white block">Chef d'équipe</span>
                <span className="text-[9px] font-mono text-slate-400 block">alice / p...123</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFleetUsername('caissier');
                  setFleetPassword('password123');
                }}
                className="p-2 px-3 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800/80 text-left space-y-0.5 transition-all cursor-pointer col-span-2"
              >
                <span className="text-[10px] font-bold text-emerald-400 block flex items-center gap-1">
                  💰 Caissier / Gestionnaire de caisse
                </span>
                <span className="text-[9px] font-mono text-slate-400 block">caissier / password123</span>
              </button>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center text-[10px] text-slate-500 max-w-sm leading-relaxed">
          Accès réservé au personnel certifié. Toute tentative d'intrusion sans jeton d'autorisation sera reportée aux administrateurs de la flotte.
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Header Navbar */}
      <header id="central-header-navbar" className="bg-slate-900 border-b border-slate-800 shrink-0 sticky top-0 z-40 px-4 lg:px-6 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow shadow-indigo-500/30">
            {systemParams.logoUrl === 'CarIcon' && <Car className="w-5 h-5" />}
            {systemParams.logoUrl === 'BikeIcon' && <Bike className="w-5 h-5" />}
            {systemParams.logoUrl === 'LogisticsEmblem' && <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm lg:text-base font-bold tracking-tight text-white flex items-center gap-1.5 uppercase">
                {systemParams.appName} <span className="text-xs bg-slate-950 border border-slate-800 text-indigo-400 font-mono font-bold px-1.5 py-0.25 rounded uppercase">PRO</span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Centrale d'Operations & Sûreté de Flotte • <span className="text-emerald-400">Services Connectés</span>
            </p>
          </div>
        </div>

        {/* System Simulation Controller indicators */}
        <div className="hidden md:flex items-center gap-4 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Moteur GPS</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSimulatorRunning(!isSimulatorRunning)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                isSimulatorRunning ? 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900' : 'bg-rose-950 text-rose-400 hover:bg-rose-900'
              }`}
              title="Arrêter ou relancer le flux GPS de simulation en direct"
            >
              <RefreshCw className={`w-3 h-3 ${isSimulatorRunning ? 'animate-spin' : ''}`} />
              {isSimulatorRunning ? 'SIM ACTIF (4Hz)' : 'SIM ARRÊTÉ'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications Alert Popover bell */}
          <div className="relative pointer-events-auto">
            <button
              onClick={() => setShowAlertDropdown(!showAlertDropdown)}
              className={`p-2 rounded-xl border transition-all relative ${
                unreadAlertsCount > 0
                  ? 'bg-red-950/40 border-red-800 text-red-400 hover:bg-red-950/80'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full font-mono text-[9px] font-bold flex items-center justify-center animate-bounce">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown panel */}
            {showAlertDropdown && (
              <div className="absolute right-0 mt-2.5 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                  <span className="text-xs font-bold text-slate-200">Centre d'Alertes Incident</span>
                  <button
                    onClick={markAllAlertsRead}
                    className="text-[10px] text-indigo-400 hover:underline font-semibold"
                  >
                    Tout acquitter
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => handleFocusOnAlertVehicle(alert.vehicleId)}
                        className={`p-3 text-xs transition-colors hover:bg-slate-800 cursor-pointer ${
                          !alert.isRead ? 'bg-indigo-950/25 border-l-2 border-indigo-500' : 'opacity-85'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-300">{alert.vehicleName}</span>
                          <span className="text-[9px] text-slate-500 font-mono">{alert.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{alert.message}</p>
                        
                        <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-800/60">
                          {alert.alertType === 'speeding' ? (
                            <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-0.5">
                              ⚠️ EXCÈS VITESSE
                            </span>
                          ) : alert.alertType === 'low_fuel' ? (
                            <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">
                              ⛽ CARBURANT BAS
                            </span>
                          ) : (
                            <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider">
                              🔧 TÉLÉMATIQUE
                            </span>
                          )}

                          <button
                            onClick={(e) => handleDeleteAlert(alert.id, e)}
                            className="text-[10px] text-slate-500 hover:text-red-400 p-0.5"
                            title="Masquer l'alerte"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400 italic">
                      Aucune alerte active dans le système.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Connected User session info & LogOut */}
          <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-200">
                {activeRole === 'admin' ? 'Administrateur' : `Chef d'équipe (${selectedLeadId})`}
              </span>
              <span className="text-[8px] text-indigo-400 font-bold uppercase font-mono tracking-wider">
                Session Active
              </span>
            </div>
            
            <button
              onClick={() => {
                setIsFleetLoggedIn(false);
                setFleetUsername('');
                setFleetPassword('');
              }}
              className="p-1.5 bg-red-950/40 hover:bg-red-950 border border-red-900/40 rounded-lg text-red-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
              title="Se déconnecter de la console"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current system time stamp */}
          <div className="hidden lg:flex flex-col text-right font-mono text-[10px] text-slate-400">
            <span className="font-semibold text-slate-300">2026-06-07</span>
            <span>16:05:13 UTC</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame container */}
      <div id="fleet-operational-split-panel" className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* Left Col: Master Fleets Control dashboards & Map */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-0 lg:pr-1 min-w-0">
          
          {/* Quick Metrics stats cards */}
          <DashboardStats
            vehicles={vehicles}
            alerts={alerts}
            maintenance={maintenance}
          />

          {/* Tab Selection Area Navigation bar */}
          <div id="fleet-dashboard-tabs" className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-2xl shrink-0 overflow-x-auto">
            {activeRole !== 'cashier' && (
              <button
                onClick={() => setActiveTab('tracking')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'tracking'
                    ? 'bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Suivi Temps Réel & Carte
              </button>
            )}

            {activeRole !== 'cashier' && (
              <button
                onClick={() => {
                  setActiveTab('analytics');
                  // Ensure default trip analysis selection
                  if (tripsHistory.length > 0) handleShowHistoricalTripOnMap(tripsHistory[0]);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Consommation & Rapports
              </button>
            )}

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'bg-emerald-600 font-bold text-white shadow-md shadow-emerald-600/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Rapports, Dépenses & Caisse 💰
            </button>

            {(activeRole === 'admin' || activeRole === 'lead') && (
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'maintenance'
                    ? 'bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wrench className="w-4 h-4" />
                Maintenance Flotte
              </button>
            )}

            {activeRole !== 'cashier' && (
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Réservations & Commandes
              </button>
            )}

            {activeRole === 'admin' && (
              <button
                onClick={() => setActiveTab('administration')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'administration'
                    ? 'bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                Rôles & Paramètres Admin
              </button>
            )}

            {activeRole === 'admin' && (
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'architecture'
                    ? 'bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-4 h-4" />
                Architecture & APIs (Laravel/MySQL)
              </button>
            )}
          </div>

          {/* Conditional View Renders */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              {/* Map */}
              <FleetMap
                vehicles={vehicles}
                selectedVehicleId={selectedVehicleId}
                onSelectVehicle={setSelectedVehicleId}
                onToggleLock={handleToggleLock}
                activeHistoricalTrip={activeHistoricalTrip}
                onClearHistoricalTrip={() => setActiveHistoricalTrip(null)}
              />

              {/* Connected fleet fast dashboard summary table */}
              <div id="fleet-connected-details" className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Statut Actuel de l'Armement Véhicules Flotte ({vehicles.length})
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">MAJ automatique live</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold h-9">
                        <th className="px-2">Code ID</th>
                        <th>Véhicule</th>
                        <th>Chauffeur</th>
                        <th>Vitesse (Max)</th>
                        <th>Statut</th>
                        <th>Portes</th>
                        <th className="text-right px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {vehicles.map((v) => {
                        const isOverSpeed = v.currentSpeed > v.maxAllowedSpeed;
                        return (
                          <tr
                            key={v.id}
                            className={`h-11 transition-all ${selectedVehicleId === v.id ? 'bg-indigo-950/20 text-white' : 'hover:bg-slate-800/40'}`}
                          >
                            <td className="px-2 font-mono font-bold text-indigo-400">{v.id}</td>
                            <td>
                              <div>
                                <span className="font-semibold">{v.name}</span>
                                <span className="text-[10px] text-slate-500 block font-mono">{v.licensePlate} • {v.type}</span>
                              </div>
                            </td>
                            <td className="text-slate-200 font-medium">{v.driverName || 'Non assigné'}</td>
                            <td>
                              <span className={`font-mono font-bold ${isOverSpeed ? 'text-red-400 animate-pulse bg-red-950/30 px-1.5 py-0.5 rounded' : 'text-slate-300'}`}>
                                {v.currentSpeed} / {v.maxAllowedSpeed} km/h
                              </span>
                            </td>
                            <td>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                v.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' :
                                v.status === 'maintenance' ? 'bg-rose-950 text-rose-400 border border-rose-900/40' : 'bg-slate-850 text-slate-400'
                              }`}>
                                {v.status}
                              </span>
                            </td>
                            <td>
                              <span className={`text-[10px] font-semibold ${v.isLocked ? 'text-emerald-400' : 'text-amber-500'}`}>
                                {v.isLocked ? '🔓 Verrouillé' : '🔓 Déverrouillé'}
                              </span>
                            </td>
                            <td className="text-right px-2">
                              <button
                                onClick={() => setSelectedVehicleId(selectedVehicleId === v.id ? null : v.id)}
                                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-[10px] border border-slate-800 rounded-lg hover:text-white font-semibold transition-all"
                              >
                                {selectedVehicleId === v.id ? 'Fermer' : 'Localiser'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <AnalyticsTab
                vehicles={vehicles}
                tripsHistory={tripsHistory}
              />

              {/* Table of Fuel & Trip statistics (includes fuel details for EACH trip) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Bilan d'Économie d'Énergie pour Chaque Trajet Passé
                  </h3>
                  <span className="text-[10px] text-slate-400">Total : {tripsHistory.length} analyses consignées</span>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold h-9">
                        <th className="px-2">Date & Id</th>
                        <th>Trajet & Itinéraire</th>
                        <th>Véhicule</th>
                        <th>Distance (Km)</th>
                        <th>Puissance (Wh)</th>
                        <th>Indice (Wh/km)</th>
                        <th>CO₂ Économisé (kg)</th>
                        <th className="text-right px-2">Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {tripsHistory.map((trip) => {
                        const calculatedRatio = (trip.powerConsumedWh / trip.distanceKm).toFixed(1);
                        return (
                          <tr key={trip.id} className="h-11 hover:bg-slate-800/30">
                            <td className="px-2">
                              <span className="font-semibold block">{trip.date}</span>
                              <span className="text-[10px] font-mono text-slate-500">{trip.id}</span>
                            </td>
                            <td className="font-semibold text-slate-100">{trip.routeName}</td>
                            <td>{trip.vehicleName}</td>
                            <td className="font-mono font-medium">{trip.distanceKm} km</td>
                            <td className="font-mono text-indigo-400 font-semibold">{trip.powerConsumedWh} Wh</td>
                            <td className="font-mono font-semibold text-amber-500">{calculatedRatio} Wh/km</td>
                            <td className="font-mono text-emerald-400">{trip.co2SavedKg} kg</td>
                            <td className="text-right px-2">
                              <button
                                onClick={() => handleShowHistoricalTripOnMap(trip)}
                                className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-[10px] text-emerald-400 hover:text-white rounded-lg font-semibold transition-all border border-emerald-800/40"
                              >
                                Rejouer Itinéraire
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceTab
              maintenance={maintenance}
              vehicles={vehicles}
              onAddMaintenance={handleAddMaintenance}
              onUpdateStatus={handleUpdateMaintenanceStatus}
            />
          )}

          {activeTab === 'bookings' && (
            <ReservationsTab
              bookings={bookings}
              vehicles={vehicles}
              onApproveBooking={handleApproveBooking}
              onRejectBooking={handleRejectBooking}
            />
          )}

          {activeTab === 'administration' && (
            <AdministrationTab
              vehicles={vehicles}
              setVehicles={setVehicles}
              onAddVehicle={(newV) => setVehicles(prev => [...prev, newV])}
              livreurs={livreurs}
              setLivreurs={setLivreurs}
              teamLeaders={teamLeaders}
              setTeamLeaders={setTeamLeaders}
              systemParams={systemParams}
              setSystemParams={setSystemParams}
              onPushAlert={(type, msg) => {
                const newAlert: Alert = {
                  id: 'AL-ADM-' + Math.floor(Math.random() * 10000),
                  timestamp: 'À l\'instant',
                  vehicleId: '',
                  vehicleName: 'Système',
                  alertType: type,
                  message: msg,
                  isRead: false
                };
                setAlerts(prev => [newAlert, ...prev]);
              }}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              selectedLeadIdForProfile={selectedLeadId}
              mobileMoneyApis={mobileMoneyApis}
              setMobileMoneyApis={setMobileMoneyApis}
            />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureTab />
          )}

          {activeTab === 'reports' && (
            <ReportsTab
              activeRole={activeRole}
              expenses={expenses}
              setExpenses={setExpenses}
              clientCourses={clientCourses}
              setClientCourses={setClientCourses}
              currentUserDisplayName={activeRole === 'admin' ? 'Administrateur' : activeRole === 'lead' ? 'Chef d\'Équipe' : 'Caissier'}
            />
          )}

        </div>

        {/* Right Col: Animated interactive Smartphone Driver portal mock */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          <div className="bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              Simulateur Conducteur Mobile
            </h4>
            <p className="text-[11px] text-indigo-200/90 leading-relaxed font-sans">
              Cette interface simule l'application mobile de vos clients / conducteurs de flotte.
              Utilisez-la pour <strong>verrouiller à distance</strong>, simuler une <strong>vitesse excessive</strong> et envoyer de nouvelles <strong>demandes de réservations</strong> en direct pour observer les interactions manager immédiates !
            </p>
          </div>

          <MobileClientMockup
            vehicles={vehicles}
            livreurs={livreurs}
            onToggleLock={handleToggleLock}
            onSpeedChange={handleSpeedChange}
            onAddBookingRequest={handleAddBookingRequest}
            clientCourses={clientCourses}
            setClientCourses={setClientCourses}
          />
        </div>

      </div>

      {/* Production footer */}
      <footer className="mt-auto py-4 bg-slate-900 border-t border-slate-800 shrink-0 text-center text-[10px] text-slate-500">
        <p>© 2026 FleetTrack Systems Inc. Tous droits réservés. Version 4.12.0 LTS (Express Engine / React 19 Client)</p>
        <p className="mt-1 text-slate-600">Conforme aux spécifications de géolocalisation RGPD et d'analyse d'émissions de carbone Scope 3.</p>
      </footer>
    </div>
  );
}
