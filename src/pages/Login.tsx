import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email o password non corretti.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Indirizzo email non confermato.');
        } else {
          setError('Si è verificato un errore durante l\'accesso. Riprova più tardi.');
          console.error('Login error:', error.message);
        }
        setLoading(false);
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError('Errore di connessione al server.');
      setLoading(false);
      console.error('Login exception:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] flex items-center justify-center px-4 font-audiowide">
      <div className="max-w-md w-full bg-[#111827] rounded-xl shadow-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-full mb-4">
            <LogIn className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white audiowide-regular">Accesso Admin</h2>
          <p className="text-gray-400 mt-2">Inserisci le tue credenziali per accedere alla dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              Indirizzo Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1f2937] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              required
              placeholder="admin@quattrosound.it"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1f2937] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <span>←</span> Torna al sito
          </button>
        </div>
      </div>
    </div>
  );
}
