import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import {
  ImageIcon,
  Package,
  Tags,
  ChevronRight,
  PlusCircle,
  Box,
  Layers
} from 'lucide-react';

interface DashboardTabProps {
  isDarkMode: boolean;
  onNavigate: (tab: string) => void;
  user: User | null;
}

export default function DashboardTab({ isDarkMode, onNavigate, user }: DashboardTabProps) {
  const [stats, setStats] = useState({
    portfolioCount: 0,
    inventoryCount: 0,
    categoriesCount: 10, // Hardcoded as per technical spec
    totalInventoryPieces: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { count: portfolioCount } = await supabase
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true });

      const { data: inventoryData } = await supabase
        .from('products')
        .select('stock');

      const totalPieces = inventoryData?.reduce((acc, item) => acc + (item.stock || 0), 0) || 0;
      const inventoryCount = inventoryData?.length || 0;

      setStats({
        portfolioCount: portfolioCount || 0,
        inventoryCount: inventoryCount,
        categoriesCount: 10,
        totalInventoryPieces: totalPieces
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: 'portfolio',
      title: 'Portfolio',
      subtitle: 'Progetti',
      value: stats.portfolioCount,
      icon: ImageIcon,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      description: 'Gestisci la vetrina dei tuoi eventi.',
      action: 'Gestisci'
    },
    {
      id: 'inventario',
      title: 'Magazzino',
      subtitle: 'Attrezzatura',
      value: stats.inventoryCount,
      secondaryValue: `${stats.totalInventoryPieces} pezzi`,
      icon: Package,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      description: 'Controllo completo asset.',
      action: 'Vedi'
    },
    {
      id: 'categorie',
      title: 'Categorie',
      subtitle: 'Organizzazione',
      value: stats.categoriesCount,
      icon: Tags,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      description: 'Asset per tipologia.',
      action: 'Sfoglia'
    }
  ];

  return (
    <div className="space-y-4 lg:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div>
        <h2 className={`text-lg lg:text-4xl font-black tracking-tighter audiowide-regular uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Benvenuto, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'}
        </h2>
        <p className="text-gray-500 mt-0.5 text-[10px] lg:text-base font-medium">Stato del sistema QuattroSound.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-40 lg:h-64 rounded-xl lg:rounded-[2rem] border animate-pulse ${isDarkMode ? 'bg-gray-800/20 border-gray-800/50' : 'bg-gray-100 border-gray-200'}`}></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`group relative p-4 lg:p-8 rounded-xl lg:rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 ${
                isDarkMode
                  ? 'bg-[#111827]/40 border-gray-800/50 hover:border-cyan-500/30 hover:bg-[#111827]/60'
                  : 'bg-white border-gray-200 hover:shadow-lg'
              }`}
            >
              <div className="flex justify-between items-start mb-4 lg:mb-8">
                <div className={`p-2 lg:p-4 rounded-lg lg:rounded-2xl ${card.bg} ${card.color}`}>
                  <card.icon size={20} lg-size={24} />
                </div>
                <div className="text-right">
                  <div className={`text-2xl lg:text-4xl font-black audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {card.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-[8px] lg:text-[10px] font-black text-gray-500 uppercase tracking-widest mt-0.5">Elementi</div>
                </div>
              </div>

              <div className="space-y-0.5 lg:space-y-2 mb-4 lg:mb-8">
                <h3 className={`text-base lg:text-xl font-black uppercase tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {card.title}
                </h3>
                <p className="text-gray-500 text-[8px] lg:text-xs font-bold uppercase tracking-widest">{card.subtitle}</p>
                <p className={`text-[10px] lg:text-sm mt-2 lg:mt-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {card.description}
                </p>
              </div>

              <button
                onClick={() => onNavigate(card.id)}
                className={`w-full flex items-center justify-between p-2 lg:p-4 rounded-lg border transition-all ${
                  isDarkMode
                    ? 'bg-gray-800/30 border-gray-700/50 text-gray-400 hover:text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{card.action}</span>
                <ChevronRight size={14} lg-size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <div className={`p-4 lg:p-8 rounded-xl lg:rounded-[2.5rem] border ${isDarkMode ? 'bg-[#111827]/60 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-4 lg:mb-8">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <PlusCircle size={18} lg-size={24} />
            </div>
            <div>
              <h4 className={`text-sm lg:text-lg font-black uppercase tracking-tight audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Azioni Rapide</h4>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('inventario')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-dashed transition-all ${
                isDarkMode ? 'border-gray-700 hover:border-cyan-500/50 bg-gray-800/20' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <Box size={20} className="text-emerald-400" />
              <span className="text-[8px] font-black uppercase tracking-widest">Nuovo Asset</span>
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-dashed transition-all ${
                isDarkMode ? 'border-gray-700 hover:border-cyan-500/50 bg-gray-800/20' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <ImageIcon size={20} className="text-cyan-400" />
              <span className="text-[8px] font-black uppercase tracking-widest">Nuovo Progetto</span>
            </button>
          </div>
        </div>

        <div className={`p-4 lg:p-8 rounded-xl lg:rounded-[2.5rem] border ${isDarkMode ? 'bg-[#111827]/60 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-4 lg:mb-8">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Layers size={18} lg-size={24} />
            </div>
            <div>
              <h4 className={`text-sm lg:text-lg font-black uppercase tracking-tight audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Stato Risorse</h4>
            </div>
          </div>

          <div className="space-y-2 lg:space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-800/30">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Database</span>
              <span className="text-[9px] font-black uppercase text-emerald-500">Online</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-800/30">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Storage</span>
              <span className="text-[9px] font-black uppercase text-emerald-500">Attivo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
