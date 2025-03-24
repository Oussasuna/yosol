
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description,
  color = "text-solana" 
}) => {
  return (
    <div className="glass-card p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg animate-fade-in">
      <div className={`p-3 rounded-lg inline-block mb-4 ${color === 'text-solana' ? 'bg-solana/10' : 'bg-wallet-accent/10'}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
