import { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    date: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbzThyYaYTkQePH3MdrqZ7dxpARqm2m1mDuqCVY6frN-z-1Of5A2im53AsYMOCbsuiwpvA/exec", {
        method: "POST",
        body: new FormData(e.currentTarget as HTMLFormElement),
      });

      setSubmitted(true);
    } catch (error) {
      alert("Errore durante l'invio, riprova.");
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        date: '',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Richiedi un <span className="text-cyan-400">Preventivo</span>
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Rendi il tuo evento indimenticabile con soluzioni LED e audio professionali
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Contattaci Subito</h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                Siamo pronti ad ascoltare le tue esigenze e creare la soluzione perfetta per il tuo evento.
                Compila il form o contattaci direttamente.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                  <Phone className="text-cyan-400" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Telefono</h4>
                  <a href="tel:+393208980405" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    +39 320 898 0405
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                  <MessageSquare className="text-cyan-400" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">WhatsApp</h4>
                  <a href="https://wa.me/393208980405" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    +39 320 898 0405
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                  <Mail className="text-cyan-400" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <a href="mailto:info@quattrosound.it" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    info@quattrosound.it
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                  <MapPin className="text-cyan-400" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Sede Operativa</h4>
                  <p className="text-gray-400">
                    Via Monte Nero 36 <br />
                    00012 Guidonia Montecelio (RM), Italia
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-3">Orari di Lavoro</h4>
              <div className="space-y-2 text-gray-400">
                <p>Lunedì - Venerdì: 9:00 - 18:00</p>
                <p>Sabato: 9:00 - 13:00</p>
                <p className="text-cyan-400 font-semibold">Supporto Eventi: 24/7</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form action="https://script.google.com/macros/s/AKfycbwA-OaXpYf5ho1k8MWTPdFSfE9QFPEfkAcg3nuq6ueb5UPPRO6OlpRP3oXuLITfvt_TtA/exec" onSubmit={handleSubmit} className="bg-gradient-to-r from-blue-800/20 to-cyan-700/20 backdrop-blur rounded-lg p-8 border border-gray-700">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="text-green-400" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Messaggio Inviato!</h3>
                  <p className="text-gray-400">
                    Grazie per averci contattato. Ti risponderemo al più presto.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-white font-medium mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                        placeholder="Mario Rossi"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-white font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                        placeholder="mario@email.it"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-white font-medium mb-2">
                        Telefono *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                        placeholder="+39 333 123 4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="eventType" className="block text-white font-medium mb-2">
                        Tipo di Evento *
                      </label>
                      <select
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                      >
                        <option value="">Seleziona...</option>
                        <option value="concerto">Concerto</option>
                        <option value="conferenza">Conferenza</option>
                        <option value="fiera">Fiera</option>
                        <option value="matrimonio">Matrimonio</option>
                        <option value="aziendale">Evento Aziendale</option>
                        <option value="chiesa">Chiesa</option>
                        <option value="altro">Altro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-white font-medium mb-2">
                      Data Evento
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white font-medium mb-2">
                      Messaggio *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all resize-none"
                      placeholder="Descrivi il tuo evento e le tue esigenze..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cyan-500 gradient-gold hover:bg-cyan-600 disabled:bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Invio in corso...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Invia Richiesta
                      </>
                    )}
                  </button>

                  <p className="text-gray-500 text-sm text-center">
                    Compilando questo form accetti la nostra informativa sulla privacy
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
