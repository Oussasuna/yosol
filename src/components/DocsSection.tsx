
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, MessageCircle, Shield, Zap, Bell, Wallet, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DocsSection = () => {
  return (
    <section id="docs" className="py-20 relative overflow-hidden">
      <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-solana/10 blur-3xl opacity-50 z-0" />
      <div className="absolute -bottom-[200px] -left-[200px] w-[400px] h-[400px] rounded-full bg-wallet-accent/10 blur-3xl opacity-50 z-0" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent">
            Learn More
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Everything you need to know about yosol, the AI-powered voice wallet for Solana
          </p>
        </motion.div>
        
        <div className="glass-card p-8 md:p-10">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="voice">Voice Commands</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <h3 className="text-2xl font-semibold mb-4">What is yosol?</h3>
              <p className="text-muted-foreground">
                yosol is an AI-powered voice wallet for the Solana blockchain that allows you to manage your crypto assets using natural language commands. It combines the power of artificial intelligence with voice recognition to provide a seamless, hands-free crypto experience.
              </p>
              
              <div className="flex flex-col md:flex-row gap-8 mt-8">
                <div className="bg-white/5 p-6 rounded-lg flex-1 backdrop-blur-sm">
                  <BookOpen className="h-10 w-10 text-solana mb-4" />
                  <h4 className="text-xl font-medium mb-2">Innovative Technology</h4>
                  <p className="text-muted-foreground">
                    Built on Solana's lightning-fast blockchain with advanced AI capabilities to understand context and intent in your voice commands.
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg flex-1 backdrop-blur-sm">
                  <BookOpen className="h-10 w-10 text-wallet-accent mb-4" />
                  <h4 className="text-xl font-medium mb-2">Easy to Use</h4>
                  <p className="text-muted-foreground">
                    No technical knowledge required. Just speak naturally to your wallet to perform any crypto operation.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="button-hover-effect bg-gradient-to-r from-solana to-wallet-accent hover:from-solana-dark hover:to-solana text-white font-medium rounded-lg">
                  Read Our Whitepaper <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-6">
              <h3 className="text-2xl font-semibold mb-4">Key Features</h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                  <MessageCircle className="h-8 w-8 text-solana mb-4" />
                  <h4 className="text-xl font-medium mb-2">Talk to Your Wallet</h4>
                  <p className="text-muted-foreground">
                    Send crypto, check prices, and trade just by speaking. Control your wallet with natural voice commands for a hands-free experience.
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                  <Shield className="h-8 w-8 text-wallet-accent mb-4" />
                  <h4 className="text-xl font-medium mb-2">AI Safety Check</h4>
                  <p className="text-muted-foreground">
                    Warns you before risky transactions or scams. Intelligent transaction monitoring flags suspicious activity before you confirm.
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                  <Wallet className="h-8 w-8 text-solana mb-4" />
                  <h4 className="text-xl font-medium mb-2">Auto Money Grow</h4>
                  <p className="text-muted-foreground">
                    Stakes, swaps, and invests for you with voice commands. AI-powered portfolio management that optimizes your assets automatically.
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                  <Bell className="h-8 w-8 text-wallet-accent mb-4" />
                  <h4 className="text-xl font-medium mb-2">Crypto Alarm</h4>
                  <p className="text-muted-foreground">
                    Alerts you when prices hit your target or something fishy happens. Stay informed about important events affecting your portfolio.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="voice" className="space-y-6">
              <h3 className="text-2xl font-semibold mb-4">Voice Commands</h3>
              <p className="text-muted-foreground mb-6">
                yosol understands natural language commands. Here are some examples of what you can say:
              </p>
              
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="font-medium">💰 "Send 5 SOL to Alex"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Initiates a transaction to send SOL to a contact or address.
                  </p>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="font-medium">📊 "What's the price of SOL today?"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Fetches the current price and 24h change for Solana.
                  </p>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="font-medium">💹 "Stake 10 SOL for maximum yield"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically finds and stakes your SOL with the validator offering the best returns.
                  </p>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="font-medium">🔔 "Alert me when SOL hits $150"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sets a price alert that will notify you when the target is reached.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <h3 className="text-2xl font-semibold mb-4">Security Features</h3>
              <p className="text-muted-foreground mb-6">
                We've built yosol with security as a top priority. Here's how we keep your assets safe:
              </p>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                  <h4 className="text-xl font-medium mb-2">Voice Authentication</h4>
                  <p className="text-muted-foreground">
                    Biometric voice recognition ensures only you can access your wallet.
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                  <h4 className="text-xl font-medium mb-2">AI Fraud Detection</h4>
                  <p className="text-muted-foreground">
                    Our AI analyzes transactions for suspicious patterns and alerts you to potential scams.
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                  <h4 className="text-xl font-medium mb-2">Self-Custody</h4>
                  <p className="text-muted-foreground">
                    Your private keys always remain in your control, never stored on our servers.
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                  <h4 className="text-xl font-medium mb-2">Spending Limits</h4>
                  <p className="text-muted-foreground">
                    Set custom transaction limits and require additional verification for larger amounts.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="faq" className="space-y-6">
              <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 p-6 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">What makes yosol different from other wallets?</h4>
                  <p className="text-muted-foreground">
                    yosol combines voice interaction with AI-powered features to create an intuitive, secure wallet experience that doesn't require any technical knowledge to use.
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Is yosol compatible with all Solana tokens?</h4>
                  <p className="text-muted-foreground">
                    Yes, yosol supports all SPL tokens on the Solana blockchain, including SOL, USDC, and popular NFTs.
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Does yosol work offline?</h4>
                  <p className="text-muted-foreground">
                    The voice recognition requires an internet connection, but you can still use the app's touch interface when offline.
                  </p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Is there a mobile app available?</h4>
                  <p className="text-muted-foreground">
                    Yes, yosol is available on iOS and Android, with a seamless experience across devices.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default DocsSection;
