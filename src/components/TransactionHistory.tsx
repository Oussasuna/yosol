
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Wallet, AlertCircle } from 'lucide-react';

// Mock transactions for demo purposes
const mockTransactions = [
  {
    id: 'tx1',
    type: 'send',
    amount: '5.2',
    to: '89XLs...7X4F',
    date: '2023-09-18T14:30:00Z',
    status: 'completed'
  },
  {
    id: 'tx2',
    type: 'receive',
    amount: '10.0',
    from: 'Market...3F9D',
    date: '2023-09-16T09:15:00Z',
    status: 'completed'
  },
  {
    id: 'tx3',
    type: 'swap',
    amount: '15.7',
    token: 'USDC',
    date: '2023-09-15T16:45:00Z',
    status: 'completed'
  },
  {
    id: 'tx4',
    type: 'receive',
    amount: '2.3',
    from: 'Stake...P2F8',
    date: '2023-09-12T11:20:00Z',
    status: 'completed'
  },
  {
    id: 'tx5',
    type: 'send',
    amount: '1.5',
    to: 'NFT...4KLM',
    date: '2023-09-10T08:55:00Z',
    status: 'completed'
  }
];

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
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ walletConnected = false }) => {
  const [animatedItems, setAnimatedItems] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (walletConnected) {
      setIsLoading(true);
      // In a real-world scenario, we would fetch the transactions from a blockchain API
      // For now, we'll simulate a loading state and then use our mock data
      const timer = setTimeout(() => {
        setTransactions(mockTransactions);
        setIsLoading(false);
        
        // Animate items after they're loaded
        const ids = mockTransactions.map(tx => tx.id);
        setAnimatedItems(ids);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Reset transactions when wallet disconnects
      setTransactions([]);
      setAnimatedItems([]);
    }
  }, [walletConnected]);

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
