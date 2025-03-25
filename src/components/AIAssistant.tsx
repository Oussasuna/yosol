
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, TrendingUp, Shield, Mic, Bot, Zap } from 'lucide-react';
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
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Define insights with handlers
  useEffect(() => {
    const insightData: AIInsight[] = [
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
      },
      {
        type: 'security',
        icon: <Zap className="h-5 w-5 text-yellow-400" />,
        title: 'New Activity',
        description: 'We detected a new NFT mint in your collection. Your wallet received a new asset.',
        action: 'View NFT',
        actionHandler: () => handleAction('Opening NFT details')
      }
    ];
    
    setInsights(insightData);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    
    // Only start interval if we have insights
    if (insights.length > 0) {
      startInsightRotation();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [insights]);
  
  const startInsightRotation = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set new interval
    intervalRef.current = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % insights.length);
    }, 6000);
  };
  
  const handleInsightClick = (index: number) => {
    setActiveInsight(index);
    
    // Reset the rotation timer when manually changing insights
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    startInsightRotation();
  };
  
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
    setLastQuery(userInput);
    
    // Simulate AI processing
    toast({
      title: "Processing Query",
      description: `Analyzing: "${userInput}"`,
    });
    
    // Simulate typing effect for more realistic AI response
    setTimeout(() => {
      setProcessingQuery(false);
      
      const response = getAIResponse(userInput);
      setLastResponse(response);
      setUserInput('');
      
      toast({
        title: "AI Response",
        description: response,
      });
    }, 1500);
  };
  
  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Enhanced responses with more specific information
    if (lowerQuery.includes('price') || lowerQuery.includes('sol') || lowerQuery.includes('worth')) {
      return "Current SOL price is $100.00, up 12.5% in the last 24 hours. Trading volume has increased by 32% in the past week, suggesting strong market interest.";
    } else if (lowerQuery.includes('stake') || lowerQuery.includes('reward')) {
      return "Your staking rewards are currently 0.42 SOL per day with an APY of 6.8%. Based on your current stake of 125 SOL, you'll earn approximately 8.5 SOL per month at current rates.";
    } else if (lowerQuery.includes('nft') || lowerQuery.includes('collection')) {
      return "You own 7 NFTs across 3 collections. The floor price of your collections has increased by 5% this week. One of your NFTs is now worth approximately 12 SOL based on recent sales.";
    } else if (lowerQuery.includes('transaction') || lowerQuery.includes('history')) {
      return "You've made 143 transactions in total. Your most recent was a SOL transfer 2 days ago. In the past month, you've conducted 28 transactions, primarily token swaps and transfers.";
    } else if (lowerQuery.includes('wallet') || lowerQuery.includes('connect')) {
      return "To connect your wallet, click the 'Connect Wallet' button at the top of the dashboard. We support multiple Solana wallets including Phantom, Solflare, and Magic Eden.";
    } else if (lowerQuery.includes('token') || lowerQuery.includes('spl')) {
      return "You have 5 SPL tokens in your wallet. The most valuable is worth approximately $120. Your token portfolio has grown by 15% in the past 30 days based on market movements.";
    } else if (lowerQuery.includes('security') || lowerQuery.includes('protect')) {
      return "Your wallet is protected with standard security measures. For enhanced security, consider enabling multi-factor authentication if your wallet provider supports it and never share your seed phrase.";
    } else if (lowerQuery.includes('market') || lowerQuery.includes('trend')) {
      return "Solana has shown positive momentum over the past week, with increasing developer activity and network usage. Trading volume is up 27% and total value locked has increased by 15%.";
    } else if (lowerQuery.includes('help') || lowerQuery.includes('guide')) {
      return "I can help with SOL prices, staking information, portfolio analysis, market trends, and wallet management. Try asking specific questions about your wallet or the Solana ecosystem.";
    } else {
      return "I'm your Solana AI assistant. I can help with SOL prices, staking info, transaction history, NFT valuations, and wallet management. What would you like to know about your wallet or the Solana ecosystem?";
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
              onClick={() => handleInsightClick(index)}
              aria-label={`View insight ${index + 1}`}
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
            aria-hidden={index !== activeInsight}
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
      
      {/* Last response display */}
      {lastQuery && lastResponse && (
        <div className="mt-4 mb-4 bg-white/5 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-white/10 p-1 rounded-full">
              <Bot className="h-3 w-3 text-solana" />
            </div>
            <p className="text-xs text-muted-foreground">Last query: "{lastQuery}"</p>
          </div>
          <p className="text-sm">{lastResponse}</p>
        </div>
      )}
      
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
          Try: "SOL price" • "My staking rewards" • "NFT value" • "Security tips"
        </p>
      </form>
    </div>
  );
};

export default AIAssistant;
