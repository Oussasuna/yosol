import React, { useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import Partners from '../components/Partners';
import Roadmap from '../components/Roadmap';
import { Button } from '@/components/ui/button';
import { MessageCircle, Shield, TrendingUp, Wallet, ArrowRight, Zap, Cloud, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const Index = () => {
  const { scrollY } = useScroll();
  const ref = useRef(null);

  // Parallax effect values
  const y1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href')?.substring(1);
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 100,
              behavior: 'smooth'
            });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return <Layout>
    <HeroSection />
    
    {/* Core Features Section - Moved to top */}
    <section id="features" className="py-20 relative overflow-hidden">
      <motion.div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-solana/10 blur-3xl opacity-50 z-0" style={{
        y: y1
      }} />
      <motion.div className="absolute -bottom-[200px] -left-[200px] w-[400px] h-[400px] rounded-full bg-wallet-accent/10 blur-3xl opacity-50 z-0" style={{
        y: y2
      }} />
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div className="text-center mb-16" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7
        }} viewport={{
          once: true
        }}>
          <h2 className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent">Smart Features, Powered by AI</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            yosol combines voice commands with artificial intelligence to give you the smartest Solana wallet experience.
          </p>
        </motion.div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={Mic} title="Talk to Your Wallet" description="Send crypto, check prices, and trade just by speaking. Control your wallet with natural voice commands." color="text-solana" animationDelay={0} />
          <FeatureCard icon={Shield} title="AI Safety Check" description="Warns you before risky transactions or scams. Intelligent monitoring flags suspicious activity before you confirm." color="text-wallet-accent" animationDelay={1} />
          <FeatureCard icon={TrendingUp} title="Auto Money Grow" description="Stakes, swaps, and invests for you with voice commands. Get real-time market analysis and personalized investment suggestions." color="text-solana" animationDelay={2} />
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-solana to-wallet-accent text-white hover:opacity-90 transition-opacity duration-300 gap-2 group">
              See All Features <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
    
    {/* Roadmap Section - Moved to second position */}
    <Roadmap />
    
    {/* Partners Section - Moved to third position */}
    <Partners />
    
    {/* CTA Section with 3D Elements */}
    <section className="py-20 relative overflow-hidden">
      <motion.div style={{
        opacity
      }} className="container px-4 md:px-6 relative z-10">
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-solana/20 rounded-full filter blur-3xl opacity-30 animate-pulse-light"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-wallet-accent/20 rounded-full filter blur-3xl opacity-30 animate-pulse-light" style={{
            animationDelay: "1.5s"
          }}></div>
          
          <motion.div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.7
          }} viewport={{
            once: true
          }}>
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent">
                Ready to Experience the Future of Crypto?
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Get started with yosol today and discover how AI and voice technology can transform your Solana experience.
              </p>
              <Link to="/dashboard">
                <Button className="button-hover-effect bg-gradient-to-r from-solana to-wallet-accent hover:from-solana-dark hover:to-solana text-white font-medium rounded-lg h-12 px-8 group">
                  Launch App 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <div className="flex space-x-[2px] relative">
              <div className="voice-wave voice-wave-1 h-16"></div>
              <div className="voice-wave voice-wave-2 h-24"></div>
              <div className="voice-wave voice-wave-3 h-32"></div>
              <div className="voice-wave voice-wave-4 h-24"></div>
              <div className="voice-wave voice-wave-5 h-16"></div>
              
              {/* 3D floating elements */}
              <motion.div className="absolute -right-8 -top-8 w-8 h-8 rounded-full bg-wallet-accent/30 backdrop-blur-sm z-10" animate={{
                y: [0, -15, 0],
                opacity: [0.7, 1, 0.7]
              }} transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }} />
              <motion.div className="absolute -left-10 -bottom-10 w-6 h-6 rounded-full bg-solana/30 backdrop-blur-sm z-10" animate={{
                y: [0, 10, 0],
                opacity: [0.5, 0.8, 0.5]
              }} transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  </Layout>;
};

export default Index;
