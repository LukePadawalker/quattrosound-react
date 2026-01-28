import { useState } from 'react';
import {
  User,
  Building2,
  Users,
  Settings as SettingsIcon,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Bell
} from 'lucide-react';
import AccountSettings from './Settings/AccountSettings';
import CompanySettings from './Settings/CompanySettings';
import UserManagement from './Settings/UserManagement';
import SystemSettings from './Settings/SystemSettings';

interface SettingsTabProps {
  isDarkMode: boolean;
}

export default function SettingsTab({ isDarkMode }: SettingsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState('account');

  const menuItems = [
    { id: 'account', label: 'Account', icon: User, desc: 'Profilo, sicurezza e password' },
    { id: 'company', label: 'Azienda', icon: Building2, desc: 'Dati legali, logo e orari' },
    { id: 'users', label: 'Team', icon: Users, desc: 'Gestione membri e permessi' },
    { id: 'system', label: 'Sistema', icon: SettingsIcon, desc: 'Notifiche e integrazioni' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 min-h-[600px]">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 space-y-2">
        <div className="mb-4 lg:mb-6 px-2 lg:px-4">
          <h2 className={`text-xl lg:text-2xl font-black audiowide-regular uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Impostazioni</h2>
          <p className="text-gray-500 text-[10px] lg:text-xs font-bold uppercase tracking-widest mt-0.5">Configurazione globale</p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all group ${
                activeSubTab === item.id
                  ? 'bg-cyan-500 text-[#0a0f18] shadow-lg shadow-cyan-500/20'
                  : `${isDarkMode ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                activeSubTab === item.id ? 'bg-white/20' : 'bg-gray-500/10 group-hover:bg-gray-500/20'
              }`}>
                <item.icon size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black uppercase tracking-tight leading-none">{item.label}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ${
                  activeSubTab === item.id ? 'text-[#0a0f18]/60' : 'text-gray-500'
                }`}>
                  {item.desc}
                </p>
              </div>
              <ChevronRight size={16} className={`ml-auto transition-transform ${
                activeSubTab === item.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'
              }`} />
            </button>
          ))}
        </nav>

        {/* Quick Links / Status */}
        <div className={`mt-6 lg:mt-12 p-4 lg:p-5 rounded-2xl lg:rounded-3xl border border-dashed ${isDarkMode ? 'border-gray-800 bg-gray-800/10' : 'border-gray-200 bg-gray-50'}`}>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Stato Sistema</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sicurezza Attiva</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-cyan-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Piano Enterprise</span>
            </div>
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">12 Notifiche Pendenti</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 min-w-0">
        <div className={`h-full rounded-2xl lg:rounded-3xl border p-3 lg:p-8 ${isDarkMode ? 'bg-[#0f172a]/20 border-gray-800/50' : 'bg-gray-50/50 border-gray-100 shadow-inner'}`}>
          {activeSubTab === 'account' && <AccountSettings isDarkMode={isDarkMode} />}
          {activeSubTab === 'company' && <CompanySettings isDarkMode={isDarkMode} />}
          {activeSubTab === 'users' && <UserManagement isDarkMode={isDarkMode} />}
          {activeSubTab === 'system' && <SystemSettings isDarkMode={isDarkMode} />}
        </div>
      </main>
    </div>
  );
}
