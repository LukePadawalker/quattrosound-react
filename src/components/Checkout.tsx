import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface CheckoutProps {
  onClose: () => void;
}

export default function Checkout({ onClose }: CheckoutProps) {
  const { items, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
    company: '',
    address: '',
    city: '',
    postal: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        alert('Per completare l\'ordine devi essere autenticato');
        setIsProcessing(false);
        return;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          stripe_payment_id: `order_${Date.now()}`
        })
        .select()
        .maybeSingle();

      if (orderError) throw orderError;
      if (!order) throw new Error('Failed to create order');

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderComplete(true);
      clearCart();

      setTimeout(() => {
        onClose();
        setOrderComplete(false);
      }, 3000);
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Errore durante l\'elaborazione dell\'ordine');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full text-center border border-gray-700">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Ordine Confermato!</h2>
          <p className="text-gray-400 mb-2">Grazie per il tuo acquisto</p>
          <p className="text-cyan-400 font-semibold mb-6">Riceverai una conferma via email</p>
          <p className="text-gray-500 text-sm">Reindirizzamento in corso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full my-8 border border-gray-700">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center gap-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white">Checkout</h2>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Riepilogo Ordine</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              {items.map(item => (
                <div key={item.productId} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm">Quantità: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-cyan-400">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                <span className="font-semibold text-white">Totale</span>
                <span className="text-2xl font-bold text-cyan-400">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Dati Personali</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nome Completo *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefono *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Indirizzo di Consegna</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="company"
                  placeholder="Azienda/Organizzazione"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Indirizzo *"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="Città *"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  />

                  <input
                    type="text"
                    name="postal"
                    placeholder="CAP *"
                    value={formData.postal}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-white font-medium mb-2">Note Aggiuntive</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Note sull'ordine o sulla consegna..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all resize-none"
              />
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Mail className="text-cyan-400 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-gray-300">
                  Riceverai una conferma dell'ordine e i dettagli di consegna via email
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="text-cyan-400 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-gray-300">
                  Potresti ricevere una chiamata per confermare i dettagli
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                {isProcessing ? 'Elaborazione...' : 'Conferma Ordine'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Annulla
              </button>
            </div>

            <p className="text-gray-500 text-xs text-center">
              Completando l'ordine accetti i nostri termini e condizioni
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
