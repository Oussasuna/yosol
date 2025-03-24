
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WalletOverview from '../components/WalletOverview';
import TransactionHistory from '../components/TransactionHistory';
import VoiceInterface from '../components/VoiceInterface';
import AIAssistant from '../components/AIAssistant';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

const Dashboard = () => {
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  
  const handleVoiceCommand = (command: string) => {
    setLastCommand(command);
    
    // Simple command handling simulation
    if (command.toLowerCase().includes('send')) {
      toast({
        title: "Transaction Initiated",
        description: "Your voice command has been processed. Please confirm the transaction details.",
        variant: "default",
      });
    } else if (command.toLowerCase().includes('balance')) {
      toast({
        title: "Balance Request",
        description: "Your current balance is 243.75 SOL (≈ $24,375.00)",
        variant: "default",
      });
    } else if (command.toLowerCase().includes('market') || command.toLowerCase().includes('insight')) {
      toast({
        title: "Market Insights",
        description: "Solana is up 12.5% in the last 24 hours. The overall market sentiment is positive.",
        variant: "default",
      });
    } else {
      toast({
        title: "Processing Command",
        description: `Analyzing: "${command}"`,
        variant: "default",
      });
    }
  };

  const connectWallet = () => {
    // Simulate wallet connection
    toast({
      title: "Connecting Wallet",
      description: "Connecting to your Solana wallet...",
      variant: "default",
    });
    
    // Simulate connection delay
    setTimeout(() => {
      setWalletConnected(true);
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
        variant: "default",
      });
    }, 1000);
  };

  useEffect(() => {
    // Welcome toast on first load
    const timer = setTimeout(() => {
      toast({
        title: "Welcome to yosol",
        description: "Your AI-powered Solana wallet is ready. Try using a voice command!",
        variant: "default",
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold animate-fade-in">Dashboard</h1>
          
          {!walletConnected ? (
            <Button 
              onClick={connectWallet} 
              className="bg-gradient-to-r from-solana to-wallet-accent text-white hover:opacity-90 transition-opacity duration-300 gap-2"
            >
              <Wallet className="h-4 w-4" /> Connect Wallet
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="border-solana text-solana hover:bg-solana/10"
            >
              <Wallet className="h-4 w-4 mr-2" /> 
              7X4F...8dj2
            </Button>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <WalletOverview />
          </div>
          <div>
            <VoiceInterface onCommand={handleVoiceCommand} />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <div className="md:col-span-2">
            <TransactionHistory />
          </div>
          <div>
            <AIAssistant />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
