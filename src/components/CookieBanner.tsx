import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900 border border-cyan-500/30 rounded-lg shadow-2xl backdrop-blur-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cookie className="text-cyan-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1 text-sm md:text-base">
                  Utilizziamo i Cookie
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                  Questo sito utilizza cookie per migliorare l'esperienza utente e analizzare il traffico.
                  Continuando la navigazione accetti l'uso dei cookie.{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                    Maggiori informazioni
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleDecline}
                className="flex-1 md:flex-none bg-gray-800 hover:bg-gray-700 text-white px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all border border-gray-700"
              >
                Rifiuta
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none bg-cyan-500 hover:bg-cyan-600 text-white px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all"
              >
                Accetta
              </button>
              <button
                onClick={handleDecline}
                className="md:hidden text-gray-400 hover:text-white p-2"
                aria-label="Chiudi"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
