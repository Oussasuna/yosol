
import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute -top-40 right-0 w-96 h-96 bg-solana/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-wallet-accent/10 rounded-full blur-3xl opacity-30"></div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-solana via-wallet-accent to-solana animate-text-gradient">
            BACKED BY AWESOMES
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Partners
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="h-full p-6 bg-background/50 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="w-16 h-16 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-solana/10 to-wallet-accent/10 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-lg mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                      {partner.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;

