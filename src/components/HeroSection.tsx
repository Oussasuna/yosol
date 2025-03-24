
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wallet, MessageCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <div className={`space-y-6 transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="inline-block rounded-lg bg-solana/10 px-3 py-1 text-sm font-medium text-solana mb-4">
              Revolutionary Solana Wallet
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Your AI-Powered <span className="text-gradient">Voice Wallet</span> for Smarter Transactions
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl/relaxed">
              Manage your crypto hands-free with intuitive voice commands—send, receive, trade, and explore market insights with built-in AI assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/dashboard">
                <Button className="button-hover-effect bg-gradient-to-r from-solana to-wallet-accent hover:from-solana-dark hover:to-solana text-white font-medium rounded-lg h-12 px-8 w-full sm:w-auto">
                  Launch App <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" className="button-hover-effect bg-transparent border border-white/20 text-white hover:bg-white/5 h-12 px-8 w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
          <div className={`relative transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-solana/20 rounded-full filter blur-3xl opacity-50"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-wallet-accent/20 rounded-full filter blur-3xl opacity-50"></div>
            <div className="relative">
              <div className="glass-card p-8 rounded-2xl overflow-hidden">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-6 w-6 text-solana" />
                    <span className="font-medium">yosol</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-wallet-accent/20 text-wallet-accent text-xs font-medium">
                    Connected
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Balance</p>
                    <h3 className="text-2xl font-bold">243.75 SOL</h3>
                    <p className="text-sm text-wallet-accent">+12.5% this week</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-solana mb-2" />
                      <p className="text-xs text-muted-foreground">Voice Command</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-wallet-accent mb-2" />
                      <p className="text-xs text-muted-foreground">AI Insights</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="flex space-x-[2px] mr-3">
                      <div className="voice-wave voice-wave-1"></div>
                      <div className="voice-wave voice-wave-2"></div>
                      <div className="voice-wave voice-wave-3"></div>
                      <div className="voice-wave voice-wave-4"></div>
                      <div className="voice-wave voice-wave-5"></div>
                    </div>
                    "Send 5 SOL to wallet ending in 7X4F..."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
