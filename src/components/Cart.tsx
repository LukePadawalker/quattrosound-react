import { Trash2, ArrowLeft, ShoppingCart as CartIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface CartProps {
  onClose: () => void;
  onCheckout: () => void;
}

export default function Cart({ onClose, onCheckout }: CartProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      onCheckout();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end md:items-center justify-end md:justify-center">
      <div className="bg-gray-900 w-full md:w-96 max-h-screen md:max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CartIcon className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white">Carrello</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <CartIcon size={48} className="text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Carrello Vuoto</h3>
            <p className="text-gray-500 mb-6">Aggiungi prodotti per iniziare lo shopping</p>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Continua lo Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 p-6 space-y-4">
              {items.map(item => (
                <div
                  key={item.productId}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex gap-4 mb-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg bg-gray-700"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-400">€{item.price.toFixed(2)} cad.</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1.5">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-cyan-400 hover:bg-gray-800 rounded transition-colors text-sm"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value) || 1);
                          updateQuantity(item.productId, val);
                        }}
                        className="w-8 bg-gray-900 text-white text-center text-sm font-semibold border-0 outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-cyan-400 hover:bg-gray-800 rounded transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-white">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-t border-gray-700">
                <span className="text-gray-400">Subtotale</span>
                <span className="font-semibold text-white">€{total.toFixed(2)}</span>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-sm text-cyan-300">
                Spedizione calcolata al checkout
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || items.length === 0}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {isProcessing ? 'Elaborazione...' : 'Procedi al Pagamento'}
                </button>

                <button
                  onClick={onClose}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Continua lo Shopping
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-gray-400 hover:text-red-400 text-sm font-medium transition-colors py-2"
                >
                  Svuota Carrello
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
