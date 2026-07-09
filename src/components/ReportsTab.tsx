import React, { useState } from 'react';
import { ClientCourse, Expense } from '../types';
import { BarChart3, Wallet, Plus, Edit2, Trash2, Calendar, FileText, CheckCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ReportsTabProps {
  activeRole: 'admin' | 'lead' | 'cashier';
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  clientCourses: ClientCourse[];
  setClientCourses: React.Dispatch<React.SetStateAction<ClientCourse[]>>;
  currentUserDisplayName: string;
}

export default function ReportsTab({
  activeRole,
  expenses,
  setExpenses,
  clientCourses,
  setClientCourses,
  currentUserDisplayName
}: ReportsTabProps) {
  // Expense Form State
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Maintenance');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expensePaymentMethod, setExpensePaymentMethod] = useState<'Cash' | 'MTN Money' | 'Orange Money' | 'Moov Money' | 'Wave'>('Cash');
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Web Course Form State (for Cashier & Admin)
  const [webClientName, setWebClientName] = useState('');
  const [webTypeEngin, setWebTypeEngin] = useState<'Vélo' | 'Moto' | 'Tricycle'>('Moto');
  const [webZoneParcours, setWebZoneParcours] = useState('Cocody');
  const [webDateHeure, setWebDateHeure] = useState('2026-07-09T16:15');
  const [webPaymentMethod, setWebPaymentMethod] = useState<'Cash' | 'MTN Money' | 'Orange Money' | 'Moov Money' | 'Wave'>('Wave');
  const [webTarif, setWebTarif] = useState(1500);

  // Auto tariff calculation for web course form
  React.useEffect(() => {
    let base = 1000;
    if (webTypeEngin === 'Moto') base = 2500;
    if (webTypeEngin === 'Tricycle') base = 4000;

    let multiplier = 1;
    if (webZoneParcours === 'Yopougon' || webZoneParcours === 'Adjamé') multiplier = 1.2;
    if (webZoneParcours === 'Plateau' || webZoneParcours === 'Riviera') multiplier = 1.5;

    setWebTarif(Math.round(base * multiplier));
  }, [webTypeEngin, webZoneParcours]);

  const handleWebCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webClientName.trim()) return;

    const newCourse: ClientCourse = {
      id: `CMD-WEB-${Math.floor(100 + Math.random() * 900)}`,
      tarifs: Number(webTarif),
      clientName: webClientName.trim(),
      typeEngin: webTypeEngin,
      zoneParcours: webZoneParcours,
      dateHeure: webDateHeure,
      modePaiement: webPaymentMethod,
      status: 'completed', // For cashier/admin entered courses, they can be directly marked completed
      source: 'web'
    };

    setClientCourses(prev => [newCourse, ...prev]);
    showNotification(`✅ Commande client ${newCourse.id} enregistrée avec succès par le guichet !`);
    
    // Reset
    setWebClientName('');
  };

  // Filter States for Reports
  const [coursesPeriod, setCoursesPeriod] = useState<'daily' | 'weekly' | 'yearly' | 'custom'>('weekly');
  const [coursesStartDate, setCoursesStartDate] = useState('');
  const [coursesEndDate, setCoursesEndDate] = useState('');

  const [expensesPeriod, setExpensesPeriod] = useState<'daily' | 'weekly' | 'yearly' | 'custom'>('weekly');
  const [expensesStartDate, setExpensesStartDate] = useState('');
  const [expensesEndDate, setExpensesEndDate] = useState('');

  // Notifications inside the tab
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle submit expense (add or update)
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;

    if (editingExpenseId) {
      // Admin only verification (though UI prevents others, check as safety)
      if (activeRole !== 'admin') {
        showNotification("⚠️ Seul l'administrateur peut modifier les dépenses.");
        return;
      }
      setExpenses(prev => prev.map(exp => {
        if (exp.id === editingExpenseId) {
          return {
            ...exp,
            title: expenseTitle,
            amount: Number(expenseAmount),
            category: expenseCategory,
            date: expenseDate,
            paymentMethod: expensePaymentMethod
          };
        }
        return exp;
      }));
      showNotification("✅ Dépense mise à jour avec succès.");
      setEditingExpenseId(null);
    } else {
      const newExpense: Expense = {
        id: `DEP-${Date.now().toString().slice(-4)}`,
        title: expenseTitle,
        amount: Number(expenseAmount),
        category: expenseCategory,
        date: expenseDate,
        paymentMethod: expensePaymentMethod,
        reportedBy: activeRole,
        reportedByName: currentUserDisplayName || (activeRole === 'admin' ? 'Administrateur' : "Chef d'équipe")
      };
      setExpenses(prev => [newExpense, ...prev]);
      showNotification("✅ Nouvelle dépense enregistrée.");
    }

    // Reset Form
    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseCategory('Maintenance');
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setExpensePaymentMethod('Cash');
  };

  // Start editing expense
  const handleStartEditExpense = (exp: Expense) => {
    if (activeRole !== 'admin') {
      showNotification("⚠️ Seul l'administrateur peut modifier ou supprimer des dépenses.");
      return;
    }
    setEditingExpenseId(exp.id);
    setExpenseTitle(exp.title);
    setExpenseAmount(exp.amount.toString());
    setExpenseCategory(exp.category);
    setExpenseDate(exp.date);
    setExpensePaymentMethod(exp.paymentMethod);

    // Scroll to the expense form
    const formElement = document.getElementById('expense-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Delete expense
  const handleDeleteExpense = (id: string) => {
    if (activeRole !== 'admin') {
      showNotification("⚠️ Seul l'administrateur peut modifier ou supprimer des dépenses.");
      return;
    }
    if (window.confirm("Voulez-vous vraiment supprimer cette dépense ?")) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      showNotification("🗑️ Dépense supprimée.");
      if (editingExpenseId === id) {
        setEditingExpenseId(null);
        setExpenseTitle('');
        setExpenseAmount('');
      }
    }
  };

  // Helper: Filter records based on selected period
  const filterByPeriod = (
    dateString: string, 
    period: 'daily' | 'weekly' | 'yearly' | 'custom',
    startDateStr: string,
    endDateStr: string
  ) => {
    const recordDate = new Date(dateString);
    const today = new Date('2026-07-09'); // Using current system context date
    
    if (period === 'daily') {
      return recordDate.toDateString() === today.toDateString() || dateString.startsWith('2026-07-09');
    }
    if (period === 'weekly') {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      return recordDate >= oneWeekAgo && recordDate <= today;
    }
    if (period === 'yearly') {
      return recordDate.getFullYear() === today.getFullYear();
    }
    if (period === 'custom') {
      if (!startDateStr && !endDateStr) return true;
      const start = startDateStr ? new Date(startDateStr) : new Date('1970-01-01');
      const end = endDateStr ? new Date(endDateStr) : new Date('2099-12-31');
      // Set end date to end of day
      end.setHours(23, 59, 59, 999);
      return recordDate >= start && recordDate <= end;
    }
    return true;
  };

  // Calculate filtered lists
  const filteredCourses = clientCourses.filter(course => 
    filterByPeriod(course.dateHeure, coursesPeriod, coursesStartDate, coursesEndDate)
  );

  const filteredExpenses = expenses.filter(exp => 
    filterByPeriod(exp.date, expensesPeriod, expensesStartDate, expensesEndDate)
  );

  // Calculate totals
  const totalCoursesRevenue = filteredCourses
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.tarifs, 0);

  const totalExpensesAmount = filteredExpenses
    .reduce((sum, e) => sum + e.amount, 0);

  // Helper: Get payment method share data
  const getPaymentMethodShares = (items: Array<any>) => {
    const paymentMethods: Array<'Cash' | 'MTN Money' | 'Orange Money' | 'Moov Money' | 'Wave'> = [
      'Cash', 'MTN Money', 'Orange Money', 'Moov Money', 'Wave'
    ];
    
    const counts = paymentMethods.reduce((acc, method) => {
      acc[method] = 0;
      return acc;
    }, {} as Record<string, number>);

    let totalVal = 0;

    items.forEach(item => {
      const val = item.tarifs || item.amount || 0;
      const method = item.modePaiement || item.paymentMethod;
      if (method && paymentMethods.includes(method as any)) {
        counts[method] += val;
        totalVal += val;
      }
    });

    return {
      breakdown: paymentMethods.map(method => ({
        method,
        value: counts[method],
        percentage: totalVal > 0 ? (counts[method] / totalVal) * 100 : 0
      })),
      totalVal
    };
  };

  const coursesPaymentShares = getPaymentMethodShares(filteredCourses);
  const expensesPaymentShares = getPaymentMethodShares(filteredExpenses);

  // Map payment styles and badges for Côte d'Ivoire providers
  const getPaymentBadgeStyle = (method: string) => {
    switch (method) {
      case 'MTN Money':
        return 'bg-amber-400 text-amber-950'; // Yellow MTN
      case 'Orange Money':
        return 'bg-orange-500 text-white'; // Orange OM
      case 'Moov Money':
        return 'bg-emerald-600 text-white'; // Green Moov Flooz
      case 'Wave':
        return 'bg-cyan-500 text-white'; // Sky blue Wave
      default:
        return 'bg-slate-700 text-slate-100'; // Cash
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-900 border border-slate-800 rounded-3xl p-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Module Rapports & Gestion de Caisse
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Générez des rapports financiers, suivez les revenus de courses et enregistrez les dépenses d'exploitation.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs px-3 py-1.5 bg-indigo-950 text-indigo-300 font-mono rounded-xl border border-indigo-900 font-bold">
            Rôle : {activeRole === 'admin' ? '👑 Administrateur' : activeRole === 'lead' ? '👔 Chef d\'Équipe' : '💰 Caissier'}
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-indigo-900/40 border border-indigo-700/60 text-indigo-200 rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          {notification}
        </div>
      )}

      {/* Grid: Forms & Lists based on roles */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: Forms & Submissions */}
        <div id="left-form-container" className="xl:col-span-4 space-y-6">
          {/* Formulaire de Commande Client (for Cashier and Admin) */}
          {(activeRole === 'admin' || activeRole === 'cashier') && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  Saisie Commande Client (Guichet Web)
                </h3>
              </div>

              <form onSubmit={handleWebCourseSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Nom du Client</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kouadio Konan"
                    value={webClientName}
                    onChange={(e) => setWebClientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Type d'Engin Électrique</label>
                  <select
                    value={webTypeEngin}
                    onChange={(e) => setWebTypeEngin(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="Vélo">Vélo Électrique 🚲</option>
                    <option value="Moto">Moto Électrique 🏍️</option>
                    <option value="Tricycle">Tricycle Électrique 🛺</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Zone de parcours</label>
                  <select
                    value={webZoneParcours}
                    onChange={(e) => setWebZoneParcours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="Cocody">Cocody</option>
                    <option value="Marcory">Marcory</option>
                    <option value="Yopougon">Yopougon</option>
                    <option value="Plateau">Plateau</option>
                    <option value="Riviera">Riviera</option>
                    <option value="Adjamé">Adjamé</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Date & Heure</label>
                    <input
                      type="datetime-local"
                      required
                      value={webDateHeure}
                      onChange={(e) => setWebDateHeure(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-white outline-none focus:border-emerald-500 font-mono text-[10px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Tarif (FCFA)</label>
                    <input
                      type="number"
                      required
                      value={webTarif}
                      onChange={(e) => setWebTarif(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-white outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Mode de Paiement</label>
                  <select
                    value={webPaymentMethod}
                    onChange={(e) => setWebPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="Wave">Wave 🌊</option>
                    <option value="Orange Money">Orange Money 🍊</option>
                    <option value="MTN Money">MTN Mobile Money 🟡</option>
                    <option value="Moov Money">Moov Money (Flooz) 🟢</option>
                    <option value="Cash">Cash / Espèces 💵</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-550 text-white font-bold rounded-xl text-center uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Créer la Commande Course
                </button>
              </form>
            </div>
          )}

          {/* Formulaire de Dépenses (for Admin & Lead) */}
          {(activeRole === 'admin' || activeRole === 'lead') && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-2">
                  <Plus className="w-4 h-4 text-rose-400" />
                  {editingExpenseId ? "Modifier une dépense" : "Saisir une Dépense d'Exploitation"}
                </h3>
                {editingExpenseId && (
                  <button 
                    onClick={() => {
                      setEditingExpenseId(null);
                      setExpenseTitle('');
                      setExpenseAmount('');
                    }}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Annuler
                  </button>
                )}
              </div>

              <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Titre / Motif de dépense</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Réparation moteur tricycle / Achat ampoule"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Montant (FCFA)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Ex: 5000"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Catégorie</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="Maintenance">Maintenance / Pièces Détachées 🛠️</option>
                    <option value="Énergie / Électricité">Énergie & Recharge Batterie ⚡</option>
                    <option value="Assurance / Administratif">Assurance & Taxes 📄</option>
                    <option value="Outils Numériques">Abonnements & Logiciels GPS 📱</option>
                    <option value="Autre">Autre dépense opérationnelle 💼</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Date de Dépense</label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Mode de Règlement</label>
                  <select
                    value={expensePaymentMethod}
                    onChange={(e) => setExpensePaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="Cash">Espèces (Cash) 💵</option>
                    <option value="Wave">Wave 🌊</option>
                    <option value="Orange Money">Orange Money 🍊</option>
                    <option value="MTN Money">MTN Mobile Money 🟡</option>
                    <option value="Moov Money">Moov Flooz 🟢</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-xl text-center uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5 mt-2"
                >
                  <Wallet className="w-4 h-4" />
                  {editingExpenseId ? "Enregistrer les modifications" : "Enregistrer la Dépense"}
                </button>
              </form>
            </div>
          )}

          {/* Alert info only for lead */}
          {activeRole === 'lead' && (
            <div className="p-3.5 bg-slate-900 border border-slate-850 text-slate-400 rounded-2xl text-[11px] leading-relaxed">
              ℹ️ En tant que <strong>Chef d'équipe</strong>, vous pouvez ajouter des dépenses de terrain, mais vous n'avez pas l'autorisation de les modifier ou de les supprimer après soumission. Seuls les administrateurs disposent de ce privilège.
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Reports displays & Visualizations */}
        <div className={`space-y-6 ${activeRole === 'cashier' ? 'xl:col-span-12' : 'xl:col-span-8'}`}>
          
          {/* 1. REPORT 1: RIDE ORDERS (Commandes de courses) - Admin and Cashier only */}
          {(activeRole === 'admin' || activeRole === 'cashier') && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-3 gap-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Rapport de Recettes de Courses clients
                  </h3>
                  <p className="text-[10px] text-slate-400">Totalité des commandes de transport et livraisons</p>
                </div>

                {/* Period Selectors */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <select
                    value={coursesPeriod}
                    onChange={(e) => setCoursesPeriod(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="daily">Aujourd'hui</option>
                    <option value="weekly">Cette Semaine (7j)</option>
                    <option value="yearly">Annuel (2026)</option>
                    <option value="custom">Périodique (Personnalisé)</option>
                  </select>

                  {coursesPeriod === 'custom' && (
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-lg">
                      <input
                        type="date"
                        value={coursesStartDate}
                        onChange={(e) => setCoursesStartDate(e.target.value)}
                        className="bg-transparent border-none text-[10px] text-white outline-none w-24 font-mono"
                        placeholder="Début"
                      />
                      <span className="text-slate-600 font-bold">-</span>
                      <input
                        type="date"
                        value={coursesEndDate}
                        onChange={(e) => setCoursesEndDate(e.target.value)}
                        className="bg-transparent border-none text-[10px] text-white outline-none w-24 font-mono"
                        placeholder="Fin"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Recettes KPI cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Chiffre d'Affaires</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                    {totalCoursesRevenue.toLocaleString('fr-FR')} FCFA
                  </span>
                  <span className="text-[9px] text-slate-400">Pour les courses complétées</span>
                </div>

                <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Volume Commandes</span>
                  <span className="text-2xl font-bold font-mono text-slate-100 mt-1 block">
                    {filteredCourses.length} courses
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {filteredCourses.filter(c => c.status === 'pending').length} en attente
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Panier Moyen</span>
                  <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
                    {filteredCourses.length > 0 
                      ? Math.round(totalCoursesRevenue / filteredCourses.length).toLocaleString('fr-FR')
                      : 0} FCFA
                  </span>
                  <span className="text-[9px] text-slate-400">Par course commandée</span>
                </div>
              </div>

              {/* GRAPH EN BANDE (stacked progress bar breakdown of payments) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Part de type de paiement (Chiffre d'Affaires)</span>
                  <span className="font-mono text-slate-400 text-[10px]">Graphique en bande</span>
                </div>

                {/* The Band */}
                <div className="w-full h-5 rounded-lg bg-slate-950 border border-slate-850 flex overflow-hidden">
                  {coursesPaymentShares.breakdown.map((share) => (
                    share.percentage > 0 && (
                      <div
                        key={share.method}
                        style={{ width: `${share.percentage}%` }}
                        className={`h-full transition-all relative group`}
                        title={`${share.method} : ${share.value} FCFA (${share.percentage.toFixed(1)}%)`}
                      >
                        <div className={`w-full h-full ${
                          share.method === 'Wave' ? 'bg-cyan-500' :
                          share.method === 'Orange Money' ? 'bg-orange-500' :
                          share.method === 'MTN Money' ? 'bg-amber-400' :
                          share.method === 'Moov Money' ? 'bg-emerald-600' :
                          'bg-slate-500'
                        }`} />
                      </div>
                    )
                  ))}
                  {coursesPaymentShares.totalVal === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 italic">
                      Aucune donnée de paiement sur la période
                    </div>
                  )}
                </div>

                {/* Legend badges */}
                <div className="flex flex-wrap gap-3 pt-1">
                  {coursesPaymentShares.breakdown.map((share) => (
                    <div key={share.method} className="flex items-center gap-1.5 text-[11px] font-medium">
                      <span className={`w-3 h-3 rounded ${
                        share.method === 'Wave' ? 'bg-cyan-500' :
                        share.method === 'Orange Money' ? 'bg-orange-500' :
                        share.method === 'MTN Money' ? 'bg-amber-400' :
                        share.method === 'Moov Money' ? 'bg-emerald-600' :
                        'bg-slate-500'
                      }`} />
                      <span className="text-slate-300">{share.method}</span>
                      <span className="font-mono text-slate-500 text-[10px]">
                        ({share.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Small details log table of client courses */}
              <div className="overflow-x-auto text-xs bg-slate-950 p-3 rounded-xl border border-slate-850">
                <table className="w-full text-left text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-bold h-8 text-[10px] uppercase">
                      <th className="px-2">Code ID</th>
                      <th>Client</th>
                      <th>Type Engin</th>
                      <th>Zone</th>
                      <th>Date / Heure</th>
                      <th>Mode paiement</th>
                      <th className="text-right">Tarif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                    {filteredCourses.map(course => (
                      <tr key={course.id} className="h-9 hover:bg-slate-900/40">
                        <td className="px-2 font-mono text-[10px] text-indigo-400 font-bold">{course.id}</td>
                        <td className="font-semibold text-white">{course.clientName}</td>
                        <td className="font-semibold">
                          {course.typeEngin === 'Vélo' && '🚲 Vélo'}
                          {course.typeEngin === 'Moto' && '🏍️ Moto'}
                          {course.typeEngin === 'Tricycle' && '🛺 Tricycle'}
                        </td>
                        <td>{course.zoneParcours}</td>
                        <td className="font-mono text-[10px] text-slate-400">
                          {course.dateHeure.replace('T', ' ')}
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getPaymentBadgeStyle(course.modePaiement)}`}>
                            {course.modePaiement}
                          </span>
                        </td>
                        <td className="text-right font-mono font-bold text-white">
                          {course.tarifs.toLocaleString()} CFA
                        </td>
                      </tr>
                    ))}
                    {filteredCourses.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-slate-600 italic py-3">Aucune course enregistrée pour cette période.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. REPORT 2: EXPENSES (Rapport des dépenses) - Visible to ALL (Admin, Lead, Cashier) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-3 gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Rapport de Dépenses d'Exploitation Flotte
                </h3>
                <p className="text-[10px] text-slate-400">Audit financier des coûts de maintenance et d'électricité</p>
              </div>

              {/* Period Selectors */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={expensesPeriod}
                  onChange={(e) => setExpensesPeriod(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 outline-none focus:border-indigo-500 font-semibold"
                >
                  <option value="daily">Aujourd'hui</option>
                  <option value="weekly">Cette Semaine (7j)</option>
                  <option value="yearly">Annuel (2026)</option>
                  <option value="custom">Périodique (Personnalisé)</option>
                </select>

                {expensesPeriod === 'custom' && (
                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-lg">
                    <input
                      type="date"
                      value={expensesStartDate}
                      onChange={(e) => setExpensesStartDate(e.target.value)}
                      className="bg-transparent border-none text-[10px] text-white outline-none w-24 font-mono"
                      placeholder="Début"
                    />
                    <span className="text-slate-600 font-bold">-</span>
                    <input
                      type="date"
                      value={expensesEndDate}
                      onChange={(e) => setExpensesEndDate(e.target.value)}
                      className="bg-transparent border-none text-[10px] text-white outline-none w-24 font-mono"
                      placeholder="Fin"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Expenses KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Dépensé</span>
                <span className="text-2xl font-bold font-mono text-rose-400 mt-1 block">
                  {totalExpensesAmount.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="text-[9px] text-slate-400">Montant total engagé</span>
              </div>

              <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Nombre d'Écritures</span>
                <span className="text-2xl font-bold font-mono text-slate-100 mt-1 block">
                  {filteredExpenses.length} lignes
                </span>
                <span className="text-[9px] text-slate-400">Sur la période sélectionnée</span>
              </div>

              <div className="bg-slate-950 border border-slate-800/60 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Dépense Moyenne</span>
                <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
                  {filteredExpenses.length > 0
                    ? Math.round(totalExpensesAmount / filteredExpenses.length).toLocaleString('fr-FR')
                    : 0} FCFA
                </span>
                <span className="text-[9px] text-slate-400">Par écriture de frais</span>
              </div>
            </div>

            {/* GRAPH EN BANDE FOR EXPENSES */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Part de type de paiement (Moyens de règlement des dépenses)</span>
                <span className="font-mono text-slate-400 text-[10px]">Graphique en bande</span>
              </div>

              {/* The Band */}
              <div className="w-full h-5 rounded-lg bg-slate-950 border border-slate-850 flex overflow-hidden">
                {expensesPaymentShares.breakdown.map((share) => (
                  share.percentage > 0 && (
                    <div
                      key={share.method}
                      style={{ width: `${share.percentage}%` }}
                      className="h-full transition-all relative"
                      title={`${share.method} : ${share.value} FCFA (${share.percentage.toFixed(1)}%)`}
                    >
                      <div className={`w-full h-full ${
                        share.method === 'Wave' ? 'bg-cyan-500' :
                        share.method === 'Orange Money' ? 'bg-orange-500' :
                        share.method === 'MTN Money' ? 'bg-amber-400' :
                        share.method === 'Moov Money' ? 'bg-emerald-600' :
                        'bg-slate-500'
                      }`} />
                    </div>
                  )
                ))}
                {expensesPaymentShares.totalVal === 0 && (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 italic">
                    Aucune dépense sur la période
                  </div>
                )}
              </div>

              {/* Legend badges */}
              <div className="flex flex-wrap gap-3 pt-1">
                {expensesPaymentShares.breakdown.map((share) => (
                  <div key={share.method} className="flex items-center gap-1.5 text-[11px] font-medium">
                    <span className={`w-3 h-3 rounded ${
                      share.method === 'Wave' ? 'bg-cyan-500' :
                      share.method === 'Orange Money' ? 'bg-orange-500' :
                      share.method === 'MTN Money' ? 'bg-amber-400' :
                      share.method === 'Moov Money' ? 'bg-emerald-600' :
                      'bg-slate-500'
                    }`} />
                    <span className="text-slate-300">{share.method}</span>
                    <span className="font-mono text-slate-500 text-[10px]">
                      ({share.percentage.toFixed(0)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* List and Actions of expenses */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Registre des Dépenses de Flotte</span>
              
              <div className="overflow-x-auto text-xs bg-slate-950 p-3 rounded-xl border border-slate-850">
                <table className="w-full text-left text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-bold h-8 text-[10px] uppercase">
                      <th className="px-2">Code ID</th>
                      <th>Intitulé / Motif</th>
                      <th>Catégorie</th>
                      <th>Date</th>
                      <th>Réglement</th>
                      <th>Auteur</th>
                      {activeRole === 'admin' && <th className="text-right px-2">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                    {filteredExpenses.map(exp => (
                      <tr key={exp.id} className="h-10 hover:bg-slate-900/40 font-medium">
                        <td className="px-2 font-mono text-[10px] text-indigo-400 font-bold">{exp.id}</td>
                        <td className="text-white font-semibold">{exp.title}</td>
                        <td className="text-slate-400">{exp.category}</td>
                        <td className="font-mono text-[10px] text-slate-400">{exp.date}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getPaymentBadgeStyle(exp.paymentMethod)}`}>
                            {exp.paymentMethod}
                          </span>
                        </td>
                        <td className="text-slate-400 text-[11px]">
                          👤 {exp.reportedByName}
                        </td>
                        {activeRole === 'admin' && (
                          <td className="text-right px-2 space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleStartEditExpense(exp)}
                              className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-800 font-bold transition-all"
                            >
                              <Edit2 className="w-3 h-3 inline mr-0.5" /> Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="text-[10px] bg-red-950/40 hover:bg-red-950 text-red-400 px-2 py-1 rounded border border-red-900/50 font-bold transition-all"
                            >
                              <Trash2 className="w-3 h-3 inline mr-0.5" /> Supprimer
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {filteredExpenses.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-slate-600 italic py-3">Aucune dépense enregistrée sur cette période.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
