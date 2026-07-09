import React, { useState } from 'react';
import { Database, MapPin, Radio, Copy, Check, Server, ShieldCheck, Cpu, ArrowRight, Layers, HelpCircle, HardDrive } from 'lucide-react';

interface GeocodeResult {
  address: string;
  lat: number;
  lng: number;
  type: string;
  provider: string;
}

export default function ArchitectureTab() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Geocoding Interactive Simulator State
  const [searchQuery, setSearchQuery] = useState('');
  const [geocodeResult, setGeocodeResult] = useState<GeocodeResult | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  // Realtime Simulation selection
  const [activeRealtimeMethod, setActiveRealtimeMethod] = useState<'pusher' | 'custom-ws'>('pusher');

  const showCopyAlert = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Simulating a geocoding service lookup (Map Provider interface)
  const handleSimulateGeocode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGeocoding(true);
    setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();
      let result: GeocodeResult = {
        address: `${searchQuery}, Coordonnées géolocalisées avec succès`,
        lat: 48.8566,
        lng: 2.3522,
        type: 'Adresse Industrielle',
        provider: 'OpenStreetMap (Nominatim API via Leaflet Provider)'
      };

      if (query.includes('paris')) {
        result = {
          address: '75008 Paris, France (Siège Social)',
          lat: 48.8566,
          lng: 2.3522,
          type: 'Zone Administrative',
          provider: 'OpenStreetMap MapBox Provider v3'
        };
      } else if (query.includes('lyon')) {
        result = {
          address: '69002 Lyon, France (Port Edouard Herriot)',
          lat: 45.7640,
          lng: 4.8357,
          type: 'Zone Portuaire / Dépôt de Flotte',
          provider: 'Google Geocoding API Enterprise'
        };
      } else if (query.includes('marseille')) {
        result = {
          address: '13001 Marseille, France (Terminus Logistique)',
          lat: 43.2965,
          lng: 5.3698,
          type: 'Zone Portuaire / Logistique',
          provider: 'Google Geocoding API Enterprise'
        };
      } else if (query.includes('abidjan')) {
        result = {
          address: 'Zone 4, Boulevard de Marseille, Abidjan, Côte d\'Ivoire',
          lat: 5.3600,
          lng: -3.9900,
          type: 'Avenue Principale / Hub ouest-africain',
          provider: 'OpenStreetMap Nominatim Map Provider'
        };
      } else {
        // Random coordinates
        const randLat = Number((43 + Math.random() * 5).toFixed(4));
        const randLng = Number((1 + Math.random() * 5).toFixed(4));
        result = {
          address: `${searchQuery} (Zone détectée par triangulation GPS)`,
          lat: randLat,
          lng: randLng,
          type: 'Recherche d\'Adresse',
          provider: 'OpenStreetMap Leaflet Engine'
        };
      }

      setGeocodeResult(result);
      setIsGeocoding(false);
    }, 800);
  };

  const mySqlSchemaCode = `// ------------------------------------------------------------------
// FILE: database/migrations/2026_06_07_000001_create_fleet_tracking_schema.php
// Laravel Migration code matching standard MySQL InnoDB tables
// ------------------------------------------------------------------
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

class CreateFleetTrackingSchema extends Migration
{
    public function up()
    {
        // 1. Vehicles Table
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id(); // BIGINT AUTO_INCREMENT PRIMARY KEY
            $table->string('name', 100);
            $table->string('license_plate', 30)->unique();
            $table->enum('type', ['Berline', 'SUV', 'Poids Lourd', 'Utilitaire']);
            $table->double('current_speed')->default(0.0);
            $table->double('max_allowed_speed')->default(90.0);
            $table->enum('status', ['active', 'idle', 'maintenance'])->default('idle');
            $table->integer('fuel_level')->default(100); // 0 to 100%
            $table->integer('fuel_capacity'); // Liters
            $table->double('average_consumption'); // L/100km
            $table->boolean('is_locked')->default(true);
            $table->decimal('lat', 10, 7); // Latitude coordinate GPS
            $table->decimal('lng', 10, 7); // Longitude coordinate GPS
            $table->integer('angle')->default(0); // Heading orientation
            $table->string('driver_name', 100)->nullable();
            $table->unsignedBigInteger('mileage')->default(0); // in km
            $table->timestamps(); // created_at, updated_at
        });

        // 2. Trips History Table (for Carbon/Fuel reporting)
        Schema::create('trips_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('vehicles')->onDelete('cascade');
            $table->string('route_name');
            $table->dateTime('started_at');
            $table->double('distance_km');
            $table->integer('duration_minutes');
            $table->double('fuel_consumed_liters');
            $table->double('co2_emissions_kg');
            $table->json('gps_path_data'); // Coordinates polyline records
            $table->timestamps();
        });

        // 3. Alerts Archive Table
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->onDelete('set null');
            $table->enum('alert_type', ['speeding', 'door_unlocked', 'low_fuel', 'maintenance']);
            $table->string('message', 255);
            $table->boolean('is_read')->default(false);
            $table->double('speed_exceeded')->nullable();
            $table->timestamps();
        });

        // 4. Bookings & Reservations Table (Order management workflow)
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('driver_name', 100);
            $table->string('vehicle_type', 50);
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->onDelete('set null');
            $table->date('start_date');
            $table->date('end_date');
            $table->text('purpose');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('alerts');
        Schema::dropIfExists('trips_history');
        Schema::dropIfExists('vehicles');
    }
}`;

  const laravelEchoCode = `// Laravel Echo configuration under JS Client
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Scenario A : Integration with Pusher Channels API (Managed Cloud)
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    forceTLS: true
});

// Scenario B : Integration with Standalone WebSocket Server (Soketi / custom Node)
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'app-key',
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
});

// Listening to Vehicle GPS movement channel in real-time :
window.Echo.private('fleet.gps')
    .listen('VehicleCoordinatesUpdated', (e) => {
        console.log("Nouveau point GPS véhicule " + e.vehicleId, e.lat, e.lng);
        // Dispatch coordinates to React Fleet Map!
    });`;

  return (
    <div id="architecture-spec-panel" className="space-y-6">
      
      {/* Informative Header card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Dossier Technique Architecture & Modèle de Production (Laravel / MySQL / WebSocket)
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Cette section détaille de manière complète comment industrialiser ce tableau de bord. Elle est structurée pour
          répondre à vos besoins d'intégration de <strong>composants de géocodage</strong>, de mise en œuvre d'un <strong>schéma relationnel InnoDB robuste</strong> et d'orientation pour la gestion du <strong>temps réel (Pusher Cloud vs Serveur WebSocket dédié)</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: Geocoding & Map Providers (nominatim / dynamic) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-950 text-indigo-400 rounded-lg">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-200">1. Géocodage & Map Providers</h3>
              <p className="text-[10px] text-slate-500">Intégration de reverse-geocoding et affichage cartographique</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/60 space-y-3 text-xs">
            <p className="text-slate-300 leading-normal">
              <strong>Architecture recommandée :</strong> Utilisation de l'API REST de services de cartographie avec <strong>Leaflet</strong> comme moteur d'affichage carte et l'un des fournisseurs ci-dessous :
            </p>
            
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold block mt-0.5">•</span>
                <span><strong>OpenStreetMap (Nominatim API via Leaflet)</strong> : Solution de géocodage gratuite et open-source pour les faibles volumes de requêtes.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold block mt-0.5">•</span>
                <span><strong>MapBox / MapTiler API</strong> : Performances remarquables, tuiles vectorielles ultra-fluides, 100 000 requêtes de géocodage gratuites par mois.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold block mt-0.5">•</span>
                <span><strong>Google Maps Geocoding API</strong> : Précision optimale dans l'interprétation des adresses complexes ou mal orthographiées avec un modèle payant (crédit mensuel de 200$).</span>
              </li>
            </ul>
          </div>

          {/* Practical Geocoding interactive playground */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Simulateur de Géocodage Client</span>
            
            <form onSubmit={handleSimulateGeocode} className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Paris, Lyon, Marseille, Abidjan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 placeholder:text-slate-600"
              />
              <button
                type="submit"
                disabled={isGeocoding}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1 shrink-0"
              >
                {isGeocoding ? 'Recherche...' : 'Géocoder'}
              </button>
            </form>

            {geocodeResult && (
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2 animate-fade-in text-[11px]">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500 uppercase">
                  <span>Fournisseur Carto</span>
                  <span className="text-green-400">{geocodeResult.provider}</span>
                </div>
                
                <p className="text-slate-200 leading-snug">
                  <strong>Adresse résolue :</strong> <br />
                  <span className="text-slate-400">{geocodeResult.address}</span>
                </p>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950 p-1.5 rounded text-indigo-400">
                  <div>Latitude: {geocodeResult.lat}</div>
                  <div>Longitude: {geocodeResult.lng}</div>
                </div>

                <div className="text-[10px] text-slate-500 italic block">
                  ✓ Type de zone : {geocodeResult.type} (Prêt à être transmis à Leaflet)
                </div>
              </div>
            )}
            
            <span className="text-[9px] text-slate-500 block leading-snug">
              Saisissez l'une des villes d'exemple pour obtenir des géocodages d'adresses opérationnels ou tout autre texte libre pour simuler le fallback GPS.
            </span>
          </div>
        </div>

        {/* Module 2: Pusher vs WebSocket choices */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-950 text-indigo-400 rounded-lg">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-200">2. Pusher vs Serveur WebSocket Dédié</h3>
              <p className="text-[10px] text-slate-500">Faut-il souscrire à Pusher ou héberger ses WebSockets ?</p>
            </div>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveRealtimeMethod('pusher')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                activeRealtimeMethod === 'pusher' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Option A : Pusher (Cloud SaaS)
            </button>
            <button
              onClick={() => setActiveRealtimeMethod('custom-ws')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                activeRealtimeMethod === 'custom-ws' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Option B : Soketi / Laravel WebSockets
            </button>
          </div>

          {activeRealtimeMethod === 'pusher' ? (
            <div className="p-4 bg-slate-950 rounded-xl space-y-3 text-[11px] leading-relaxed">
              <p className="text-slate-300 font-bold">🎯 Pusher Channels (SaaS Managé)</p>
              
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex gap-1.5 items-start">
                  <span className="text-emerald-400 font-bold font-mono">✔ Avant. :</span>
                  <span>Installation immédiate sans gestion d'infra ni maintenance de ports ou proxies Nginx. Évolutivité mondiale gérée de base.</span>
                </li>
                <li className="flex gap-1.5 items-start">
                  <span className="text-red-400 font-bold font-mono">✖ Inconv. :</span>
                  <span>Coût mensuel proportionnel au nombre de connexions simultanées et de messages par jour (limité à 200 000 msgs/jour en offre gratuite).</span>
                </li>
                <li className="flex gap-1.5 items-start">
                  <span className="text-indigo-400 font-bold font-mono">⌛ Latence :</span>
                  <span>~ 20ms à 35ms (dépendant de la région AWS sélectionnée).</span>
                </li>
              </ul>

              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between font-mono">
                <span className="text-slate-400">Statut de test Ping :</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  ~ 28ms (Cluster eu-west3)
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-950 rounded-xl space-y-3 text-[11px] leading-relaxed">
              <p className="text-slate-300 font-bold">⚙ Soketi / Server WebSockets Autonome (On-Premise)</p>

              <ul className="space-y-1.5 text-slate-400">
                <li className="flex gap-1.5 items-start">
                  <span className="text-emerald-400 font-bold font-mono">✔ Avant. :</span>
                  <span>100% gratuit, open-source et sans limite de messages. Parfaite sécurité (les secrets GPS transitent uniquement sur vos propres serveurs).</span>
                </li>
                <li className="flex gap-1.5 items-start">
                  <span className="text-red-400 font-bold font-mono">✖ Inconv. :</span>
                  <span>Nécessite de configurer un proxy inverse (Nginx, Certificats SSL/WSS, orchestration de processus avec Supervisor ou Docker).</span>
                </li>
                <li className="flex gap-1.5 items-start">
                  <span className="text-indigo-400 font-bold font-mono">⌛ Latence :</span>
                  <span>~ 3ms à 7ms (vitesse hyperlocale car hébergé directement près de la base).</span>
                </li>
              </ul>

              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between font-mono">
                <span className="text-slate-400">Statut de test Ping :</span>
                <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  ~ 4ms (Local Engine)
                </span>
              </div>
            </div>
          )}

          <div className="bg-slate-950 p-2 rounded-xl text-[10px] text-slate-500 font-sans border border-slate-850">
            💡 <strong>Ressource développeur :</strong> Tant pour Pusher que pour Soketi, la syntaxe cliente en Javascript reste <strong>100% identique</strong> grâce au pilote standard <code>laravel-echo</code> !
          </div>
        </div>

      </div>

      {/* Full Database Schema view & copyable code blocks */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-950 text-indigo-400 rounded-lg">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-200">3. Modèle de Données MySQL & Migrations Laravel</h3>
              <p className="text-[10px] text-slate-500">Structure relationnelle pour stocker la flotte et les trajectoires GPS</p>
            </div>
          </div>

          <button
            onClick={() => showCopyAlert('mysql', mySqlSchemaCode)}
            className="px-3 py-1 bg-slate-950 hover:bg-slate-850 hover:text-white text-slate-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-800 transition-all font-mono"
          >
            {copiedText === 'mysql' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copié !
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copier PHP Migration
              </>
            )}
          </button>
        </div>

        {/* ER Diagram Representation */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Schéma des Relations (Moteur MySQL InnoDB)</span>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-1">
              <span className="font-bold text-slate-200 block">vehicles</span>
              <span className="text-[9px] text-slate-500 block">Table Maître (Id, plaque, position, lock_status, mileage)</span>
            </div>
            
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-1">
              <span className="font-bold text-slate-200 block">trips_history</span>
              <span className="text-[9px] text-indigo-400 block">1:N avec vehicles</span>
              <span className="text-[9px] text-slate-500 block">Données de conduite (co2_emissions, gps_path_data JSON)</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-1">
              <span className="font-bold text-slate-200 block">alerts</span>
              <span className="text-[9px] text-indigo-400 block">1:N avec vehicles</span>
              <span className="text-[9px] text-slate-500 block">Journal d'insécurité (speed_limit, lock_status)</span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-1">
              <span className="font-bold text-slate-200 block">bookings</span>
              <span className="text-[9px] text-slate-500 block">Demandes d'accès conducteurs avec processus de validation</span>
            </div>
          </div>
        </div>

        {/* Code View for Laravel PHP Code Migration */}
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80">
          <div className="bg-slate-900/80 px-4 py-2 text-[10px] font-mono text-indigo-400 border-b border-slate-850 flex items-center justify-between">
            <span>Php Migration Laravel</span>
            <span className="text-slate-500">Modifications 2026-06-07 (Dossier Production)</span>
          </div>
          <pre className="p-4 overflow-x-auto text-left text-[11px] font-mono text-slate-300 leading-relaxed max-h-96 select-text whitespace-pre">
            {mySqlSchemaCode}
          </pre>
        </div>

      </div>

      {/* Code View for Echo Client Server */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-950 text-indigo-400 rounded-lg">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-200 font-sans">4. Implémentation du Client Laravel Echo & Websockets</h3>
              <p className="text-[10px] text-slate-500">Dispatch client des coordonnées et des statuts de verrous</p>
            </div>
          </div>

          <button
            onClick={() => showCopyAlert('echo', laravelEchoCode)}
            className="px-3 py-1 bg-slate-950 hover:bg-slate-850 hover:text-white text-slate-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-800 transition-all font-mono"
          >
            {copiedText === 'echo' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copié !
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copier Client JS
              </>
            )}
          </button>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80">
          <div className="bg-slate-900/80 px-4 py-2 text-[10px] font-mono text-indigo-400 border-b border-slate-850 flex items-center justify-between">
            <span>JS Client Implementation (React SPA / Laravel Echo)</span>
            <span className="text-slate-500">Realtime GPS Sync Client</span>
          </div>
          <pre className="p-4 overflow-x-auto text-left text-[11px] font-mono text-slate-300 leading-relaxed max-h-64 select-text whitespace-pre">
            {laravelEchoCode}
          </pre>
        </div>

      </div>

    </div>
  );
}
