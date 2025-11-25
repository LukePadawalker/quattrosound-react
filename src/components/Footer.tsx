import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800" style={{ backgroundColor: 'rgb(24, 24, 24)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              Quattro<span className="text-gradient-gold">Sound</span>
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Leader nel noleggio e installazione di Ledwall e impianti audio professionali.
              Trasformiamo ogni evento in un'esperienza indimenticabile.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:gradient-gold rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Facebook"
              >
                <Facebook size={20} className="text-gray-300 group-hover:text-black" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:gradient-gold rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-gray-300 group-hover:text-black" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:gradient-gold rounded-lg flex items-center justify-center transition-colors group"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="text-gray-300 group-hover:text-black" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:gradient-gold rounded-lg flex items-center justify-center transition-colors group"
                aria-label="YouTube"
              >
                <Youtube size={20} className="text-gray-300 group-hover:text-black" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Link Rapidi</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Chi Siamo
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Servizi
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Shop
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contatti</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={16} className="text-cyan-400" />
                <a href="tel:+3932089804045" className="hover:text-cyan-400 transition-colors">
                  +39 320 898 0405
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={16} className="text-cyan-400" />
                <a href="mailto:info@ledpro.it" className="hover:text-cyan-400 transition-colors">
                  info@quattrosound.it
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2025 @QuattroSound. | Tutti i diritti riservati.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Cookie Policy
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Termini e Condizioni
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
