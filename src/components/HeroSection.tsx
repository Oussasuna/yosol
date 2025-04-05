
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wallet, MessageCircle, TrendingUp, Smartphone, Download, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      const {
        clientX,
        clientY
      } = e;
      const x = clientX / window.innerWidth - 0.5;
      const y = clientY / window.innerHeight - 0.5;
      setMousePosition({
        x,
        y
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return <section className="py-20 md:py-32 overflow-hidden relative">
      <motion.div className="absolute top-0 left-0 w-full h-full z-0 opacity-70" initial={{
      opacity: 0
    }} animate={{
      opacity: 0.7
    }} transition={{
      duration: 1
    }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(153,69,255,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_0%_300px,rgba(20,241,149,0.1),transparent)]"></div>
        
        <motion.div className="absolute w-[500px] h-[500px] rounded-full bg-solana/5 blur-[100px]" animate={{
        x: [50, -50, 50],
        y: [20, -20, 20]
      }} transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-wallet-accent/5 blur-[100px]" animate={{
        x: [-30, 30, -30],
        y: [-30, 30, -30]
      }} transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }} />
      </motion.div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <motion.div className="space-y-6" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7,
          delay: 0.2
        }}>
            <motion.div className="inline-block rounded-lg bg-solana/10 px-3 py-1 text-sm font-medium text-solana mb-4 backdrop-blur-sm" whileHover={{
            scale: 1.05
          }} transition={{
            type: "spring",
            stiffness: 400,
            damping: 10
          }}>
              Revolutionary Solana Wallet
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Your AI-Powered <span className="text-gradient">Voice Wallet</span> for Smarter Transactions
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl/relaxed">
              Manage your crypto hands-free with intuitive voice commands—send, receive, trade, and explore market insights with built-in AI assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/dashboard">
                <motion.div whileHover={{
                scale: 1.03
              }} whileTap={{
                scale: 0.97
              }}>
                  <Button className="button-hover-effect bg-gradient-to-r from-solana to-wallet-accent hover:from-solana-dark hover:to-solana text-white font-medium rounded-lg h-12 px-8 w-full sm:w-auto group">
                    Launch App <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{
              scale: 1.03
            }} whileTap={{
              scale: 0.97
            }}>
                <Button variant="outline" className="button-hover-effect bg-transparent border border-white/20 text-white hover:bg-white/5 h-12 px-8 w-full sm:w-auto group">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-solana/70 to-wallet-accent/70 group-hover:from-solana group-hover:to-wallet-accent transition-all duration-300">
                    Learn More
                  </span>
                </Button>
              </motion.div>
            </div>
            
            {/* App Store and Play Store Coming Soon */}
            <motion.div 
              className="mt-8 relative z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className="bg-black/30 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
                <p className="text-white text-sm mb-3 font-medium">Mobile Apps Coming Soon</p>
                <div className="flex gap-4">
                  <motion.a 
                    href="#" 
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-lg px-4 py-2 border border-white/10"
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5"></path>
                      <path d="M16 3v4"></path>
                      <path d="M8 3v4"></path>
                      <path d="M20.5 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"></path>
                      <path d="m18 16.5 2.5 2.5"></path>
                      <path d="M4 11h16"></path>
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] text-white/80">Download on the</div>
                      <div className="text-sm font-semibold text-white">App Store</div>
                    </div>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-lg px-4 py-2 border border-white/10"
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="m3 16 5 3 3-5"></path>
                      <path d="M13 8V6a3 3 0 0 0-6 0v2"></path>
                      <path d="M8 8h8"></path>
                      <path d="M19 8h-1"></path>
                      <path d="M18 12V8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h12"></path>
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] text-white/80">GET IT ON</div>
                      <div className="text-sm font-semibold text-white">Play Store</div>
                    </div>
                  </motion.a>
                </div>
              </div>
            </motion.div>
            
          </motion.div>
          
          <motion.div className="relative" initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.7,
          delay: 0.5
        }} style={{
          transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`
        }}>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-solana/10 rounded-full filter blur-3xl opacity-70"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-wallet-accent/10 rounded-full filter blur-3xl opacity-70"></div>
            
            <div className="relative">
              <motion.div className="glass-card p-8 rounded-2xl overflow-hidden border border-white/10 shadow-lg backdrop-blur-sm" whileHover={{
              y: -5
            }} transition={{
              type: "spring",
              stiffness: 400,
              damping: 10
            }}>
                <motion.div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-solana/40 backdrop-blur-sm z-10" animate={{
                y: [0, -10, 0],
                opacity: [0.4, 0.8, 0.4]
              }} transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }} />
                <motion.div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-wallet-accent/40 backdrop-blur-sm z-10" animate={{
                y: [0, 8, 0],
                opacity: [0.3, 0.7, 0.3]
              }} transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.7
              }} />
                
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-6 w-6 text-solana" />
                    <span className="font-medium">yosol</span>
                  </div>
                  <motion.div className="px-3 py-1 rounded-full bg-wallet-accent/20 text-wallet-accent text-xs font-medium" whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }}>
                    Connected
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Balance</p>
                    <motion.h3 className="text-2xl font-bold" initial={{
                    opacity: 0,
                    y: 10
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} transition={{
                    delay: 0.8
                  }}>
                      243.75 SOL
                    </motion.h3>
                    <p className="text-sm text-wallet-accent">+12.5% this week</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <motion.div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm" whileHover={{
                    y: -5,
                    backgroundColor: "rgba(255,255,255,0.1)"
                  }} transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }}>
                      <MessageCircle className="h-5 w-5 text-solana mb-2" />
                      <p className="text-xs text-muted-foreground">Voice Command</p>
                    </motion.div>
                    <motion.div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm" whileHover={{
                    y: -5,
                    backgroundColor: "rgba(255,255,255,0.1)"
                  }} transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }}>
                      <TrendingUp className="h-5 w-5 text-wallet-accent mb-2" />
                      <p className="text-xs text-muted-foreground">AI Insights</p>
                    </motion.div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="flex space-x-[2px] mr-3 relative">
                      <motion.div className="voice-wave voice-wave-1 animate-[wave-animation_0.8s_infinite]"></motion.div>
                      <motion.div className="voice-wave voice-wave-2 animate-[wave-animation_0.8s_infinite]"></motion.div>
                      <motion.div className="voice-wave voice-wave-3 animate-[wave-animation_0.8s_infinite]"></motion.div>
                      <motion.div className="voice-wave voice-wave-4 animate-[wave-animation_0.8s_infinite]"></motion.div>
                      <motion.div className="voice-wave voice-wave-5 animate-[wave-animation_0.8s_infinite]"></motion.div>
                    </div>
                    "Send 5 SOL to wallet ending in 7X4F..."
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default HeroSection;
