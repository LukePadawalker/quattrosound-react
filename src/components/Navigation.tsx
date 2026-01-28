import { Menu, X, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';


export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);


  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-gray-800">
      <div className="mx-2 px-4 py-2 my-2 sm:mx-2 sm:pl-4 sm:pr-8  md:px-8 md:mx-8 lg:px-16 xl:mx-24 2xl:mx-64 2xl:py-2 rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-400/10 backdrop-blur ">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center text-2xl font-bold text-white">
              <img className="w-14 py-2" src="/white-logo.png" alt="logo" />
              <span className="text-gradient-blue text-xs ml-1">QuattroSound</span>
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button onClick={() => scrollToSection('home')} className=" audiowide-regular text-white-400 hover:accent-gold transition-colors px-3 py-2 text-sm font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="audiowide-regular text-white-400 hover:accent-gold transition-colors px-3 py-2 text-sm font-medium">
                Chi Siamo
              </button>
              <button onClick={() => scrollToSection('services')} className="audiowide-regular text-white-400 hover:accent-gold transition-colors px-3 py-2 text-sm font-medium">
                Servizi
              </button>
              <button onClick={() => scrollToSection('gallery')} className="audiowide-regular text-white-400 hover:accent-gold transition-colors px-3 py-2 text-sm font-medium">
                Portfolio
              </button>
              <button onClick={() => scrollToSection('contact')} className="audiowide-regular text-white-400 hover:accent-gold transition-colors px-3 py-2 text-sm font-medium">
                Contatti
              </button>

              {user ? (
                <Link
                  to="/admin"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2"
                >
                  <UserIcon size={18} />
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full text-sm font-bold border border-gray-700 transition-all flex items-center gap-2"
                >
                  Login Admin
                </Link>
              )}

            </div>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:accent-gold"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {
        isOpen && (
          <div className="lg:hidden  bg-gradient-to-r from-blue-900/90 to-cyan-700/90 border-t border-gray-800 px-6 mx-4 rounded-xl mt-2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => scrollToSection('home')} className="audiowide-regular text-white-400 hover:accent-gold block px-3 py-2 text-base font-medium w-full text-left">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="audiowide-regular text-gray-400 hover:accent-gold block px-3 py-2 text-base font-medium w-full text-left">
                Chi Siamo
              </button>
              <button onClick={() => scrollToSection('services')} className="audiowide-regular text-gray-400 hover:accent-gold block px-3 py-2 text-base font-medium w-full text-left">
                Servizi
              </button>
              <button onClick={() => scrollToSection('gallery')} className="audiowide-regular text-gray-400 hover:accent-gold block px-3 py-2 text-base font-medium w-full text-left">
                Portfolio
              </button>
              <button onClick={() => scrollToSection('contact')} className="audiowide-regular text-gray-400 hover:accent-gold block px-3 py-2 text-base font-medium w-full text-left">
                Contatti
              </button>
              <div className="pt-4 pb-2 border-t border-blue-400/20">
                {user ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-cyan-400 font-bold px-3 py-2"
                  >
                    <UserIcon size={20} />
                    Dashboard Admin
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-white font-bold px-3 py-2"
                  >
                    Login Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
        )
      }
    </nav >
  );
}
