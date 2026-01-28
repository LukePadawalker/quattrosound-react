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
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Calendar,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortfolioForm from '../components/PortfolioForm';
import InventoryForm from '../components/InventoryForm';

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
  price?: number;
  name?: string; // For products compatibility
}

export default function AdminDashboard() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setSearchQuery('');
    fetchItems();
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
    setUser(user);
  };

  const fetchItems = async () => {
    setLoading(true);
    const table = activeTab === 'inventario' ? 'products' : 'portfolio_items';
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

    const table = activeTab === 'inventario' ? 'products' : 'portfolio_items';
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
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#111827] border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <img src="/white-logo.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className={`text-xl font-bold tracking-tight uppercase audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>QuattroSound</span>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'inventario', label: 'Inventario', icon: Package },
              { id: 'categorie', label: 'Categorie', icon: Tags },
              { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.05)]'
                    : `text-gray-400 ${isDarkMode ? 'hover:text-white hover:bg-gray-800/30' : 'hover:text-gray-900 hover:bg-gray-100'}`
                }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-cyan-400' : 'text-gray-400'} />
                <span className="text-[15px] font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={`mt-auto p-6 space-y-4 border-t ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200'}`}>
          <button className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
            <Settings size={20} />
            <span className="text-sm font-medium">Impostazioni</span>
          </button>

          <div className={`flex items-center gap-3 px-4 py-4 rounded-xl border transition-colors group ${isDarkMode ? 'bg-gray-800/20 border-gray-700/30' : 'bg-gray-50 border-gray-200'}`}>
            <div className="relative">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-10 h-10 rounded-lg object-cover ring-2 ring-cyan-500/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center ring-2 ring-cyan-500/20">
                  <UserCircle className="text-cyan-400" size={24} />
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
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-red-400 transition-colors group"
          >
            <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium">Esci dal portale</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className={`h-18 backdrop-blur-xl border-b flex items-center justify-between px-8 py-4 z-10 transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0f18]/80 border-gray-800/50' : 'bg-white/80 border-gray-200'}`}>
          <div className="relative w-1/3 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Cerca attrezzatura..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-gray-600 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}
            />
          </div>

          <div className="flex items-center gap-5">
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
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {activeTab === 'portfolio' || activeTab === 'inventario' ? (
            <>
              {/* Page Title & Actions */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className={`text-4xl font-black tracking-tighter audiowide-regular uppercase flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {activeTab === 'portfolio' ? 'Portfolio' : 'Inventario'}
                  </h2>
                  <p className="text-gray-500 mt-1 font-medium">Gestione asset e portfolio QuattroSound.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl border transition-all ${isDarkMode ? 'bg-gray-800/40 text-gray-300 hover:text-white border-gray-700/50' : 'bg-white text-gray-600 hover:text-gray-900 border-gray-200'}`}>
                    <Filter size={18} className="text-gray-500" />
                    Filtra
                  </button>
                  <button
                    onClick={handleAddNew}
                    className="bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-5 py-2.5 rounded-xl font-black transition-all flex items-center gap-2 shadow-[0_10px_25px_-5px_rgba(6,182,212,0.4)] hover:-translate-y-0.5"
                  >
                    <Plus size={20} strokeWidth={3} />
                    Articolo
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: activeTab === 'inventario' ? 'Articoli Totali' : 'Progetti Totali', value: items.length, trend: `Su ${items.length} elementi`, icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                  { label: 'Disponibili', value: items.filter(i => i.status === 'Available').length, trend: 'Pronti al noleggio', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                  { label: 'In Uso', value: items.filter(i => i.status === 'In Use').length, trend: 'Attualmente fuori', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                  { label: 'Manutenzione', value: items.filter(i => i.status === 'Maintenance').length, trend: 'In riparazione', icon: Wrench, color: 'text-rose-400', bg: 'bg-rose-400/10' },
                ].map((stat, i) => (
                  <div key={i} className={`border rounded-2xl p-6 transition-all group ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50 hover:border-gray-700/50' : 'bg-white border-gray-200 hover:shadow-lg'}`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon size={24} />
                      </div>
                      <MoreVertical size={20} className="text-gray-700 group-hover:text-gray-500 cursor-pointer" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                      <h3 className="text-3xl font-black audiowide-regular">{stat.value}</h3>
                      <p className={`text-[11px] font-bold ${stat.color === 'text-cyan-400' ? 'text-cyan-400/70' : stat.color === 'text-rose-400' ? 'text-rose-400/70' : 'text-gray-600'}`}>
                        {i === 0 ? '↗ ' : i === 3 ? '↘ ' : ''}{stat.trend}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium">Caricamento portfolio...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-32 bg-[#111827]/20 rounded-3xl border border-gray-800/50 border-dashed">
                  <div className="w-20 h-20 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ImageIcon size={40} className="text-gray-700" />
                  </div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {searchQuery ? 'Nessun risultato per la ricerca' : 'Nessun articolo trovato'}
                  </h3>
                  <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                    {searchQuery ? 'Prova con termini diversi o cancella la ricerca.' : 'Inizia aggiungendo il tuo primo contenuto per mostrarlo sul portale.'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleAddNew}
                      className="mt-8 text-cyan-400 font-bold hover:underline"
                    >
                      Aggiungi ora →
                    </button>
                  )}
                </div>
              ) : (
                <div className={`border rounded-3xl overflow-hidden shadow-2xl transition-colors ${isDarkMode ? 'bg-[#111827]/20 border-gray-800/50' : 'bg-white border-gray-200'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b transition-colors ${isDarkMode ? 'border-gray-800/50 bg-[#111827]/40' : 'border-gray-100 bg-gray-50/50'}`}>
                          <th className="px-6 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Articolo</th>
                          <th className="px-6 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Categoria</th>
                          <th className="px-6 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">
                            {activeTab === 'inventario' ? 'Prezzo / Stock' : 'Ubicazione'}
                          </th>
                          <th className="px-6 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Data</th>
                          <th className="px-6 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Stato</th>
                          <th className="px-6 py-5 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/30">
                        {filteredItems.map((item) => (
                          <tr key={item.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-cyan-500/[0.02]' : 'hover:bg-gray-50'}`}>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl overflow-hidden border shadow-inner transition-colors ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50 group-hover:border-cyan-500/30' : 'bg-gray-100 border-gray-200 group-hover:border-cyan-500/30'}`}>
                                  {item.image_url ? (
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center"><ImageIcon size={18} className="text-gray-400" /></div>
                                  )}
                                </div>
                                <div>
                                  <div className={`text-sm font-black uppercase tracking-tight transition-colors ${isDarkMode ? 'text-white group-hover:text-cyan-400' : 'text-gray-900 group-hover:text-cyan-600'}`}>{item.title}</div>
                                  <div className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">{item.id.substring(0, 8)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`px-3 py-1.5 border rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50 text-gray-400 group-hover:border-cyan-500/20 group-hover:text-cyan-300' : 'bg-gray-50 border-gray-200 text-gray-500 group-hover:border-cyan-500/20 group-hover:text-cyan-600'}`}>
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              {activeTab === 'inventario' ? (
                                <div className="space-y-1">
                                  <div className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>€{item.price || 0}</div>
                                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    <MapPin size={10} className="text-cyan-500/50" />
                                    {item.location || 'Roma'} • {item.stock || 0} DISPONIBILI
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                  <MapPin size={14} className="text-cyan-500/50" />
                                  <span className="uppercase tracking-wide">{item.location || 'Roma'}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                <Calendar size={14} className="text-gray-400" />
                                {new Date(item.created_at).toLocaleDateString('it-IT')}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                                  item.status === 'Available' ? 'bg-emerald-500 shadow-emerald-500/50' :
                                  item.status === 'In Use' ? 'bg-amber-500 shadow-amber-500/50' :
                                  item.status === 'Maintenance' ? 'bg-rose-500 shadow-rose-500/50' :
                                  'bg-gray-500 shadow-gray-500/50'
                                }`}></div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                  item.status === 'Available' ? 'text-emerald-500' :
                                  item.status === 'In Use' ? 'text-amber-500' :
                                  item.status === 'Maintenance' ? 'text-rose-500' :
                                  'text-gray-500'
                                }`}>
                                  {item.status === 'Available' ? 'DISPONIBILE' :
                                   item.status === 'In Use' ? 'IN USO' :
                                   item.status === 'Maintenance' ? 'MANUTENZIONE' :
                                   'ESAURITO'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="p-2 text-gray-600 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                                  title="Modifica"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id, item.image_url)}
                                  className="p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                  title="Elimina"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className={`px-6 py-5 border-t flex items-center justify-between transition-colors ${isDarkMode ? 'border-gray-800/50 bg-[#111827]/40' : 'border-gray-100 bg-gray-50/50'}`}>
                    <div className="text-[11px] font-black text-gray-600 uppercase tracking-widest">
                      {filteredItems.length} DI {items.length} ASSET TOTALI
                    </div>
                    <div className="flex items-center gap-1">
                      <button className={`p-2 disabled:opacity-30 ${isDarkMode ? 'text-gray-700 hover:text-gray-400' : 'text-gray-300 hover:text-gray-500'}`} disabled>
                        <ChevronLeft size={20} />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-cyan-500 text-[#0a0f18] text-xs font-black shadow-lg shadow-cyan-500/20">1</button>
                      <button className={`w-8 h-8 rounded-lg text-xs font-black transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-500' : 'hover:bg-gray-200 text-gray-400'}`}>2</button>
                      <button className="p-2 text-gray-400 hover:text-white">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6">
                <LayoutDashboard size={40} className="text-cyan-500" />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-widest audiowide-regular">Panoramica {activeTab}</h2>
              <p className="text-gray-500 mt-2">Questa sezione è in fase di sviluppo per il sistema gestionale.</p>
              <button
                onClick={() => setActiveTab('portfolio')}
                className="mt-8 px-6 py-2 border border-gray-700 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Vai a Portfolio
              </button>
            </div>
          )}
        </div>
      </main>

      {isFormOpen && (
        activeTab === 'inventario' ? (
          <InventoryForm
            item={editingItem as any}
            onClose={() => setIsFormOpen(false)}
            onSuccess={() => {
              setIsFormOpen(false);
              fetchItems();
            }}
          />
        ) : (
          <PortfolioForm
            item={editingItem}
            onClose={() => setIsFormOpen(false)}
            onSuccess={() => {
              setIsFormOpen(false);
              fetchItems();
            }}
          />
        )
      )}
    </div>
  );
}
