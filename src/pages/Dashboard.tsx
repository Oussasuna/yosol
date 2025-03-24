import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WalletOverview from '../components/WalletOverview';
import TransactionHistory from '../components/TransactionHistory';
import VoiceInterface from '../components/VoiceInterface';
import AIAssistant from '../components/AIAssistant';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown, LogOut, ExternalLink, Copy, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWalletType, setConnectedWalletType] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  useEffect(() => {
    if (walletConnected && !walletAddress) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 44; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      setWalletAddress(result);
    }
  }, [walletConnected, walletAddress]);

  const handleVoiceCommand = (command: string) => {
    setLastCommand(command);
    console.log("Voice command received:", command);

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
    toast({
      title: `Connecting ${walletType}`,
      description: `Connecting to your Solana wallet via ${walletType}...`,
      variant: "default"
    });

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

  const disconnectWallet = () => {
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been successfully disconnected.",
      variant: "default"
    });
    setWalletConnected(false);
    setConnectedWalletType(null);
    setWalletAddress(null);
  };

  const copyWalletAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
        variant: "default"
      });
    }
  };

  const openInExplorer = () => {
    if (walletAddress) {
      window.open(`https://explorer.solana.com/address/${walletAddress}`, '_blank');
      toast({
        title: "Opening Explorer",
        description: "Viewing wallet on Solana Explorer.",
        variant: "default"
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Welcome to yosol",
        description: "Your AI-powered Solana wallet is ready. Try using a voice command!",
        variant: "default"
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getWalletIcon = (type: string) => {
    switch (type) {
      case "Phantom":
        return "https://phantom.app/favicon.ico";
      case "Solflare":
        return "https://solflare.com/favicon.ico";
      case "Backpack":
        return "https://www.backpack.app/favicon.ico";
      case "Ledger":
        return "https://www.ledger.com/favicon.ico";
      case "Brave":
        return "https://brave.com/static-assets/images/brave-favicon.png";
      case "Glow":
        return "https://glow.app/favicon.ico";
      default:
        return "";
    }
  };

  const shortenAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-solana text-solana hover:bg-solana/10 flex items-center gap-2">
                  {connectedWalletType && <img src={getWalletIcon(connectedWalletType)} alt={connectedWalletType} className="h-4 w-4" />}
                  <Wallet className="h-4 w-4" /> 
                  <span className="hidden sm:inline">{connectedWalletType}:</span> {shortenAddress(walletAddress)}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 bg-background/95 backdrop-blur-sm border-solana/20">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{connectedWalletType} Wallet</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{walletAddress}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyWalletAddress} className="cursor-pointer flex items-center gap-2">
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {isCopied ? "Copied" : "Copy Address"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openInExplorer} className="cursor-pointer flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" /> View on Explorer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnectWallet} className="cursor-pointer flex items-center gap-2 text-red-500">
                  <LogOut className="h-4 w-4" /> Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <WalletOverview walletConnected={walletConnected} walletAddress={walletAddress} walletType={connectedWalletType} />
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

