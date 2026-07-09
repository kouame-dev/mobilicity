import React, { useState } from 'react';
import { 
  ShieldAlert, 
  UserPlus, 
  Settings, 
  CreditCard, 
  Plus, 
  Search, 
  Power, 
  PowerOff,
  PlusCircle, 
  Trash2, 
  Check, 
  Bike, 
  Car, 
  Sparkles, 
  UserCheck, 
  Briefcase, 
  Smartphone, 
  Sliders, 
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  Coins,
  Globe,
  Map,
  Key,
  Shield
} from 'lucide-react';
import { Vehicle, Livreur, TeamLeader, SystemParams, PaymentMethodConfig, UserRole } from '../types';

interface AdministrationTabProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  onAddVehicle: (newVehicle: Vehicle) => void;
  livreurs: Livreur[];
  setLivreurs: React.Dispatch<React.SetStateAction<Livreur[]>>;
  teamLeaders: TeamLeader[];
  setTeamLeaders: React.Dispatch<React.SetStateAction<TeamLeader[]>>;
  systemParams: SystemParams;
  setSystemParams: React.Dispatch<React.SetStateAction<SystemParams>>;
  onPushAlert: (type: 'speeding' | 'door_unlocked' | 'low_battery' | 'maintenance', message: string) => void;
  activeRole?: 'admin' | 'lead' | 'cashier';
  setActiveRole?: (role: 'admin' | 'lead' | 'cashier') => void;
  selectedLeadIdForProfile?: string;
  mobileMoneyApis?: any;
  setMobileMoneyApis?: React.Dispatch<React.SetStateAction<any>>;
}

export default function AdministrationTab({
  vehicles,
  setVehicles,
  onAddVehicle,
  livreurs,
  setLivreurs,
  teamLeaders,
  setTeamLeaders,
  systemParams,
  setSystemParams,
  onPushAlert,
  activeRole: propActiveRole,
  setActiveRole: propSetActiveRole,
  selectedLeadIdForProfile: propSelectedLeadIdForProfile,
  mobileMoneyApis,
  setMobileMoneyApis
}: AdministrationTabProps) {
  
  // Local fallbacks if props not supplied
  const [localActiveRole, setLocalActiveRole] = useState<'admin' | 'lead' | 'cashier'>('admin');
  const [localSelectedLeadId, setLocalSelectedLeadId] = useState<string>('TL-201');

  const activeRole = propActiveRole !== undefined ? propActiveRole : localActiveRole;
  const setActiveRole = propSetActiveRole !== undefined ? propSetActiveRole : setLocalActiveRole;
  const selectedLeadIdForProfile = propSelectedLeadIdForProfile !== undefined ? propSelectedLeadIdForProfile : localSelectedLeadId;

  const setSelectedLeadIdForProfile = (val: string) => {
    if (propSetActiveRole) {
      // It's passed via prop, so we don't mutate local state, but we can set local if we want to sync
    } else {
      setLocalSelectedLeadId(val);
    }
  };

  // Form toggles / Active sub-sections (added 'roles' tab)
  const [adminTab, setAdminTab] = useState<'livreurs' | 'vehicles' | 'teamleaders' | 'config' | 'roles'>('livreurs');

  // Search terms
  const [livreurSearch, setLivreurSearch] = useState('');
  const [leaderSearch, setLeaderSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');

  // Editing state
  const [editingLivreurId, setEditingLivreurId] = useState<string | null>(null);
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Success message alerts
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // -------- FORM STATES FOR ADDING/EDITING VEHICLE ---------
  const [vName, setVName] = useState('');
  const [vType, setVType] = useState<'Vélo' | 'Moto' | 'Tricycle'>('Vélo');
  const [vLicense, setVLicense] = useState('');
  const [vMaxSpeed, setVMaxSpeed] = useState(25);
  const [vBatteryCapacity, setVBatteryCapacity] = useState(500);
  const [vVoltage, setVVoltage] = useState(36);
  const [vIntensity, setVIntensity] = useState(15);
  const [vPowerConsumedWh, setVPowerConsumedWh] = useState(100);
  const [vPowerAvailableWh, setVPowerAvailableWh] = useState(400);
  const [vPowerReceivedWh, setVPowerReceivedWh] = useState(10);

  // -------- FORM STATES FOR ADDING/EDITING LIVREUR ---------
  const [lName, setLName] = useState('');
  const [lPhone, setLPhone] = useState('');
  const [lEmail, setLEmail] = useState('');
  const [lStatus, setLStatus] = useState<'active' | 'inactive'>('active');
  const [lVehicleType, setLVehicleType] = useState<'Vélo' | 'Moto' | 'Tricycle'>('Vélo');
  const [lAssignedVehicleId, setLAssignedVehicleId] = useState('');
  const [lTeamLeaderId, setLTeamLeaderId] = useState('TL-201');
  const [lLogin, setLLogin] = useState('');
  const [lPassword, setLPassword] = useState('');

  // -------- FORM STATES FOR ADDING/EDITING TEAM LEADER ---------
  const [tlName, setTlName] = useState('');
  const [tlEmail, setTlEmail] = useState('');
  const [tlPhone, setTlPhone] = useState('');
  const [tlStatus, setTlStatus] = useState<'active' | 'inactive'>('active');
  const [tlDepartment, setTlDepartment] = useState('Livraison Zone Nord');
  const [tlLogin, setTlLogin] = useState('');
  const [tlPassword, setTlPassword] = useState('');

  // -------- SYSTEM PARAMS LOCAL STATES ---------
  const [sysName, setSysName] = useState(systemParams.appName);
  const [sysLogo, setSysLogo] = useState(systemParams.logoUrl);
  const [sysCurrency, setSysCurrency] = useState(systemParams.currency);

  // -------- NEW: STATES FOR GPS PROVIDER API & MAPS CONFIG ---------
  const [gpsProviderId, setGpsProviderId] = useState(systemParams.gpsApi?.providerId || 'TRACK-GPS-INT-001');
  const [gpsAppKey, setGpsAppKey] = useState(systemParams.gpsApi?.appKey || 'gp_sk_live_903hnd8a9f3k4m2b8a7f');
  const [gpsProviderUrl, setGpsProviderUrl] = useState(systemParams.gpsApi?.providerUrl || 'https://api.gpsprovider.net/v2/telemetry');

  const [mapsApiKey, setMapsApiKey] = useState(systemParams.googleMaps?.apiKey || 'AIzaSyAs-GMapSec_8091h_Live92xKey');
  const [mapsCenterLat, setMapsCenterLat] = useState(systemParams.googleMaps?.defaultCenterLat || 48.8566);
  const [mapsCenterLng, setMapsCenterLng] = useState(systemParams.googleMaps?.defaultCenterLng || 2.3522);
  const [geocodingProvider, setGeocodingProvider] = useState(systemParams.googleMaps?.geocodingProvider || 'google');

  // -------- NEW: STATES FOR CUSTOM ROLES ---------
  const [customRoles, setCustomRoles] = useState<UserRole[]>([
    { id: 'ROLE-1', name: 'Administrateur', code: 'admin', canAdd: true, canEdit: true, canDelete: true, description: 'Accès total sur les flottes, finances, personnel et paramètres système.' },
    { id: 'ROLE-2', name: 'Chef de groupe', code: 'lead', canAdd: true, canEdit: true, canDelete: false, description: 'Supervise ses conducteurs et véhicules assignés.' },
    { id: 'ROLE-3', name: 'Conducteur', code: 'driver', canAdd: false, canEdit: false, canDelete: false, description: 'Accès aux outils mobiles et verrous de portes.' }
  ]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleCode, setNewRoleCode] = useState('');
  const [newRoleCanAdd, setNewRoleCanAdd] = useState(true);
  const [newRoleCanEdit, setNewRoleCanEdit] = useState(true);
  const [newRoleCanDelete, setNewRoleCanDelete] = useState(false);
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  // Modal open states
  const [isLivreurModalOpen, setIsLivreurModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);
  const [isMapsModalOpen, setIsMapsModalOpen] = useState(false);

  const triggerNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  // ADD OR EDIT VEHICLE HANDLER
  const handleCreateVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName || !vLicense) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (editingVehicleId) {
      setVehicles(prev => prev.map(v => {
        if (v.id === editingVehicleId) {
          return {
            ...v,
            name: vName,
            type: vType as any,
            licensePlate: vLicense.toUpperCase(),
            maxAllowedSpeed: vMaxSpeed,
            batteryCapacityWh: vBatteryCapacity,
            voltage: vVoltage,
            intensity: vIntensity,
            powerConsumedWh: vPowerConsumedWh,
            powerAvailableWh: vPowerAvailableWh,
            powerReceivedWh: vPowerReceivedWh
          };
        }
        return v;
      }));
      onPushAlert('maintenance', `Véhicule modifié : ${vName} [${vLicense.toUpperCase()}]`);
      triggerNotification(`Le véhicule ${vName} a été mis à jour avec succès.`);
      setEditingVehicleId(null);
    } else {
      const customId = `V-NEW-${100 + vehicles.length + 1}`;
      const speed = 0;

      const newV: Vehicle = {
        id: customId,
        name: vName,
        type: vType as any,
        licensePlate: vLicense.toUpperCase(),
        currentSpeed: speed,
        maxAllowedSpeed: vMaxSpeed,
        status: 'idle',
        batteryCapacityWh: vBatteryCapacity,
        voltage: vVoltage,
        intensity: vIntensity,
        powerConsumedWh: vPowerConsumedWh,
        powerAvailableWh: vPowerAvailableWh,
        powerReceivedWh: vPowerReceivedWh,
        isLocked: true,
        lat: 48.85 + (Math.random() * 0.04 - 0.02), // Paris-like layout
        lng: 2.35 + (Math.random() * 0.04 - 0.02),
        angle: 90,
        mileage: 0
      };

      onAddVehicle(newV);
      onPushAlert('maintenance', `Nouveau véhicule enregistré : ${vName} [${vLicense.toUpperCase()}] (${vType})`);
      triggerNotification(`Le véhicule ${vName} (${vType}) a été ajouté avec succès.`);
    }

    // Reset Form
    setVName('');
    setVLicense('');
    setVMaxSpeed(25);
    setVBatteryCapacity(500);
    setVVoltage(36);
    setVIntensity(15);
    setVPowerConsumedWh(100);
    setVPowerAvailableWh(400);
    setVPowerReceivedWh(10);
    setIsVehicleModalOpen(false);
  };

  const handleStartEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setVName(v.name);
    setVType(v.type as any);
    setVLicense(v.licensePlate);
    setVMaxSpeed(v.maxAllowedSpeed);
    setVBatteryCapacity(v.batteryCapacityWh || 500);
    setVVoltage(v.voltage || 36);
    setVIntensity(v.intensity || 15);
    setVPowerConsumedWh(v.powerConsumedWh || 100);
    setVPowerAvailableWh(v.powerAvailableWh || 400);
    setVPowerReceivedWh(v.powerReceivedWh || 10);
    setAdminTab('vehicles');
    setIsVehicleModalOpen(true);
  };

  const handleDeleteVehicle = (id: string, name: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le véhicule ${name} [ID: ${id}] de la flotte ?`)) {
      setVehicles(prev => prev.filter(v => v.id !== id));
      onPushAlert('maintenance', `Véhicule supprimé de la flotte : ${name}`);
      triggerNotification(`Le véhicule ${name} a été supprimé.`);
    }
  };

  // ADD or SAVE LIVREUR HANDLER
  const handleLivreurSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lName || !lPhone || !lEmail) {
      alert('Veuillez renseigner le nom, le téléphone et l\'adresse email.');
      return;
    }

    if (editingLivreurId) {
      // Modify
      setLivreurs(prev => prev.map(liv => {
        if (liv.id === editingLivreurId) {
          const updated: Livreur = {
            ...liv,
            name: lName,
            phone: lPhone,
            email: lEmail,
            status: lStatus,
            vehicleType: lVehicleType,
            assignedVehicleId: lAssignedVehicleId || undefined,
            teamLeaderId: lTeamLeaderId,
            login: lLogin || undefined,
            password: lPassword || undefined
          };

          // If vehicle assigned, let's update that vehicle status to active and assign driver
          if (lAssignedVehicleId) {
            onPushAlert('door_unlocked', `Conducteur ${lName} affecté au véhicule ID ${lAssignedVehicleId}`);
          }
          return updated;
        }
        return liv;
      }));
      triggerNotification(`Le livreur "${lName}" a été mis à jour avec succès.`);
      setEditingLivreurId(null);
    } else {
      // Create new
      const nextId = `LIV-${300 + livreurs.length + 1}`;
      const newLiv: Livreur = {
        id: nextId,
        name: lName,
        phone: lPhone,
        email: lEmail,
        status: lStatus,
        vehicleType: lVehicleType,
        assignedVehicleId: lAssignedVehicleId || undefined,
        teamLeaderId: activeRole === 'lead' ? selectedLeadIdForProfile : lTeamLeaderId,
        joinDate: new Date().toISOString().split('T')[0],
        login: lLogin || undefined,
        password: lPassword || undefined
      };

      setLivreurs(prev => [newLiv, ...prev]);
      onPushAlert('door_unlocked', `Nouveau livreur enregistré : ${lName} (${lVehicleType})`);
      triggerNotification(`Le livreur "${lName}" a été créé et rattaché à son équipe.`);
    }

    // Reset fields
    setLName('');
    setLPhone('');
    setLEmail('');
    setLStatus('active');
    setLAssignedVehicleId('');
    setLLogin('');
    setLPassword('');
    setIsLivreurModalOpen(false);
  };

  // EDIT LIVREUR ASSIGNMENT
  const handleStartEditLivreur = (l: Livreur) => {
    setEditingLivreurId(l.id);
    setLName(l.name);
    setLPhone(l.phone);
    setLEmail(l.email);
    setLStatus(l.status);
    setLVehicleType(l.vehicleType);
    setLAssignedVehicleId(l.assignedVehicleId || '');
    setLTeamLeaderId(l.teamLeaderId || 'TL-201');
    setLLogin(l.login || '');
    setLPassword(l.password || '');
    setAdminTab('livreurs'); // focus form tab
    setIsLivreurModalOpen(true);
  };

  const handleToggleLivreurStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setLivreurs(prev => prev.map(liv => {
      if (liv.id === id) {
        onPushAlert(
          nextStatus === 'inactive' ? 'door_unlocked' : 'maintenance',
          `Profil Livreur : ${liv.name} est maintenant ${nextStatus === 'inactive' ? 'Désactivé 🔴' : 'Activé 🟢'}`
        );
        return { ...liv, status: nextStatus };
      }
      return liv;
    }));
    triggerNotification(`Statut du livreur mis à jour.`);
  };

  const handleDeleteLivreur = (id: string, name: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le dossier de livraison de ${name} ?`)) {
      setLivreurs(prev => prev.filter(liv => liv.id !== id));
      triggerNotification(`Dossier livreur supprimé.`);
    }
  };

  // TEAM LEADER HANDLERS (Only for role 'admin')
  const handleTeamLeaderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole !== 'admin') return;

    if (!tlName || !tlEmail || !tlPhone) {
      alert('Veuillez remplir tous les champs pour le chef d\'équipe.');
      return;
    }

    if (editingLeaderId) {
      setTeamLeaders(prev => prev.map(lead => {
        if (lead.id === editingLeaderId) {
          return {
            ...lead,
            name: tlName,
            email: tlEmail,
            phone: tlPhone,
            status: tlStatus,
            department: tlDepartment,
            login: tlLogin || undefined,
            password: tlPassword || undefined
          };
        }
        return lead;
      }));
      triggerNotification(`Le chef d'équipe "${tlName}" a été mis à jour.`);
      setEditingLeaderId(null);
    } else {
      const nextId = `TL-${200 + teamLeaders.length + 1}`;
      const newLead: TeamLeader = {
        id: nextId,
        name: tlName,
        email: tlEmail,
        phone: tlPhone,
        status: tlStatus,
        department: tlDepartment,
        joinDate: new Date().toISOString().split('T')[0],
        login: tlLogin || undefined,
        password: tlPassword || undefined
      };
      setTeamLeaders(prev => [newLead, ...prev]);
      triggerNotification(`Nouveau chef d'équipe créé : ${tlName}`);
    }

    // Reset Form
    setTlName('');
    setTlEmail('');
    setTlPhone('');
    setTlStatus('active');
    setTlDepartment('Livraison Zone Nord');
    setTlLogin('');
    setTlPassword('');
    setIsLeaderModalOpen(false);
  };

  const handleStartEditLeader = (tl: TeamLeader) => {
    setEditingLeaderId(tl.id);
    setTlName(tl.name);
    setTlEmail(tl.email);
    setTlPhone(tl.phone);
    setTlStatus(tl.status);
    setTlDepartment(tl.department);
    setTlLogin(tl.login || '');
    setTlPassword(tl.password || '');
    setAdminTab('teamleaders');
    setIsLeaderModalOpen(true);
  };

  const handleToggleLeaderStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setTeamLeaders(prev => prev.map(lead => {
      if (lead.id === id) {
        return { ...lead, status: nextStatus };
      }
      return lead;
    }));
    triggerNotification(`Statut du chef d'équipe mis à jour.`);
  };

  // SAVE SYSTEM PARAMETERS HANDLER (Only for role 'admin')
  const handleSaveSystemConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole !== 'admin') return;

    setSystemParams({
      ...systemParams,
      appName: sysName,
      logoUrl: sysLogo,
      currency: sysCurrency,
      gpsApi: {
        providerId: gpsProviderId,
        appKey: gpsAppKey,
        providerUrl: gpsProviderUrl
      },
      googleMaps: {
        apiKey: mapsApiKey,
        defaultCenterLat: Number(mapsCenterLat),
        defaultCenterLng: Number(mapsCenterLng),
        geocodingProvider: geocodingProvider as any
      }
    });

    onPushAlert('maintenance', `Paramètres Système mis à jour par l'Administrateur.`);
    triggerNotification('Les paramètres système globaux ont été appliqués avec succès !');
    setIsConfigModalOpen(false);
    setIsGpsModalOpen(false);
    setIsMapsModalOpen(false);
  };

  const handleTogglePaymentMethod = (methodId: string) => {
    if (activeRole !== 'admin') return;
    
    const updatedMethods = systemParams.paymentMethods.map(p => {
      if (p.id === methodId) {
        return { ...p, enabled: !p.enabled };
      }
      return p;
    });

    setSystemParams({
      ...systemParams,
      paymentMethods: updatedMethods
    });
    
    const target = updatedMethods.find(m => m.id === methodId);
    triggerNotification(`Moyen de paiement "${target?.name}" ${target?.enabled ? 'ACTIVÉ 🟢' : 'DÉSACTIVÉ 🔴'}`);
  };

  // CUSTOM ROLE HANDLERS
  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole !== 'admin') return;

    if (!newRoleName || !newRoleCode) {
      alert('Le nom et le code du rôle sont requis.');
      return;
    }

    if (editingRoleId) {
      setCustomRoles(prev => prev.map(r => {
        if (r.id === editingRoleId) {
          return {
            ...r,
            name: newRoleName,
            code: newRoleCode.toLowerCase().trim(),
            canAdd: newRoleCanAdd,
            canEdit: newRoleCanEdit,
            canDelete: newRoleCanDelete,
            description: newRoleDesc
          };
        }
        return r;
      }));
      triggerNotification(`Le rôle "${newRoleName}" a été modifié avec succès.`);
      setEditingRoleId(null);
    } else {
      const nextId = `ROLE-${customRoles.length + 1}`;
      const newRole: UserRole = {
        id: nextId,
        name: newRoleName,
        code: newRoleCode.toLowerCase().trim(),
        canAdd: newRoleCanAdd,
        canEdit: newRoleCanEdit,
        canDelete: newRoleCanDelete,
        description: newRoleDesc
      };
      setCustomRoles(prev => [...prev, newRole]);
      triggerNotification(`Le rôle "${newRoleName}" a été créé avec succès.`);
    }

    // Reset Form
    setNewRoleName('');
    setNewRoleCode('');
    setNewRoleCanAdd(true);
    setNewRoleCanEdit(true);
    setNewRoleCanDelete(false);
    setNewRoleDesc('');
    setIsRoleModalOpen(false);
  };

  const handleStartEditRole = (r: UserRole) => {
    setEditingRoleId(r.id);
    setNewRoleName(r.name);
    setNewRoleCode(r.code);
    setNewRoleCanAdd(r.canAdd);
    setNewRoleCanEdit(r.canEdit);
    setNewRoleCanDelete(r.canDelete);
    setNewRoleDesc(r.description || '');
    setAdminTab('roles');
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = (id: string, name: string) => {
    if (['ROLE-1', 'ROLE-2', 'ROLE-3'].includes(id)) {
      alert('Les rôles système par défaut ne peuvent pas être supprimés.');
      return;
    }
    if (window.confirm(`Voulez-vous vraiment supprimer le rôle "${name}" ?`)) {
      setCustomRoles(prev => prev.filter(r => r.id !== id));
      triggerNotification(`Le rôle "${name}" a été supprimé.`);
    }
  };

  // Filtering lists
  const filteredLivreurs = livreurs.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(livreurSearch.toLowerCase()) || 
                          l.phone.includes(livreurSearch) ||
                          l.email.toLowerCase().includes(livreurSearch.toLowerCase());
    
    // If active role is team leader, restrict to see ONLY their subordinates
    if (activeRole === 'lead') {
      return matchesSearch && l.teamLeaderId === selectedLeadIdForProfile;
    }
    return matchesSearch;
  });

  const filteredLeaders = teamLeaders.filter(tl => 
    tl.name.toLowerCase().includes(leaderSearch.toLowerCase()) || 
    tl.department.toLowerCase().includes(leaderSearch.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(v =>
    v.name.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
    v.licensePlate.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
    v.type.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  return (
    <div id="administration-system-control" className="space-y-6">
      
      {/* Dynamic Success Toast */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-900 border-2 border-indigo-500 text-indigo-100 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-2xl animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Main role control banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950 text-indigo-400 border border-indigo-800">
              PANEL RBAC SECURITY
            </span>
            <span className="text-xs text-slate-500 font-bold">•</span>
            {activeRole === 'admin' ? (
              <span className="text-xs text-rose-400 font-bold flex items-center gap-1 font-mono">
                🛡️ Administrateur Général (Full Accès)
              </span>
            ) : (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 font-mono">
                👥 Chef d'équipe : {teamLeaders.find(t => t.id === selectedLeadIdForProfile)?.name || 'Manager'}
              </span>
            )}
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
            Gestion du personnel, des rôles et configurations de flotte
          </h2>
          <p className="text-[11px] text-slate-400 max-w-2xl leading-normal">
            Basculez entre les rôles de simulation ci-contre pour tester les restrictions de formulaires en direct. Les livreurs sont reliés à leur chef de groupe afin de simuler une organisation d'entreprise.
          </p>
        </div>

        {/* Role Select Control Interface */}
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-2 shrink-0">
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                setActiveRole('admin');
                triggerNotification("Rôle configuré : Administrateur.");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'admin' 
                  ? 'bg-rose-600/90 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Administrateur
            </button>
            
            <button
              onClick={() => {
                setActiveRole('lead');
                // Auto switch adminTab if on config since leader can't configure system parameters
                if (adminTab === 'config' || adminTab === 'teamleaders') {
                  setAdminTab('livreurs');
                }
                triggerNotification(`Rôle configuré : Chef d'équipe.`);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeRole === 'lead' 
                  ? 'bg-emerald-600/90 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Chef d'équipe
            </button>
          </div>

          {activeRole === 'lead' && (
            <select
              value={selectedLeadIdForProfile}
              onChange={(e) => {
                setSelectedLeadIdForProfile(e.target.value);
                triggerNotification(`Équipe commutée sur : ${teamLeaders.find(t => t.id === e.target.value)?.name}`);
              }}
              className="bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 tracking-tight font-bold py-1 px-2 rounded outline-none w-36"
            >
              {teamLeaders.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Grid navigation options and active sub-tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Sidebar Nav Tabs */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
          <button
            onClick={() => setAdminTab('livreurs')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              adminTab === 'livreurs' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:bg-slate-950/40 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Gestion des Livreurs
          </button>
          
          <button
            onClick={() => setAdminTab('vehicles')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              adminTab === 'vehicles' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:bg-slate-950/40 hover:text-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            Ajout de Véhicules
          </button>

          <button
            onClick={() => {
              if (activeRole !== 'admin') {
                triggerNotification("Accès refusé ! Les chefs d'équipe ne gèrent pas d'autres leaders.");
                return;
              }
              setAdminTab('teamleaders');
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2.5 transition-all ${
              activeRole !== 'admin' ? 'opacity-40 cursor-not-allowed' : ''
            } ${
              adminTab === 'teamleaders' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:bg-slate-950/40 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4" />
              Chefs d'équipes
            </span>
            {activeRole !== 'admin' && <Lock className="w-3 h-3 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              if (activeRole !== 'admin') {
                triggerNotification("Accès refusé ! Seul l'Administrateur peut modifier les paramètres globaux.");
                return;
              }
              setAdminTab('config');
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2.5 transition-all ${
              activeRole !== 'admin' ? 'opacity-40 cursor-not-allowed' : ''
            } ${
              adminTab === 'config' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:bg-slate-950/40 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              Paramètres Système
            </span>
            {activeRole !== 'admin' && <Lock className="w-3 h-3 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              if (activeRole !== 'admin') {
                triggerNotification("Accès refusé ! Seul l'Administrateur peut configurer les rôles globaux.");
                return;
              }
              setAdminTab('roles');
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2.5 transition-all ${
              activeRole !== 'admin' ? 'opacity-40 cursor-not-allowed' : ''
            } ${
              adminTab === 'roles' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:bg-slate-950/40 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Shield className="w-4 h-4" />
              Gestion des Rôles
            </span>
            {activeRole !== 'admin' && <Lock className="w-3 h-3 text-slate-500" />}
          </button>

          {/* Connected state stats brief */}
          <div className="pt-4 mt-6 border-t border-slate-800 space-y-2.5 px-2">
            <span className="text-[9px] text-slate-500 block uppercase tracking-widest font-mono">Bilan Base de Données</span>
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>Livreurs rattachés :</span>
              <span className="text-white font-bold font-mono">{livreurs.length}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>Motos, Vélos, Autos :</span>
              <span className="text-white font-bold font-mono">{vehicles.length}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>Chefs d'équipe :</span>
              <span className="text-white font-bold font-mono">{teamLeaders.length}</span>
            </div>
          </div>
        </div>

        {/* Content Panel Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: LIVREURS */}
          {adminTab === 'livreurs' && (
            <div className="space-y-6">
              
              {/* Form segment as Modal popup */}
              {isLivreurModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
                    <button 
                      type="button"
                      onClick={() => setIsLivreurModalOpen(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold font-mono text-xl bg-slate-950 border border-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      &times;
                    </button>
                    
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
                        <UserPlus className="w-5 h-5" />
                        {editingLivreurId ? `📌 Modifier la fiche livreur : ${lName}` : '📝 Ajouter un nouveau livreur'}
                      </h3>
                      {editingLivreurId && (
                        <button 
                          type="button"
                          onClick={() => {
                            setEditingLivreurId(null);
                            setLName('');
                            setLPhone('');
                            setLEmail('');
                            setLStatus('active');
                            setLAssignedVehicleId('');
                            setIsLivreurModalOpen(false);
                          }} 
                          className="text-[10px] text-slate-400 hover:text-white font-mono uppercase bg-slate-950 border border-slate-800 px-2 py-1 rounded"
                        >
                          Annuler la modification
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleLivreurSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Nom Complet</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Koffi Mensah"
                          value={lName}
                          onChange={(e) => setLName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Numéro Téléphone</label>
                        <input
                          type="tel"
                          required
                          placeholder="Ex: +33 6 12 34 56 78"
                          value={lPhone}
                          onChange={(e) => setLPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Adresse Email</label>
                        <input
                          type="email"
                          required
                          placeholder="Ex: k.mensah@fleettrack.com"
                          value={lEmail}
                          onChange={(e) => setLEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">moyen de transport ciblé</label>
                        <select
                          value={lVehicleType}
                          onChange={(e) => setLVehicleType(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-semibold"
                        >
                          <option value="Moto">Moto 🏍️</option>
                          <option value="Vélo">Vélo / trottinette 🚲</option>
                          <option value="Voiture">Voiture / Berline 🚗</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Affectation Véhicule (Optionnel)</label>
                        <select
                          value={lAssignedVehicleId}
                          onChange={(e) => setLAssignedVehicleId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-indigo-400 outline-none focus:border-indigo-500 transition-all font-semibold"
                        >
                          <option value="">-- Aucun véhicule --</option>
                          {vehicles.map(v => (
                            <option key={v.id} value={v.id} disabled={v.driverName && v.driverName !== lName ? true : false}>
                              {v.id} - {v.name} ({v.type}) {v.driverName ? ' - Déjà assigné' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Responsable Hiérarchique</label>
                        {activeRole === 'lead' ? (
                          <div className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono font-bold">
                            {teamLeaders.find(t => t.id === selectedLeadIdForProfile)?.name || 'Votre Équipe'}
                          </div>
                        ) : (
                          <select
                            value={lTeamLeaderId}
                            onChange={(e) => setLTeamLeaderId(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-semibold"
                          >
                            {teamLeaders.map(tl => (
                              <option key={tl.id} value={tl.id}>
                                {tl.name} ({tl.department})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Statut de livraison</label>
                        <select
                          value={lStatus}
                          onChange={(e) => setLStatus(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-semibold"
                        >
                          <option value="active">Actif (autorisé à livrer) 🟢</option>
                          <option value="inactive">Inactif/Désactivé (bloqué) 🔴</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Identifiant Mobile (Login)</label>
                        <input
                          type="text"
                          placeholder="Ex: koffi"
                          value={lLogin}
                          onChange={(e) => setLLogin(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Mot de passe Mobile</label>
                        <input
                          type="password"
                          placeholder="Ex: secret123"
                          value={lPassword}
                          onChange={(e) => setLPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                        />
                      </div>

                      <div className="col-span-1 md:col-span-3 flex items-end pt-2">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
                        >
                          <PlusCircle className="w-4 h-4" />
                          {editingLivreurId ? 'Sauvegarder les modifications' : 'Enregistrer le nouveau Livreur'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Table / List views */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      Registre des Livreurs de la Flotte ({filteredLivreurs.length} trouvés)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLivreurId(null);
                        setLName('');
                        setLPhone('');
                        setLEmail('');
                        setLStatus('active');
                        setLAssignedVehicleId('');
                        setLLogin('');
                        setLPassword('');
                        setIsLivreurModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter un Livreur
                    </button>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64 pointer-events-auto">
                    <input
                      type="text"
                      placeholder="Rechercher nom, email oú tel..."
                      value={livreurSearch}
                      onChange={(e) => setLivreurSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500 placeholder:text-slate-600"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {activeRole === 'lead' && (
                  <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl text-[11px] text-emerald-400">
                    💡 <strong>Filtre Chef d'équipe actif :</strong> En tant que responsable, vous visualisez et administrez uniquement les livreurs affectés à votre zone ({teamLeaders.find(t => t.id === selectedLeadIdForProfile)?.name}).
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold h-9 bg-slate-950/50">
                        <th className="px-3">ID Code</th>
                        <th>Nom Complet</th>
                        <th>Coordonnées</th>
                        <th>Véhicule d'accès</th>
                        <th>Chef d'équipe rattaché</th>
                        <th>Statut</th>
                        <th className="text-right px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {filteredLivreurs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-6 text-slate-500 font-sans italic">
                            Aucun livreur répertorié pour cette requête.
                          </td>
                        </tr>
                      ) : (
                        filteredLivreurs.map(l => {
                          const assignedV = vehicles.find(v => v.id === l.assignedVehicleId);
                          const leader = teamLeaders.find(tl => tl.id === l.teamLeaderId);
                          return (
                            <tr key={l.id} className="h-12 hover:bg-slate-950/30 transition-all font-medium">
                              <td className="px-3 font-mono text-[10px] text-indigo-400 font-bold">{l.id}</td>
                              <td>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  {l.name}
                                  {l.vehicleType === 'Moto' && <span className="text-[10px]" title="Livreur Moto">🏍️</span>}
                                  {l.vehicleType === 'Vélo' && <span className="text-[10px]" title="Livreur Vélo">🚲</span>}
                                  {l.vehicleType === 'Tricycle' && <span className="text-[10px]" title="Livreur Tricycle">🛺</span>}
                                </div>
                                <span className="text-[9px] text-slate-500 block">Inscrit le : {l.joinDate}</span>
                              </td>
                              <td className="font-mono text-[10px] text-slate-400">
                                <div>{l.phone}</div>
                                <div className="text-[9px] text-slate-500">{l.email}</div>
                              </td>
                              <td>
                                {assignedV ? (
                                  <span className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 text-indigo-300 rounded font-mono text-[10px]">
                                    {assignedV.id} ({assignedV.name})
                                  </span>
                                ) : (
                                  <span className="text-slate-500 italic text-[10px]">Non affecté</span>
                                )}
                              </td>
                              <td>
                                {leader ? (
                                  <span className="text-slate-300 font-semibold">{leader.name}</span>
                                ) : (
                                  <span className="text-slate-500">—</span>
                                )}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={() => handleToggleLivreurStatus(l.id, l.status)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                                    l.status === 'active'
                                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/45 hover:bg-emerald-950'
                                      : 'bg-rose-950/80 text-rose-400 border border-rose-500/45 hover:bg-rose-950'
                                  }`}
                                  title="Cliquer pour changer le statut d'activité"
                                >
                                  {l.status === 'active' ? (
                                    <>
                                      <Power className="w-3 h-3 text-emerald-400" />
                                      Actif
                                    </>
                                  ) : (
                                    <>
                                      <PowerOff className="w-3 h-3 text-rose-400" />
                                      Inactif
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="text-right px-3 space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleStartEditLivreur(l)}
                                  className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded-lg border border-slate-800 font-bold transition-all"
                                >
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDeleteLivreur(l.id, l.name)}
                                  className="text-[10px] bg-red-950/40 hover:bg-red-950 text-red-400 px-2 py-1 rounded-lg border border-red-900/60 transition-all font-bold"
                                >
                                  Supprimer
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ADD VEHICLES */}
          {adminTab === 'vehicles' && (
            <div className="space-y-6">
              
              {/* Form specifically for adding vehicles of types moto, vélo, tricycles */}
              {isVehicleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
                    <button 
                      type="button"
                      onClick={() => setIsVehicleModalOpen(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold font-mono text-xl bg-slate-950 border border-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      &times;
                    </button>
                    
                    <div className="space-y-1 border-b border-slate-800 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
                        <Plus className="w-5 h-5 text-indigo-400" />
                        {editingVehicleId ? `📌 Modifier le Véhicule : ${vName}` : 'Enregistrement de Nouveaux Véhicules'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Saisissez les caractéristiques et spécifications techniques du véhicule électrique.
                      </p>
                    </div>

                    <form onSubmit={handleCreateVehicleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Modèle / Nom</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Scooter Yamaha NMAX / Vélo VanMoof"
                      value={vName}
                      onChange={(e) => setVName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Catégorie / Type de Véhicule</label>
                    <select
                      value={vType}
                      onChange={(e) => setVType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-semibold"
                    >
                      <option value="Vélo">Vélo Électrique 🚲</option>
                      <option value="Moto">Moto Électrique 🏍️</option>
                      <option value="Tricycle">Tricycle Électrique 🛺</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Immatriculation / Code ID</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: GH-904-AA ou vélo-001"
                      value={vLicense}
                      onChange={(e) => setVLicense(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Limiteur de vitesse (km/h)</label>
                    <input
                      type="number"
                      placeholder="Ex: 25 ou 45"
                      value={vMaxSpeed}
                      onChange={(e) => setVMaxSpeed(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Capacité Batterie (Wh)</label>
                    <input
                      type="number"
                      value={vBatteryCapacity}
                      onChange={(e) => setVBatteryCapacity(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Tension Électrique (V)</label>
                    <input
                      type="number"
                      value={vVoltage}
                      onChange={(e) => setVVoltage(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Intensité Électrique (A)</label>
                    <input
                      type="number"
                      value={vIntensity}
                      onChange={(e) => setVIntensity(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Puissance Disponible (Wh)</label>
                    <input
                      type="number"
                      value={vPowerAvailableWh}
                      onChange={(e) => setVPowerAvailableWh(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Puissance Consommée (Wh)</label>
                    <input
                      type="number"
                      value={vPowerConsumedWh}
                      onChange={(e) => setVPowerConsumedWh(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Puissance Reçue (Wh)</label>
                    <input
                      type="number"
                      value={vPowerReceivedWh}
                      onChange={(e) => setVPowerReceivedWh(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono font-semibold"
                    />
                  </div>

                      <div className="col-span-1 md:col-span-3 flex items-end justify-end pt-2 border-t border-slate-850 gap-2">
                        {editingVehicleId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingVehicleId(null);
                              setVName('');
                              setVLicense('');
                              setIsVehicleModalOpen(false);
                            }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                          >
                            Annuler
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 shadow"
                        >
                          <PlusCircle className="w-4 h-4" />
                          {editingVehicleId ? 'Sauvegarder les modifications' : 'Enregistrer le Véhicule'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* View current list categorized / searchable table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                        Registre des Véhicules de la Flotte ({filteredVehicles.length} trouvés)
                      </h3>
                      <p className="text-[10px] text-slate-500">Motos, vélos, tricycles et voitures de livraison</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingVehicleId(null);
                        setVName('');
                        setVLicense('');
                        setVMaxSpeed(25);
                        setVBatteryCapacity(500);
                        setVVoltage(36);
                        setVIntensity(15);
                        setVPowerConsumedWh(100);
                        setVPowerAvailableWh(400);
                        setVPowerReceivedWh(10);
                        setIsVehicleModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter un Véhicule
                    </button>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Rechercher immatriculation, nom..."
                      value={vehicleSearch}
                      onChange={(e) => setVehicleSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500 placeholder:text-slate-600"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold h-9">
                        <th className="px-3">ID Code</th>
                        <th>Modèle / Catégorie</th>
                        <th>Immatriculation</th>
                        <th>Limiteur Vitesse</th>
                        <th>Spécifications Électriques</th>
                        <th className="text-right px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredVehicles.map(v => (
                        <tr key={v.id} className="h-12 hover:bg-slate-950/20 font-medium">
                          <td className="px-3 font-mono text-[10px] text-indigo-400 font-bold">{v.id}</td>
                          <td className="font-bold text-white flex items-center gap-1.5 h-12">
                            {v.type === 'Tricycle' && <span>🛺</span>}
                            {v.type === 'Moto' && <span>🏍️</span>}
                            {v.type === 'Vélo' && <span>🚲</span>}
                            <span>{v.name}</span>
                          </td>
                          <td className="font-mono text-[11px] text-indigo-300 font-bold">{v.licensePlate}</td>
                          <td className="font-mono text-[11px] text-slate-300">{v.maxAllowedSpeed} km/h</td>
                          <td className="font-mono text-[10px] text-slate-400">
                            <span>Bat: {v.batteryCapacityWh} Wh | {v.voltage}V • {v.intensity}A</span>
                          </td>
                          <td className="text-right px-3 space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleStartEditVehicle(v)}
                              className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded-lg border border-slate-800 font-bold transition-all"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(v.id, v.name)}
                              className="text-[10px] bg-red-950/40 hover:bg-red-950 text-red-400 px-2 py-1 rounded-lg border border-red-900/60 transition-all font-bold"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredVehicles.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-slate-500 italic text-center py-4">Aucun véhicule ne correspond à votre recherche.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: TEAM LEADERS (Only for admin) */}
          {adminTab === 'teamleaders' && activeRole === 'admin' && (
            <div className="space-y-6">
              
              {/* Form specifically for adding team leaders as modal popup */}
              {isLeaderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-150">
                    <button 
                      type="button"
                      onClick={() => setIsLeaderModalOpen(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold font-mono text-xl bg-slate-950 border border-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      &times;
                    </button>
                    
                    <div className="space-y-1 border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        {editingLeaderId ? `📌 Modifier le Chef d'équipe : ${tlName}` : "📝 Ajouter un nouveau Chef d'équipe"}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Renseignez les informations de contact et d'accès pour ce responsable de zone.
                      </p>
                    </div>

                    <form onSubmit={handleTeamLeaderSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Nom Complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Benoît Legrand"
                      value={tlName}
                      onChange={(e) => setTlName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: b.legrand@fleettrack.com"
                      value={tlEmail}
                      onChange={(e) => setTlEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Téléphone</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +33 6 45 67 89 01"
                      value={tlPhone}
                      onChange={(e) => setTlPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Zone / Département</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Zone Urbaine Ouest"
                      value={tlDepartment}
                      onChange={(e) => setTlDepartment(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Statut de Responsabilité</label>
                    <select
                      value={tlStatus}
                      onChange={(e) => setTlStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-semibold"
                    >
                      <option value="active">Actif (gère ses équipes) 🟢</option>
                      <option value="inactive">Désactivé (retirer les droits de gestion) 🔴</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Identifiant Flotte (Login)</label>
                    <input
                      type="text"
                      placeholder="Ex: alice"
                      value={tlLogin}
                      onChange={(e) => setTlLogin(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Mot de passe Flotte</label>
                    <input
                      type="password"
                      placeholder="Ex: pass123"
                      value={tlPassword}
                      onChange={(e) => setTlPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-end pt-2 gap-2 justify-end">
                    {editingLeaderId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLeaderId(null);
                          setTlName('');
                          setTlEmail('');
                          setTlPhone('');
                          setIsLeaderModalOpen(false);
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                      >
                        Annuler
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
                    >
                      <PlusCircle className="w-4 h-4" />
                      {editingLeaderId ? 'Sauvegarder les modifications' : 'Enregistrer le Chef d\'équipe'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

              {/* Leaders table list */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Registre des Chefs d'équipe</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLeaderId(null);
                        setTlName('');
                        setTlEmail('');
                        setTlPhone('');
                        setTlStatus('active');
                        setTlDepartment('Livraison Zone Nord');
                        setTlLogin('');
                        setTlPassword('');
                        setIsLeaderModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter un Chef d'équipe
                    </button>
                  </div>
                  
                  <div className="relative w-48">
                    <input
                      type="text"
                      placeholder="Rechercher leader..."
                      value={leaderSearch}
                      onChange={(e) => setLeaderSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1 text-xs text-white outline-none focus:border-indigo-500 placeholder:text-slate-600"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold h-9">
                        <th className="px-3">ID Code</th>
                        <th>Nom Complet</th>
                        <th>Zone/Département</th>
                        <th>Livreurs sous supervision</th>
                        <th>Coordonnées</th>
                        <th>Statut</th>
                        <th className="text-right px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredLeaders.map(tl => {
                        const subordinateCount = livreurs.filter(l => l.teamLeaderId === tl.id).length;
                        return (
                          <tr key={tl.id} className="h-12 hover:bg-slate-950/20 font-medium">
                            <td className="px-3 font-mono text-[10px] text-indigo-400 font-bold">{tl.id}</td>
                            <td className="font-bold text-white">{tl.name}</td>
                            <td className="text-slate-300 font-semibold">{tl.department}</td>
                            <td>
                              <span className="px-2 py-0.5 bg-slate-950 text-indigo-400 font-mono font-bold rounded border border-slate-800">
                                {subordinateCount} livreur(s)
                              </span>
                            </td>
                            <td className="font-mono text-[10px] text-slate-400">
                              <div>{tl.phone}</div>
                              <div className="text-[9px] text-slate-500">{tl.email}</div>
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleToggleLeaderStatus(tl.id, tl.status)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                                  tl.status === 'active'
                                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                                }`}
                              >
                                {tl.status === 'active' ? 'Actif' : 'Bloqué'}
                              </button>
                            </td>
                            <td className="text-right px-3 whitespace-nowrap">
                              <button
                                onClick={() => handleStartEditLeader(tl)}
                                className="text-[10px] bg-slate-950 hover:bg-slate-850 text-slate-300 px-2 py-1 rounded-lg border border-slate-800 font-bold transition-all"
                              >
                                Modifier
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

          {/* TAB 4: SYSTEM CONFIGURATION (Only for Admin) */}
          {adminTab === 'config' && activeRole === 'admin' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual Customization Panel */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Identité Visuelle Du Système & Paramètres Globaux
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Personnalisez le nom de marque, le symbole d'en-tête et la devise monétaire par défaut de l'interface.
                    </p>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Nom de l'application :</span>
                        <span className="text-white font-bold">{sysName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Logo / Icône :</span>
                        <span className="text-indigo-400 font-semibold font-mono">
                          {sysLogo === 'CarIcon' && 'Standard (🚗)'}
                          {sysLogo === 'BikeIcon' && 'Livraison Rapide (🚲)'}
                          {sysLogo === 'LogisticsEmblem' && 'Logistique Pro (🛡️)'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Devise par défaut :</span>
                        <span className="text-emerald-400 font-mono font-bold">{sysCurrency}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setIsConfigModalOpen(true)}
                    className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Sliders className="w-4 h-4" />
                    Modifier l'Identité Visuelle
                  </button>
                </div>

                {/* Payment Methods Configuration Panel */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    Modes de Paiement Système (Passerelles & Mobiles)
                  </h3>

                  <p className="text-[11px] text-slate-400 leading-normal">
                    Activez ou désactivez les moyens de paiement autorisés lors du dispatching des courses et des livraisons de type e-commerce ou colis express.
                  </p>

                  <div className="space-y-3.5 pt-2 border-t border-slate-850">
                    
                    {systemParams.paymentMethods.map(method => (
                      <div 
                        key={method.id} 
                        className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-indigo-400">
                            {method.type === 'gateway' && <CreditCard className="w-4 h-4" />}
                            {method.type === 'mobile_money' && <Smartphone className="w-4 h-4" />}
                            {method.type === 'cash' && <Coins className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">{method.name}</span>
                            <span className="text-[9px] text-slate-500 capitalize tracking-wide block font-semibold">
                              Canal : {method.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTogglePaymentMethod(method.id)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            method.enabled
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 hover:bg-emerald-950'
                              : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-400'
                          }`}
                        >
                          {method.enabled ? 'Activé' : 'Désactivé'}
                        </button>
                      </div>
                    ))}

                  </div>
                </div>

              </div>

              {/* Côte d'Ivoire Mobile Money Payment APIs Gateway Configurations */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
                      <Smartphone className="w-5 h-5 text-indigo-400" />
                      Configuration des APIs Mobile Money Côte d'Ivoire (Orange, MTN, Moov, Wave)
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Paramétrez les clés secrètes, identifiants marchands et URLs d'accès pour les passerelles de paiement de Côte d'Ivoire.
                    </p>
                  </div>
                </div>

                {mobileMoneyApis ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Orange Money */}
                    <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <span className="text-xs font-bold text-orange-500 flex items-center gap-1.5">
                          🍊 Orange Money Côte d'Ivoire
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={mobileMoneyApis.orange.enabled}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              orange: { ...prev.orange, enabled: e.target.checked }
                            }))}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Merchant ID (Identifiant Marchand)</label>
                          <input 
                            type="text"
                            value={mobileMoneyApis.orange.merchantId}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              orange: { ...prev.orange, merchantId: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">API Secret Key (Clé API secrète)</label>
                          <input 
                            type="password"
                            value={mobileMoneyApis.orange.apiKey}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              orange: { ...prev.orange, apiKey: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Endpoint Gateway URL</label>
                          <input 
                            type="text"
                            value={mobileMoneyApis.orange.url}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              orange: { ...prev.orange, url: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* MTN Mobile Money */}
                    <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          🟡 MTN Mobile Money (MoMo)
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={mobileMoneyApis.mtn.enabled}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              mtn: { ...prev.mtn, enabled: e.target.checked }
                            }))}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                        </label>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Merchant ID (Identifiant Marchand)</label>
                          <input 
                            type="text"
                            value={mobileMoneyApis.mtn.merchantId}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              mtn: { ...prev.mtn, merchantId: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">API Secret Key (Clé API secrète)</label>
                          <input 
                            type="password"
                            value={mobileMoneyApis.mtn.apiKey}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              mtn: { ...prev.mtn, apiKey: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Endpoint Gateway URL</label>
                          <input 
                            type="text"
                            value={mobileMoneyApis.mtn.url}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              mtn: { ...prev.mtn, url: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Moov Money (Flooz) */}
                    <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                          🟢 Moov Money (Flooz CI)
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={mobileMoneyApis.moov.enabled}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              moov: { ...prev.moov, enabled: e.target.checked }
                            }))}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Merchant ID (Identifiant Marchand)</label>
                          <input 
                            type="text"
                            value={mobileMoneyApis.moov.merchantId}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              moov: { ...prev.moov, merchantId: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">API Secret Key (Clé API secrète)</label>
                          <input 
                            type="password"
                            value={mobileMoneyApis.moov.apiKey}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              moov: { ...prev.moov, apiKey: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Endpoint Gateway URL</label>
                          <input 
                            type="text"
                            value={mobileMoneyApis.moov.url}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              moov: { ...prev.moov, url: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Wave Money */}
                    <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <span className="text-xs font-bold text-cyan-500 flex items-center gap-1.5">
                          🌊 Wave Côte d'Ivoire
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={mobileMoneyApis.wave.enabled}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              wave: { ...prev.wave, enabled: e.target.checked }
                            }))}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Merchant ID (Identifiant Marchand)</label>
                          <input 
                            type="text"
                            value={mobileMoneyApis.wave.merchantId}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              wave: { ...prev.wave, merchantId: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">API Secret Key (Clé API secrète)</label>
                          <input 
                            type="password"
                            value={mobileMoneyApis.wave.apiKey}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              wave: { ...prev.wave, apiKey: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Endpoint Gateway URL</label>
                          <input 
                            type="text"
                            value={mobileMoneyApis.wave.url}
                            onChange={(e) => setMobileMoneyApis((prev: any) => ({
                              ...prev,
                              wave: { ...prev.wave, url: e.target.value }
                            }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-500 italic py-4">
                    Les modules d'APIs de paiement sont chargés depuis le portail central.
                  </div>
                )}
              </div>

              {/* GPS API and Google Maps API Configurations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800/60 pt-6">
                
                {/* GPS Provider Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
                      <Globe className="w-4 h-4" />
                      Configuration de l'API Fournisseur GPS
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Définissez les clés d'accès au serveur GPS externe de télémétrie des véhicules.
                    </p>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Fournisseur ID :</span>
                        <span className="text-white font-mono font-bold truncate max-w-[150px]">{gpsProviderId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Clé Secrète :</span>
                        <span className="text-slate-400 font-mono">••••••••••••{gpsAppKey.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">API Endpoint :</span>
                        <span className="text-indigo-400 font-mono text-[10px] truncate max-w-[150px]" title={gpsProviderUrl}>{gpsProviderUrl}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsGpsModalOpen(true)}
                    className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-4 h-4" />
                    Configurer l'API GPS
                  </button>
                </div>

                {/* Google Maps Configuration Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
                      <Map className="w-4 h-4" />
                      Cartographie & Géocodage Google Maps
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Configurez le SDK JavaScript Google Maps et le moteur de géocodage inverse.
                    </p>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Clé API Maps :</span>
                        <span className="text-slate-400 font-mono">••••••••••••{mapsApiKey.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Centre Carte :</span>
                        <span className="text-white font-mono">{Number(mapsCenterLat).toFixed(4)}, {Number(mapsCenterLng).toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Géocodage :</span>
                        <span className="text-emerald-400 font-semibold text-[10px] uppercase">{geocodingProvider.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMapsModalOpen(true)}
                    className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Map className="w-4 h-4" />
                    Configurer Google Maps
                  </button>
                </div>

              </div>
              
              {/* Informative Help banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-200 block">Sûreté et Journalisation Technique</span>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    La modification de ces variables est immédiatement propagées sur les terminaux clients via le canal de temps réel. Tout ajout de livreur ou de moyen de paiement est tracé dans les logs applicatifs conformément aux directives ISO-27001.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: ROLES MANAGEMENT (Only for Admin) */}
          {adminTab === 'roles' && activeRole === 'admin' && (
            <div className="space-y-6">
              
              {/* Role Creation/Modification form */}
              {isRoleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-150">
                    <button 
                      type="button"
                      onClick={() => setIsRoleModalOpen(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold font-mono text-xl bg-slate-950 border border-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      &times;
                    </button>
                    
                    <div className="space-y-1 border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
                        <Shield className="w-4 h-4" />
                        {editingRoleId ? `📌 Modifier les droits du rôle : ${newRoleName}` : '📝 Créer un nouveau Rôle & Autorisations'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Configurez les autorisations d'accès aux différentes ressources et fonctionnalités de l'application.
                      </p>
                    </div>

                    <form onSubmit={handleRoleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Nom du Rôle</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Contrôleur de Flotte"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Code Système unique</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: controleur"
                      value={newRoleCode}
                      onChange={(e) => setNewRoleCode(e.target.value)}
                      disabled={editingRoleId ? ['admin', 'lead', 'driver'].includes(newRoleCode) : false}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Description / Fonctions</label>
                    <input
                      type="text"
                      placeholder="Ex: Peut auditer les comptes..."
                      value={newRoleDesc}
                      onChange={(e) => setNewRoleDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Checkboxes for permissions configuration */}
                  <div className="col-span-1 md:col-span-3 bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col md:flex-row gap-6">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="perm-add"
                        checked={newRoleCanAdd}
                        onChange={(e) => setNewRoleCanAdd(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-800 bg-slate-900"
                      />
                      <label htmlFor="perm-add" className="text-xs text-slate-300 font-medium cursor-pointer">
                        Autoriser l'<strong>Ajout</strong> de ressources (Livreurs, Véhicules, etc.)
                      </label>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="perm-edit"
                        checked={newRoleCanEdit}
                        onChange={(e) => setNewRoleCanEdit(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-800 bg-slate-900"
                      />
                      <label htmlFor="perm-edit" className="text-xs text-slate-300 font-medium cursor-pointer">
                        Autoriser la <strong>Modification</strong> (Édition des profils, véhicules)
                      </label>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="perm-delete"
                        checked={newRoleCanDelete}
                        onChange={(e) => setNewRoleCanDelete(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-800 bg-slate-900"
                      />
                      <label htmlFor="perm-delete" className="text-xs text-slate-300 font-medium cursor-pointer">
                        Autoriser la <strong>Suppression</strong> (Dossiers, véhicules)
                      </label>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3 flex items-end justify-end pt-2 gap-2">
                    {editingRoleId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRoleId(null);
                          setNewRoleName('');
                          setNewRoleCode('');
                          setNewRoleCanAdd(true);
                          setNewRoleCanEdit(true);
                          setNewRoleCanDelete(false);
                          setNewRoleDesc('');
                          setIsRoleModalOpen(false);
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                      >
                        Annuler
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 shadow"
                    >
                      <PlusCircle className="w-4 h-4" />
                      {editingRoleId ? 'Enregistrer les Droits' : 'Créer et configurer le Rôle'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

              {/* Roles list register with details */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">Registre des Rôles Configureux du Système</span>
                    <p className="text-[10px] text-slate-500">Gérez les rôles personnalisés et leurs permissions globales</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRoleId(null);
                      setNewRoleName('');
                      setNewRoleCode('');
                      setNewRoleCanAdd(true);
                      setNewRoleCanEdit(true);
                      setNewRoleCanDelete(false);
                      setNewRoleDesc('');
                      setIsRoleModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter un Rôle
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold h-9">
                        <th className="px-3">Code Rôle</th>
                        <th>Nom d'affichage</th>
                        <th>Description</th>
                        <th className="text-center">Droit : Ajout</th>
                        <th className="text-center">Droit : Modification</th>
                        <th className="text-center">Droit : Suppression</th>
                        <th className="text-right px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {customRoles.map(role => (
                        <tr key={role.id} className="h-12 hover:bg-slate-950/20 font-medium">
                          <td className="px-3 font-mono text-[10px] text-indigo-400 font-bold">{role.code}</td>
                          <td className="font-bold text-white">{role.name}</td>
                          <td className="text-slate-400 text-[11px] max-w-xs truncate" title={role.description}>{role.description}</td>
                          <td className="text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${role.canAdd ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                              {role.canAdd ? 'OUI' : 'NON'}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${role.canEdit ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                              {role.canEdit ? 'OUI' : 'NON'}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${role.canDelete ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                              {role.canDelete ? 'OUI' : 'NON'}
                            </span>
                          </td>
                          <td className="text-right px-3 space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => handleStartEditRole(role)}
                              className="text-[10px] bg-slate-950 hover:bg-slate-850 text-slate-300 px-2 py-1 rounded border border-slate-800 font-bold transition-all"
                            >
                              Configurer
                            </button>
                            {!['ROLE-1', 'ROLE-2', 'ROLE-3'].includes(role.id) && (
                              <button
                                onClick={() => handleDeleteRole(role.id, role.name)}
                                className="text-[10px] bg-red-950/40 hover:bg-red-950 text-red-400 px-2 py-1 rounded border border-red-900/60 transition-all font-bold"
                              >
                                Supprimer
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* MODAL: CONFIGURATION VISUELLE */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Modifier l'Identité Visuelle
              </h3>
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold bg-slate-950 border border-slate-850 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSystemConfig} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Nom de l'Application</label>
                <input
                  type="text"
                  required
                  value={sysName}
                  onChange={(e) => setSysName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Emblème / Logo Système</label>
                <select
                  value={sysLogo}
                  onChange={(e) => setSysLogo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-indigo-400 outline-none focus:border-indigo-500 font-semibold"
                >
                  <option value="CarIcon">Standard (Icône Flotte 🚗)</option>
                  <option value="BikeIcon">Livraison Rapide (Vélo Durable 🚲)</option>
                  <option value="LogisticsEmblem">Logistique Pro (Logo Bouclier 🛡️)</option>
                </select>
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Devise de Facturation du Système</label>
                <input
                  type="text"
                  required
                  value={sysCurrency}
                  onChange={(e) => setSysCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="flex-1 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-850 rounded-xl text-xs font-bold transition-all uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIGURATION GPS */}
      {isGpsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                Configurer l'API GPS
              </h3>
              <button
                type="button"
                onClick={() => setIsGpsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold bg-slate-950 border border-slate-850 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSystemConfig} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">ID Fournisseur GPS</label>
                <input
                  type="text"
                  required
                  value={gpsProviderId}
                  onChange={(e) => setGpsProviderId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono font-bold"
                  placeholder="Ex: gps-provider-v4"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Clé d'Application (Key App)</label>
                <input
                  type="text"
                  required
                  value={gpsAppKey}
                  onChange={(e) => setGpsAppKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                  placeholder="Ex: app_key_live_abc123"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">URL du Fournisseur</label>
                <input
                  type="url"
                  required
                  value={gpsProviderUrl}
                  onChange={(e) => setGpsProviderUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                  placeholder="Ex: https://api.gps-provider.com/v1"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGpsModalOpen(false)}
                  className="flex-1 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-850 rounded-xl text-xs font-bold transition-all uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  Appliquer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIGURATION GOOGLE MAPS */}
      {isMapsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Map className="w-4 h-4 text-indigo-400" />
                Configurer Google Maps
              </h3>
              <button
                type="button"
                onClick={() => setIsMapsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold bg-slate-950 border border-slate-850 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSystemConfig} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Clé API Google Maps</label>
                <input
                  type="text"
                  required
                  value={mapsApiKey}
                  onChange={(e) => setMapsApiKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                  placeholder="Ex: AIzaSyA1..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Latitude Centre</label>
                  <input
                    type="text"
                    required
                    value={mapsCenterLat}
                    onChange={(e) => setMapsCenterLat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Longitude Centre</label>
                  <input
                    type="text"
                    required
                    value={mapsCenterLng}
                    onChange={(e) => setMapsCenterLng(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Moteur de Géocodage Actif</label>
                <select
                  value={geocodingProvider}
                  onChange={(e) => setGeocodingProvider(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-indigo-400 outline-none focus:border-indigo-500 font-semibold"
                >
                  <option value="google_geocoding">Google Maps Reverse Geocoding 📍</option>
                  <option value="openstreetmap">OpenStreetMap Nominatim 🗺️</option>
                  <option value="mapbox">Mapbox Geocoding Service 🌐</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMapsModalOpen(false)}
                  className="flex-1 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-850 rounded-xl text-xs font-bold transition-all uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  Appliquer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
