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
  isDarkMode: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LOCATIONS = ['Roma', 'Chiarano'];

export default function PortfolioForm({ item, isDarkMode, onClose, onSuccess }: PortfolioFormProps) {
  const [isEditing, setIsEditing] = useState(!item);
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 backdrop-blur-xl overflow-y-auto ${isDarkMode ? 'bg-[#0a0f18]/95' : 'bg-slate-900/40'}`}>
      <div className={`md:rounded-2xl w-full max-w-2xl min-h-screen md:min-h-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-x md:border flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#111827] border-gray-800/50' : 'bg-white border-slate-200'}`}>
        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-800/50' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isDarkMode ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'}`}>
              <ImageIcon className="text-cyan-500" size={16} />
            </div>
            <div>
              <h2 className={`text-sm font-black audiowide-regular uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {!item ? 'Nuova Immagine' : isEditing ? 'Modifica Immagine' : 'Dettagli Immagine'}
              </h2>
            </div>
          </div>
          {item && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="ml-auto mr-4 px-4 py-1.5 bg-cyan-500 text-[#0a0f18] text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-cyan-400 transition-colors"
            >
              Modifica
            </button>
          )}
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
                  className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-xs font-bold disabled:opacity-50 transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800/30 border-gray-700/50 text-white'
                      : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                  required
                  disabled={!isEditing}
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
                    className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-xs font-bold appearance-none disabled:opacity-50 transition-colors ${
                      isDarkMode
                        ? 'bg-gray-800/30 border-gray-700/50 text-white'
                        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                    }`}
                    required
                    disabled={!isEditing}
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
                    className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-xs font-bold appearance-none disabled:opacity-50 transition-colors ${
                      isDarkMode
                        ? 'bg-gray-800/30 border-gray-700/50 text-white'
                        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                    }`}
                    required
                    disabled={!isEditing}
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
                  className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/30 text-xs font-bold resize-none disabled:opacity-50 transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800/30 border-gray-700/50 text-white'
                      : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                  required
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  Immagine
                </label>
                <div className={`relative group aspect-video md:aspect-square rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
                  isDarkMode
                    ? 'bg-gray-800/20 border-gray-800 hover:border-cyan-500/30'
                    : 'bg-slate-50 border-slate-200 hover:border-cyan-500/30 shadow-inner'
                }`}>
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
                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 mt-auto">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-8 py-2.5 rounded-lg font-black transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(6,182,212,0.4)]"
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : (item ? 'Aggiorna' : 'Salva')}
                </button>
                <button
                  type="button"
                  onClick={() => item ? setIsEditing(false) : onClose()}
                  className="w-full sm:w-auto px-8 py-2.5 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  {item ? 'Annulla' : 'Chiudi'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-2.5 bg-gray-800 text-gray-300 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-gray-700 transition-colors"
              >
                Chiudi
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
