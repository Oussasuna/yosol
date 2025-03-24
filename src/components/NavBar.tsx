
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-4 bg-background/80 backdrop-blur-md border-b border-white/5 shadow-lg'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <Wallet className="h-6 w-6 text-solana" />
            <span className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent">
              yosol
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <a 
                    href="#features" 
                    className={navigationMenuTriggerStyle()}
                  >
                    Features
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a 
                    href="#roadmap" 
                    className={navigationMenuTriggerStyle()}
                  >
                    Roadmap
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a 
                    href="#docs" 
                    className={navigationMenuTriggerStyle()}
                  >
                    Learn More
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/dashboard" className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <div className="flex items-center space-x-4 ml-4">
              <Button 
                variant="outline" 
                className="hidden lg:flex"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Docs
              </Button>
              <Button className="bg-gradient-to-r from-solana to-wallet-accent hover:from-solana-dark hover:to-solana text-white">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </div>
          </nav>
          
          {/* Mobile Menu Trigger */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-white/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-white/5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container px-4 py-4 flex flex-col space-y-4">
              <a 
                href="#features" 
                className="py-2 hover:text-solana transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#roadmap" 
                className="py-2 hover:text-solana transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Roadmap
              </a>
              <a 
                href="#docs" 
                className="py-2 hover:text-solana transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Learn More
              </a>
              <Link 
                to="/dashboard" 
                className="py-2 hover:text-solana transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="pt-4 border-t border-white/10">
                <Button 
                  className="w-full bg-gradient-to-r from-solana to-wallet-accent hover:from-solana-dark hover:to-solana text-white"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
