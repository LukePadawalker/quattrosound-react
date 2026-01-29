import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Plus,
  Edit2,
  Trash2,
  LogOut,
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  Package,
  Tags,
  Settings,
  Sun,
  Moon,
  Search,
  UserCircle,
  CheckCircle,
  Clock,
  Wrench,
  Filter,
  Calendar,
  MapPin,
  Menu,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortfolioForm from '../components/PortfolioForm';
import InventoryForm from '../components/InventoryForm';
import CategoriesTab from '../components/CategoriesTab';
import SettingsTab from '../components/SettingsTab';
import DashboardTab from '../components/DashboardTab';
import { CATEGORIES } from '../data/categories';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  image_url: string;
  created_at: string;
  stock?: number;
  status?: string;
  name?: string; // For products compatibility
}

export default function AdminDashboard() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchQuery('');
    const handleTabChange = async () => {
      setIsTransitioning(true);
      await fetchItems();
      // Delay slightly to ensure smooth animation
      setTimeout(() => setIsTransitioning(false), 200);
    };
    handleTabChange();
  }, [activeTab]);

  useEffect(() => {
    fetchUser();
  }, []);

  const filteredItems = items.filter(item =>
    (item.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (item.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    const table = (activeTab === 'inventario' || activeTab === 'categorie') ? 'products' : 'portfolio_items';
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
    } else {
      // Normalize data for the table (products use 'name' instead of 'title')
      const normalizedData = (data || []).map((item: any) => ({
        ...item,
        title: item.title || item.name || 'Untitled',
      }));
      setItems(normalizedData);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;

    const table = (activeTab === 'inventario' || activeTab === 'categorie') ? 'products' : 'portfolio_items';
    const { error: dbError } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (dbError) {
      alert(`Errore durante l'eliminazione dal database: ${dbError.message}`);
      return;
    }

    if (imageUrl && imageUrl.includes('/storage/v1/object/public/portfolio/')) {
      const filePath = imageUrl.split('/portfolio/')[1];
      if (filePath) {
        await supabase.storage.from('portfolio').remove([filePath]);
      }
    }

    setRefreshKey(prev => prev + 1);
    fetchItems();
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  return (
    <div className={`flex h-screen overflow-hidden font-audiowide transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-[#0f172a] via-[#0a0f18] to-[#020617] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r flex flex-col transition-all duration-300 transform
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDarkMode ? 'bg-[#111827]/80 backdrop-blur-xl border-gray-800/50' : 'bg-white/90 backdrop-blur-xl border-slate-200'}
      `}>
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <img src="/white-logo.png" alt="Logo" className="w-5 h-5 object-contain" />
              </div>
              <span className={`text-base font-bold tracking-tight uppercase audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>QuattroSound</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-0.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'inventario', label: 'Inventario', icon: Package },
              { id: 'categorie', label: 'Categorie', icon: Tags },
              { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
              { id: 'impostazioni', label: 'Impostazioni', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.05)]'
                    : `text-gray-400 ${isDarkMode ? 'hover:text-white hover:bg-gray-800/30' : 'hover:text-gray-900 hover:bg-gray-100'}`
                }`}
              >
                <item.icon size={18} className={activeTab === item.id ? 'text-cyan-400' : 'text-gray-400'} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={`mt-auto p-4 space-y-3 border-t ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200'}`}>
          <div className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors group ${isDarkMode ? 'bg-gray-800/20 border-gray-700/30' : 'bg-gray-50 border-gray-200'}`}>
            <div className="relative">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-cyan-500/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center ring-2 ring-cyan-500/20">
                  <UserCircle className="text-cyan-400" size={20} />
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 rounded-full ${isDarkMode ? 'border-[#111827]' : 'border-white'}`}></div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.email?.split('@')[0] || 'Admin'}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold truncate">
                {user?.email || 'ADMIN MAGAZZINO'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-red-400 transition-colors group"
          >
            <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-medium">Esci dal portale</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className={`h-14 lg:h-18 backdrop-blur-xl border-b flex items-center justify-between px-3 lg:px-8 py-2 lg:py-4 z-30 transition-all duration-300 ${isDarkMode ? 'bg-[#0a0f18]/40 border-gray-800/30' : 'bg-white/70 border-slate-200 shadow-sm shadow-slate-200/50'}`}>
          <div className="flex items-center gap-3 lg:gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="relative flex-1 max-w-lg hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Cerca attrezzatura..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full border rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-gray-500 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-inner shadow-slate-100'}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-5">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 transition-all hover:bg-cyan-500/5 rounded-lg ${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-cyan-600'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className={`h-6 w-[1px] mx-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${isDarkMode ? 'bg-gray-800/40 text-gray-300 hover:text-white hover:bg-gray-800 border-gray-700/50' : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-200'}`}
            >
              <ExternalLink size={16} className="text-cyan-400" />
              Sito Web
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-8 space-y-4 lg:space-y-10 scrollbar-hide relative">
          {isTransitioning && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-[2px]">
              <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
          )}

          <div className={isTransitioning ? 'opacity-0' : 'animate-fade-in-up'}>
          {activeTab === 'portfolio' || activeTab === 'inventario' ? (
            <>
              {/* Search Mobile */}
              <div className="md:hidden relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="Cerca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}
                />
              </div>

              {/* Page Title & Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 lg:gap-4">
                <div>
                  <h2 className={`text-lg lg:text-4xl font-black tracking-tighter audiowide-regular uppercase flex items-center gap-3 lg:gap-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {activeTab === 'portfolio' ? 'Portfolio' : 'Inventario'}
                  </h2>
                  <p className="text-gray-500 mt-0.5 text-[10px] lg:text-base font-medium">Gestione asset e portfolio QuattroSound.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl border transition-all ${isDarkMode ? 'bg-gray-800/40 text-gray-300 hover:text-white border-gray-700/50' : 'bg-white text-gray-600 hover:text-gray-900 border-gray-200'}`}>
                    <Filter size={18} className="text-gray-500" />
                    Filtra
                  </button>
                  <button
                    onClick={handleAddNew}
                    className="flex-1 sm:flex-none bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-4 py-2 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-[0_10px_25px_-5px_rgba(6,182,212,0.4)] text-sm"
                  >
                    <Plus size={18} strokeWidth={3} />
                    {activeTab === 'portfolio' ? 'Immagine' : 'Articolo'}
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5">
                {[
                  { label: activeTab === 'inventario' ? 'Articoli' : 'Progetti', value: items.length, trend: `Su ${items.length} el.`, icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                  { label: 'Disponibili', value: items.filter(i => i.status === 'Available').length, trend: 'Pronti al noleggio', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                  { label: 'In Uso', value: items.filter(i => i.status === 'In Use').length, trend: 'Attualmente fuori', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                  { label: 'Manutenzione', value: items.filter(i => i.status === 'Maintenance').length, trend: 'In riparazione', icon: Wrench, color: 'text-rose-400', bg: 'bg-rose-400/10' },
                ].map((stat, i) => (
                  <div key={i} className={`border rounded-lg lg:rounded-2xl p-2.5 lg:p-6 transition-all group ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50 hover:border-gray-700/50' : 'bg-white border-gray-200 hover:shadow-lg'}`}>
                    <div className="flex items-center justify-between mb-2 lg:mb-6">
                      <div className={`p-1.5 lg:p-3 rounded-lg lg:rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon size={14} lg-size={24} />
                      </div>
                    </div>
                    <div className="space-y-0.5 lg:space-y-1">
                      <p className="text-gray-500 text-[8px] lg:text-xs font-black uppercase tracking-widest">{stat.label}</p>
                      <h3 className="text-base lg:text-3xl font-black audiowide-regular">{stat.value}</h3>
                      <p className={`text-[9px] lg:text-[11px] font-bold ${stat.color === 'text-cyan-400' ? 'text-cyan-400/70' : stat.color === 'text-rose-400' ? 'text-rose-400/70' : 'text-gray-600'}`}>
                        {i === 0 ? '↗ ' : i === 3 ? '↘ ' : ''}{stat.trend}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium text-xs">Caricamento...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-[#111827]/20 rounded-2xl border border-gray-800/50 border-dashed">
                  <div className="w-16 h-16 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={32} className="text-gray-700" />
                  </div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {searchQuery ? 'Nessun risultato' : 'Nessun articolo'}
                  </h3>
                </div>
              ) : (
                <div className={`border rounded-xl lg:rounded-3xl overflow-hidden shadow-2xl transition-colors ${isDarkMode ? 'bg-[#111827]/20 border-gray-800/50' : 'bg-white border-gray-200'}`}>
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-[600px] lg:min-w-full">
                      <thead>
                        <tr className={`border-b transition-colors ${isDarkMode ? 'border-gray-800/50 bg-[#111827]/40' : 'border-gray-100 bg-gray-50/50'}`}>
                          <th className="px-3 lg:px-6 py-3 lg:py-5 text-[9px] lg:text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">
                            {activeTab === 'portfolio' ? 'Immagine' : 'Articolo'}
                          </th>
                          <th className="hidden sm:table-cell px-3 lg:px-6 py-3 lg:py-5 text-[9px] lg:text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Categoria</th>
                          <th className="px-3 lg:px-6 py-3 lg:py-5 text-[9px] lg:text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">
                            {activeTab === 'inventario' ? 'Stock' : 'Ubicazione'}
                          </th>
                          <th className="hidden lg:table-cell px-3 lg:px-6 py-3 lg:py-5 text-[9px] lg:text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Data</th>
                          <th className="hidden md:table-cell px-3 lg:px-6 py-3 lg:py-5 text-[9px] lg:text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Stato</th>
                          <th className="px-3 lg:px-6 py-3 lg:py-5 text-[9px] lg:text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/30">
                        {filteredItems.map((item, index) => (
                          <tr
                            key={item.id}
                            onClick={() => handleEdit(item)}
                            className={`transition-all group cursor-pointer animate-fade-in-up ${isDarkMode ? 'hover:bg-cyan-500/[0.02]' : 'hover:bg-gray-50'}`}
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            <td className="px-3 lg:px-6 py-3 lg:py-5">
                              <div className="flex items-center gap-2 lg:gap-4">
                                <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl overflow-hidden border shadow-inner transition-colors ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50 group-hover:border-cyan-500/30' : 'bg-gray-100 border-gray-200 group-hover:border-cyan-500/30'}`}>
                                  {item.image_url ? (
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center"><ImageIcon size={14} lg-size={18} className="text-gray-400" /></div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className={`text-[11px] lg:text-sm font-black uppercase tracking-tight transition-colors truncate ${isDarkMode ? 'text-white group-hover:text-cyan-400' : 'text-gray-900 group-hover:text-cyan-600'}`}>{item.title}</div>
                                  <div className="text-[8px] lg:text-[10px] text-gray-500 font-bold uppercase mt-0.5">{item.id.substring(0, 8)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="hidden sm:table-cell px-3 lg:px-6 py-3 lg:py-5">
                              {(() => {
                                const category = CATEGORIES.find(c => c.name === item.category);
                                return (
                                  <span className={`px-2 py-1 border rounded text-[8px] font-black uppercase tracking-wider transition-all ${
                                    isDarkMode
                                      ? `${category?.bg || 'bg-gray-800/50'} ${category?.color || 'text-gray-400'} border-gray-700/50 group-hover:border-white/20`
                                      : `${category?.bg || 'bg-gray-50'} ${category?.color || 'text-gray-500'} border-gray-200 group-hover:border-black/10`
                                  }`}>
                                    {item.category}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-3 lg:px-6 py-3 lg:py-5">
                              {activeTab === 'inventario' ? (
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1 text-[8px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    <MapPin size={8} className="text-cyan-500/50" />
                                    {item.location || 'Roma'} • {item.stock || 0} DISP.
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-[10px] lg:text-xs font-bold text-gray-500">
                                  <MapPin size={10} lg-size={14} className="text-cyan-500/50" />
                                  <span className="uppercase tracking-wide">{item.location || 'Roma'}</span>
                                </div>
                              )}
                            </td>
                            <td className="hidden lg:table-cell px-3 lg:px-6 py-3 lg:py-5">
                              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                <Calendar size={14} className="text-gray-400" />
                                {new Date(item.created_at).toLocaleDateString('it-IT')}
                              </div>
                            </td>
                            <td className="hidden md:table-cell px-3 lg:px-6 py-3 lg:py-5">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === 'Available' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                  item.status === 'In Use' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                  item.status === 'Maintenance' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                                  'bg-gray-500'
                                }`}></div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${
                                  item.status === 'Available' ? 'text-emerald-500' :
                                  item.status === 'In Use' ? 'text-amber-500' :
                                  item.status === 'Maintenance' ? 'text-rose-500' :
                                  'text-gray-500'
                                }`}>
                                  {item.status === 'Available' ? 'OK' :
                                   item.status === 'In Use' ? 'OUT' :
                                   item.status === 'Maintenance' ? 'REP' :
                                   'OFF'}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 lg:px-6 py-3 lg:py-5 text-right">
                              <div className="flex justify-end gap-1 lg:gap-2">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="p-1.5 text-gray-600 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id, item.image_url)}
                                  className="p-1.5 text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Stats */}
                  <div className={`px-4 py-3 lg:px-6 lg:py-5 border-t flex items-center justify-between transition-colors ${isDarkMode ? 'border-gray-800/50 bg-[#111827]/40' : 'border-gray-100 bg-gray-50/50'}`}>
                    <div className="text-[9px] lg:text-[11px] font-black text-gray-600 uppercase tracking-widest">
                      Visualizzati {filteredItems.length} di {items.length} {activeTab === 'portfolio' ? 'Immagini' : 'Articoli'}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : activeTab === 'categorie' ? (
            <CategoriesTab
              key={refreshKey}
              isDarkMode={isDarkMode}
              onEdit={handleEdit}
            />
          ) : activeTab === 'impostazioni' ? (
            <SettingsTab isDarkMode={isDarkMode} />
          ) : (
            <DashboardTab
              isDarkMode={isDarkMode}
              onNavigate={(tab) => setActiveTab(tab)}
              user={user}
            />
          )}
          </div>
        </div>
      </main>

      {isFormOpen && (
        (activeTab === 'inventario' || activeTab === 'categorie') ? (
          <InventoryForm
            item={editingItem as any}
            isDarkMode={isDarkMode}
            onClose={() => setIsFormOpen(false)}
            onSuccess={() => {
              setIsFormOpen(false);
              setRefreshKey(prev => prev + 1);
              fetchItems();
            }}
          />
        ) : (
          <PortfolioForm
            item={editingItem}
            isDarkMode={isDarkMode}
            onClose={() => setIsFormOpen(false)}
            onSuccess={() => {
              setIsFormOpen(false);
              setRefreshKey(prev => prev + 1);
              fetchItems();
            }}
          />
        )
      )}
    </div>
  );
}
