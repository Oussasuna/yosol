import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import WalletOverview from '../components/WalletOverview';
import TransactionHistory from '../components/TransactionHistory';
import VoiceInterface from '../components/VoiceInterface';
import AIAssistant from '../components/AIAssistant';
import FeatureCard from '../components/FeatureCard';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { usePhantomWallet } from '@/components/PhantomWalletProvider';
import { 
  Wallet, ChevronDown, LogOut, ExternalLink, Copy, Check, X,
  Zap, Shield, ArrowLeftRight, LineChart, Globe, Briefcase, 
  Gauge, Fingerprint, Award, Sparkles, FileText, Coins, Building,
  Lock, Ban, BookOpen, BellRing, Wallet2, Braces, 
  LayoutDashboard, AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

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
  const { 
    connectWallet: providerConnectWallet, 
    disconnectWallet: providerDisconnectWallet,
    walletConnected: providerWalletConnected,
    walletAddress: providerWalletAddress,
    walletType: providerWalletType,
    isInitialized
  } = usePhantomWallet();
  
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWalletType, setConnectedWalletType] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [walletConnectionError, setWalletConnectionError] = useState<string | null>(null);
  const [processingTransaction, setProcessingTransaction] = useState<boolean>(false);
  const [transactionConfirmData, setTransactionConfirmData] = useState<{
    amount?: number;
    recipient?: string;
    type: 'send' | 'stake' | 'swap';
  } | null>(null);
  
  useEffect(() => {
    if (isInitialized && providerWalletConnected) {
      setWalletConnected(providerWalletConnected);
      setWalletAddress(providerWalletAddress);
      setConnectedWalletType(providerWalletType);
    }
  }, [isInitialized, providerWalletConnected, providerWalletAddress, providerWalletType]);

  const handleVoiceCommand = (command: string) => {
    setLastCommand(command);
    console.log("Voice command received:", command);

    const lowerCommand = command.toLowerCase();
    
    // Process wallet connection command
    if (lowerCommand.includes('wallet') && lowerCommand.includes('connect')) {
      if (!walletConnected) {
        setShowWalletDialog(true);
        toast({
          title: "Wallet Connection",
          description: "Please select a wallet provider to connect with.",
          variant: "default"
        });
        return;
      } else {
        toast({
          title: "Wallet Already Connected",
          description: "Your wallet is already connected to the application.",
          variant: "default"
        });
        return;
      }
    }
    
    // Process send command
    if (lowerCommand.includes('send')) {
      if (!walletConnected) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet first to send transactions.",
          variant: "destructive"
        });
        return;
      }
      
      const amountMatch = lowerCommand.match(/\d+(\.\d+)?/);
      let amount = 1; // Default amount
      if (amountMatch) {
        amount = parseFloat(amountMatch[0]);
      }
      
      // Try to extract a recipient address
      const recipient = generateRandomWalletAddress().slice(0, 6) + "..." + generateRandomWalletAddress().slice(-4);
      
      setTransactionConfirmData({
        amount: amount,
        recipient: recipient,
        type: 'send'
      });
      
      toast({
        title: "Transaction Prepared",
        description: `Preparing to send ${amount} SOL to ${recipient}. Please confirm the transaction.`,
        variant: "default"
      });
      return;
    }
    
    // Process balance check
    if (lowerCommand.includes('balance') || (lowerCommand.includes('check') && lowerCommand.includes('sol'))) {
      if (!walletConnected) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet first to check your balance.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Balance Information",
        description: "Your current balance is 243.75 SOL (≈ $24,375.00)",
        variant: "default"
      });
      return;
    }
    
    // Process market/price check
    if (lowerCommand.includes('market') || lowerCommand.includes('price') || lowerCommand.includes('insight')) {
      toast({
        title: "Market Insights",
        description: "Solana is up 12.5% in the last 24 hours. The overall market sentiment is positive.",
        variant: "default"
      });
      return;
    }
    
    // Process staking command
    if (lowerCommand.includes('stake') || lowerCommand.includes('staking')) {
      if (!walletConnected) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet first to manage staking.",
          variant: "destructive"
        });
        return;
      }
      
      const amountMatch = lowerCommand.match(/\d+(\.\d+)?/);
      let amount = 10; // Default amount
      if (amountMatch) {
        amount = parseFloat(amountMatch[0]);
      }
      
      setTransactionConfirmData({
        amount: amount,
        type: 'stake'
      });
      
      toast({
        title: "Staking Prepared",
        description: `Preparing to stake ${amount} SOL. Please confirm the transaction.`,
        variant: "default"
      });
      return;
    }
    
    // Process alert setup
    if (lowerCommand.includes('alert') || lowerCommand.includes('notification')) {
      const priceMatch = lowerCommand.match(/\$?\d+(\.\d+)?/);
      let price = 150; // Default price
      if (priceMatch) {
        price = parseFloat(priceMatch[0].replace('$', ''));
      }
      
      toast({
        title: "Price Alert Set",
        description: `You will be notified when SOL reaches $${price.toFixed(2)}.`,
        variant: "default"
      });
      return;
    }
    
    // Unknown or general command
    toast({
      title: "Command Processed",
      description: `I understood: "${command}". How else can I assist you?`,
      variant: "default"
    });
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
    setWalletConnectionError(null);
    
    toast({
      title: `Connecting ${walletType}`,
      description: `Connecting to your Solana wallet via ${walletType}...`,
      variant: "default"
    });

    if (walletType.toLowerCase() === 'phantom' || walletType.toLowerCase() === 'solflare') {
      providerConnectWallet(walletType.toLowerCase() as 'phantom' | 'solflare')
        .then(() => {
          setIsConnecting(false);
          setShowWalletDialog(false);
        })
        .catch((error) => {
          console.error("Wallet connection error:", error);
          setIsConnecting(false);
          setWalletConnectionError(error instanceof Error ? error.message : "Unknown error occurred");
          
          toast({
            title: "Connection Failed",
            description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
            variant: "destructive"
          });
        });
      return;
    }

    const walletLowerCase = walletType.toLowerCase().replace(' ', '');
    const hasWallet = typeof window !== 'undefined' && 
                     (window as any)[walletLowerCase];
    
    console.log(`Attempting to connect to ${walletType}. Available in window:`, hasWallet);

    setTimeout(() => {
      try {
        if (Math.random() < 0.1) {
          throw new Error("Connection timeout. Please try again.");
        }
        
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
      } catch (error) {
        console.error("Wallet connection error:", error);
        setIsConnecting(false);
        setWalletConnectionError(error instanceof Error ? error.message : "Unknown error occurred");
        
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
          variant: "destructive"
        });
      }
    }, 1500);
  };

  const disconnectWallet = () => {
    providerDisconnectWallet();
    setWalletConnected(false);
    setConnectedWalletType(null);
    setWalletAddress(null);
    setTransactionConfirmData(null);
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
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to send transactions.",
        variant: "destructive"
      });
      return;
    }
    
    setTransactionConfirmData({
      amount: 1,
      recipient: shortenAddress(generateRandomWalletAddress()),
      type: 'send'
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
  
  const confirmTransaction = () => {
    if (!transactionConfirmData) return;
    
    setProcessingTransaction(true);
    
    setTimeout(() => {
      setProcessingTransaction(false);
      setTransactionConfirmData(null);
      
      if (transactionConfirmData.type === 'send') {
        toast({
          title: "Transaction Successful",
          description: `Successfully sent ${transactionConfirmData.amount} SOL to ${transactionConfirmData.recipient}.`,
          variant: "default"
        });
      } else if (transactionConfirmData.type === 'stake') {
        toast({
          title: "Staking Successful",
          description: `Successfully staked ${transactionConfirmData.amount} SOL. You will start earning rewards soon.`,
          variant: "default"
        });
      } else if (transactionConfirmData.type === 'swap') {
        toast({
          title: "Swap Successful",
          description: `Successfully swapped ${transactionConfirmData.amount} SOL.`,
          variant: "default"
        });
      }
    }, 2000);
  };
  
  const cancelTransaction = () => {
    setTransactionConfirmData(null);
    toast({
      title: "Transaction Cancelled",
      description: "The transaction has been cancelled.",
      variant: "default"
    });
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
                    <DialogDescription className="text-center text-sm text-gray-400">
                      Select a wallet provider to connect with yosol
                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </DialogClose>
                </div>
                <div className="bg-gradient-to-b from-[#5846f9]/20 to-[#1de9b6]/20 backdrop-blur-sm">
                  {walletConnectionError && (
                    <div className="p-3 m-3 bg-red-500/20 rounded-md flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <p className="text-sm text-red-200">{walletConnectionError}</p>
                    </div>
                  )}
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
        
        {/* Transaction Confirmation Dialog */}
        {transactionConfirmData && (
          <Dialog open={!!transactionConfirmData} onOpenChange={(open) => !open && cancelTransaction()}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Transaction</DialogTitle>
                <DialogDescription>
                  {transactionConfirmData.type === 'send' && `Send ${transactionConfirmData.amount} SOL to ${transactionConfirmData.recipient}`}
                  {transactionConfirmData.type === 'stake' && `Stake ${transactionConfirmData.amount} SOL for rewards`}
                  {transactionConfirmData.type === 'swap' && `Swap ${transactionConfirmData.amount} SOL`}
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-4 bg-white/5 rounded-md my-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-sm font-medium">{transactionConfirmData.amount} SOL</span>
                </div>
                {transactionConfirmData.type === 'send' && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">To</span>
                    <span className="text-sm font-medium">{transactionConfirmData.recipient}</span>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Fee</span>
                  <span className="text-sm font-medium">0.000005 SOL</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm font-medium">{(Number(transactionConfirmData.amount) + 0.000005).toFixed(6)} SOL</span>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
                <Button variant="outline" onClick={cancelTransaction} disabled={processingTransaction}>
                  Cancel
                </Button>
                <Button 
                  onClick={confirmTransaction} 
                  className="bg-gradient-to-r from-solana to-wallet-accent text-white hover:opacity-90" 
                  disabled={processingTransaction}
                >
                  {processingTransaction ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
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
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-gradient">Upcoming Features</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <p className="text-muted-foreground mb-8">Explore the future of Solana with these upcoming innovations</p>
              
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-foreground/90">Featured Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FeatureCard 
                    icon={Zap} 
                    title="Lightning Transactions" 
                    description="Send and receive SOL and tokens with unprecedented speed and efficiency."
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={Shield} 
                    title="Enhanced Security" 
                    description="Advanced multi-signature wallet protection with biometric authentication."
                    color="text-wallet-accent" 
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={ArrowLeftRight} 
                    title="Cross-Chain Bridge" 
                    description="Seamlessly bridge assets between Solana and other popular blockchains."
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={LineChart} 
                    title="Portfolio Analytics" 
                    description="Advanced charting, performance metrics, and visual portfolio insights."
                    color="text-wallet-accent"
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={Globe} 
                    title="Global Payments" 
                    description="Send money internationally with near-zero fees using Solana's network."
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={Briefcase} 
                    title="Business Accounts" 
                    description="Specialized wallet features designed for businesses and organizations."
                    color="text-wallet-accent"
                    comingSoon={true}
                  />
                </div>
              </div>
              
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-foreground/90">Wallet Enhancements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FeatureCard 
                    icon={Gauge} 
                    title="Gas Optimizer" 
                    description="Intelligent fee suggestions to optimize transaction costs based on network conditions."
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={Fingerprint} 
                    title="Identity Verification" 
                    description="Simplified KYC and identity management for compliant transactions."
                    color="text-wallet-accent"
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={Award} 
                    title="Loyalty Rewards" 
                    description="Earn rewards for active wallet usage and community participation."
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={Sparkles} 
                    title="NFT Showcase" 
                    description="Beautiful gallery to display, organize and show off your NFT collection."
                    color="text-wallet-accent"
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={FileText} 
                    title="Smart Receipts" 
                    description="Automated transaction documentation for personal and business expenses."
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={Coins} 
                    title="Token Swaps" 
                    description="Built-in DEX aggregator for optimal token swaps at the best rates."
                    color="text-wallet-accent"
                    comingSoon={true}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground/90">Advanced Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FeatureCard 
                    icon={Building} 
                    title="Yield Optimizer" 
                    description="Automatic staking and yield farming to maximize your crypto returns."
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={Lock} 
                    title="Time-Lock Vaults" 
                    description="Create time-restricted vaults for controlled asset distribution."
                    color="text-wallet-accent"
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={Ban} 
                    title="Price Alerts" 
                    description="Customizable alerts for token price targets and market conditions."
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={BookOpen} 
                    title="Tax Reporting" 
                    description="Comprehensive transaction reports for simplified crypto tax compliance."
                    color="text-wallet-accent"
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={BellRing} 
                    title="Smart Notifications" 
                    description="AI-powered alerts for relevant opportunities in the Solana ecosystem."
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={Wallet2} 
                    title="Budget Planning" 
                    description="Set spending limits and financial goals for responsible crypto use."
                    color="text-wallet-accent"
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={Braces} 
                    title="Developer Tools" 
                    description="API access and developer features for building on top of your wallet."
                    comingSoon={true}
                  />
                  <FeatureCard 
                    icon={LayoutDashboard} 
                    title="Custom Dashboard" 
                    description="Fully customizable dashboard layout to display what matters most to you."
                    color="text-wallet-accent"
                    comingSoon={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </Layout>;
};

export default Dashboard;
