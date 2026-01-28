import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  ImageIcon,
  Package,
  Tags,
  ChevronRight,
  ArrowUpRight,
  PlusCircle,
  Activity,
  Box,
  Layers
} from 'lucide-react';

interface DashboardTabProps {
  isDarkMode: boolean;
  onNavigate: (tab: string) => void;
}

export default function DashboardTab({ isDarkMode, onNavigate }: DashboardTabProps) {
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
      subtitle: 'Progetti e Lavori',
      value: stats.portfolioCount,
      icon: ImageIcon,
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      description: 'Gestisci la vetrina dei tuoi migliori eventi e installazioni.',
      action: 'Gestisci Portfolio'
    },
    {
      id: 'inventario',
      title: 'Inventario',
      subtitle: 'Attrezzatura Tecnica',
      value: stats.inventoryCount,
      secondaryValue: `${stats.totalInventoryPieces} pezzi totali`,
      icon: Package,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      description: 'Controllo completo del magazzino, disponibilità e stato asset.',
      action: 'Vai al Magazzino'
    },
    {
      id: 'categorie',
      title: 'Categorie',
      subtitle: 'Organizzazione Tecnica',
      value: stats.categoriesCount,
      icon: Tags,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      description: 'Sfoglia gli asset organizzati per tipologia professionale.',
      action: 'Vedi Categorie'
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className={`text-3xl lg:text-4xl font-black tracking-tighter audiowide-regular uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Benvenuto, Admin
        </h2>
        <p className="text-gray-500 mt-1 text-sm lg:text-base font-medium">Panoramica rapida delle attività e dello stato del sistema QuattroSound.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-64 rounded-[2rem] border animate-pulse ${isDarkMode ? 'bg-gray-800/20 border-gray-800/50' : 'bg-gray-100 border-gray-200'}`}></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`group relative p-8 rounded-[2rem] border transition-all duration-300 hover:-translate-y-2 ${
                isDarkMode
                  ? 'bg-[#111827]/40 border-gray-800/50 hover:border-cyan-500/30 hover:bg-[#111827]/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]'
                  : 'bg-white border-gray-200 hover:shadow-2xl hover:border-cyan-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-500`}>
                  <card.icon size={28} />
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-black audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {card.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Elementi</div>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className={`text-xl font-black uppercase tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {card.title}
                </h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{card.subtitle}</p>
                <p className={`text-sm mt-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {card.description}
                </p>
                {card.secondaryValue && (
                   <div className="flex items-center gap-2 mt-4">
                     <Activity size={14} className="text-cyan-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500/80">{card.secondaryValue}</span>
                   </div>
                )}
              </div>

              <button
                onClick={() => onNavigate(card.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isDarkMode
                    ? 'bg-gray-800/30 border-gray-700/50 hover:border-cyan-500/50 text-gray-400 hover:text-white'
                    : 'bg-gray-50 border-gray-200 hover:border-cyan-500/50 text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-xs font-black uppercase tracking-widest">{card.action}</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-10 transition-all translate-x-4 group-hover:translate-x-0">
                <card.icon size={80} className={card.color} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions / Activity Feed Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#111827]/60 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                <PlusCircle size={24} />
              </div>
              <div>
                <h4 className={`text-lg font-black uppercase tracking-tight audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Azioni Rapide</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Crea nuovi contenuti all'istante</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('inventario')}
              className={`flex flex-col items-center gap-4 p-6 rounded-2xl border border-dashed transition-all hover:border-solid hover:scale-105 ${
                isDarkMode ? 'border-gray-700 hover:border-cyan-500/50 bg-gray-800/20' : 'border-gray-200 hover:border-cyan-500/50 bg-gray-50'
              }`}
            >
              <Box size={24} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Nuovo Asset</span>
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className={`flex flex-col items-center gap-4 p-6 rounded-2xl border border-dashed transition-all hover:border-solid hover:scale-105 ${
                isDarkMode ? 'border-gray-700 hover:border-cyan-500/50 bg-gray-800/20' : 'border-gray-200 hover:border-cyan-500/50 bg-gray-50'
              }`}
            >
              <ImageIcon size={24} className="text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Nuovo Progetto</span>
            </button>
          </div>
        </div>

        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#111827]/60 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                <Layers size={24} />
              </div>
              <div>
                <h4 className={`text-lg font-black uppercase tracking-tight audiowide-regular ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Stato Risorse</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Integrità del database</p>
              </div>
            </div>
            <ArrowUpRight size={20} className="text-gray-500" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-800/30">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Database Supabase</span>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-800/30">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Storage Immagini</span>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Attivo
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Certificato SSL</span>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Valido
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
