import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, LogOut, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortfolioForm from '../components/PortfolioForm';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    // Delete record from DB
    const { error: dbError } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);

    if (dbError) {
      alert('Error deleting from database');
      return;
    }

    // Delete image from storage if it exists and is in the 'portfolio' bucket
    if (imageUrl && imageUrl.includes('/storage/v1/object/public/portfolio/')) {
      const filePath = imageUrl.split('/portfolio/')[1];
      if (filePath) {
        await supabase.storage.from('portfolio').remove([filePath]);
      }
    }

    fetchItems();
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-cyan-400">QuattroSound</span> Admin
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
            >
              <ExternalLink size={16} />
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Portfolio Items</h2>
            <p className="text-gray-400">Manage your website's portfolio projects</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Project
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-xl border-2 border-dashed border-gray-700">
            <ImageIcon size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-300">No projects found</h3>
            <p className="text-gray-500">Start by adding your first portfolio project</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 flex flex-col">
                <div className="aspect-video relative overflow-hidden group">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <ImageIcon size={32} className="text-gray-600" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-gray-900/80 hover:bg-cyan-500 p-2 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.image_url)}
                      className="bg-gray-900/80 hover:bg-red-500 p-2 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold mt-1 mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isFormOpen && (
        <PortfolioForm
          item={editingItem}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchItems();
          }}
        />
      )}
    </div>
  );
}
