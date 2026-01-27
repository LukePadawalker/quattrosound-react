import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Contact />
      <Footer />

      <CookieBanner />
    </div>
  );
}
