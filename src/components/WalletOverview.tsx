
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WalletOverview: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const walletAddress = 'DJkx7m12xUF4mXVfgP5yEFGwxYfFkXgYLANvuKtWg6w7';
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
          </div>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white/5 hover:bg-white/10">
            <ArrowDown className="h-4 w-4 text-wallet-accent" /> Receive
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white/5 hover:bg-white/10">
            <ArrowUp className="h-4 w-4 text-solana" /> Send
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline mb-1">
          <h3 className="text-3xl font-bold">243.75 SOL</h3>
          <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-wallet-accent/20 text-wallet-accent">+12.5%</span>
        </div>
        <p className="text-sm text-muted-foreground">≈ 24,375.00 USD</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Transactions', value: '143' },
          { label: 'Staked SOL', value: '50.00' },
          { label: 'NFTs', value: '7' },
          { label: 'Tokens', value: '5' }
        ].map((item, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            <p className="text-xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletOverview;
