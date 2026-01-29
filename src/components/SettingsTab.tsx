import { useState } from 'react';
import {
  User,
  Building2,
  Users,
  Settings as SettingsIcon,
  ChevronRight
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
    { id: 'account', label: 'Account', icon: User, desc: 'Profilo, sicurezza' },
    { id: 'company', label: 'Azienda', icon: Building2, desc: 'Dati legali, logo' },
    { id: 'users', label: 'Team', icon: Users, desc: 'Gestione membri' },
    { id: 'system', label: 'Sistema', icon: SettingsIcon, desc: 'Notifiche' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 space-y-2">
        <div className="mb-2 lg:mb-6 px-1 lg:px-4 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <h2 className={`text-base lg:text-2xl font-black audiowide-regular uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Impostazioni</h2>
          <p className="text-gray-500 text-[8px] lg:text-xs font-bold uppercase tracking-widest mt-0.5">Configurazione globale</p>
        </div>

        <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`flex items-center gap-2 lg:gap-4 px-3 lg:px-4 py-3 lg:py-4 rounded-xl transition-all group animate-fade-in-up ${
                activeSubTab === item.id
                  ? 'bg-cyan-500 text-[#0a0f18] shadow-lg shadow-cyan-500/20'
                  : `${isDarkMode ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
              }`}
              style={{ animationDelay: `${50 + (index * 50)}ms` }}
            >
              <div className={`p-1.5 lg:p-2 rounded-lg transition-colors ${
                activeSubTab === item.id ? 'bg-white/20' : 'bg-gray-500/10 group-hover:bg-gray-500/20'
              }`}>
                <item.icon size={16} lg-size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] lg:text-sm font-black uppercase tracking-tight leading-none">{item.label}</p>
              </div>
              <ChevronRight size={14} className={`ml-auto hidden lg:block transition-transform ${
                activeSubTab === item.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'
              }`} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 min-w-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className={`h-full rounded-xl lg:rounded-3xl border p-3 lg:p-8 ${isDarkMode ? 'bg-[#0f172a]/20 border-gray-800/50' : 'bg-gray-50/50 border-gray-100 shadow-inner'}`}>
          {activeSubTab === 'account' && <AccountSettings isDarkMode={isDarkMode} />}
          {activeSubTab === 'company' && <CompanySettings isDarkMode={isDarkMode} />}
          {activeSubTab === 'users' && <UserManagement isDarkMode={isDarkMode} />}
          {activeSubTab === 'system' && <SystemSettings isDarkMode={isDarkMode} />}
        </div>
      </main>
    </div>
  );
}
