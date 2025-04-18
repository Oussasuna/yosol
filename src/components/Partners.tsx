import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const Partners = () => {
  const partners = [{
    name: "Dexscreener",
    logo: "/lovable-uploads/150888b3-9f51-49dc-aa5f-7e3c7f7a906d.png",
    description: "DEX Analytics Platform",
    link: "https://dexscreener.com"
  }, {
    name: "Jupiter",
    logo: "/lovable-uploads/e76cacca-12c4-461e-801f-7763a29a8e53.png",
    description: "Liquidity Aggregator",
    link: "https://jup.ag"
  }, {
    name: "Raydium",
    logo: "/lovable-uploads/867150ba-12a9-43ee-8d40-0d1611b9ce25.png",
    description: "AMM & Liquidity Provider",
    link: "https://raydium.io"
  }, {
    name: "Solana",
    logo: "/lovable-uploads/7f869378-c6d0-4932-af06-255a30e9f110.png",
    description: "Blockchain Platform",
    link: "https://solana.com"
  }];

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div className="text-center mb-16 space-y-4" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.7
      }}>
          <h3 className="text-lg font-medium tracking-wider text-solana">
            TRUSTED PARTNERS
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Built with the Best
          </h2>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
          once: true
        }}>
          {partners.map(partner => (
            <motion.a key={partner.name} href={partner.link} target="_blank" rel="noopener noreferrer" variants={itemVariants} whileHover={{
              scale: 1.02
            }} className="group px-0">
              <Card className="h-full p-6 bg-transparent border-none hover:border-solana/50 transition-all duration-500 rounded-xl">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="w-24 h-24 object-contain opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-none p-0"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }} 
                    />
                  </div>
                  <div className="text-center group-hover:transform group-hover:translate-y-[-2px] transition-all duration-500">
                    <h4 className="font-semibold text-lg mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                      {partner.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
