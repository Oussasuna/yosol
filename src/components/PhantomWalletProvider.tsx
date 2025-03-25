
import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { createPhantom, Position } from '@phantom/wallet-sdk';
import { toast } from '@/components/ui/use-toast';

interface PhantomWalletContextType {
  phantom: any;
  walletConnected: boolean;
  walletAddress: string | null;
  walletType: string | null;
  balance: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  handleSend: () => void;
  handleReceive: () => void;
  isInitialized: boolean;
}

const PhantomWalletContext = createContext<PhantomWalletContextType>({
  phantom: null,
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
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>("Phantom");
  const [balance, setBalance] = useState(243.75);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initPhantomWallet = async () => {
      try {
        const phantomWallet = await createPhantom({
          position: Position.bottomRight,
          hideLauncherBeforeOnboarded: false,
          namespace: "yosol",
        });
        
        setPhantom(phantomWallet);
        setIsInitialized(true);
        
        // Check if already connected
        try {
          // This checks if wallet is already connected
          if (window.yosol?.solana) {
            const connected = await window.yosol.solana.isConnected();
            if (connected) {
              const publicKey = await window.yosol.solana.getPublicKey();
              setWalletAddress(publicKey.toString());
              setWalletConnected(true);
              toast({
                title: "Wallet Connected",
                description: "Your Phantom wallet is already connected",
              });
            }
          }
        } catch (error) {
          console.log("No existing connection");
        }
      } catch (error) {
        console.error("Failed to initialize Phantom wallet:", error);
        toast({
          title: "Wallet Initialization Failed",
          description: "Could not initialize Phantom wallet. Using simulation mode.",
          variant: "destructive"
        });
        setIsInitialized(true); // Still set initialized to prevent blocking UI
      }
    };

    initPhantomWallet();
  }, []);

  const connectWallet = async () => {
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
        
        // You would normally fetch the actual balance here
        // For demo purposes, using a fixed value
        setBalance(243.75);
        
        toast({
          title: "Wallet Connected",
          description: "Your Phantom wallet has been successfully connected.",
        });
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const disconnectWallet = () => {
    if (phantom) {
      // Phantom SDK doesn't have a direct disconnect method, but we can handle it client side
      try {
        phantom.solana.disconnect();
      } catch (e) {
        console.log("Error disconnecting:", e);
      }
    }
    
    setWalletConnected(false);
    setWalletAddress(null);
    
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
    
    if (phantom) {
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
    
    if (phantom) {
      try {
        phantom.show();
        // Show receive screen
        toast({
          title: "Receive Address Ready",
          description: "Your wallet address has been copied. Share it to receive SOL or tokens.",
        });
        
        // Copy address to clipboard
        if (walletAddress) {
          navigator.clipboard.writeText(walletAddress);
        }
      } catch (error) {
        console.error("Receive error:", error);
        toast({
          title: "Receive Error",
          description: "Error showing receive address.",
          variant: "destructive"
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
        phantom,
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
