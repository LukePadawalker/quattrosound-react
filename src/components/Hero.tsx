import { ArrowRight, Phone } from 'lucide-react';

export default function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <img
          src="/impact-herobg.jpeg"
          alt="LED Wall Event"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(24, 24, 24, 0.6), rgba(24, 24, 24, 0.5), rgba(24, 24, 24, 0.7))' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Sound & Lighting <br />
          <span className="text-gradient-gold">Excellence</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Noleggio e installazione di schermi LED e impianti audio di alta qualità per concerti, conferenze, fiere, matrimoni ed eventi aziendali
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToContact}
            className="group gradient-gold text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-yellow-500/30"
          >
            Richiedi un Preventivo
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>

          <button
            onClick={scrollToContact}
            className="group bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center gap-2"
          >
            <Phone size={20} />
            Contattaci Ora
          </button>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold accent-gold mb-2">15+</div>
            <div className="text-gray-300">Anni di Esperienza</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold accent-gold mb-2">500+</div>
            <div className="text-gray-300">Eventi Realizzati</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold accent-gold mb-2">24/7</div>
            <div className="text-gray-300">Supporto Tecnico</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold accent-gold mb-2">100%</div>
            <div className="text-gray-300">Soddisfazione</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
