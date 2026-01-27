import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
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
  const [category, setCategory] = useState(item?.category || 'PRO-SOUND');
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
      image_url: finalImageUrl,
    };

    if (item) {
      // Update
      const { error } = await supabase
        .from('portfolio_items')
        .update(portfolioData)
        .eq('id', item.id);

      if (error) alert('Errore durante l\'aggiornamento: ' + error.message);
      else onSuccess();
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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-[#111827] rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <ImageIcon className="text-cyan-400" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white audiowide-regular uppercase tracking-tight">
              {item ? 'Modifica Articolo' : 'Nuovo Articolo Portfolio'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors bg-gray-800 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Titolo Progetto
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Es: Live Concert Setup"
                  className="w-full bg-[#1f2937] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1f2937] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium appearance-none"
                  required
                >
                  <option value="PRO-SOUND">PRO-SOUND</option>
                  <option value="LIGHTING">LIGHTING</option>
                  <option value="STAGE">STAGE</option>
                  <option value="CORPORATE">CORPORATE</option>
                  <option value="CONCERT">CONCERT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Descrizione
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Descrivi brevemente il progetto..."
                  className="w-full bg-[#1f2937] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Immagine Progetto
                </label>
                <div className="relative group aspect-[4/3] bg-[#1f2937] rounded-2xl border-2 border-dashed border-gray-700 hover:border-cyan-500/50 flex items-center justify-center overflow-hidden transition-all">
                  {imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Current"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500/10 transition-colors">
                        <Upload className="text-gray-500 group-hover:text-cyan-400 transition-colors" size={28} />
                      </div>
                      <p className="text-sm text-gray-400 font-bold">Carica Immagine</p>
                      <p className="text-xs text-gray-500 mt-2">Trascina o clicca qui</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  {(imageFile || imageUrl) && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">Cambia Immagine</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5"></div>
                  <p className="text-[11px] text-gray-500 italic">
                    Dimensione consigliata: 1200x900px. Formato JPG, PNG o WebP. Max 5MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-10 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {uploading ? 'Caricamento...' : 'Salvataggio...'}
                </>
              ) : (
                item ? 'Salva Modifiche' : 'Crea Progetto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
