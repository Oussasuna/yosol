
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();
  
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
          ? 'py-3 bg-background/80 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="bg-gradient-to-br from-solana to-wallet-accent p-2 rounded-lg"
            >
              <Wallet className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent group-hover:from-solana-light group-hover:to-solana transition-all duration-300">
              yosol
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <a 
                    href="#features" 
                    className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
                  >
                    Features
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a 
                    href="#roadmap" 
                    className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
                  >
                    Roadmap
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a 
                    href="#docs" 
                    className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
                  >
                    Learn More
                  </a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/dashboard" className="nav-link px-3 py-2 rounded-md hover:bg-white/5 transition-colors">
                    Dashboard
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <div className="flex items-center space-x-4 ml-6">
              <Button 
                variant="outline" 
                className="hidden lg:flex border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                size="sm"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Docs
              </Button>
              <Button 
                className="bg-gradient-to-r from-solana to-wallet-accent hover:from-solana-dark hover:to-solana text-white shadow-lg shadow-solana/20 hover:shadow-solana/30 transition-all duration-300"
                size="sm"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </div>
          </nav>
          
          {/* Mobile Menu Trigger */}
          <button 
            className="md:hidden p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileMenuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container px-4 py-4 flex flex-col space-y-3">
              <motion.a 
                href="#features" 
                className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span>Features</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.a>
              <motion.a 
                href="#roadmap" 
                className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span>Roadmap</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.a>
              <motion.a 
                href="#docs" 
                className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span>Learn More</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.a>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link 
                  to="/dashboard" 
                  className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-white/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Dashboard</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </motion.div>
              <div className="pt-4 border-t border-white/10">
                <Button 
                  className="w-full bg-gradient-to-r from-solana to-wallet-accent hover:from-solana-dark hover:to-solana text-white shadow-lg shadow-solana/10"
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
