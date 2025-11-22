import { useState, useEffect } from 'react';
import { ShoppingCart, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { addItem } = useCart();

  const categories = ['All', 'Noleggio', 'Vendita', 'Accessori', 'Servizi'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);

      const initialQuantities: Record<string, number> = {};
      data?.forEach(product => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity > 0 && quantity <= product.stock) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image_url
      });
      setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="products" className="py-24" style={{ backgroundColor: 'rgb(24, 24, 24)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shop <span className="text-gradient-gold">Prodotti</span>
          </h2>
          <div className="w-24 h-1 gradient-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Acquista attrezzature e servizi professionali per i tuoi eventi
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="accent-gold" />
            <span className="text-white font-semibold">Categoria</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? 'gradient-gold text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#D4AF37' }}></div>
              <p className="text-gray-400">Caricamento prodotti...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Nessun prodotto disponibile in questa categoria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-600 transition-all group"
                style={{ backgroundColor: '#1a1a1a' }}
              >
                {product.image_url ? (
                  <div className="relative h-64 overflow-hidden bg-gray-700">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-64 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <div className="text-gray-600 text-sm">Nessuna immagine</div>
                  </div>
                )}

                <div className="p-6">
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 border" style={{ backgroundColor: '#D4AF37/10', color: '#D4AF37', borderColor: '#D4AF37/30' }}>
                    {product.category}
                  </span>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold accent-gold">€{product.price.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {product.stock > 0 ? (
                      <>
                        <span className="text-sm text-gray-400">Disponibili: </span>
                        <span className="text-sm font-semibold text-green-400">{product.stock}</span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-red-400">Non disponibile</span>
                    )}
                  </div>

                  {product.stock > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-lg p-2" style={{ backgroundColor: '#1a1a1a' }}>
                        <button
                          onClick={() => setQuantities(prev => ({
                            ...prev,
                            [product.id]: Math.max(1, (prev[product.id] || 1) - 1)
                          }))}
                          className="w-8 h-8 flex items-center justify-center accent-gold hover:bg-gray-800 rounded transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={product.stock}
                          value={quantities[product.id] || 1}
                          onChange={(e) => {
                            const val = Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1));
                            setQuantities(prev => ({ ...prev, [product.id]: val }));
                          }}
                          className="flex-1 text-white text-center text-sm font-semibold border-0 outline-none"
                          style={{ backgroundColor: '#1a1a1a' }}
                        />
                        <button
                          onClick={() => setQuantities(prev => ({
                            ...prev,
                            [product.id]: Math.min(product.stock, (prev[product.id] || 1) + 1)
                          }))}
                          className="w-8 h-8 flex items-center justify-center accent-gold hover:bg-gray-800 rounded transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full gradient-gold text-black font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-yellow-500/20"
                      >
                        <ShoppingCart size={20} />
                        Aggiungi al Carrello
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
