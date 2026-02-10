import { useEffect, useState } from 'react';
import { Mail, Trash2, MessageSquare, Phone, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { soundManager, SOUNDS } from '../lib/sounds';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  date: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const MessagesTab = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01' || error.code === 'PGRST205') { // Table not found
          setError('MISSING_TABLE');
          return;
        }
        throw error;
      }
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('FETCH_ERROR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel('public_messages')
      .on('postgres_changes', { event: 'INSERT', table: 'contact_messages', schema: 'public' }, payload => {
        setMessages(current => [payload.new as ContactMessage, ...current]);
        soundManager.play(SOUNDS.SUCCESS);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
      soundManager.play(SOUNDS.CLICK);
    } catch (err) {
      console.error('Error updating message:', err);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo messaggio?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      soundManager.play(SOUNDS.CLICK);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error === 'MISSING_TABLE') {
    return (
      <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
            <Filter size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Configurazione <span className="text-amber-500">Incompleta</span></h3>
            <p className="text-gray-400 text-sm">La tabella dei messaggi non è ancora presente nel database.</p>
          </div>
        </div>
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 mb-6">
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Per attivare la gestione dei messaggi, devi eseguire lo script SQL di configurazione nel tuo editor SQL di Supabase.
          </p>
          <div className="flex items-center gap-3">
            <code className="bg-black/50 px-3 py-1 rounded text-cyan-400 text-xs font-mono">supabase_messages.sql</code>
            <span className="text-gray-600 text-xs">Trovi questo file nella root del progetto.</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Una volta eseguito lo script, ricarica questa pagina per visualizzare i messaggi ricevuti.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Messaggi <span className="text-cyan-400">Ricevuti</span></h2>
          <p className="text-gray-400 text-sm">Richieste di contatto dai form pubblici</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Message List */}
        <div className={`${selectedMessage ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
          <div className="bg-gray-800/40 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50 text-[10px] uppercase text-gray-400 font-black">
                  <tr>
                    <th className="px-6 py-4">Mittente</th>
                    <th className="px-6 py-4">Data</th>
                    {!selectedMessage && <th className="px-6 py-4">Messaggio</th>}
                    <th className="px-6 py-4 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {messages.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Nessun messaggio ricevuto</td>
                    </tr>
                  ) : (
                    messages.map((msg) => (
                      <tr
                        key={msg.id}
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (!msg.is_read) markAsRead(msg.id);
                        }}
                        className={`hover:bg-cyan-500/5 transition-colors cursor-pointer ${!msg.is_read ? 'bg-cyan-500/5 border-l-4 border-l-cyan-400' : ''} ${selectedMessage?.id === msg.id ? 'bg-cyan-500/10' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm">{msg.name}</div>
                          <div className="text-[10px] text-gray-400">{msg.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-gray-300">
                            {new Date(msg.created_at).toLocaleDateString('it-IT')}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {new Date(msg.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        {!selectedMessage && (
                          <td className="px-6 py-4">
                            <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{msg.message}</p>
                          </td>
                        )}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMessage(msg.id);
                            }}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Message Detail View */}
        {selectedMessage && (
          <div className="lg:col-span-7 animate-fade-in">
            <div className="bg-gray-800/40 border border-cyan-500/20 rounded-3xl p-8 backdrop-blur-md sticky top-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedMessage.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-2"><Mail size={14} className="text-cyan-400" /> {selectedMessage.email}</span>
                    {selectedMessage.phone && <span className="flex items-center gap-2"><Phone size={14} className="text-cyan-400" /> {selectedMessage.phone}</span>}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-white"
                >
                  <Filter size={20} className="rotate-45" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
                  <div className="text-[10px] uppercase text-gray-500 font-black mb-1">Tipo Evento</div>
                  <div className="text-sm font-bold text-cyan-400 uppercase">{selectedMessage.event_type || 'Non specificato'}</div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
                  <div className="text-[10px] uppercase text-gray-500 font-black mb-1">Data Evento</div>
                  <div className="text-sm font-bold text-white">
                    {selectedMessage.date ? new Date(selectedMessage.date).toLocaleDateString('it-IT') : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-700 relative">
                <MessageSquare className="absolute top-4 right-4 text-gray-800" size={40} />
                <div className="text-[10px] uppercase text-gray-500 font-black mb-3">Messaggio</div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
                <div className="text-[10px] text-gray-500">
                  Ricevuto il {new Date(selectedMessage.created_at).toLocaleString('it-IT')}
                </div>
                <div className="flex gap-4">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-6 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2"
                  >
                    Rispondi via Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesTab;
