
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/40 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-solana" />
              <span className="text-2xl font-semibold tracking-tight">yosol</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'text-foreground after:scale-x-100' : ''}`}>
              Home
            </Link>
            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'text-foreground after:scale-x-100' : ''}`}>
              Dashboard
            </Link>
            <Link to="/features" className={`nav-link ${location.pathname === '/features' ? 'text-foreground after:scale-x-100' : ''}`}>
              Features
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button size="sm" className="bg-gradient-to-r from-solana to-wallet-accent text-white hover:opacity-90 transition-opacity duration-300 gap-2">
                Launch App <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
