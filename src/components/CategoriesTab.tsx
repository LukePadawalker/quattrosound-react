import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  ChevronLeft,
  Package,
  MapPin,
  Image as ImageIcon,
  Edit2
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface CategoriesTabProps {
  isDarkMode: boolean;
  onEdit: (item: any) => void;
}

export default function CategoriesTab({ isDarkMode, onEdit }: CategoriesTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
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
      .select('category, stock, name, image_url');

    if (!error && data) {
      const newCounts: Record<string, number> = {};
      const newImages: Record<string, string> = {};
      let totalPezzi = 0;
      const uniqueTypologies = new Set();

      data.forEach(item => {
        newCounts[item.category] = (newCounts[item.category] || 0) + 1;
        if (item.image_url && !newImages[item.category]) {
          newImages[item.category] = item.image_url;
        }
        totalPezzi += (item.stock || 0);
        uniqueTypologies.add(item.name);
      });

      setCounts(newCounts);
      setCategoryImages(newImages);
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
      <div className="space-y-4 lg:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-1.5 rounded-lg border transition-all ${
                isDarkMode
                  ? 'bg-gray-800/40 border-gray-700/50 text-gray-400'
                  : 'bg-white border-gray-200 text-gray-500'
              }`}
            >
              <ChevronLeft size={16} lg-size={20} />
            </button>
            <div>
              <h2 className={`text-base lg:text-3xl font-black tracking-tighter audiowide-regular uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedCategory}
              </h2>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-[#111827]/20 rounded-2xl border border-gray-800/50 border-dashed">
            <h3 className={`text-base font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nessun articolo</h3>
          </div>
        ) : (
          <div className="space-y-2 lg:space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`group flex items-center gap-3 lg:gap-6 p-2 lg:p-4 rounded-xl border transition-all ${
                  isDarkMode
                    ? 'bg-[#111827]/40 border-gray-800/50'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 lg:w-20 lg:h-20 rounded-lg overflow-hidden border flex-shrink-0 ${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-100 border-gray-200'}`}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-gray-400" /></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <h3 className={`text-[11px] lg:text-lg font-black uppercase tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1 text-[8px] lg:text-[10px] text-gray-500 font-bold uppercase">
                          <MapPin size={10} className="text-cyan-500/50" />
                          {item.location || 'Roma'}
                        </div>
                        <div className="flex items-center gap-1 text-[8px] lg:text-[10px] text-gray-500 font-bold uppercase">
                          <Package size={10} className="text-cyan-500/50" />
                          {item.stock || 0} PEZZI
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-gray-500 hover:text-cyan-400 transition-all"
                      >
                        <Edit2 size={14} />
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
    <div className="space-y-4 lg:space-y-10 animate-fade-in-up">
      <div>
        <h2 className={`text-lg lg:text-4xl font-black tracking-tighter audiowide-regular uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Esplora Categorie
        </h2>
        <p className="text-gray-500 mt-0.5 text-[10px] lg:text-base font-medium">
          Organizzazione professionale QuattroSound.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6">
        {CATEGORIES.map((cat, index) => {
          const Icon = cat.icon;
          const count = counts[cat.name] || 0;
          const bgImage = categoryImages[cat.name];
          const overlayColor = cat.color.replace('text-', 'bg-').replace('-400', '-500/20');

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`group relative text-left p-4 lg:p-8 rounded-xl lg:rounded-[2rem] border transition-all duration-500 overflow-hidden animate-fade-in-up ${
                isDarkMode
                  ? 'bg-[#111827]/40 border-gray-800/50 hover:border-cyan-500/50'
                  : 'bg-white border-gray-200 hover:shadow-xl'
              } shadow-lg hover:-translate-y-1`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Background Image - No Blur */}
              {bgImage && (
                <>
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${bgImage})` }}
                  />
                  <div className={`absolute inset-0 z-10 ${overlayColor} transition-colors duration-300 group-hover:bg-black/20`} />
                  <div className={`absolute inset-0 z-10 ${isDarkMode ? 'bg-black/40' : 'bg-white/20'}`} />
                </>
              )}

              <div className="relative z-20 flex justify-between items-start mb-4 lg:mb-12">
                <div className={`p-2 lg:p-4 rounded-lg lg:rounded-2xl backdrop-blur-md shadow-inner transition-transform duration-300 group-hover:scale-110 ${cat.bg} ${cat.color} border border-white/10`}>
                  <Icon size={18} lg-size={28} />
                </div>
                <div className="text-right">
                  <div className={`text-lg lg:text-2xl font-black audiowide-regular transition-colors duration-300 ${isDarkMode ? 'text-white/30 group-hover:text-cyan-400' : 'text-gray-300 group-hover:text-cyan-600'}`}>
                    {count.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>

              <h3 className={`relative z-20 text-[10px] lg:text-lg font-black uppercase tracking-tight leading-tight transition-all duration-300 ${isDarkMode ? 'text-white drop-shadow-md' : 'text-gray-900'} group-hover:translate-x-1`}>
                {cat.name}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Stats Footer */}
      <div className={`p-4 lg:p-8 rounded-xl lg:rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-8 transition-colors ${
        isDarkMode ? 'bg-[#111827]/60 border-gray-800/50' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-3 lg:gap-6 w-full md:w-auto">
          <div className="w-10 h-10 lg:w-14 lg:h-14 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Package size={20} lg-size={28} className="text-[#0a0f18]" />
          </div>
          <div>
            <h4 className={`text-sm lg:text-xl font-black uppercase tracking-tight audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Magazzino</h4>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 lg:gap-20 w-full md:w-auto">
          <div className="text-center">
            <div className={`text-base lg:text-3xl font-black audiowide-regular ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{stats.categories}</div>
            <div className="text-[8px] lg:text-[10px] font-black text-gray-500 uppercase tracking-[0.1em]">Cat.</div>
          </div>
          <div className="text-center">
            <div className={`text-base lg:text-3xl font-black audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.typologies}</div>
            <div className="text-[8px] lg:text-[10px] font-black text-gray-500 uppercase tracking-[0.1em]">Tipi</div>
          </div>
          <div className="text-center">
            <div className={`text-base lg:text-3xl font-black audiowide-regular text-yellow-500`}>{stats.totalPieces}</div>
            <div className="text-[8px] lg:text-[10px] font-black text-gray-500 uppercase tracking-[0.1em]">Pezzi</div>
          </div>
        </div>
      </div>
    </div>
  );
}
