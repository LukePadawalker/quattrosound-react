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
}

interface PortfolioFormProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PortfolioForm({ item, onClose, onSuccess }: PortfolioFormProps) {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [category, setCategory] = useState(item?.category || 'AUDIO');
  const [location, setLocation] = useState(item?.location || '');
  const [imageUrl] = useState(item?.image_url || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      setUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, imageFile);

      if (uploadError) {
        alert('Errore durante il caricamento dell\'immagine: ' + uploadError.message);
        setUploading(false);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      finalImageUrl = publicUrl;
      setUploading(false);
    }

    // 2. Save to database
    const portfolioData = {
      title,
      description,
      category,
      location,
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
    <div className="fixed inset-0 bg-[#0a0f18]/90 z-50 flex items-center justify-center p-4 backdrop-blur-xl">
      <div className="bg-[#111827] rounded-[2rem] w-full max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800/50 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-8 border-b border-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]">
              <ImageIcon className="text-cyan-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white audiowide-regular uppercase tracking-wider">
                {item ? 'Modifica Articolo' : 'Nuovo Articolo'}
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Gestione Portfolio QuattroSound</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-all bg-gray-800/50 hover:bg-gray-800 p-2.5 rounded-xl border border-gray-700/50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <label htmlFor="title" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                  Titolo Progetto
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Es: Live Concert Setup"
                  className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold placeholder:text-gray-700 text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                  Ubicazione / Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Es: Roma, IT"
                  className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold placeholder:text-gray-700 text-sm"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                  Categoria
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold appearance-none text-sm cursor-pointer"
                  required
                >
                  <option value="AUDIO">AUDIO</option>
                  <option value="LUCI">LUCI</option>
                  <option value="VIDEO">VIDEO</option>
                  <option value="STRUTTURE">STRUTTURE</option>
                  <option value="PROGETTI">PROGETTI</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                  Descrizione
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Descrivi brevemente il progetto..."
                  className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none font-bold placeholder:text-gray-700 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label htmlFor="image" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                  Immagine Progetto
                </label>
                <div className="relative group aspect-[4/3] bg-gray-800/20 rounded-[1.5rem] border-2 border-dashed border-gray-800 hover:border-cyan-500/30 flex items-center justify-center overflow-hidden transition-all shadow-inner">
                  {imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Current"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-20 h-20 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-cyan-500/10 transition-all group-hover:scale-110">
                        <Upload className="text-gray-600 group-hover:text-cyan-400 transition-colors" size={32} />
                      </div>
                      <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Carica Immagine</p>
                      <p className="text-[10px] text-gray-600 mt-2 font-bold">JPG, PNG, WebP (Max 5MB)</p>
                    </div>
                  )}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  {(imageFile || imageUrl) && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <p className="text-white text-[11px] font-black bg-cyan-500/20 border border-cyan-500/30 px-5 py-2.5 rounded-xl uppercase tracking-widest">Cambia Immagine</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-5 pt-10 border-t border-gray-800/50">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3.5 text-xs font-black text-gray-600 hover:text-white transition-all uppercase tracking-[0.2em]"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-12 py-3.5 rounded-xl font-black transition-all flex items-center gap-3 shadow-[0_15px_30px_-5px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 uppercase tracking-widest text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {uploading ? 'Upload...' : 'Salvataggio...'}
                </>
              ) : (
                item ? 'Aggiorna Articolo' : 'Salva Articolo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
