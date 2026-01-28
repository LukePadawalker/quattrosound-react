import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Upload, Loader2, Package } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  description: string;
  category: string;
  location?: string;
  stock: number;
  status: string;
  image_url: string;
}

interface InventoryFormProps {
  item: ProductItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  'Diffusori Audio',
  'Mixer & Regia Audio',
  'Microfoni & Wireless',
  'Stagebox & Networking',
  'Video & LED Wall',
  'Luci & Illuminazione',
  'Cavi & Cablaggi',
  'Strutture & Supporti',
  'Distribuzione Elettrica',
  'Accessori Tecnici'
];
const STATUSES = ['Available', 'In Use', 'Maintenance', 'Out of Stock'];
const LOCATIONS = ['Roma', 'Chiarano'];

export default function InventoryForm({ item, onClose, onSuccess }: InventoryFormProps) {
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [category, setCategory] = useState(item?.category || CATEGORIES[0]);
  const [location, setLocation] = useState(item?.location || LOCATIONS[0]);
  const [stock, setStock] = useState(item?.stock || 0);
  const [status, setStatus] = useState(item?.status || 'Available');
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

    if (imageFile) {
      setUploading(true);
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
        setUploading(false);
        setLoading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    const productData = {
      name,
      description,
      category,
      location,
      stock,
      status,
      image_url: finalImageUrl,
      updated_at: new Date().toISOString()
    };

    if (item) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', item.id);

      if (error) {
        alert('Errore durante l\'aggiornamento: ' + error.message);
      } else {
        if (imageFile && item.image_url && item.image_url.includes('/storage/v1/object/public/portfolio/')) {
          const oldFilePath = item.image_url.split('/portfolio/')[1];
          if (oldFilePath) {
            await supabase.storage.from('portfolio').remove([oldFilePath]);
          }
        }
        onSuccess();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) alert('Errore durante la creazione: ' + error.message);
      else onSuccess();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0a0f18]/90 z-50 flex items-center justify-center p-0 md:p-4 backdrop-blur-xl">
      <div className="bg-[#111827] md:rounded-[2rem] w-full h-full md:h-auto md:max-w-4xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-800/50 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]">
              <Package className="text-cyan-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white audiowide-regular uppercase tracking-wider">
                {item ? 'Modifica Attrezzatura' : 'Nuova Attrezzatura'}
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Gestione Inventario Magazzino</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-all bg-gray-800/50 hover:bg-gray-800 p-2.5 rounded-xl border border-gray-700/50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 overflow-y-auto h-[calc(100%-100px)] md:max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                    Nome Articolo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Es: RCF Subwoofer"
                    className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold placeholder:text-gray-700 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                    Ubicazione
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold appearance-none text-sm cursor-pointer"
                    required
                  >
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                    Quantità Disponibile
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold appearance-none text-sm cursor-pointer"
                    required
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                    Stato
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-bold appearance-none text-sm cursor-pointer"
                    required
                  >
                    {STATUSES.map(st => (
                      <option key={st} value={st}>{st.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                  Descrizione Tecnica
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Specifiche tecniche, numeri di serie, etc..."
                  className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none font-bold placeholder:text-gray-700 text-sm"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                  Immagine Prodotto
                </label>
                <div className="relative group aspect-square bg-gray-800/20 rounded-[1.5rem] border-2 border-dashed border-gray-800 hover:border-cyan-500/30 flex items-center justify-center overflow-hidden transition-all shadow-inner">
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

          <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-5 pt-10 mt-10 border-t border-gray-800/50">
            <button
              type="button"
              onClick={onClose}
              className="order-2 sm:order-1 px-8 py-3.5 text-xs font-black text-gray-600 hover:text-white transition-all uppercase tracking-[0.2em]"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="order-1 sm:order-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0f18] px-12 py-3.5 rounded-xl font-black transition-all flex items-center justify-center gap-3 shadow-[0_15px_30px_-5px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 uppercase tracking-widest text-xs"
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
