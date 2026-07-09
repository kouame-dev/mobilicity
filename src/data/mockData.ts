import { Vehicle, Trip, Alert, MaintenanceRecord, BookingRequest, Coordinates } from '../types';

// Let's define beautiful pre-set path coordinates on a 100x100 virtual map
export const PATH_CITY_ROUTE: Coordinates[] = [
  { x: 15, y: 35 }, { x: 25, y: 35 }, { x: 35, y: 30 }, { x: 45, y: 30 },
  { x: 45, y: 45 }, { x: 55, y: 55 }, { x: 65, y: 50 }, { x: 75, y: 65 },
  { x: 80, y: 55 }, { x: 70, y: 40 }, { x: 50, y: 25 }, { x: 25, y: 20 },
  { x: 15, y: 35 }
];

export const PATH_HIGHWAY: Coordinates[] = [
  { x: 5, y: 80 }, { x: 20, y: 78 }, { x: 40, y: 75 }, { x: 60, y: 72 },
  { x: 80, y: 70 }, { x: 95, y: 68 }, { x: 90, y: 50 }, { x: 75, y: 30 },
  { x: 60, y: 20 }, { x: 45, y: 15 }, { x: 25, y: 30 }, { x: 10, y: 55 },
  { x: 5, y: 80 }
];

export const PATH_UTILITY_RUN: Coordinates[] = [
  { x: 50, y: 50 }, { x: 55, y: 65 }, { x: 70, y: 75 }, { x: 85, y: 72 },
  { x: 80, y: 85 }, { x: 65, y: 90 }, { x: 40, y: 85 }, { x: 30, y: 70 },
  { x: 35, y: 55 }, { x: 50, y: 50 }
];

export const initialVehicles: Vehicle[] = [
  {
    id: 'V-101',
    name: 'Specialized Turbo Vado',
    type: 'Vélo',
    licensePlate: 'E-BIKE-101',
    currentSpeed: 22,
    maxAllowedSpeed: 25,
    status: 'active',
    powerConsumedWh: 120,
    powerAvailableWh: 370,
    powerReceivedWh: 10,
    voltage: 36,
    intensity: 10,
    batteryCapacityWh: 500,
    isLocked: true,
    lat: 15,
    lng: 35,
    angle: 90,
    driverName: 'Jean Dupont',
    mileage: 4150
  },
  {
    id: 'V-102',
    name: 'Super Soco TC Max',
    type: 'Moto',
    licensePlate: 'E-MOTO-102',
    currentSpeed: 82,
    maxAllowedSpeed: 80, // Alerte excès de vitesse imminente
    status: 'active',
    powerConsumedWh: 1800,
    powerAvailableWh: 1312,
    powerReceivedWh: 50,
    voltage: 72,
    intensity: 45,
    batteryCapacityWh: 3200,
    isLocked: true,
    lat: 40,
    lng: 75,
    angle: 340,
    driverName: 'Marc Lefèvre',
    mileage: 14100
  },
  {
    id: 'V-103',
    name: 'Babboe Curve-E Cargo',
    type: 'Tricycle',
    licensePlate: 'E-TRIKE-103',
    currentSpeed: 0,
    maxAllowedSpeed: 25,
    status: 'idle',
    powerConsumedWh: 200,
    powerAvailableWh: 290,
    powerReceivedWh: 15,
    voltage: 36,
    intensity: 12,
    batteryCapacityWh: 500,
    isLocked: false,
    lat: 50,
    lng: 50,
    angle: 180,
    driverName: 'Sarah Martin',
    mileage: 5600
  },
  {
    id: 'V-104',
    name: 'Moustache Lundi 27',
    type: 'Vélo',
    licensePlate: 'E-BIKE-104',
    currentSpeed: 18,
    maxAllowedSpeed: 25,
    status: 'active',
    powerConsumedWh: 60,
    powerAvailableWh: 556,
    powerReceivedWh: 5,
    voltage: 36,
    intensity: 15,
    batteryCapacityWh: 625,
    isLocked: true,
    lat: 60,
    lng: 72,
    angle: 210,
    driverName: 'Emma Bernard',
    mileage: 1850
  },
  {
    id: 'V-105',
    name: 'Trivel E-Tricycle',
    type: 'Tricycle',
    licensePlate: 'E-TRIKE-105',
    currentSpeed: 0,
    maxAllowedSpeed: 25,
    status: 'maintenance',
    powerConsumedWh: 850,
    powerAvailableWh: 120, // 12% restant de 1000Wh
    powerReceivedWh: 30,
    voltage: 48,
    intensity: 20,
    batteryCapacityWh: 1000,
    isLocked: true,
    lat: 30,
    lng: 70,
    angle: 0,
    driverName: 'Atelier Central',
    mileage: 9200
  }
];

export const initialTripsHistory: Trip[] = [
  {
    id: 'T-9001',
    vehicleId: 'V-101',
    vehicleName: 'Specialized Turbo Vado',
    licensePlate: 'E-BIKE-101',
    date: "Aujourd'hui, 11:30",
    routeName: 'Paris Centre - Versailles',
    distanceKm: 24.5,
    durationMin: 35,
    powerConsumedWh: 180,
    avgSpeedKmH: 42,
    co2SavedKg: 4.9, // Économie de CO2 vs voiture essence
    routePath: [
      { x: 15, y: 35 }, { x: 22, y: 35 }, { x: 28, y: 32 }, { x: 35, y: 30 }
    ]
  },
  {
    id: 'T-9002',
    vehicleId: 'V-103',
    vehicleName: 'Babboe Curve-E Cargo',
    licensePlate: 'E-TRIKE-103',
    date: 'Hier, 08:15',
    routeName: 'Dépôt Nord - Chantier Orly',
    distanceKm: 38.2,
    durationMin: 50,
    powerConsumedWh: 290,
    avgSpeedKmH: 45.8,
    co2SavedKg: 7.6,
    routePath: [
      { x: 50, y: 50 }, { x: 55, y: 65 }, { x: 70, y: 75 }
    ]
  },
  {
    id: 'T-9003',
    vehicleId: 'V-102',
    vehicleName: 'Super Soco TC Max',
    licensePlate: 'E-MOTO-102',
    date: 'Hier, 14:00',
    routeName: 'Dépôt Lyon - Plateforme Rungis',
    distanceKm: 162.0,
    durationMin: 140,
    powerConsumedWh: 4500,
    avgSpeedKmH: 81.5,
    co2SavedKg: 32.4,
    routePath: [
      { x: 5, y: 80 }, { x: 40, y: 75 }, { x: 80, y: 70 }, { x: 95, y: 68 }
    ]
  },
  {
    id: 'T-9004',
    vehicleId: 'V-104',
    vehicleName: 'Moustache Lundi 27',
    licensePlate: 'E-BIKE-104',
    date: 'Hier, 17:45',
    routeName: 'Navette Client Roissy',
    distanceKm: 18.2,
    durationMin: 22,
    powerConsumedWh: 140,
    avgSpeedKmH: 49.6,
    co2SavedKg: 3.6,
    routePath: [
      { x: 60, y: 20 }, { x: 45, y: 15 }, { x: 25, y: 30 }
    ]
  }
];

export const initialAlerts: Alert[] = [
  {
    id: 'AL-201',
    timestamp: 'Il y a 2 min',
    vehicleId: 'V-102',
    vehicleName: 'Super Soco TC Max',
    alertType: 'speeding',
    message: 'Excès de vitesse détecté : 82 km/h (Limite : 80 km/h)',
    isRead: false,
    speedExceeded: 82
  },
  {
    id: 'AL-202',
    timestamp: 'Il y a 15 min',
    vehicleId: 'V-105',
    vehicleName: 'Trivel E-Tricycle',
    alertType: 'low_battery',
    message: 'Niveau de batterie critique (12% restant - 120 Wh)',
    isRead: false
  },
  {
    id: 'AL-203',
    timestamp: 'Hier, 16:34',
    vehicleId: 'V-103',
    vehicleName: 'Babboe Curve-E Cargo',
    alertType: 'door_unlocked',
    message: 'Véhicule immobilisé mais antivol non verrouillé',
    isRead: true
  }
];

export const initialMaintenance: MaintenanceRecord[] = [
  {
    id: 'MT-501',
    vehicleId: 'V-105',
    vehicleName: 'Trivel E-Tricycle',
    issue: 'Contrôle de la capacité de batterie (SOH) et graissage',
    type: 'Préventif',
    status: 'in_progress',
    dateScheduled: '2026-06-05',
    cost: 85,
    technician: 'Atelier Cycle Électrique'
  },
  {
    id: 'MT-502',
    vehicleId: 'V-102',
    vehicleName: 'Super Soco TC Max',
    issue: 'Remplacement des plaquettes de freins train arrière',
    type: 'Correctif',
    status: 'pending',
    dateScheduled: '2026-06-10',
    cost: 120,
    technician: 'Moto Elec Service'
  },
  {
    id: 'MT-503',
    vehicleId: 'V-101',
    vehicleName: 'Specialized Turbo Vado',
    issue: 'Mise à jour firmware moteur Brose et lubrification transmission',
    type: 'Préventif',
    status: 'completed',
    dateScheduled: '2026-05-20',
    cost: 45,
    technician: 'Specialized Center'
  }
];

export const initialBookings: BookingRequest[] = [
  {
    id: 'BK-801',
    driverName: 'Julien Lambert',
    vehicleType: 'Vélo',
    startDate: '2026-06-08',
    endDate: '2026-06-10',
    purpose: 'Livraisons express centre-ville',
    status: 'pending'
  },
  {
    id: 'BK-802',
    driverName: 'Sophie Roussel',
    vehicleType: 'Tricycle',
    startDate: '2026-06-09',
    endDate: '2026-06-09',
    purpose: 'Livraison colis encombrants',
    status: 'pending'
  },
  {
    id: 'BK-803',
    driverName: 'Nicolas Dubois',
    vehicleType: 'Moto',
    vehicleId: 'V-104',
    startDate: '2026-06-06',
    endDate: '2026-06-07',
    purpose: 'Navette d\'urgence inter-sites',
    status: 'approved'
  }
];
