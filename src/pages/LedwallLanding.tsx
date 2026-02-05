import { useEffect } from 'react';
import { Monitor, CheckCircle, MapPin, Settings, HelpCircle, ArrowRight, Phone, Mail, Clock } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const LedwallLanding = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    // SEO Metadata
    document.title = "Noleggio Ledwall Venezia – Eventi, Fiere e Aziende | Quattrosound";

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    const description = "Cerchi un noleggio Ledwall a Venezia, Pordenone o Oderzo? Quattrosound offre schermi 4K per fiere ed eventi aziendali con assistenza tecnica inclusa. Scopri di più!";
    metaDescription.setAttribute('content', description);

    return () => {
      document.title = "QuattroSound | Service Audio & Luci";
    };
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Quattrosound",
    "image": "https://quattrosound.it/white-logo.png",
    "@id": "https://quattrosound.it",
    "url": "https://quattrosound.it",
    "telephone": "+393208980405",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Via delle Industrie",
      "addressLocality": "Oderzo",
      "postalCode": "31046",
      "addressRegion": "TV",
      "addressCountry": "IT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 45.782,
      "longitude": 12.492
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/quattrosound",
      "https://www.instagram.com/quattrosound"
    ]
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-audiowide">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navigation />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Noleggio Ledwall Professionale per <br />
            <span className="text-cyan-400">Eventi, Fiere e Aziende</span>
          </h1>
          <p className="text-lg lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-medium">
            Soluzioni video ad alto impatto visivo a Venezia, Pordenone, Oderzo e Udine.
            Tecnologia 4K e installazione certificata per il tuo successo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-8 py-4 rounded-xl font-black transition-all shadow-[0_10px_25px_-5px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
            >
              Richiedi un Preventivo <ArrowRight size={20} />
            </button>
            <a
              href="tel:+393208980405"
              className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-black transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              Chiamaci Ora <Phone size={20} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-24">

        {/* Why Choose Us */}
        <section id="why-choose-us">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 uppercase">
              Perché scegliere il nostro servizio <span className="text-cyan-400">Ledwall</span>
            </h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-800/40 border border-gray-700 rounded-3xl hover:border-cyan-500/50 transition-colors">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Monitor className="text-cyan-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Qualità Video 4K</h3>
              <p className="text-gray-400 leading-relaxed">
                Utilizziamo moduli LED di ultima generazione con pixel pitch ridotto per immagini nitide anche a distanza ravvicinata. Ideale per presentazioni aziendali dettagliate e contenuti 4K.
              </p>
            </div>
            <div className="p-8 bg-gray-800/40 border border-gray-700 rounded-3xl hover:border-cyan-500/50 transition-colors">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Settings className="text-cyan-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Installazione Certificata</h3>
              <p className="text-gray-400 leading-relaxed">
                Ogni montaggio è eseguito da tecnici specializzati. Garantiamo stabilità strutturale e cablaggi professionali per evitare qualsiasi imprevisto durante il tuo evento.
              </p>
            </div>
            <div className="p-8 bg-gray-800/40 border border-gray-700 rounded-3xl hover:border-cyan-500/50 transition-colors">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="text-cyan-400" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Servizio Locale Rapido</h3>
              <p className="text-gray-400 leading-relaxed">
                La nostra sede a Oderzo ci permette di intervenire rapidamente in tutto il Veneto e Friuli, garantendo logistica efficiente per il **noleggio ledwall Venezia** e Pordenone.
              </p>
            </div>
          </div>
        </section>

        {/* SEO Long Content Section */}
        <section className="prose prose-invert prose-cyan max-w-none">
          <div className="bg-gray-800/20 p-8 lg:p-12 rounded-3xl border border-gray-800">
            <h2 className="text-3xl font-bold mb-8 text-white uppercase">Soluzioni Video su Misura per ogni Esigenza</h2>
            <p className="text-gray-300 mb-6 text-lg">
              Benvenuti su Quattrosound, il punto di riferimento per il **noleggio ledwall Venezia**, Pordenone e Oderzo.
              In un mondo dove l'impatto visivo è fondamentale per comunicare messaggi e valori, i nostri schermi LED professionali
              offrono la luminosità e la definizione necessarie per distinguersi. Che si tratti di un grande concerto all'aperto,
              di una fiera internazionale o di una cena aziendale elegante, abbiamo la soluzione tecnologica perfetta per te.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Noleggio Ledwall per Eventi Aziendali e Convention</h3>
            <p className="text-gray-300 mb-6">
              Il **noleggio ledwall eventi aziendali** è una delle nostre specialità. Comprendiamo che la vostra azienda
              richiede perfezione e professionalità. I nostri schermi vengono utilizzati per proiettare video emozionali,
              dati aziendali e live streaming con una chiarezza eccezionale. A Venezia e Treviso, supportiamo le aziende
              nella creazione di scenografie digitali che catturano l'attenzione degli stakeholder e dei dipendenti.
              Il nostro **service audio Oderzo** si integra perfettamente con la parte video, offrendo un'esperienza multimediale completa.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Noleggio Ledwall Fiere: Distinguiti nel Padiglione</h3>
            <p className="text-gray-300 mb-6">
              Nelle fiere di Venezia, Pordenone e Udine, la competizione per l'attenzione dei visitatori è altissima.
              Un ledwall ad alta luminosità è lo strumento definitivo per attirare traffico verso il vostro stand.
              Il **noleggio ledwall fiere** di Quattrosound include non solo lo schermo, ma anche la consulenza sui contenuti
              e il supporto tecnico costante. Grazie ai nostri moduli personalizzabili, possiamo creare pareti video di ogni
              forma e dimensione, adattandoci perfettamente al design del vostro spazio espositivo.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Ledwall per Matrimoni ed Eventi Privati</h3>
            <p className="text-gray-300 mb-6">
              Sempre più sposi scelgono di integrare la tecnologia nel loro giorno speciale. Come leader nel
              **service audio matrimonio** a Venezia e Pordenone, offriamo ledwall per la proiezione di video ricordi,
              dirette della serata o scenografie dinamiche per il momento del taglio della torta. La nostra attrezzatura
              è discreta ed elegante, integrandosi con lo stile della location, dalle ville storiche veneziane ai moderni
              resort in Friuli.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Copertura Territoriale: Venezia, Pordenone, Oderzo e Udine</h3>
            <p className="text-gray-300 mb-6">
              La forza di Quattrosound risiede nella sua profonda conoscenza del territorio locale. Offriamo un servizio
              capillare di **service audio Venezia**, garantendo trasporti puntuali nonostante le sfide logistiche della città lagunare.
              A Pordenone e Udine, siamo il partner tecnico preferito per eventi in piazza e spettacoli live.
              La nostra vicinanza geografica ad Oderzo ci permette di offrire prezzi competitivi e un'assistenza post-vendita
              senza eguali in tutto il Triveneto.
            </p>
          </div>
        </section>

        {/* CTA Block 1 */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-10 lg:p-16 text-center shadow-2xl">
          <h2 className="text-3xl lg:text-5xl font-black mb-6 uppercase tracking-tight">Pronto a dare luce al tuo evento?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Contattaci oggi per un sopralluogo gratuito e un preventivo personalizzato per il tuo Ledwall.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#0a0f18] text-white px-10 py-4 rounded-xl font-black hover:bg-gray-900 transition-all flex items-center gap-2"
            >
              Scrivici Ora <ArrowRight size={20} />
            </button>
          </div>
        </section>

        {/* Technical Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 uppercase">
              Caratteristiche <span className="text-cyan-400">Tecniche</span>
            </h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-6 p-6 bg-gray-800/20 rounded-2xl border border-gray-800">
              <CheckCircle className="text-cyan-400 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-2">Alta Luminosità (5000+ nits)</h4>
                <p className="text-gray-400 text-sm">Visibilità perfetta anche sotto la luce diretta del sole per eventi outdoor.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 bg-gray-800/20 rounded-2xl border border-gray-800">
              <CheckCircle className="text-cyan-400 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-2">Pixel Pitch Ridotto</h4>
                <p className="text-gray-400 text-sm">Immagini definite anche da 2-3 metri di distanza, perfetto per schermi indoor.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 bg-gray-800/20 rounded-2xl border border-gray-800">
              <CheckCircle className="text-cyan-400 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-2">Refresh Rate Elevato</h4>
                <p className="text-gray-400 text-sm">Assenza di sfarfallio nelle riprese video e dirette streaming.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 bg-gray-800/20 rounded-2xl border border-gray-800">
              <CheckCircle className="text-cyan-400 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-2">Configurazioni Creative</h4>
                <p className="text-gray-400 text-sm">Possibilità di montaggio curvo o con angoli per design unici.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gray-800/40 border border-gray-700 p-8 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 uppercase">Installazione e <span className="text-cyan-400">Supporto On-Site</span></h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Il nostro impegno non finisce con il noleggio. Offriamo un servizio "chiavi in mano" che include
                la progettazione dello schema di montaggio, la logistica, l'installazione e la presenza di un tecnico
                certificato durante tutto lo svolgimento dell'evento.
                <br /><br />
                Sia che tu stia organizzando un **service audio Pordenone** o un grande palco a Venezia,
                i nostri esperti gestiranno la regia video, assicurandosi che i contenuti siano riprodotti
                senza interruzioni e con la massima resa cromatica.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-300 font-bold">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div> Trasporto dedicato con mezzi certificati
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-bold">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div> Montaggio su americane o strutture autoportanti
                </li>
                <li className="flex items-center gap-3 text-gray-300 font-bold">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div> Regia video con switcher professionale
                </li>
              </ul>
            </div>
            <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-700 overflow-hidden">
               <img src="/images/hero/hero-1.jpg" alt="Ledwall Installation" className="w-full h-full object-cover opacity-60" />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 uppercase">Domande <span className="text-cyan-400">Frequenti</span></h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                q: "Qual è il costo per il noleggio di un Ledwall a Venezia?",
                a: "Il costo dipende dalle dimensioni dello schermo, dalla risoluzione (pitch) e dalla durata del noleggio. Offriamo pacchetti personalizzati per Venezia includendo il trasporto in barca se necessario. Contattaci per un preventivo esatto."
              },
              {
                q: "Operate anche per piccoli eventi ad Oderzo?",
                a: "Assolutamente sì. Siamo nati come service locale ad Oderzo e supportiamo eventi di ogni dimensione, dalle feste private ai grandi eventi aziendali locali."
              },
              {
                q: "Fornite anche l'audio per il Ledwall?",
                a: "Sì, come esperti di **service audio Udine** e Pordenone, forniamo sistemi audio completi (Line Array, diffusori, mixer) integrati con il sistema video per un'esperienza multimediale perfetta."
              },
              {
                q: "I vostri Ledwall sono adatti per l'uso esterno?",
                a: "Disponiamo di moduli certificati IP65, progettati per resistere a pioggia e vento, garantendo una luminosità elevata visibile anche in pieno sole."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-gray-800/20 border border-gray-800 rounded-2xl">
                <h4 className="font-bold text-lg mb-3 flex items-start gap-3">
                  <HelpCircle className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                  {faq.q}
                </h4>
                <p className="text-gray-400 text-sm ml-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Block 2: Geographical Focus */}
        <section className="bg-gray-800/40 border border-cyan-500/20 p-12 lg:p-20 rounded-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 uppercase">Il tuo Partner per il <span className="text-cyan-400">Service Audio e Video</span> in Triveneto</h2>
          <p className="text-lg text-gray-400 mb-10 max-w-3xl mx-auto">
            Da Venezia a Udine, passando per Pordenone ed Oderzo. Portiamo l'innovazione tecnologica
            al servizio della tua creatività. Siamo specializzati in **service audio matrimonio** e grandi eventi.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
              <span className="block text-cyan-400 font-bold mb-1">Venezia</span>
              <span className="text-[10px] text-gray-500 uppercase">Centri Storici e Hotel</span>
            </div>
            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
              <span className="block text-cyan-400 font-bold mb-1">Pordenone</span>
              <span className="text-[10px] text-gray-500 uppercase">Fiere e Concerti</span>
            </div>
            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
              <span className="block text-cyan-400 font-bold mb-1">Udine</span>
              <span className="text-[10px] text-gray-500 uppercase">Spettacoli Live</span>
            </div>
            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
              <span className="block text-cyan-400 font-bold mb-1">Oderzo</span>
              <span className="text-[10px] text-gray-500 uppercase">Sede Centrale e Supporto</span>
            </div>
          </div>
          <button
            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-12 py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 mx-auto"
          >
            Inizia il Progetto <ArrowRight size={20} />
          </button>
        </section>

        {/* Contact Form Section Mockup */}
        <section id="contact-form" className="py-20 border-t border-gray-800">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-6 uppercase">Contattaci per un <span className="text-cyan-400">Preventivo</span></h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Compila il form per ricevere una quotazione personalizzata entro 24 ore.
                I nostri esperti sono a tua disposizione per una consulenza tecnica gratuita.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 uppercase font-black">Email</span>
                    <span className="text-white font-bold">info@quattrosound.it</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                    <Phone size={24} />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 uppercase font-black">Telefono</span>
                    <span className="text-white font-bold">+39 320 898 0405</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 uppercase font-black">Disponibilità</span>
                    <span className="text-white font-bold">Lun - Ven | 09:00 - 18:00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/40 p-8 rounded-3xl border border-gray-700">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2">Nome</label>
                    <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm focus:border-cyan-500 outline-none transition-colors" placeholder="Nome" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-2">Email</label>
                    <input type="email" className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm focus:border-cyan-500 outline-none transition-colors" placeholder="Email" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-2">Servizio di interesse</label>
                  <select className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm focus:border-cyan-500 outline-none transition-colors">
                    <option>Noleggio Ledwall Venezia</option>
                    <option>Noleggio Ledwall Pordenone</option>
                    <option>Noleggio Ledwall Fiere</option>
                    <option>Service Audio Oderzo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-2">Messaggio</label>
                  <textarea rows={4} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm focus:border-cyan-500 outline-none transition-colors" placeholder="Descrivi il tuo evento..."></textarea>
                </div>
                <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg">Invia Messaggio</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LedwallLanding;
