
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WalletOverview from '../components/WalletOverview';
import TransactionHistory from '../components/TransactionHistory';
import VoiceInterface from '../components/VoiceInterface';
import AIAssistant from '../components/AIAssistant';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  
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
        <h1 className="text-3xl font-bold mb-8 animate-fade-in">Dashboard</h1>
        
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
