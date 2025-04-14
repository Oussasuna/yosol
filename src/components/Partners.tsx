
import React from 'react';
import { motion } from "framer-motion";

const Partners = () => {
  const partners = [
    {
      name: "Phantom",
      logo: "/placeholder.svg",
      description: "Leading Solana Wallet"
    },
    {
      name: "Solflare",
      logo: "/placeholder.svg",
      description: "Advanced Solana Wallet"
    },
    {
      name: "Magic Eden",
      logo: "/placeholder.svg",
      description: "NFT Marketplace"
    },
    {
      name: "Jupiter",
      logo: "/placeholder.svg",
      description: "Liquidity Aggregator"
    },
    {
      name: "Orca",
      logo: "/placeholder.svg",
      description: "DEX Protocol"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-solana/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-wallet-accent/10 rounded-full blur-3xl opacity-30"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h3 
            className="text-lg font-medium text-solana mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            BACKED BY AWESOMES
          </motion.h3>
          <motion.h2 
            className="text-4xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Partners
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              className="glass-card p-6 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="w-20 h-20 mb-4 opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <h4 className="font-medium mb-2">{partner.name}</h4>
              <p className="text-sm text-muted-foreground">{partner.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
