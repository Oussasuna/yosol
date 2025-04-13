
import React, { useState } from 'react';
import Layout from '../components/Layout';
import WalletOverview from '../components/WalletOverview';
import TransactionHistory from '../components/TransactionHistory';
import VoiceInterface from '../components/VoiceInterface';
import AIAssistant from '../components/AIAssistant';
import AssemblyAITranscriber from '../components/AssemblyAITranscriber';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePhantomWallet } from '../components/PhantomWalletProvider';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshWalletData } = usePhantomWallet();

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    
    // Handle refresh wallet command
    if (command.toLowerCase().includes('refresh') && command.toLowerCase().includes('wallet')) {
      handleRefreshWallet();
    }
    // Other voice commands can be handled here
  };

  const handleRefreshWallet = async () => {
    if (!refreshWalletData) return;
    
    setIsRefreshing(true);
    try {
      await refreshWalletData();
      toast({
        title: "Wallet Refreshed",
        description: "Your wallet data has been updated.",
      });
    } catch (error) {
      console.error('Error refreshing wallet data:', error);
      toast({
        title: "Refresh Failed",
        description: "Could not update wallet data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent animate-pulse">
          Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <WalletOverview 
              handleVoiceCommand={handleVoiceCommand}
              onRefresh={handleRefreshWallet}
              isRefreshing={isRefreshing}
            />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Voice Assistant</CardTitle>
                <CardDescription>
                  Control your wallet with voice commands
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceInterface 
                  onVoiceCommand={handleVoiceCommand} 
                  walletConnected={true}
                  walletBalance={123.45}
                  walletAddress="0x1234...5678"
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="transactions" className="mb-8">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="ai-assistants">AI Tools</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <TransactionHistory />
          </TabsContent>
          <TabsContent value="ai-assistants">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIAssistant />
              <AssemblyAITranscriber />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
