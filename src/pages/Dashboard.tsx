import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WalletOverview from '../components/WalletOverview';
import TransactionHistory from '../components/TransactionHistory';
import VoiceInterface from '../components/VoiceInterface';
import AIAssistant from '../components/AIAssistant';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown, LogOut, ExternalLink, Copy, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const Dashboard = () => {
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWalletType, setConnectedWalletType] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  
  // This effect generates a random wallet address when connecting
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
    // Don't try to connect if already connecting
    if (isConnecting) return;
    
    setIsConnecting(true);
    
    toast({
      title: `Connecting ${walletType}`,
      description: `Connecting to your Solana wallet via ${walletType}...`,
      variant: "default"
    });

    // Check if the requested wallet is available in the window object
    const hasWallet = typeof window !== 'undefined' && 
                     window.hasOwnProperty(walletType.toLowerCase());
    
    console.log(`Attempting to connect to ${walletType}. Available in window:`, hasWallet);

    // Simulate connection with timeout
    setTimeout(() => {
      setWalletConnected(true);
      setConnectedWalletType(walletType);
      setIsConnecting(false);
      setShowWalletDialog(false);
      
      toast({
        title: "Wallet Connected",
        description: `Your ${walletType} wallet has been successfully connected.`,
        variant: "default"
      });
    }, 1500);
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
      case "Magic Eden":
        return "https://magiceden.io/favicon.ico";
      case "OKX Wallet":
        return "https://www.okx.com/favicon.ico";
      case "Backpack":
        return "https://www.backpack.app/favicon.ico";
      case "Torus":
        return "https://tor.us/favicon.ico";
      case "MathWallet":
        return "https://mathwallet.org/favicon.ico";
      case "Coinbase Wallet":
        return "https://www.coinbase.com/favicon.ico";
      default:
        return "";
    }
  };

  const shortenAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleSend = () => {
    toast({
      title: "Send Transaction",
      description: "Please complete the form to send SOL or tokens to another wallet.",
    });
  };

  const handleReceive = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Receive Address Ready",
        description: "Your wallet address has been copied. Share it to receive SOL or tokens.",
      });
    }
  };

  const walletOptions = [
    { name: "Phantom", detected: true },
    { name: "Solflare", detected: true },
    { name: "Magic Eden", detected: true },
    { name: "OKX Wallet", detected: true },
    { name: "Backpack", detected: true },
    { name: "Torus", detected: true },
    { name: "MathWallet", detected: false },
    { name: "Coinbase Wallet", detected: false }
  ];

  return <Layout>
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold animate-fade-in my-[37px] mx-[5px]">Dashboard</h1>
          
          {!walletConnected ? (
            <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-solana to-wallet-accent text-white hover:opacity-90 transition-opacity duration-300 gap-2"
                  disabled={isConnecting}
                >
                  <Wallet className="h-4 w-4" /> 
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 border-0 rounded-lg overflow-hidden bg-transparent shadow-2xl max-w-xs w-full">
                <div className="bg-[#0e0e12] text-white p-5 relative">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-center text-xl font-medium">Connect a wallet on Solana to continue</DialogTitle>
                  </DialogHeader>
                  <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                <div className="bg-gradient-to-b from-[#5846f9]/20 to-[#1de9b6]/20 backdrop-blur-sm">
                  {walletOptions.map((wallet, index) => (
                    <div 
                      key={wallet.name}
                      onClick={() => connectWallet(wallet.name)}
                      className="flex items-center justify-between p-4 hover:bg-white/10 transition-colors cursor-pointer border-t border-white/10 first:border-t-0"
                    >
                      <div className="flex items-center gap-3">
                        <img src={getWalletIcon(wallet.name)} alt={wallet.name} className="h-6 w-6 rounded-full" />
                        <span className="text-white font-medium">{wallet.name}</span>
                      </div>
                      {wallet.detected && <span className="text-[#1de9b6] text-sm">Detected</span>}
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
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
            <WalletOverview 
              walletConnected={walletConnected} 
              walletAddress={walletAddress} 
              walletType={connectedWalletType}
              onSend={handleSend}
              onReceive={handleReceive}
            />
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
