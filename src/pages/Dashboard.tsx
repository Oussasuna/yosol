
import React from 'react';
import Layout from '../components/Layout';
import WalletOverview from '../components/WalletOverview';
import TransactionHistory from '../components/TransactionHistory';
import VoiceInterface from '../components/VoiceInterface';
import AIAssistant from '../components/AIAssistant';
import AssemblyAITranscriber from '../components/AssemblyAITranscriber';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    // Handle voice commands here
  };

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent">
          Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <WalletOverview />
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
