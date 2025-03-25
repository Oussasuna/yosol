
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface WalletOverviewProps {
  walletConnected?: boolean;
  walletAddress?: string | null;
  walletType?: string | null;
  balance?: number;
  onSend?: () => void;
  onReceive?: () => void;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({ 
  walletConnected = false, 
  walletAddress = null,
  walletType = null,
  balance = 243.75,
  onSend,
  onReceive
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [isLoadingReceive, setIsLoadingReceive] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    console.log("WalletOverview received address:", walletAddress);
  }, [walletAddress]);

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const handleSend = () => {
    setIsLoadingSend(true);
    if (onSend) {
      onSend();
    } else {
      toast({
        title: "Send Request",
        description: "Send functionality is being implemented.",
      });
    }
    setTimeout(() => setIsLoadingSend(false), 1000);
  };

  const handleReceive = () => {
    setIsLoadingReceive(true);
    if (onReceive) {
      onReceive();
    } else {
      toast({
        title: "Receive Request",
        description: "Receive functionality is being implemented.",
      });
    }
    setTimeout(() => setIsLoadingReceive(false), 1000);
  };

  if (!walletConnected) {
    return (
      <div className={`glass-card p-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col items-center justify-center py-8">
          <h2 className="text-2xl font-semibold mb-4">Wallet Not Connected</h2>
          <p className="text-center text-muted-foreground mb-6">
            Connect your Solana wallet to view your balance and transactions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Wallet Overview</h2>
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground">{shortAddress}</p>
            <button 
              onClick={handleCopyAddress}
              className="ml-2 text-muted-foreground hover:text-white transition-colors"
            >
              {isCopied ? <Check className="h-4 w-4 text-wallet-accent" /> : <Copy className="h-4 w-4" />}
            </button>
            {walletType && (
              <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                {walletType}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 bg-white/5 hover:bg-white/10"
            onClick={handleReceive}
            disabled={isLoadingReceive}
          >
            {isLoadingReceive ? (
              <div className="h-4 w-4 border-2 border-wallet-accent border-t-transparent rounded-full animate-spin mr-1"></div>
            ) : (
              <ArrowDown className="h-4 w-4 text-wallet-accent" />
            )}
            Receive
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 bg-white/5 hover:bg-white/10"
            onClick={handleSend}
            disabled={isLoadingSend}
          >
            {isLoadingSend ? (
              <div className="h-4 w-4 border-2 border-solana border-t-transparent rounded-full animate-spin mr-1"></div>
            ) : (
              <ArrowUp className="h-4 w-4 text-solana" />
            )}
            Send
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline mb-1">
          <h3 className="text-3xl font-bold">{balance.toFixed(2)} SOL</h3>
          <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-wallet-accent/20 text-wallet-accent">+12.5%</span>
        </div>
        <p className="text-sm text-muted-foreground">≈ {(balance * 100).toFixed(2)} USD</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Transactions', value: '143' },
          { label: 'Staked SOL', value: '50.00', comingSoon: true },
          { label: 'NFTs', value: '7', comingSoon: true },
          { label: 'Tokens', value: '5', comingSoon: true }
        ].map((item, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg relative">
            {item.comingSoon && (
              <Badge 
                variant="solid" 
                className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 shadow-md"
              >
                Soon
              </Badge>
            )}
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            <p className="text-xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletOverview;
