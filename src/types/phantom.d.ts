
interface YosolWallet {
  solana: {
    isConnected: () => Promise<boolean>;
    getPublicKey: () => Promise<{ toString: () => string }>;
  };
}

interface Window {
  yosol?: YosolWallet;
  solflare?: any;
}

// Solflare types
interface SolflareWallet {
  publicKey: { toString: () => string };
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (transaction: any) => Promise<string>;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions: (transactions: any[]) => Promise<any[]>;
  signMessage: (message: Uint8Array, encoding: string) => Promise<Uint8Array>;
  on: (event: string, callback: () => void) => void;
  isConnected: boolean;
}
