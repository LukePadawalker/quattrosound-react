import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err.message);
      setError('Si è verificato un errore durante il caricamento del portfolio. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="gallery" className="py-12 lg:py-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Il Nostro <span className="text-cyan-400">Portfolio</span>
          </h2>
          <div className="w-16 lg:w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
          <p className="text-base lg:text-xl text-gray-400 max-w-3xl mx-auto">
            Scopri alcuni dei progetti che abbiamo realizzato con passione e dedizione
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="text-cyan-400 animate-spin" size={48} />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="text-cyan-400 hover:underline"
            >
              Riprova
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Nessun progetto disponibile al momento.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(project.image_url)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm">{project.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 lg:mt-16 text-center px-4">
          <p className="text-gray-400 text-base lg:text-lg mb-6 lg:mb-8">
            Hai bisogno di vedere altri esempi del nostro lavoro?
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-cyan-500 gradient-gold hover:bg-cyan-600 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-lg text-base lg:text-lg font-semibold transition-all inline-flex items-center gap-2"
          >
            Richiedi il Portfolio Completo
          </button>
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
