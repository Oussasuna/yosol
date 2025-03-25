import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { createPhantom, Position } from '@phantom/wallet-sdk';
import Solflare from '@solflare-wallet/sdk';
import { toast } from '@/components/ui/use-toast';

interface PhantomWalletContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  walletType: string | null;
  balance: number;
  connectWallet: (type: 'phantom' | 'solflare' | string) => Promise<void>;
  disconnectWallet: () => void;
  handleSend: () => void;
  handleReceive: () => void;
  isInitialized: boolean;
}

const PhantomWalletContext = createContext<PhantomWalletContextType>({
  walletConnected: false,
  walletAddress: null,
  walletType: null,
  balance: 0,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  handleSend: () => {},
  handleReceive: () => {},
  isInitialized: false,
});

export const usePhantomWallet = () => useContext(PhantomWalletContext);

export const PhantomWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [phantom, setPhantom] = useState<any>(null);
  const [solflare, setSolflare] = useState<any>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [balance, setBalance] = useState(243.75);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initWallets = async () => {
      try {
        // Initialize Phantom wallet
        const phantomWallet = await createPhantom({
          position: Position.bottomRight,
          hideLauncherBeforeOnboarded: false,
          namespace: "yosol",
        });
        
        setPhantom(phantomWallet);
        
        // Initialize Solflare wallet
        const solflareWallet = new Solflare();
        
        solflareWallet.on('connect', () => {
          if (solflareWallet.publicKey) {
            const address = solflareWallet.publicKey.toString();
            setWalletAddress(address);
            setWalletConnected(true);
            setWalletType("Solflare");
            toast({
              title: "Wallet Connected",
              description: "Your Solflare wallet is connected",
            });
          }
        });
        
        solflareWallet.on('disconnect', () => {
          if (walletType === "Solflare") {
            setWalletConnected(false);
            setWalletAddress(null);
            setWalletType(null);
            toast({
              title: "Wallet Disconnected",
              description: "Your Solflare wallet has been disconnected",
            });
          }
        });
        
        setSolflare(solflareWallet);
        setIsInitialized(true);
        
        // Check if Phantom wallet is already connected
        try {
          if (typeof window !== 'undefined' && window.yosol?.solana) {
            const connected = await window.yosol.solana.isConnected();
            if (connected) {
              const publicKey = await window.yosol.solana.getPublicKey();
              setWalletAddress(publicKey.toString());
              setWalletConnected(true);
              setWalletType("Phantom");
              toast({
                title: "Wallet Connected",
                description: "Your Phantom wallet is already connected",
              });
            }
          }
        } catch (error) {
          console.log("No existing Phantom connection");
        }
        
        // Check if Solflare wallet is already connected
        try {
          if (typeof window !== 'undefined' && window.solflare?.isConnected) {
            if (solflareWallet.isConnected && solflareWallet.publicKey) {
              setWalletAddress(solflareWallet.publicKey.toString());
              setWalletConnected(true);
              setWalletType("Solflare");
              toast({
                title: "Wallet Connected",
                description: "Your Solflare wallet is already connected",
              });
            }
          }
        } catch (error) {
          console.log("No existing Solflare connection");
        }
      } catch (error) {
        console.error("Failed to initialize wallets:", error);
        toast({
          title: "Wallet Initialization Failed",
          description: "Could not initialize wallets. Using simulation mode.",
          variant: "destructive"
        });
        setIsInitialized(true); // Still set initialized to prevent blocking UI
      }
    };

    initWallets();
  }, []);

  const connectWallet = async (type: 'phantom' | 'solflare' | string = 'phantom') => {
    if (type === 'phantom') {
      if (!phantom) {
        toast({
          title: "Wallet Not Available",
          description: "Phantom wallet is not available. Using simulation mode.",
          variant: "destructive"
        });

        // Use simulation data in case the actual wallet is not available
        const simulatedAddress = "5xgSZdA8UNMAu5WgXGz6WQfVdSGKQ9FEJVxcK5mKGJL1";
        setWalletAddress(simulatedAddress);
        setWalletConnected(true);
        setWalletType("Phantom");
        return;
      }

      try {
        phantom.show();
        
        // Connect to Solana
        const publicKey = await phantom.solana.connect();
        
        if (publicKey) {
          setWalletAddress(publicKey.toString());
          setWalletConnected(true);
          setWalletType("Phantom");
          
          // You would normally fetch the actual balance here
          // For demo purposes, using a fixed value
          setBalance(243.75);
          
          toast({
            title: "Wallet Connected",
            description: "Your Phantom wallet has been successfully connected.",
          });
        }
      } catch (error) {
        console.error("Failed to connect Phantom wallet:", error);
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : "Failed to connect Phantom wallet. Please try again.",
          variant: "destructive"
        });
      }
    } else if (type === 'solflare') {
      if (!solflare) {
        toast({
          title: "Wallet Not Available",
          description: "Solflare wallet is not available. Using simulation mode.",
          variant: "destructive"
        });

        // Use simulation data in case the actual wallet is not available
        const simulatedAddress = "7YWm5WGRnXEEtST4Vr8WkR2WnPvMxW7Ka5YrGKjNFNwW";
        setWalletAddress(simulatedAddress);
        setWalletConnected(true);
        setWalletType("Solflare");
        return;
      }

      try {
        // Connect to Solflare
        await solflare.connect();
        
        // The connection events will handle the state updates
      } catch (error) {
        console.error("Failed to connect Solflare wallet:", error);
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : "Failed to connect Solflare wallet. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      // Handle other wallet types in a generic way
      const generateRandomWalletAddress = () => {
        const characters = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let result = '';
        const length = 44;
        
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return result;
      };

      setTimeout(() => {
        const randomAddress = generateRandomWalletAddress();
        setWalletAddress(randomAddress);
        setWalletConnected(true);
        setWalletType(type);
        
        toast({
          title: "Wallet Connected",
          description: `Your ${type} wallet has been successfully connected.`,
        });
      }, 1000);
    }
  };

  const disconnectWallet = () => {
    if (walletType === "Phantom") {
      if (phantom) {
        // Phantom SDK doesn't have a direct disconnect method, but we can handle it client side
        try {
          phantom.solana.disconnect();
        } catch (e) {
          console.log("Error disconnecting from Phantom:", e);
        }
      }
    } else if (walletType === "Solflare") {
      if (solflare) {
        try {
          solflare.disconnect();
        } catch (e) {
          console.log("Error disconnecting from Solflare:", e);
        }
      }
    }
    
    setWalletConnected(false);
    setWalletAddress(null);
    setWalletType(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been successfully disconnected.",
    });
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
    
    if (walletType === "Phantom" && phantom) {
      try {
        phantom.show();
        // In a real implementation, you would use phantom.solana.signAndSendTransaction()
        // For demo, just showing the wallet UI and a toast notification
        toast({
          title: "Send Request",
          description: "Use the Phantom wallet interface to send SOL.",
        });
      } catch (error) {
        console.error("Send error:", error);
        toast({
          title: "Send Error",
          description: "Error initiating send transaction.",
          variant: "destructive"
        });
      }
    } else if (walletType === "Solflare" && solflare) {
      try {
        // In a real implementation, you would create a transaction and use solflare.signAndSendTransaction()
        toast({
          title: "Send Request",
          description: "Please create a transaction to send through Solflare.",
        });
      } catch (error) {
        console.error("Send error:", error);
        toast({
          title: "Send Error",
          description: "Error initiating send transaction.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Send Request",
        description: "Send functionality is simulated in demo mode.",
      });
    }
  };

  const handleReceive = () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to receive SOL.",
        variant: "destructive"
      });
      return;
    }
    
    if (walletAddress) {
      // Copy address to clipboard
      navigator.clipboard.writeText(walletAddress);
      
      if (walletType === "Phantom" && phantom) {
        try {
          phantom.show();
          // Show receive screen
          toast({
            title: "Receive Address Ready",
            description: "Your wallet address has been copied. Share it to receive SOL or tokens.",
          });
        } catch (error) {
          console.error("Receive error:", error);
        }
      } else {
        toast({
          title: "Receive Address Ready",
          description: "Your wallet address has been copied. Share it to receive SOL or tokens.",
        });
      }
    } else {
      toast({
        title: "Receive Request",
        description: "Receive functionality is simulated in demo mode.",
      });
    }
  };

  return (
    <PhantomWalletContext.Provider
      value={{
        walletConnected,
        walletAddress,
        walletType,
        balance,
        connectWallet,
        disconnectWallet,
        handleSend,
        handleReceive,
        isInitialized,
      }}
    >
      {children}
    </PhantomWalletContext.Provider>
  );
};
