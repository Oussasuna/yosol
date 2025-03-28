
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Wallet, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { usePhantomWallet } from './PhantomWalletProvider';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface TransactionHistoryProps {
  walletConnected?: boolean;
  walletAddress?: string | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  walletConnected: propWalletConnected = false, 
  walletAddress: propWalletAddress = null 
}) => {
  const { 
    walletConnected: contextWalletConnected,
    walletAddress: contextWalletAddress,
    recentTransactions: contextTransactions,
    isLoading: contextIsLoading,
    refreshWalletData
  } = usePhantomWallet();
  
  // Use props if provided, otherwise fall back to context values
  const walletConnected = propWalletConnected !== undefined ? propWalletConnected : contextWalletConnected;
  const walletAddress = propWalletAddress !== null ? propWalletAddress : contextWalletAddress;
  const transactions = contextTransactions || [];
  const isLoading = contextIsLoading;
  
  const [animatedItems, setAnimatedItems] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate items after they're loaded
    if (transactions.length > 0) {
      const ids = transactions.map(tx => tx.id);
      setAnimatedItems(ids);
    }
  }, [transactions]);

  // Auto-refresh transaction data every 30 seconds if wallet is connected
  useEffect(() => {
    if (!walletConnected) return;
    
    const refreshInterval = setInterval(() => {
      if (refreshWalletData) {
        console.log('Auto-refreshing wallet transaction data');
        refreshWalletData();
      }
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [walletConnected, refreshWalletData]);

  const handleManualRefresh = () => {
    if (!refreshWalletData) return;
    
    setIsRefreshing(true);
    refreshWalletData()
      .then(() => {
        toast({
          title: "Data Refreshed",
          description: "Transaction data has been updated.",
        });
      })
      .catch(error => {
        console.error('Error refreshing transaction data:', error);
        toast({
          title: "Refresh Failed",
          description: "Could not update transaction data. Please try again.",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  if (!walletConnected) {
    return (
      <div className={`glass-card p-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground mb-2">No wallet connected</p>
          <p className="text-sm text-muted-foreground/70">Connect your wallet to view your transaction history</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={handleManualRefresh}
          disabled={isLoading || isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-wallet-accent mb-4" />
          <p className="text-muted-foreground">Loading your transactions...</p>
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <div 
              key={tx.id}
              className={`bg-white/5 rounded-lg p-4 transition-all duration-300 ease-out ${
                animatedItems.includes(tx.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  tx.type === 'send' 
                    ? 'bg-solana/10 text-solana' 
                    : tx.type === 'receive' 
                      ? 'bg-wallet-accent/10 text-wallet-accent'
                      : 'bg-white/10 text-white'
                }`}>
                  {tx.type === 'send' ? (
                    <ArrowUp className="h-5 w-5" />
                  ) : tx.type === 'receive' ? (
                    <ArrowDown className="h-5 w-5" />
                  ) : (
                    <Wallet className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-white capitalize">{tx.type}</h4>
                    <div className="flex items-center">
                      <span className={`font-semibold ${
                        tx.type === 'send' ? 'text-solana' : 'text-wallet-accent'
                      }`}>
                        {tx.type === 'send' ? '-' : '+'}{tx.amount} SOL
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {tx.type === 'send' 
                        ? `To: ${tx.to}` 
                        : tx.type === 'receive' 
                          ? `From: ${tx.from}`
                          : `Swap to: ${tx.token}`
                      }
                    </span>
                    <span className="text-muted-foreground">{formatDate(tx.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Wallet className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground mb-2">No transactions found</p>
          <p className="text-sm text-muted-foreground/70">Once you start using your wallet, your transactions will appear here</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
