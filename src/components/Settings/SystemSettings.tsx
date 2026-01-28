import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Bell,
  Database,
  ShieldCheck,
  Share2,
  Save,
  Download,
  RefreshCcw,
  ExternalLink,
  MessageSquare,
  CreditCard,
  Cloud,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface SystemSettingsProps {
  isDarkMode: boolean;
}

export default function SystemSettings({ isDarkMode }: SystemSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>({
    notifications_email: true,
    notifications_push: false,
    backup_frequency: 'daily',
    gdpr_compliance: true,
    integrations: { stripe: false, whatsapp: false, google: false }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (data) {
      setSettings(data);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    const { error } = await supabase
      .from('system_settings')
      .upsert({
        ...settings,
        updated_at: new Date().toISOString()
      });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Impostazioni di sistema salvate!');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications */}
        <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Bell size={20} />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-tight audiowide-regular">Notifiche</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Email</p>
                <p className="text-xs text-gray-500">Ricevi avvisi via email per nuovi ordini e messaggi.</p>
              </div>
              <button
                onClick={() => setSettings({...settings, notifications_email: !settings.notifications_email})}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.notifications_email ? 'bg-cyan-500' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notifications_email ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Push Desktop</p>
                <p className="text-xs text-gray-500">Notifiche in tempo reale direttamente sul browser.</p>
              </div>
              <button
                onClick={() => setSettings({...settings, notifications_push: !settings.notifications_push})}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.notifications_push ? 'bg-cyan-500' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notifications_push ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Data & Backup */}
        <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Database size={20} />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-tight audiowide-regular">Dati & Backup</h3>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg"><Download size={16} className="text-gray-400" /></div>
                <span className="text-sm font-bold">Esporta Dati</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-gray-800 text-[10px] font-black uppercase tracking-widest border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">CSV</button>
                <button className="px-3 py-1.5 bg-gray-800 text-[10px] font-black uppercase tracking-widest border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">PDF</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg"><RefreshCcw size={16} className="text-gray-400" /></div>
                <span className="text-sm font-bold">Backup Cloud</span>
              </div>
              <select
                value={settings.backup_frequency}
                onChange={(e) => setSettings({...settings, backup_frequency: e.target.value})}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest focus:outline-none"
              >
                <option value="daily">Quotidiano</option>
                <option value="weekly">Settimanale</option>
                <option value="monthly">Mensile</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      {/* Integrations */}
      <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <Share2 size={20} />
          </div>
          <h3 className="text-lg font-bold uppercase tracking-tight audiowide-regular">Integrazioni Esterne</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'stripe', name: 'Stripe', icon: CreditCard, color: 'text-indigo-400', desc: 'Pagamenti online' },
            { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-400', desc: 'Chat aziendale' },
            { id: 'google', name: 'Google', icon: Cloud, color: 'text-rose-400', desc: 'Google Drive Sync' }
          ].map((app) => (
            <div key={app.id} className="p-5 rounded-2xl bg-gray-800/20 border border-gray-700/30 flex flex-col justify-between gap-6">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl bg-gray-800 ${app.color}`}>
                  <app.icon size={24} />
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1 hover:underline">
                  Configura
                  <ExternalLink size={10} />
                </button>
              </div>
              <div>
                <p className="font-bold text-sm">{app.name}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{app.desc}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Stato: Disconnesso</span>
                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy & GDPR */}
      <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-emerald-500/[0.02] border-emerald-500/20' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight">Privacy & Conformità GDPR</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Il sistema è configurato per rispettare le normative europee.</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-emerald-500/30 text-emerald-500 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
            Visualizza Registro
          </button>
        </div>
      </section>

      {/* Action Bar */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-10 py-3.5 rounded-xl font-black transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={20} />
          Salva Impostazioni Sistema
        </button>
      </div>
    </div>
  );
}
