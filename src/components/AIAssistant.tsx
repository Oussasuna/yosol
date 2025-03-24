
import React, { useState, useEffect } from 'react';
import { MessageCircle, TrendingUp, Shield, Mic, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface AIInsight {
  type: 'security' | 'market' | 'suggestion';
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
  actionHandler?: () => void;
}

const AIAssistant: React.FC = () => {
  const [activeInsight, setActiveInsight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [processingQuery, setProcessingQuery] = useState(false);

  // Define insights with handlers
  const insights: AIInsight[] = [
    {
      type: 'security',
      icon: <Shield className="h-5 w-5 text-wallet-accent" />,
      title: 'Security Alert',
      description: 'Your last transaction was to a new address. Would you like to add it to your trusted list?',
      action: 'Add to trusted',
      actionHandler: () => handleAction('Added address to trusted list')
    },
    {
      type: 'market',
      icon: <TrendingUp className="h-5 w-5 text-solana" />,
      title: 'Market Insight',
      description: 'SOL is up 12.5% in the last 24 hours. This might be a good time to review your portfolio.',
      action: 'View details',
      actionHandler: () => handleAction('Opening market details')
    },
    {
      type: 'suggestion',
      icon: <MessageCircle className="h-5 w-5 text-white" />,
      title: 'Voice Command Suggestion',
      description: 'Try saying "Show me my staking rewards" to see your latest rewards.',
      action: 'Try it now',
      actionHandler: () => handleAction('Activated voice command')
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % insights.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleAction = (message: string) => {
    toast({
      title: "AI Assistant",
      description: message,
    });
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    setProcessingQuery(true);
    
    // Simulate AI processing
    toast({
      title: "Processing Query",
      description: `Analyzing: "${userInput}"`,
    });
    
    // Simulate response time
    setTimeout(() => {
      setProcessingQuery(false);
      setUserInput('');
      
      toast({
        title: "AI Response",
        description: getAIResponse(userInput),
      });
    }, 1500);
  };
  
  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('price') || lowerQuery.includes('sol') || lowerQuery.includes('worth')) {
      return "Current SOL price is $100.00, up 12.5% in the last 24 hours.";
    } else if (lowerQuery.includes('stake') || lowerQuery.includes('reward')) {
      return "Your staking rewards are currently 0.42 SOL per day with an APY of 6.8%.";
    } else if (lowerQuery.includes('nft') || lowerQuery.includes('collection')) {
      return "You own 7 NFTs across 3 collections. The floor price of your collections has increased by 5% this week.";
    } else if (lowerQuery.includes('transaction') || lowerQuery.includes('history')) {
      return "You've made 143 transactions in total. Your most recent was a SOL transfer 2 days ago.";
    } else {
      return "I'm your Solana AI assistant. I can help with SOL prices, staking info, transaction history, and wallet management.";
    }
  };

  return (
    <div className={`glass-card p-6 overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">AI Assistant</h2>
        <div className="flex space-x-1">
          {insights.map((_, index) => (
            <button 
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeInsight ? 'bg-solana' : 'bg-white/20'
              }`}
              onClick={() => setActiveInsight(index)}
            />
          ))}
        </div>
      </div>
      
      <div className="relative h-[140px]">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`absolute top-0 left-0 w-full transition-all duration-500 ${
              index === activeInsight 
                ? 'opacity-100 translate-x-0' 
                : index < activeInsight
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-full">
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  {insight.action && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="bg-white/10 hover:bg-white/20 text-white text-xs"
                      onClick={insight.actionHandler}
                    >
                      {insight.action}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleAskAI} className="mt-6 pt-4 border-t border-white/10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask your AI assistant..."
              className="w-full bg-white/5 text-white placeholder:text-white/40 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-solana pr-10"
              disabled={processingQuery}
            />
            <Bot className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
          </div>
          <Button 
            type="submit" 
            size="sm" 
            disabled={processingQuery || !userInput.trim()}
            className="bg-gradient-to-r from-solana to-wallet-accent hover:opacity-90"
          >
            {processingQuery ? "Processing..." : "Ask"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Try: "SOL price" • "My staking rewards" • "NFT value"
        </p>
      </form>
    </div>
  );
};

export default AIAssistant;
