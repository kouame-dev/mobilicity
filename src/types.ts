export interface Vehicle {
  id: string;
  name: string;
  type: 'Vélo' | 'Moto' | 'Tricycle';
  licensePlate: string;
  currentSpeed: number;
  maxAllowedSpeed: number;
  status: 'active' | 'idle' | 'maintenance';
  powerConsumedWh: number; // Puissance consommée électrique en Wh
  powerAvailableWh: number; // Puissance disponible électrique en Wh
  powerReceivedWh: number; // Puissance reçue électrique en Wh
  voltage: number; // Tension en Volts (V)
  intensity: number; // Intensité en Ampères (A)
  batteryCapacityWh: number; // Capacité totale de la batterie en Wh
  isLocked: boolean;
  lat: number; // 0-100 grid scale
  lng: number; // 0-100 grid scale
  angle: number; // angle of moving heading
  driverName?: string;
  mileage: number; // km
}

export interface Livreur {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  vehicleType: 'Vélo' | 'Moto' | 'Tricycle';
  assignedVehicleId?: string;
  teamLeaderId?: string; // id of the chef d'équipe who manages them
  joinDate: string;
  login?: string;
  password?: string;
  photo?: string;
}

export interface TeamLeader {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  department: string;
  joinDate: string;
  login?: string;
  password?: string;
  photo?: string;
}

export interface UserRole {
  id: string;
  name: string;
  code: 'admin' | 'lead' | 'driver' | string;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  description: string;
}

export interface GpsApiConfig {
  providerId: string;
  appKey: string;
  providerUrl: string;
}

export interface GoogleMapsConfig {
  apiKey: string;
  defaultCenterLat: number;
  defaultCenterLng: number;
  geocodingProvider: 'google' | 'mapbox' | 'openstreetmap';
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  enabled: boolean;
  type: 'gateway' | 'mobile_money' | 'cash';
}

export interface SystemParams {
  logoUrl: string;
  appName: string;
  paymentMethods: PaymentMethodConfig[];
  currency: string;
  gpsApi: GpsApiConfig;
  googleMaps: GoogleMapsConfig;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface RoutePoint {
  x: number;
  y: number;
  speed: number;
  timestamp: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  date: string;
  routeName: string;
  distanceKm: number;
  durationMin: number;
  powerConsumedWh: number; // Puissance électrique consommée en Wh
  avgSpeedKmH: number;
  co2SavedKg: number; // CO2 économisé par rapport au thermique en kg
  routePath: Coordinates[];
}

export interface Alert {
  id: string;
  timestamp: string;
  vehicleId: string;
  vehicleName: string;
  alertType: 'speeding' | 'door_unlocked' | 'low_battery' | 'maintenance';
  message: string;
  isRead: boolean;
  speedExceeded?: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  issue: string;
  type: 'Préventif' | 'Correctif';
  status: 'pending' | 'in_progress' | 'completed';
  dateScheduled: string;
  cost: number;
  technician: string;
}

export interface BookingRequest {
  id: string;
  driverName: string;
  vehicleType: string;
  vehicleId?: string; // assigned vehicle if approved
  startDate: string;
  endDate: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ClientCourse {
  id: string;
  tarifs: number;
  clientName: string;
  typeEngin: 'Vélo' | 'Moto' | 'Tricycle';
  zoneParcours: string;
  dateHeure: string;
  modePaiement: 'Cash' | 'MTN Money' | 'Orange Money' | 'Moov Money' | 'Wave';
  status: 'pending' | 'completed' | 'cancelled';
  source: 'mobile' | 'web';
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: 'Cash' | 'MTN Money' | 'Orange Money' | 'Moov Money' | 'Wave';
  reportedBy: string; // role or identifier
  reportedByName: string;
}

