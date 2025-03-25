
interface YosolWallet {
  solana: {
    isConnected: () => Promise<boolean>;
    getPublicKey: () => Promise<{ toString: () => string }>;
  };
}

interface Window {
  yosol?: YosolWallet;
}
