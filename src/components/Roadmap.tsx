
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const RoadmapCard = ({ 
  phase, 
  title, 
  description, 
  color = 'solana',
  delay = 0,
  isLive = false
}: { 
  phase: string; 
  title: string; 
  description: string; 
  color?: 'solana' | 'wallet-accent';
  delay?: number;
  isLive?: boolean;
}) => {
  return (
    <motion.div 
      className={`rounded-xl p-8 bg-white/[0.03] border border-${color}/20 backdrop-blur-sm hover:border-${color}/40 transition-all duration-300 relative overflow-hidden h-full`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true }}
    >
      {/* Glowing dot or check mark for live status */}
      <div className={`absolute top-5 left-5 ${isLive ? 'w-auto h-auto p-1' : 'w-3 h-3 rounded-full'} ${isLive ? 'text-[#14F195]' : `bg-${color}`} ${!isLive && 'blur-[2px]'}`}>
        {isLive && <Check size={16} />}
      </div>
      
      {/* Subtle gradient overlay */}
      <div className={`absolute inset-0 opacity-5 bg-gradient-to-br from-${color} to-transparent rounded-xl pointer-events-none`} />
      
      <h3 className="text-xl font-bold mb-2 mt-5">
        {phase}
        {isLive && (
          <span className="ml-2 text-sm font-normal text-[#14F195]">(Live)</span>
        )}
      </h3>
      <h4 className={`text-lg font-medium text-${color} mb-4`}>{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
};

const Roadmap = () => {
  return (
    <section id="roadmap" className="py-20 relative overflow-hidden">
      <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-solana/5 blur-3xl opacity-20 z-0"></div>
      <div className="absolute -bottom-[200px] -left-[200px] w-[400px] h-[400px] rounded-full bg-wallet-accent/5 blur-3xl opacity-20 z-0"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent">Road map</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Implementation plans
          </p>
        </motion.div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <RoadmapCard 
            phase="Phase 1" 
            title="MVP Launch" 
            description="Basic voice commands for seamless transactions and token swaps. Focus on providing a simple and intuitive user experience. Strong blockchain integration to ensure security and reliability." 
            color="solana"
            delay={0}
            isLive={true}
          />
          <RoadmapCard 
            phase="Phase 2" 
            title="AI Expansion" 
            description="Advanced AI capabilities for improved voice recognition and reduced errors. Introduction of multi-language support for global accessibility. Enhanced personalization to cater to individual user preferences and behaviors." 
            color="solana"
            delay={1}
          />
          <RoadmapCard 
            phase="Phase 3" 
            title="DeFi Integration" 
            description="Collaboration with DeFi protocols to enable staking, lending, and yield farming. Seamless access to decentralized financial products through voice commands. Expanded features for power users, including advanced analytics and real-time insights." 
            color="solana"
            delay={2}
          />
          <RoadmapCard 
            phase="Phase 4" 
            title="Ecosystem Growth" 
            description="Launch marketing campaigns to onboard a wider user base. Continuous feature development based on user feedback. Strengthen partnerships within the Solana ecosystem to enhance platform utility." 
            color="wallet-accent"
            delay={3}
          />
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
