
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { usePhantomWallet, Token, NFT } from './PhantomWalletProvider';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

interface WalletOverviewProps {
  walletConnected?: boolean;
  walletAddress?: string | null;
  walletType?: string | null;
  balance?: number;
  onSend?: () => void;
  onReceive?: () => void;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({ 
  walletConnected: propWalletConnected,
  walletAddress: propWalletAddress,
  walletType: propWalletType,
  balance: propBalance,
  onSend,
  onReceive
}) => {
  const { 
    walletConnected: contextWalletConnected, 
    walletAddress: contextWalletAddress,
    walletType: contextWalletType,
    balance: contextBalance,
    tokens: contextTokens,
    nfts: contextNfts,
    recentTransactions: contextTransactions,
    handleSend: contextHandleSend,
    handleReceive: contextHandleReceive,
    isLoading: contextIsLoading
  } = usePhantomWallet();
  
  // Use props if provided, otherwise fall back to context values
  const walletConnected = propWalletConnected !== undefined ? propWalletConnected : contextWalletConnected;
  const walletAddress = propWalletAddress !== null ? propWalletAddress : contextWalletAddress;
  const walletType = propWalletType !== null ? propWalletType : contextWalletType;
  const balance = propBalance !== undefined ? propBalance : contextBalance;
  const tokens = contextTokens || [];
  const nfts = contextNfts || [];
  const transactions = contextTransactions || [];
  const isLoading = contextIsLoading;
  
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [isLoadingReceive, setIsLoadingReceive] = useState(false);
  const [activeTab, setActiveTab] = useState("balance");

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
    } else if (contextHandleSend) {
      contextHandleSend();
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
    } else if (contextHandleReceive) {
      contextHandleReceive();
    } else {
      toast({
        title: "Receive Request",
        description: "Receive functionality is being implemented.",
      });
    }
    setTimeout(() => setIsLoadingReceive(false), 1000);
  };

  // Calculate total portfolio value
  const calculateTotalValue = () => {
    const solValue = balance * 100; // Assuming 1 SOL = $100 for simplicity
    const tokensValue = tokens.reduce((total, token) => total + token.usdValue, 0);
    return solValue + tokensValue;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
          <h3 className="text-3xl font-bold">{balance.toFixed(4)} SOL</h3>
          <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-wallet-accent/20 text-wallet-accent">+12.5%</span>
        </div>
        <p className="text-sm text-muted-foreground">≈ ${(balance * 100).toFixed(2)} USD</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-wallet-accent" />
          <span className="ml-2 text-muted-foreground">Loading wallet data...</span>
        </div>
      ) : (
        <Tabs defaultValue="balance" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="balance">Portfolio</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="balance" className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Portfolio Overview</h4>
              <p className="text-2xl font-bold mb-1">${calculateTotalValue().toFixed(2)}</p>
              <div className="flex justify-between text-sm mt-3">
                <span className="text-muted-foreground">SOL Balance</span>
                <span>${(balance * 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Token Value</span>
                <span>${tokens.reduce((total, token) => total + token.usdValue, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">NFTs</span>
                <span>{nfts.length} items</span>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Recent Transactions</h4>
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-full mr-3 ${
                          tx.type === 'send' 
                            ? 'bg-solana/10 text-solana' 
                            : tx.type === 'receive' 
                              ? 'bg-wallet-accent/10 text-wallet-accent'
                              : 'bg-white/10 text-white'
                        }`}>
                          {tx.type === 'send' ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">{tx.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.type === 'send' 
                              ? `To: ${tx.to}` 
                              : tx.type === 'receive' 
                                ? `From: ${tx.from}`
                                : `Swap to: ${tx.token}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          tx.type === 'send' ? 'text-solana' : 'text-wallet-accent'
                        }`}>
                          {tx.type === 'send' ? '-' : '+'}{tx.amount} SOL
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recent transactions</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tokens">
            {tokens.length > 0 ? (
              <div className="space-y-3">
                {tokens.map((token, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg flex items-center">
                    <div className="h-10 w-10 bg-white/10 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                      {token.logoURI ? (
                        <img src={token.logoURI} alt={token.symbol} className="h-full w-full object-cover" />
                      ) : (
                        <div className="text-lg font-bold text-center">{token.symbol.charAt(0)}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{token.symbol}</p>
                          <p className="text-xs text-muted-foreground">{token.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{token.amount.toLocaleString(undefined, { 
                            maximumFractionDigits: token.amount > 100 ? 0 : 4 
                          })}</p>
                          <p className="text-xs text-muted-foreground">${token.usdValue.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-white/5 rounded-lg">
                <p className="text-muted-foreground mb-2">No tokens found</p>
                <p className="text-xs text-muted-foreground/70">When you have SPL tokens, they will appear here</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="nfts">
            {nfts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {nfts.map((nft, index) => (
                  <div key={index} className="bg-white/5 rounded-lg overflow-hidden">
                    <div className="aspect-square w-full overflow-hidden">
                      <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm truncate">{nft.name}</h4>
                      {nft.collection && (
                        <p className="text-xs text-muted-foreground truncate">{nft.collection}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-white/5 rounded-lg">
                <p className="text-muted-foreground mb-2">No NFTs found</p>
                <p className="text-xs text-muted-foreground/70">When you have NFTs, they will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Total Transactions', value: transactions.length.toString() || '0' },
          { label: 'Staked SOL', value: '0.00' },
          { label: 'NFTs', value: nfts.length.toString() || '0' },
          { label: 'Tokens', value: tokens.length.toString() || '0' }
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
