
import React, { useState, useEffect } from 'react';
import { MessageCircle, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIInsight {
  type: 'security' | 'market' | 'suggestion';
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: string;
}

const insights: AIInsight[] = [
  {
    type: 'security',
    icon: <Shield className="h-5 w-5 text-wallet-accent" />,
    title: 'Security Alert',
    description: 'Your last transaction was to a new address. Would you like to add it to your trusted list?',
    action: 'Add to trusted'
  },
  {
    type: 'market',
    icon: <TrendingUp className="h-5 w-5 text-solana" />,
    title: 'Market Insight',
    description: 'SOL is up 12.5% in the last 24 hours. This might be a good time to review your portfolio.',
    action: 'View details'
  },
  {
    type: 'suggestion',
    icon: <MessageCircle className="h-5 w-5 text-white" />,
    title: 'Voice Command Suggestion',
    description: 'Try saying "Show me my staking rewards" to see your latest rewards.',
  }
];

const AIAssistant: React.FC = () => {
  const [activeInsight, setActiveInsight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % insights.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);
  
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
                    <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white text-xs">
                      {insight.action}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-sm text-muted-foreground">
          Your AI assistant analyzes your activity and market conditions to provide helpful insights.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
