import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  ChevronLeft,
  Package,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface CategoriesTabProps {
  isDarkMode: boolean;
  onEdit: (item: any) => void;
  onDelete: (id: string, imageUrl: string) => void;
}

export default function CategoriesTab({ isDarkMode, onEdit, onDelete }: CategoriesTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    categories: 10,
    typologies: 0,
    totalPieces: 0
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryItems(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCounts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('category, stock, name');

    if (!error && data) {
      const newCounts: Record<string, number> = {};
      let totalPezzi = 0;
      const uniqueTypologies = new Set();

      data.forEach(item => {
        newCounts[item.category] = (newCounts[item.category] || 0) + 1;
        totalPezzi += (item.stock || 0);
        uniqueTypologies.add(item.name);
      });

      setCounts(newCounts);
      setStats({
        categories: 10,
        typologies: uniqueTypologies.size,
        totalPieces: totalPezzi
      });
    }
  };

  const fetchCategoryItems = async (categoryName: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryName)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data.map(item => ({
        ...item,
        title: item.name || item.title || 'Senza Titolo'
      })));
    }
    setLoading(false);
  };

  if (selectedCategory) {
    return (
      <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode
                  ? 'bg-gray-800/40 border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft size={18} lg-size={20} />
            </button>
            <div>
              <h2 className={`text-xl lg:text-3xl font-black tracking-tighter audiowide-regular uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedCategory}
              </h2>
              <p className="text-gray-500 mt-0.5 text-xs lg:text-sm font-medium">Visualizzazione asset per categoria.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium font-bold uppercase tracking-widest text-[10px]">Caricamento asset...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-32 bg-[#111827]/20 rounded-3xl border border-gray-800/50 border-dashed">
            <div className="w-20 h-20 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-gray-700" />
            </div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nessun articolo in questa categoria</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto text-sm">Inizia aggiungendo il tuo primo contenuto in questa categoria.</p>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`group flex items-center gap-4 lg:gap-6 p-3 lg:p-4 rounded-xl lg:rounded-2xl border transition-all ${
                  isDarkMode
                    ? 'bg-[#111827]/40 border-gray-800/50 hover:border-cyan-500/30 hover:bg-[#111827]/60'
                    : 'bg-white border-gray-200 hover:shadow-lg hover:border-cyan-500/30'
                }`}
              >
                <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden border shadow-inner flex-shrink-0 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-100 border-gray-200'}`}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon size={24} className="text-gray-400" /></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-base lg:text-lg font-black uppercase tracking-tight transition-colors ${isDarkMode ? 'text-white group-hover:text-cyan-400' : 'text-gray-900 group-hover:text-cyan-600'}`}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 lg:gap-4 mt-1">
                        <div className="flex items-center gap-1 text-[9px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          <MapPin size={12} className="text-cyan-500/50" />
                          {item.location || 'Roma'}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          <Package size={12} className="text-cyan-500/50" />
                          {item.stock || 0} PEZZI
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          <Calendar size={12} className="text-cyan-500/50" />
                          {new Date(item.created_at).toLocaleDateString('it-IT')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2.5 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl border border-transparent hover:border-cyan-500/20 transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id, item.image_url)}
                        className="p-2.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/20 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700">
      <div>
        <div className="flex justify-between items-end">
          <div>
            <h2 className={`text-xl lg:text-4xl font-black tracking-tighter audiowide-regular uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Esplora Categorie
            </h2>
            <p className="text-gray-500 mt-0.5 text-xs lg:text-base font-medium">
              Organizzazione intelligente per gestire il tuo parco macchine professionale con precisione.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sistema Aggiornato</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = counts[cat.name] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`group relative text-left p-5 lg:p-8 rounded-2xl lg:rounded-[2rem] border transition-all duration-300 hover:-translate-y-2 ${
                isDarkMode
                  ? 'bg-[#111827]/40 border-gray-800/50 hover:border-cyan-500/30 hover:bg-[#111827]/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]'
                  : 'bg-white border-gray-200 hover:shadow-2xl hover:border-cyan-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-6 lg:mb-12">
                <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={22} lg-size={28} />
                </div>
                <div className="text-right">
                  <div className={`text-xl lg:text-2xl font-black audiowide-regular ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`}>
                    {count.toString().padStart(2, '0')}
                  </div>
                  <div className="text-[9px] lg:text-[10px] font-black text-gray-500 uppercase tracking-widest mt-0.5">Assets</div>
                </div>
              </div>

              <h3 className={`text-sm lg:text-lg font-black uppercase tracking-tight leading-tight group-hover:text-cyan-400 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {cat.name}
              </h3>

              <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <Plus size={20} className="text-cyan-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats Footer */}
      <div className={`p-5 lg:p-8 rounded-2xl lg:rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8 transition-colors ${
        isDarkMode ? 'bg-[#111827]/60 border-gray-800/50' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-cyan-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <svg width="24" lg-width="28" height="24" lg-height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a0f18]">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </div>
          <div>
            <h4 className={`text-lg lg:text-xl font-black uppercase tracking-tight audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Magazzino</h4>
            <p className="text-gray-500 text-[10px] lg:text-xs font-bold uppercase tracking-widest mt-0.5">Inventario aggiornato in tempo reale.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 lg:gap-20">
          <div className="text-center">
            <div className={`text-xl lg:text-3xl font-black audiowide-regular ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{stats.categories}</div>
            <div className="text-[9px] lg:text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mt-1">Cat.</div>
          </div>
          <div className="text-center">
            <div className={`text-xl lg:text-3xl font-black audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.typologies}</div>
            <div className="text-[9px] lg:text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mt-1">Tipi</div>
          </div>
          <div className="text-center">
            <div className={`text-xl lg:text-3xl font-black audiowide-regular text-yellow-500`}>{stats.totalPieces}</div>
            <div className="text-[9px] lg:text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mt-1">Pezzi</div>
          </div>
        </div>
      </div>
    </div>
  );
}
