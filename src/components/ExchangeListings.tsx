
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

// Define the type for exchange data
interface Exchange {
  name: string;
  logo: string;
  status: 'listed' | 'coming-soon';
}

const ExchangeListings: React.FC = () => {
  // List of exchanges
  const exchanges: Exchange[] = [
    {
      name: 'Gate.io',
      logo: '/lovable-uploads/888fc46b-71e8-4804-b6de-50bbb5c9d7e5.png',
      status: 'coming-soon',
    },
    {
      name: 'KCEX',
      logo: '/lovable-uploads/888fc46b-71e8-4804-b6de-50bbb5c9d7e5.png',
      status: 'coming-soon',
    },
    {
      name: 'XT.com',
      logo: '/lovable-uploads/888fc46b-71e8-4804-b6de-50bbb5c9d7e5.png',
      status: 'coming-soon',
    },
    {
      name: 'Jupiter',
      logo: '/lovable-uploads/888fc46b-71e8-4804-b6de-50bbb5c9d7e5.png',
      status: 'coming-soon',
    },
    {
      name: 'DexScreener',
      logo: '/lovable-uploads/888fc46b-71e8-4804-b6de-50bbb5c9d7e5.png',
      status: 'coming-soon',
    },
    {
      name: 'Defined',
      logo: '/lovable-uploads/888fc46b-71e8-4804-b6de-50bbb5c9d7e5.png',
      status: 'coming-soon',
    }
  ];

  return (
    <section className="py-16 relative overflow-hidden bg-black">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-solana/5 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-wallet-accent/5 rounded-full filter blur-3xl opacity-30"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent">
            Our official ticker YSOL is listed on
          </h2>
          <div className="w-full max-w-3xl mx-auto mt-4 border-t border-white/10"></div>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center">
          {exchanges.map((exchange, index) => (
            <motion.div
              key={exchange.name}
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative group flex flex-col items-center">
                <div className="w-24 h-24 flex items-center justify-center glass-card p-4 rounded-2xl mb-2 transition-all duration-300 group-hover:scale-105">
                  {exchange.logo ? (
                    <img
                      src={exchange.name.toLowerCase().replace(/\s+/g, '-') + '.svg'}
                      alt={`${exchange.name} logo`}
                      className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        // Fallback to a text representation if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `<div class="text-lg font-bold text-white/80">${exchange.name}</div>`;
                      }}
                    />
                  ) : (
                    <div className="text-lg font-bold text-white/80">{exchange.name}</div>
                  )}
                </div>
                {exchange.status === 'coming-soon' && (
                  <Badge variant="outline" className="bg-wallet-accent/10 text-wallet-accent border-wallet-accent/20 absolute -top-2 -right-2">
                    Soon
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExchangeListings;
