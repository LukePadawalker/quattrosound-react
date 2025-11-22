import { CheckCircle2 } from 'lucide-react';

export default function Technology() {
  const brands = {
    led: [
      'Novastar',
      'Colorlight',
      'Absen',
      'Unilumin',
      'ROE Visual'
    ],
    audio: [
      'Midas',
      'd&b audiotechnik',
      'L-Acoustics',
      'Shure',
      'Sennheiser',
      'Yamaha',
      'Allen & Heath',
      'Behringer'
    ],
    lighting: [
      'Martin Professional',
      'Clay Paky',
      'Ayrton',
      'GLP',
      'Chamsys'
    ],
    video: [
      'Blackmagic Design',
      'Roland',
      'Barco',
      'Christie'
    ]
  };

  return (
    <section id="technology" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tecnologia <span className="text-cyan-400">Premium</span>
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Lavoriamo solo con i migliori brand internazionali per garantire qualità e affidabilità
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="text-cyan-400" size={24} />
              </div>
              LED Wall & Video
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {brands.led.map((brand, index) => (
                <div
                  key={index}
                  className="bg-gray-900 px-4 py-3 rounded-lg text-gray-300 font-medium hover:text-cyan-400 hover:border-cyan-400 border border-gray-700 transition-all"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="text-cyan-400" size={24} />
              </div>
              Audio Professionale
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {brands.audio.map((brand, index) => (
                <div
                  key={index}
                  className="bg-gray-900 px-4 py-3 rounded-lg text-gray-300 font-medium hover:text-cyan-400 hover:border-cyan-400 border border-gray-700 transition-all"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="text-cyan-400" size={24} />
              </div>
              Illuminazione
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {brands.lighting.map((brand, index) => (
                <div
                  key={index}
                  className="bg-gray-900 px-4 py-3 rounded-lg text-gray-300 font-medium hover:text-cyan-400 hover:border-cyan-400 border border-gray-700 transition-all"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="text-cyan-400" size={24} />
              </div>
              Regia Video
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {brands.video.map((brand, index) => (
                <div
                  key={index}
                  className="bg-gray-900 px-4 py-3 rounded-lg text-gray-300 font-medium hover:text-cyan-400 hover:border-cyan-400 border border-gray-700 transition-all"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-8 md:p-12 border border-cyan-500/20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-3">4K</div>
              <div className="text-gray-300 text-lg">Risoluzioni Ultra HD</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-3">10K+</div>
              <div className="text-gray-300 text-lg">Nits di Luminosità</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-cyan-400 mb-3">96kHz</div>
              <div className="text-gray-300 text-lg">Qualità Audio Studio</div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-lg">
            Tutte le nostre attrezzature sono regolarmente certificate, testate e mantenute secondo i più alti standard professionali
          </p>
        </div>
      </div>
    </section>
  );
}
