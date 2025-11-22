import { useState } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Technology from './components/Technology';
import Products from './components/Products';
import Contact from './components/Contact';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { CartProvider } from './context/CartContext';

function App() {
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-900">
        <Navigation onCartClick={() => setShowCart(true)} />
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Technology />
        <Products />
        <Contact />
        <Footer />

        {showCart && (
          <Cart
            onClose={() => setShowCart(false)}
            onCheckout={handleCheckout}
          />
        )}

        {showCheckout && (
          <Checkout onClose={() => setShowCheckout(false)} />
        )}
      </div>
    </CartProvider>
  );
}

export default App;
