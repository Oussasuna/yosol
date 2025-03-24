import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WalletOverview from '../components/WalletOverview';
import TransactionHistory from '../components/TransactionHistory';
import VoiceInterface from '../components/VoiceInterface';
import AIAssistant from '../components/AIAssistant';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWalletType, setConnectedWalletType] = useState<string | null>(null);
  
  const handleVoiceCommand = (command: string) => {
    setLastCommand(command);
    console.log("Voice command received:", command);

    // Process command (case-insensitive)
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('send')) {
      toast({
        title: "Transaction Initiated",
        description: "Voice command processed: Preparing to send tokens. Please confirm the transaction details.",
        variant: "default"
      });
    } else if (lowerCommand.includes('balance') || lowerCommand.includes('check')) {
      toast({
        title: "Balance Request",
        description: "Your current balance is 243.75 SOL (≈ $24,375.00)",
        variant: "default"
      });
    } else if (lowerCommand.includes('market') || lowerCommand.includes('price') || lowerCommand.includes('insight')) {
      toast({
        title: "Market Insights",
        description: "Solana is up 12.5% in the last 24 hours. The overall market sentiment is positive.",
        variant: "default"
      });
    } else if (lowerCommand.includes('stake') || lowerCommand.includes('staking')) {
      toast({
        title: "Staking Information",
        description: "Your current staking rewards are 0.42 SOL per day. Total staked: 125 SOL.",
        variant: "default"
      });
    } else if (lowerCommand.includes('alert') || lowerCommand.includes('notification')) {
      toast({
        title: "Price Alert Set",
        description: "We'll notify you when SOL reaches your target price.",
        variant: "default"
      });
    } else if (lowerCommand.includes('wallet') && lowerCommand.includes('connect')) {
      if (!walletConnected) {
        connectWallet("Phantom");
      } else {
        toast({
          title: "Wallet Already Connected",
          description: "Your wallet is already connected to the application.",
          variant: "default"
        });
      }
    } else {
      toast({
        title: "Processing Command",
        description: `Analyzing: "${command}"`,
        variant: "default"
      });
    }
  };

  const connectWallet = (walletType: string) => {
    // Simulate wallet connection
    toast({
      title: `Connecting ${walletType}`,
      description: `Connecting to your Solana wallet via ${walletType}...`,
      variant: "default"
    });

    // Simulate connection delay
    setTimeout(() => {
      setWalletConnected(true);
      setConnectedWalletType(walletType);
      toast({
        title: "Wallet Connected",
        description: `Your ${walletType} wallet has been successfully connected.`,
        variant: "default"
      });
    }, 1000);
  };

  useEffect(() => {
    // Welcome toast on first load
    const timer = setTimeout(() => {
      toast({
        title: "Welcome to yosol",
        description: "Your AI-powered Solana wallet is ready. Try using a voice command!",
        variant: "default"
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return <Layout>
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold animate-fade-in my-[37px] mx-[5px]">Dashboard</h1>
          
          {!walletConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gradient-to-r from-solana to-wallet-accent text-white hover:opacity-90 transition-opacity duration-300 gap-2">
                  <Wallet className="h-4 w-4" /> Connect Wallet <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border-solana/20">
                <DropdownMenuItem onClick={() => connectWallet("Phantom")} className="cursor-pointer flex items-center gap-2">
                  <img src="https://phantom.app/favicon.ico" alt="Phantom" className="h-5 w-5" /> Phantom
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => connectWallet("Solflare")} className="cursor-pointer flex items-center gap-2">
                  <img src="https://solflare.com/favicon.ico" alt="Solflare" className="h-5 w-5" /> Solflare
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => connectWallet("Backpack")} className="cursor-pointer flex items-center gap-2">
                  <img src="https://www.backpack.app/favicon.ico" alt="Backpack" className="h-5 w-5" /> Backpack
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => connectWallet("Ledger")} className="cursor-pointer flex items-center gap-2">
                  <img src="https://www.ledger.com/favicon.ico" alt="Ledger" className="h-5 w-5" /> Ledger
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => connectWallet("Brave")} className="cursor-pointer flex items-center gap-2">
                  <img src="https://brave.com/static-assets/images/brave-favicon.png" alt="Brave" className="h-5 w-5" /> Brave Wallet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => connectWallet("Glow")} className="cursor-pointer flex items-center gap-2">
                  <img src="https://glow.app/favicon.ico" alt="Glow" className="h-5 w-5" /> Glow
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" className="border-solana text-solana hover:bg-solana/10">
              <Wallet className="h-4 w-4 mr-2" /> 
              {connectedWalletType}: 7X4F...8dj2
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
    </Layout>;
};

export default Dashboard;
