
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import { Button } from '@/components/ui/button';
import { MessageCircle, Shield, TrendingUp, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
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

  return (
    <Layout>
      <HeroSection />
      
      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Powered by Intelligence</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              yosol combines voice commands with artificial intelligence to give you the smartest Solana wallet experience.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon={MessageCircle}
              title="Voice Commands"
              description="Control your wallet with natural voice commands. Send, receive, and manage your assets hands-free."
              color="text-solana"
            />
            <FeatureCard 
              icon={Shield}
              title="AI Security"
              description="Intelligent transaction monitoring flags suspicious activity before you confirm."
              color="text-wallet-accent"
            />
            <FeatureCard 
              icon={TrendingUp}
              title="Market Insights"
              description="Get real-time market analysis and personalized investment suggestions."
              color="text-solana"
            />
            <FeatureCard 
              icon={Wallet}
              title="Smart Portfolio"
              description="AI-powered portfolio management that optimizes your assets automatically."
              color="text-wallet-accent"
            />
            <FeatureCard 
              icon={Shield}
              title="Intelligent Permissions"
              description="Set custom rules for your AI assistant to manage assets within your comfort level."
              color="text-solana"
            />
            <FeatureCard 
              icon={MessageCircle}
              title="Conversational AI"
              description="Ask questions about your finances, set goals, and get personalized advice."
              color="text-wallet-accent"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-solana/20 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-wallet-accent/20 rounded-full filter blur-3xl opacity-30"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Ready to Experience the Future of Crypto?
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Get started with yosol today and discover how AI and voice technology can transform your Solana experience.
                </p>
                <Link to="/dashboard">
                  <Button className="button-hover-effect bg-gradient-to-r from-solana to-wallet-accent hover:from-solana-dark hover:to-solana text-white font-medium rounded-lg h-12 px-8">
                    Launch App <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="flex space-x-[2px]">
                <div className="voice-wave voice-wave-1 h-16"></div>
                <div className="voice-wave voice-wave-2 h-24"></div>
                <div className="voice-wave voice-wave-3 h-32"></div>
                <div className="voice-wave voice-wave-4 h-24"></div>
                <div className="voice-wave voice-wave-5 h-16"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
