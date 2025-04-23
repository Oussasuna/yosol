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
      e.preventDefault();
      if (location.pathname === '/') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        navigate('/');
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else if (path === '/partners' && location.pathname === '/') {
      e.preventDefault();
      const partnersSection = document.getElementById('partners');
      if (partnersSection) {
        partnersSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/60 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <motion.div className="flex items-center" initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5
        }}>
            <Link to="/" className="flex items-center space-x-3 group" onClick={e => handleNavLinkClick('/', e)}>
              <div className="relative">
                <motion.div whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.95
              }} transition={{
                duration: 0.2
              }} className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-wallet-accent via-solana to-wallet-accent p-[2px] shadow-lg">
                  <div className="w-full h-full bg-black rounded-xl flex items-center justify-center overflow-hidden">
                    <motion.div initial={{
                    opacity: 0,
                    scale: 0.8,
                    rotateY: -180
                  }} animate={{
                    opacity: 1,
                    scale: 1,
                    rotateY: 0
                  }} transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 120,
                    damping: 10
                  }} className="w-full h-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8 text-solana group-hover:text-wallet-accent transition-colors duration-300">
                        <defs>
                          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#14F195" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#9945FF" stopOpacity="1" />
                          </linearGradient>
                        </defs>
                        <g transform="translate(50,50) scale(0.7)">
                          <path d="M0,-40 
                               Q20,-20 0,0 
                               Q-20,20 0,40 
                               A40,40 0 0,1 0,-40" fill="url(#aiGradient)" stroke="#14F195" strokeWidth="3" />
                          <circle cx="0" cy="0" r="10" fill="rgba(20,241,149,0.3)" className="animate-pulse" />
                        </g>
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-wallet-accent rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col items-start">
                <motion.span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent" whileHover={{
                scale: 1.05
              }} transition={{
                type: "spring",
                stiffness: 400,
                damping: 10
              }}>YoSol</motion.span>
                <span className="text-xs text-muted-foreground">Voice AI Wallet</span>
              </div>
            </Link>
          </motion.div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {[{
            path: '/',
            label: 'Home'
          }, {
            path: '/dashboard',
            label: 'Dashboard'
          }, {
            path: '/features',
            label: 'Features'
          }, {
            path: '/partners',
            label: 'Partners'
          }, {
            path: '/roadmap',
            label: 'Roadmap'
          }].map((item, index) => <motion.div key={item.path} initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1 * index
          }}>
                <Link to={item.path} className={`nav-link ${location.pathname === item.path ? 'text-foreground after:scale-x-100' : ''}`} onClick={e => handleNavLinkClick(item.path, e)}>
                  {item.label}
                </Link>
              </motion.div>)}
          </nav>
          
          <motion.div className="flex items-center space-x-4" initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5
        }}>
            <Link to="/dashboard" className="hidden sm:block">
              <motion.div whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                <Button size="sm" className="bg-gradient-to-r from-solana to-wallet-accent text-white hover:opacity-90 transition-opacity duration-300 gap-2 group">
                  Launch App <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            
            <div className="block md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-white hover:bg-white/10" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && <motion.div className="md:hidden fixed inset-0 top-16 z-40 bg-black/90 backdrop-blur-md" initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -10
      }} transition={{
        duration: 0.3
      }}>
            <div className="p-6 flex flex-col space-y-6">
              {[{
            path: '/',
            label: 'Home'
          }, {
            path: '/dashboard',
            label: 'Dashboard'
          }, {
            path: '/features',
            label: 'Features'
          }, {
            path: '/partners',
            label: 'Partners'
          }, {
            path: '/roadmap',
            label: 'Roadmap'
          }].map((item, index) => <motion.div key={item.path} initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.3,
            delay: 0.05 * index
          }}>
                  <Link to={item.path} className={`text-lg font-medium ${location.pathname === item.path ? 'text-solana' : 'text-white'}`} onClick={e => {
              setMobileMenuOpen(false);
              handleNavLinkClick(item.path, e);
            }}>
                    {item.label}
                  </Link>
                </motion.div>)}
              
              <motion.div initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.3,
            delay: 0.25
          }} className="pt-2">
                <Link to="/dashboard" className="inline-block" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="bg-gradient-to-r from-solana to-wallet-accent text-white hover:opacity-90 transition-opacity duration-300 gap-2 group w-full sm:w-auto">
                    Launch App <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </header>;
};
export default NavBar;