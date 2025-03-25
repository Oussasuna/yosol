import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  comingSoon?: boolean;
  animationDelay?: number;
}
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  color = "text-solana",
  comingSoon = false,
  animationDelay = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return <motion.div className="glass-card p-6 overflow-hidden relative group" initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: animationDelay * 0.1
  }} whileHover={{
    y: -8,
    transition: {
      duration: 0.2
    }
  }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
      {/* Coming Soon overlay */}
      {comingSoon && <div className="absolute top-0 right-0 z-20 m-2">
          <Badge variant="solid" className="shadow-md">
            Coming Soon
          </Badge>
        </div>}
      
      {/* Background glow effect */}
      <div className={`absolute -inset-1 ${color === 'text-solana' ? 'bg-solana/10' : 'bg-wallet-accent/10'} rounded-xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className={`p-3 rounded-lg inline-block mb-4 ${color === 'text-solana' ? 'bg-solana/10' : 'bg-wallet-accent/10'} backdrop-blur-lg`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <h3 className="text-xl font-medium mb-2 text-gray-50">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        
        {/* 3D rotation effect cube */}
        <motion.div className={`absolute right-3 bottom-3 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} animate={{
        rotateX: isHovered ? [0, 180, 360] : 0,
        rotateY: isHovered ? [0, 180, 360] : 0
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}>
          <div className={`w-4 h-4 rounded-sm ${color === 'text-solana' ? 'bg-solana/30' : 'bg-wallet-accent/30'} backdrop-blur-lg`}></div>
        </motion.div>
      </div>
    </motion.div>;
};
export default FeatureCard;