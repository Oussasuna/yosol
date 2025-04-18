
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wallet, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavLinkClick = (path: string, e: React.MouseEvent) => {
    if (path === '/') {
      // For home link, navigate to home and scroll to top
      e.preventDefault();
      if (location.pathname === '/') {
        // If we're already on home page, just scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // If on another page, navigate to home
        navigate('/');
        // Scroll to top after navigation
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    }
    // All other links use their default behavior
  };

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/60 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-2 group" onClick={(e) => handleNavLinkClick('/', e)}>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                <Wallet className="h-8 w-8 text-solana group-hover:text-wallet-accent transition-colors duration-300" />
              </motion.div>
              <motion.span 
                className="text-2xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                yosol
              </motion.span>
            </Link>
          </motion.div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { path: '/', label: 'Home' },
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/features', label: 'Features' },
              { path: '/partners', label: 'Partners' },
              { path: '/roadmap', label: 'Roadmap' }
            ].map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'text-foreground after:scale-x-100' : ''}`}
                  onClick={(e) => item.path === '/' ? handleNavLinkClick('/', e) : undefined}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/dashboard" className="hidden sm:block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="sm" className="bg-gradient-to-r from-solana to-wallet-accent text-white hover:opacity-90 transition-opacity duration-300 gap-2 group">
                  Launch App <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            
            <div className="block md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
                className="text-white hover:bg-white/10"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 top-16 z-40 bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 flex flex-col space-y-6">
              {[
                { path: '/', label: 'Home' },
                { path: '/dashboard', label: 'Dashboard' },
                { path: '/features', label: 'Features' },
                { path: '/partners', label: 'Partners' },
                { path: '/roadmap', label: 'Roadmap' }
              ].map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <Link 
                    to={item.path} 
                    className={`text-lg font-medium ${location.pathname === item.path ? 'text-solana' : 'text-white'}`}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (item.path === '/') {
                        handleNavLinkClick('/', e);
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Add Launch App button to mobile menu */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="pt-2"
              >
                <Link 
                  to="/dashboard" 
                  className="inline-block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="bg-gradient-to-r from-solana to-wallet-accent text-white hover:opacity-90 transition-opacity duration-300 gap-2 group w-full sm:w-auto">
                    Launch App <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
