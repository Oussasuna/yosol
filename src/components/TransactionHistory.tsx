
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Wallet } from 'lucide-react';

const transactions = [
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

const TransactionHistory: React.FC = () => {
  const [animatedItems, setAnimatedItems] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const ids = transactions.map(tx => tx.id);
      setAnimatedItems(ids);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
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
    </div>
  );
};

export default TransactionHistory;
