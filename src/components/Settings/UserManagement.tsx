import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  MoreVertical,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Key,
  Edit2,
  Trash2
} from 'lucide-react';

interface UserManagementProps {
  isDarkMode: boolean;
}

export default function UserManagement({ isDarkMode }: UserManagementProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });

    if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(user =>
    (user.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black audiowide-regular uppercase tracking-tight">Gestione Team</h3>
          <p className="text-gray-500 text-sm font-medium mt-1">Gestisci i permessi e gli accessi dei membri del team.</p>
        </div>
        <button className="bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-6 py-2.5 rounded-xl font-black transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2">
          <UserPlus size={18} strokeWidth={3} />
          Nuovo Utente
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Cerca per nome o username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
          />
        </div>
        <button className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl border font-bold text-sm ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'}`}>
          <Filter size={18} />
          Ruoli
        </button>
      </div>

      {/* Users Table */}
      <div className={`border rounded-2xl overflow-hidden ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-800 bg-gray-800/40' : 'border-gray-100 bg-gray-50'}`}>
                <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Utente</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Ruolo</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Stato</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Caricamento membri...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Nessun utente trovato.</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-cyan-500/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isDarkMode ? 'bg-gray-800 text-cyan-400' : 'bg-gray-100 text-cyan-600'}`}>
                        {user.full_name?.[0] || user.username?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{user.full_name || 'Utente senza nome'}</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">@{user.username || 'username'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' ? (
                        <ShieldAlert size={14} className="text-amber-500" />
                      ) : user.role === 'operator' ? (
                        <ShieldCheck size={14} className="text-cyan-500" />
                      ) : (
                        <Shield size={14} className="text-gray-500" />
                      )}
                      <span className={`text-xs font-bold uppercase tracking-widest ${
                        user.role === 'admin' ? 'text-amber-500' :
                        user.role === 'operator' ? 'text-cyan-400' :
                        'text-gray-500'
                      }`}>
                        {user.role || 'viewer'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Attivo</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-600 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all" title="Reset Password">
                        <Key size={16} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all" title="Modifica">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all" title="Elimina">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Guide */}
      <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-cyan-500/[0.02] border-cyan-500/20' : 'bg-gray-50 border-gray-200'}`}>
        <h4 className="text-sm font-black uppercase tracking-widest text-cyan-500 mb-4">Guida ai Ruoli</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-500">ADMIN</p>
            <p className="text-[10px] text-gray-500 font-medium">Accesso completo, gestione utenti e impostazioni di sistema.</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-cyan-400">OPERATOR</p>
            <p className="text-[10px] text-gray-500 font-medium">Gestione inventario e portfolio. Non può modificare impostazioni globali.</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400">VIEWER</p>
            <p className="text-[10px] text-gray-500 font-medium">Accesso in sola lettura a tutte le sezioni del gestionale.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
