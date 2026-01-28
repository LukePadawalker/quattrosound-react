import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  User,
  Mail,
  Lock,
  Shield,
  Smartphone,
  History,
  Globe,
  Moon,
  Sun,
  Trash2,
  AlertCircle,
  CheckCircle,
  Save,
  LogOut,
  UserCircle
} from 'lucide-react';

interface AccountSettingsProps {
  isDarkMode: boolean;
}

export default function AccountSettings({ isDarkMode }: AccountSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setEmail(user.email || '');
      setFullName(user.user_metadata?.full_name || '');
      setUsername(user.user_metadata?.username || user.email?.split('@')[0] || '');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, username: username }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Profilo aggiornato con successo!');
      // Also update the profiles table if it exists
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName,
        username: username,
        updated_at: new Date().toISOString()
      });
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    setLoading(true);
    setSuccess(null);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password aggiornata con successo!');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    }
    setLoading(false);
  };

  const handleLogoutAllDevices = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Messages */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-bold">
          <CheckCircle size={18} />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-bold">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Profile Section */}
      <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
            <User size={20} />
          </div>
          <h3 className="text-lg font-bold uppercase tracking-tight audiowide-regular">Informazioni Personali</h3>
        </div>

        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Nome Completo</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                placeholder="Il tuo nome"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Username</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">@</div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                placeholder="username"
              />
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                value={email}
                disabled
                className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 italic">* L'email può essere modificata solo tramite procedura di sicurezza.</p>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-6 py-2.5 rounded-xl font-black transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Save size={18} />
              Salva Profilo
            </button>
          </div>
        </form>
      </section>

      {/* Security Section */}
      <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <Lock size={20} />
          </div>
          <h3 className="text-lg font-bold uppercase tracking-tight audiowide-regular">Sicurezza & Password</h3>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Password Attuale</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Nuova Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Conferma Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <Shield size={14} className="text-emerald-500" />
              Password consigliata: 8+ caratteri
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl font-black transition-all border border-gray-700/50 disabled:opacity-50"
            >
              Aggiorna Password
            </button>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-800/50 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Smartphone size={16} className="text-cyan-400" />
                Autenticazione a due fattori (2FA)
              </h4>
              <p className="text-xs text-gray-500">Aggiungi un ulteriore livello di sicurezza al tuo account.</p>
            </div>
            <button className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all">
              Configura
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <History size={16} className="text-gray-400" />
                Sessioni Attive
              </h4>
              <p className="text-xs text-gray-500">Sei attualmente collegato su questo dispositivo.</p>
            </div>
            <button
              onClick={handleLogoutAllDevices}
              className="px-4 py-2 text-gray-500 hover:text-rose-400 text-xs font-black uppercase tracking-widest transition-all"
            >
              Esci da tutti i dispositivi
            </button>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <Globe size={20} />
          </div>
          <h3 className="text-lg font-bold uppercase tracking-tight audiowide-regular">Preferenze</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/20 border border-gray-700/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                {isDarkMode ? <Moon size={18} className="text-cyan-400" /> : <Sun size={18} className="text-amber-400" />}
              </div>
              <div>
                <p className="text-sm font-bold">Tema Interfaccia</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{isDarkMode ? 'Modalità Scura' : 'Modalità Chiara'}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${isDarkMode ? 'bg-cyan-500' : 'bg-gray-400'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/20 border border-gray-700/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Globe size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold">Lingua Sistema</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Italiano (IT)</p>
              </div>
            </div>
            <select className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer">
              <option value="it">Italiano</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/[0.02]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
            <Trash2 size={20} />
          </div>
          <h3 className="text-lg font-bold uppercase tracking-tight audiowide-regular text-rose-500">Zona Pericolosa</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Elimina Account</h4>
            <p className="text-xs text-gray-500 max-w-md">Una volta eliminato l'account, tutti i tuoi dati verranno rimossi permanentemente. Questa azione non è reversibile.</p>
          </div>
          <button className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-[#0a0f18] px-6 py-2.5 rounded-xl font-black transition-all border border-rose-500/20">
            Elimina Account
          </button>
        </div>
      </section>
    </div>
  );
}
