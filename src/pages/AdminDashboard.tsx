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
  Bell,
  Moon,
  Search,
  UserCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortfolioForm from '../components/PortfolioForm';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [activeTab, setActiveTab] = useState('portfolio');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;

    const { error: dbError } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);

    if (dbError) {
      alert('Errore durante l\'eliminazione dal database');
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
    <div className="flex h-screen bg-[#0a0f18] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-gray-800 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
              <img src="/white-logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight">QuattroSound</span>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'inventario', label: 'Inventario', icon: Package },
              { id: 'categorie', label: 'Categorie', icon: Tags },
              { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-2 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white rounded-lg transition-colors">
            <Settings size={20} />
            <span className="font-medium">Impostazioni</span>
          </button>

          <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <UserCircle size={32} className="text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-sm font-bold truncate max-w-[120px]">Admin</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">QuattroSound</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-2"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#111827]/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-8 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Cerca attrezzatura..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#111827]"></span>
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Moon size={20} />
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ExternalLink size={16} />
              Torna al sito
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'portfolio' ? (
            <>
              <div className="flex justify-between items-start mb-10">
                <div className="relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-full"></div>
                  <h2 className="text-3xl font-bold tracking-tight audiowide-regular">PORTFOLIO LAVORI</h2>
                  <p className="text-gray-400 mt-2">Una selezione visiva delle nostre migliori installazioni ed eventi live.</p>
                </div>
                <button
                  onClick={handleAddNew}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-105"
                >
                  <Plus size={20} />
                  Aggiungi Articolo
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium">Caricamento portfolio...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-32 bg-[#111827]/30 rounded-2xl border-2 border-dashed border-gray-800">
                  <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ImageIcon size={40} className="text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-300">Nessun progetto trovato</h3>
                  <p className="text-gray-500 mt-2 max-w-xs mx-auto">Inizia aggiungendo il tuo primo progetto portfolio per mostrarlo sul sito.</p>
                  <button
                    onClick={handleAddNew}
                    className="mt-8 text-cyan-400 font-bold hover:underline"
                  >
                    Aggiungi ora →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-[#111827] rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500/50 transition-all flex flex-col shadow-lg"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <ImageIcon size={32} className="text-gray-700" />
                          </div>
                        )}

                        <div className="absolute top-3 left-3">
                          <span className="bg-black/60 backdrop-blur-md text-[10px] font-bold text-white px-2.5 py-1 rounded border border-white/10 uppercase tracking-widest">
                            {item.category}
                          </span>
                        </div>

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-white text-gray-900 p-2.5 rounded-lg hover:bg-cyan-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                            title="Modifica"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.image_url)}
                            className="bg-white text-gray-900 p-2.5 rounded-lg hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                            title="Elimina"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 flex-grow">
                        <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                          <div className="w-12 h-1 bg-cyan-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
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
        <PortfolioForm
          item={editingItem}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchItems();
          }}
        />
      )}
    </div>
  );
}
