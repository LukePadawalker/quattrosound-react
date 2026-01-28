import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  CreditCard,
  Upload,
  CheckCircle,
  AlertCircle,
  Save,
  Image as ImageIcon
} from 'lucide-react';

interface CompanySettingsProps {
  isDarkMode: boolean;
}

export default function CompanySettings({ isDarkMode }: CompanySettingsProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<any>({
    company_name: '',
    address: '',
    vat_number: '',
    phone: '',
    email: '',
    working_hours: {},
    billing_preferences: '',
    company_logo: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .single();

    if (data) {
      setSettings(data);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    const { error } = await supabase
      .from('company_settings')
      .upsert({
        ...settings,
        updated_at: new Date().toISOString()
      });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Impostazioni aziendali salvate!');
    }
    setLoading(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mock upload for now
    if (e.target.files?.[0]) {
      setSuccess('Logo caricato (simulazione)');
    }
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Header Settings */}
        <section className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-3xl overflow-hidden border-2 border-dashed flex items-center justify-center transition-all ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 group-hover:border-cyan-500/50' : 'bg-gray-50 border-gray-300 group-hover:border-cyan-500/50'}`}>
                {settings.company_logo ? (
                  <img src={settings.company_logo} alt="Logo" className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto text-gray-500 mb-2" size={24} />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Logo</span>
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-2 bg-cyan-500 text-[#0a0f18] rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <Upload size={16} />
                <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
              </label>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h3 className="text-2xl font-black audiowide-regular uppercase tracking-tight">{settings.company_name || 'Nome Azienda'}</h3>
                <p className="text-gray-500 text-sm font-medium mt-1">Configura l'identità e i dettagli della tua attività professionale.</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <MapPin size={14} className="text-cyan-500" />
                  {settings.address || 'Indirizzo non impostato'}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Mail size={14} className="text-cyan-500" />
                  {settings.email || 'email@esempio.it'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* General Info */}
        <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Building2 size={20} />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-tight audiowide-regular">Informazioni Aziendali</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Ragione Sociale</label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({...settings, company_name: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                placeholder="QuattroSound S.r.l."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">P. IVA / Codice Fiscale</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={settings.vat_number}
                  onChange={(e) => setSettings({...settings, vat_number: e.target.value})}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="IT01234567890"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Telefono</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="+39 06 1234567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Email Aziendale</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="info@quattrosound.it"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Indirizzo Sede</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="Via delle Note, 42 - 00100 Roma"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Business Hours & Billing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <Clock size={20} />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight audiowide-regular">Orari di Lavoro</h3>
            </div>

            <div className="space-y-3">
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
                <div key={day} className="flex items-center justify-between py-2 border-b border-gray-800/30 last:border-0">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">{day}</span>
                  <input
                    type="text"
                    defaultValue={day === 'Sab' || day === 'Dom' ? 'Chiuso' : '09:00 - 18:00'}
                    className={`bg-transparent text-right text-xs font-bold focus:outline-none focus:text-cyan-400 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111827]/40 border-gray-800/50' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <CreditCard size={20} />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight audiowide-regular">Preferenze Fatturazione</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Metodo Predefinito</label>
                <select className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                  <option>Bonifico Bancario</option>
                  <option>Carta di Credito</option>
                  <option>PayPal</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Note in Fattura</label>
                <textarea
                  value={settings.billing_preferences}
                  onChange={(e) => setSettings({...settings, billing_preferences: e.target.value})}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${isDarkMode ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="Inserisci note legali o coordinate bancarie..."
                ></textarea>
              </div>
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className={`px-8 py-3 rounded-xl font-black text-sm transition-all border ${isDarkMode ? 'border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800/50' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-8 py-3 rounded-xl font-black transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            Salva Configurazioni
          </button>
        </div>
      </form>
    </div>
  );
}
