import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  image_url: string;
  stock?: number;
  status?: string;
}

interface PortfolioFormProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const LOCATIONS = ['Roma', 'Chiarano'];

export default function PortfolioForm({ item, onClose, onSuccess }: PortfolioFormProps) {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [category, setCategory] = useState(item?.category || 'AUDIO');
  const [location, setLocation] = useState(item?.location || LOCATIONS[0]);
  const [stock] = useState(item?.stock || 1);
  const [status] = useState(item?.status || 'Available');
  const [imageUrl] = useState(item?.image_url || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = imageUrl;

    // 1. Upload image if a new file is selected
    if (imageFile) {
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error('Errore durante il caricamento dell\'immagine: ' + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      } catch (err: any) {
        console.error('Upload error:', err);
        alert('Errore caricamento immagine: ' + (err.message || 'Errore sconosciuto'));
        setLoading(false);
        return;
      }
    }

    // 2. Save to database
    const portfolioData = {
      title,
      description,
      category,
      location,
      stock,
      status,
      image_url: finalImageUrl,
    };

    if (item) {
      // Update
      const { error } = await supabase
        .from('portfolio_items')
        .update(portfolioData)
        .eq('id', item.id);

      if (error) {
        alert('Errore durante l\'aggiornamento: ' + error.message);
      } else {
        // If update successful and we have a new image, delete the old one
        if (imageFile && item.image_url && item.image_url.includes('/storage/v1/object/public/portfolio/')) {
          const oldFilePath = item.image_url.split('/portfolio/')[1];
          if (oldFilePath) {
            await supabase.storage.from('portfolio').remove([oldFilePath]);
          }
        }
        onSuccess();
      }
    } else {
      // Create
      const { error } = await supabase
        .from('portfolio_items')
        .insert([portfolioData]);

      if (error) alert('Errore durante la creazione: ' + error.message);
      else onSuccess();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0a0f18]/95 z-50 flex items-center justify-center p-0 md:p-4 backdrop-blur-xl overflow-y-auto">
      <div className="bg-[#111827] md:rounded-2xl w-full max-w-2xl min-h-screen md:min-h-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-x md:border border-gray-800/50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
              <ImageIcon className="text-cyan-400" size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white audiowide-regular uppercase tracking-wider">
                {item ? 'Modifica Articolo' : 'Nuovo Articolo'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-all bg-gray-800/50 p-2 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-4 md:space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  Titolo Progetto
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Es: Live Concert"
                  className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="location" className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                    Ubicazione
                  </label>
                  <select
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-xs font-bold appearance-none"
                    required
                  >
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="category" className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                    Categoria
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-xs font-bold appearance-none"
                    required
                  >
                    <option value="AUDIO">AUDIO</option>
                    <option value="LUCI">LUCI</option>
                    <option value="VIDEO">VIDEO</option>
                    <option value="STRUTTURE">STRUTTURE</option>
                    <option value="PROGETTI">PROGETTI</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  Descrizione
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Dettagli..."
                  className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-xs font-bold resize-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  Immagine
                </label>
                <div className="relative group aspect-video md:aspect-square bg-gray-800/20 rounded-xl border-2 border-dashed border-gray-800 hover:border-cyan-500/30 flex items-center justify-center overflow-hidden transition-all">
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Current" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="text-gray-600 mx-auto mb-2" size={24} />
                      <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Carica</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 mt-auto">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-8 py-2.5 rounded-lg font-black transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : (item ? 'Aggiorna' : 'Salva')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-2.5 text-[10px] font-black text-gray-500 uppercase tracking-widest"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
