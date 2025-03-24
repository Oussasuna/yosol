
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Wallet, AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  amount: string;
  to?: string;
  from?: string;
  token?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
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

interface TransactionHistoryProps {
  walletConnected?: boolean;
  walletAddress?: string | null;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  walletConnected = false, 
  walletAddress = null 
}) => {
  const [animatedItems, setAnimatedItems] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (walletConnected && walletAddress) {
      setIsLoading(true);
      
      // In a real implementation, this would call a blockchain API with the wallet address
      // For demonstration, we'll simulate fetching transactions based on the wallet address
      const fetchTransactions = async () => {
        try {
          console.log(`Fetching transactions for wallet: ${walletAddress}`);
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Generate some pseudo-random transactions based on the wallet address
          // In a real app, this would be replaced with actual blockchain API calls
          const lastDigit = walletAddress.slice(-1);
          const transactionCount = (parseInt(lastDigit, 16) % 5) + 2; // 2-6 transactions
          
          const types = ['send', 'receive', 'swap'];
          const newTransactions: Transaction[] = [];
          
          for (let i = 0; i < transactionCount; i++) {
            const typeIndex = (parseInt(walletAddress.slice(i, i+2) || '0', 16) % 3);
            const type = types[typeIndex] as 'send' | 'receive' | 'swap';
            
            const amount = ((parseInt(walletAddress.slice(i*2, i*2+2) || '10', 16) % 20) + 1).toFixed(2);
            const daysAgo = (parseInt(walletAddress.slice(-i-2, -i) || '1', 16) % 10);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            
            newTransactions.push({
              id: `tx-${walletAddress.slice(0, 6)}-${i}`,
              type,
              amount,
              ...(type === 'send' ? { to: `${walletAddress.slice(0, 2)}...${walletAddress.slice(-4)}` } : {}),
              ...(type === 'receive' ? { from: `${walletAddress.slice(-4, -2)}...${walletAddress.slice(2, 4)}` } : {}),
              ...(type === 'swap' ? { token: 'USDC' } : {}),
              date: date.toISOString(),
              status: 'completed'
            });
          }
          
          setTransactions(newTransactions);
          setIsLoading(false);
          
          // Animate items after they're loaded
          const ids = newTransactions.map(tx => tx.id);
          setAnimatedItems(ids);
          
        } catch (error) {
          console.error("Error fetching transactions:", error);
          setIsLoading(false);
        }
      };
      
      fetchTransactions();
    } else {
      // Reset transactions when wallet disconnects
      setTransactions([]);
      setAnimatedItems([]);
    }
  }, [walletConnected, walletAddress]);

  if (!walletConnected) {
    return (
      <div className="glass-card p-6 animate-fade-in">
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
    <div className="glass-card p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="h-8 w-8 rounded-full border-2 border-solana border-t-transparent animate-spin mb-4"></div>
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
