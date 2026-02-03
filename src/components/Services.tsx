import { Monitor, Volume2, Cable, Headphones, Truck, Wrench, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      icon: Monitor,
      title: 'Noleggio LED Wall',
      description: 'Schermi LED di ogni dimensione per interni ed esterni, con risoluzioni HD e 4K. Ideali per concerti, conferenze, fiere e presentazioni aziendali.',
      features: ['Indoor & Outdoor', 'Risoluzioni fino a 4K', 'Dimensioni personalizzabili', 'Massima luminosità']
    },
    {
      icon: Volume2,
      title: 'Impianti Audio Professionali',
      description: 'Sistemi audio line array e point source delle migliori marche, progettati per garantire una copertura sonora perfetta in ogni ambiente.',
      features: ['Line Array Systems', 'Mixer digitali', 'Microfonazione wireless', 'Acustica ottimizzata']
    },
    {
      icon: Cable,
      title: 'Installazione e Cablaggio',
      description: 'Montaggio professionale di tutte le attrezzature con cablaggio ordinato e sicuro secondo le normative vigenti.',
      features: ['Montaggio certificato', 'Cablaggio professionale', 'Test pre-evento', 'Documentazione tecnica']
    },
    {
      icon: Headphones,
      title: 'Supporto Tecnico On-Site',
      description: 'Tecnici specializzati presenti durante tutto l\'evento per gestire audio, video e risolvere qualsiasi imprevisto.',
      features: ['Presenza costante', 'Regia audio/video', 'Troubleshooting rapido', 'Consulenza live']
    },
    {
      icon: Truck,
      title: 'Trasporto e Logistica',
      description: 'Servizio completo di trasporto, carico e scarico delle attrezzature con mezzi idonei e personale qualificato.',
      features: ['Mezzi attrezzati', 'Assicurazione completa', 'Puntualità garantita', 'Gestione ritiro']
    },
    {
      icon: Wrench,
      title: 'Manutenzione Preventiva',
      description: 'Tutte le nostre attrezzature sono sottoposte a controlli regolari e manutenzione preventiva per garantire affidabilità assoluta.',
      features: ['Check completi', 'Attrezzature certificate', 'Backup disponibili', 'Affidabilità 100%']
    }
  ];

  return (
    <section id="services" className="py-12 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            I Nostri <span className="text-cyan-400">Servizi</span>
          </h2>
          <div className="w-16 lg:w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
          <p className="text-base lg:text-xl text-gray-400 max-w-3xl mx-auto">
            Soluzioni complete per eventi di successo: dal noleggio all'assistenza tecnica
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 lg:p-8 border border-gray-700 hover:border-cyan-400 transition-all group hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 lg:mb-6 group-hover:bg-cyan-500/20 transition-colors group-hover:scale-110 transform duration-300">
                <service.icon className="text-cyan-400" size={24} lg-size={32} />
              </div>

              <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">{service.title}</h3>
              <p className="text-sm lg:text-base text-gray-400 mb-4 lg:mb-6 leading-relaxed">{service.description}</p>

              {service.title === 'Noleggio LED Wall' && (
                <Link
                  to="/noleggio-ledwall-venezia-eventi"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm mb-6 group/link"
                >
                  Scopri di più <ExternalLink size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              )}

              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 lg:mt-16 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 lg:p-12 border border-cyan-500/20">
          <div className="text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Eventi Chiavi in Mano
            </h3>
            <p className="text-base lg:text-lg text-gray-300 mb-6 lg:mb-8 max-w-3xl mx-auto">
              Gestiamo ogni aspetto tecnico del tuo evento: dalla progettazione iniziale alla realizzazione finale.
              Ti liberiamo da ogni preoccupazione tecnica così puoi concentrarti sul successo del tuo evento.
            </p>
            <div className="flex flex-wrap justify-center gap-2 lg:gap-4">
              {['Concerti', 'Conferenze', 'Fiere', 'Matrimoni', 'Eventi Aziendali', 'Chiese'].map((tag) => (
                <span key={tag} className="bg-gray-800 px-4 py-2 lg:px-6 lg:py-3 rounded-lg text-cyan-400 text-xs lg:text-sm font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
