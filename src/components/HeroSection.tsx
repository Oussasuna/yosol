import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wallet, MessageCircle, TrendingUp, Smartphone, Download, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) - 0.5;
      const y = (clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="py-20 md:py-32 overflow-hidden relative">
      <motion.div 
        className="absolute top-0 left-0 w-full h-full z-0 opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(153,69,255,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_0%_300px,rgba(20,241,149,0.1),transparent)]"></div>
        
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-solana/5 blur-[100px]"
          animate={{ 
            x: [50, -50, 50],
            y: [20, -20, 20],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-wallet-accent/5 blur-[100px]"
          animate={{ 
            x: [-30, 30, -30],
            y: [-30, 30, -30],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </motion.div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div 
              className="inline-block rounded-lg bg-solana/10 px-3 py-1 text-sm font-medium text-solana mb-4 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
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
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button className="button-hover-effect bg-gradient-to-r from-solana to-wallet-accent hover:from-solana-dark hover:to-solana text-white font-medium rounded-lg h-12 px-8 w-full sm:w-auto group">
                    Launch App <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" className="button-hover-effect bg-transparent border border-white/20 text-white hover:bg-white/5 h-12 px-8 w-full sm:w-auto group">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-solana/70 to-wallet-accent/70 group-hover:from-solana group-hover:to-wallet-accent transition-all duration-300">
                    Learn More
                  </span>
                </Button>
              </motion.div>
            </div>
            
            <div className="mt-12 pt-4 relative z-30 bg-black/30 p-6 rounded-xl backdrop-blur-sm border border-white/10 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-3">Coming Soon to Mobile</h3>
              <p className="text-white/90 mb-6">Get yosol on your device when we launch:</p>
              <div className="flex flex-wrap gap-4">
                <motion.div
                  className="glass-card px-5 py-3 flex items-center gap-3 cursor-pointer group relative overflow-hidden border border-white/20"
                  whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-gradient-to-br from-white to-white/80 rounded-xl p-2 shadow-lg">
                    <svg 
                      viewBox="0 0 24 24" 
                      className="h-6 w-6 text-black fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.87 1.17-.28 2.26-.93 3.46-.85 1.31.1 2.22.5 2.92 1.22-2.21 1.32-1.76 4.1.19 5.21-.54 1.67-1.28 3.32-2.65 5.52ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.89 4.27-3.74 4.25Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/70 group-hover:text-white transition-colors">Download on the</span>
                    <span className="text-base font-semibold text-white">App Store</span>
                  </div>
                  <Badge variant="outline" className="absolute top-2 right-2 border border-solana/30 bg-solana/10 text-solana text-[10px] py-0 px-2">
                    Soon
                  </Badge>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-solana/0 via-solana/10 to-wallet-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{ 
                      x: ['-100%', '100%'],
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
                
                <motion.div
                  className="glass-card px-5 py-3 flex items-center gap-3 cursor-pointer group relative overflow-hidden border border-white/20"
                  whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="bg-gradient-to-br from-wallet-accent to-wallet-accent/80 rounded-xl p-2 shadow-lg">
                    <svg 
                      viewBox="0 0 24 24" 
                      className="h-6 w-6 text-black fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m12.954 11.616 2.957-2.957L6.36 3.17c-.633-.342-1.226-.39-1.746-.016l8.34 8.462zm3.94 3.939 1.718-1.718c.322-.322.485-.708.486-1.094 0-.387-.164-.773-.485-1.094l-1.333-1.333-3.083 3.082 2.697 2.157zM3.696 13.96l8.138 8.138c.344.343.808.533 1.306.533.27 0 .552-.067.83-.204.781-.374 1.324-1.293 1.324-2.372V11.96l-11.598 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/70 group-hover:text-white transition-colors">GET IT ON</span>
                    <span className="text-base font-semibold text-white">Play Store</span>
                  </div>
                  <Badge variant="outline" className="absolute top-2 right-2 border border-wallet-accent/30 bg-wallet-accent/10 text-wallet-accent text-[10px] py-0 px-2">
                    Soon
                  </Badge>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-wallet-accent/0 via-wallet-accent/10 to-solana/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{ 
                      x: ['-100%', '100%'],
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.2
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`
            }}
          >
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-solana/10 rounded-full filter blur-3xl opacity-70"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-wallet-accent/10 rounded-full filter blur-3xl opacity-70"></div>
            
            <div className="relative">
              <motion.div 
                className="glass-card p-8 rounded-2xl overflow-hidden border border-white/10 shadow-lg backdrop-blur-sm"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div 
                  className="absolute top-4 right-4 w-4 h-4 rounded-full bg-solana/40 backdrop-blur-sm z-10"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-wallet-accent/40 backdrop-blur-sm z-10"
                  animate={{ 
                    y: [0, 8, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.7
                  }}
                />
                
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-6 w-6 text-solana" />
                    <span className="font-medium">yosol</span>
                  </div>
                  <motion.div 
                    className="px-3 py-1 rounded-full bg-wallet-accent/20 text-wallet-accent text-xs font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Connected
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Balance</p>
                    <motion.h3 
                      className="text-2xl font-bold"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      243.75 SOL
                    </motion.h3>
                    <p className="text-sm text-wallet-accent">+12.5% this week</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <motion.div 
                      className="bg-white/5 p-4 rounded-lg backdrop-blur-sm"
                      whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <MessageCircle className="h-5 w-5 text-solana mb-2" />
                      <p className="text-xs text-muted-foreground">Voice Command</p>
                    </motion.div>
                    <motion.div 
                      className="bg-white/5 p-4 rounded-lg backdrop-blur-sm"
                      whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
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
    </section>
  );
};

export default HeroSection;
