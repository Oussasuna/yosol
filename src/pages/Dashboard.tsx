
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WalletOverview from '../components/WalletOverview';
import TransactionHistory from '../components/TransactionHistory';
import VoiceInterface from '../components/VoiceInterface';
import AIAssistant from '../components/AIAssistant';
import FeatureCard from '../components/FeatureCard';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Wallet, ChevronDown, LogOut, ExternalLink, Copy, Check, X, 
  TrendingUp, Shield, AlarmClock, Shuffle, Lightbulb, PiggyBank, 
  Key, Bell, Layers, Globe, FileCode, Network, Lock, Filter
} from 'lucide-react';
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const walletIcons = {
  "Phantom": "https://phantom.app/favicon.ico",
  "Solflare": "https://solflare.com/favicon.ico",
  "Magic Eden": "https://magiceden.io/favicon.ico",
  "OKX Wallet": "https://www.okx.com/favicon.ico",
  "Backpack": "https://www.backpack.app/favicon.ico",
  "Torus": "https://tor.us/favicon.ico",
  "MathWallet": "https://mathwallet.org/favicon.ico",
  "Coinbase Wallet": "https://www.coinbase.com/favicon.ico",
};

const Dashboard = () => {
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWalletType, setConnectedWalletType] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  
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

  const generateRandomWalletAddress = () => {
    const characters = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = '';
    const length = 44;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  };

  const connectWallet = (walletType: string) => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    
    toast({
      title: `Connecting ${walletType}`,
      description: `Connecting to your Solana wallet via ${walletType}...`,
      variant: "default"
    });

    const walletLowerCase = walletType.toLowerCase().replace(' ', '');
    const hasWallet = typeof window !== 'undefined' && 
                     (window as any)[walletLowerCase];
    
    console.log(`Attempting to connect to ${walletType}. Available in window:`, hasWallet);

    setTimeout(() => {
      const randomAddress = generateRandomWalletAddress();
      console.log(`Connected to wallet with address: ${randomAddress}`);
      
      setWalletAddress(randomAddress);
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

  const getWalletIcon = (type: string): string => {
    return walletIcons[type as keyof typeof walletIcons] || "";
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

  const FeatureCard = ({ icon: Icon, title, description, color = "text-solana" }) => (
    <Card className="p-4 relative overflow-hidden">
      <Badge 
        variant="outline" 
        className="absolute top-2 right-2 bg-white/10 text-white border-white/20 backdrop-blur-sm"
      >
        Coming Soon
      </Badge>
      <div className={`p-3 rounded-lg inline-block mb-3 ${color === 'text-solana' ? 'bg-solana/10' : 'bg-wallet-accent/10'} backdrop-blur-lg`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );

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
                    <DialogDescription className="text-center text-sm text-gray-400">
                      Select a wallet provider to connect with yosol
                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                <div className="bg-gradient-to-b from-[#5846f9]/20 to-[#1de9b6]/20 backdrop-blur-sm">
                  {walletOptions.map((wallet) => (
                    <div 
                      key={wallet.name}
                      onClick={() => connectWallet(wallet.name)}
                      className="flex items-center justify-between p-4 hover:bg-white/10 transition-colors cursor-pointer border-t border-white/10 first:border-t-0"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={getWalletIcon(wallet.name)} 
                          alt={wallet.name} 
                          className="h-6 w-6 rounded-full bg-gray-800"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }} 
                        />
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
                  {connectedWalletType && (
                    <img 
                      src={getWalletIcon(connectedWalletType)} 
                      alt={connectedWalletType} 
                      className="h-4 w-4 rounded-full" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  )}
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
            <TransactionHistory 
              walletConnected={walletConnected} 
              walletAddress={walletAddress}
            />
          </div>
          <div>
            <AIAssistant />
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Tools</h2>
            <Button variant="outline" className="text-solana border-solana hover:bg-solana/10">
              View All <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard 
              icon={TrendingUp}
              title="Smart Trading"
              description="AI-powered trading suggestions based on market trends and your portfolio"
              delay={0}
            />
            <FeatureCard 
              icon={Shield}
              title="Security Advisor"
              description="Get alerts about suspicious transactions and security recommendations"
              color="text-wallet-accent"
              delay={1}
            />
            <FeatureCard 
              icon={AlarmClock}
              title="Price Alerts"
              description="Set custom price alerts for tokens in your portfolio"
              delay={2}
            />
            <FeatureCard 
              icon={Shuffle}
              title="Auto Swap"
              description="Automatically swap tokens based on market conditions"
              color="text-wallet-accent"
              delay={3}
            />
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Wallet Enhancements</h2>
            <Badge variant="outline" className="bg-gradient-to-r from-solana/20 to-wallet-accent/20 backdrop-blur-sm border-white/10 text-white px-3 py-1">
              Premium
            </Badge>
          </div>
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon={Lightbulb}
              title="Smart Insights"
              description="Get personalized investment insights based on your portfolio and market trends"
              delay={0}
            />
            <FeatureCard 
              icon={PiggyBank}
              title="Yield Optimizer"
              description="Automatically find and suggest the best yield opportunities for your assets"
              color="text-wallet-accent"
              delay={1}
            />
            <FeatureCard 
              icon={Key}
              title="Multi-sig Vault"
              description="Create secure multi-signature vaults for your most valuable assets"
              delay={2}
            />
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Advanced Features</h2>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Beta Access
            </Button>
          </div>
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <FeatureCard 
              icon={Bell}
              title="Smart Notifications"
              description="Receive personalized alerts for important events like price movements, airdrops, and security threats"
              delay={0}
            />
            <FeatureCard 
              icon={Layers}
              title="Portfolio Analyzer"
              description="Deep insights into your portfolio performance with advanced analytics and visualization tools"
              color="text-wallet-accent"
              delay={1}
            />
            <FeatureCard 
              icon={Globe}
              title="Cross-chain Bridge"
              description="Seamlessly move assets between Solana and other blockchains with integrated bridge functionality"
              delay={2}
            />
            <FeatureCard 
              icon={FileCode}
              title="Developer Tools"
              description="Access to advanced tools for developers to build and test applications on Solana"
              color="text-wallet-accent"
              delay={3}
            />
            <FeatureCard 
              icon={Network}
              title="Decentralized Identity"
              description="Manage your Web3 identity and credentials across the Solana ecosystem"
              delay={4}
            />
            <FeatureCard 
              icon={Lock}
              title="Enhanced Security"
              description="Additional security features including biometric authentication and hardware wallet integration"
              color="text-wallet-accent"
              delay={5}
            />
            <FeatureCard 
              icon={Filter}
              title="Tax & Reporting"
              description="Automated tax calculations and reporting for all your crypto transactions"
              delay={6}
            />
          </div>
        </div>
      </div>
    </Layout>;
};

export default Dashboard;
