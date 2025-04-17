import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Partners = () => {
  const partners = [
    {
      name: "Dexscreener",
      logo: "/placeholder.svg",
      description: "DEX Analytics Platform",
      link: "https://dexscreener.com"
    },
    {
      name: "Jupiter",
      logo: "/placeholder.svg",
      description: "Liquidity Aggregator",
      link: "https://jup.ag"
    },
    {
      name: "Orca",
      logo: "/placeholder.svg",
      description: "DEX Protocol",
      link: "https://www.orca.so"
    },
    {
      name: "Solana",
      logo: "/placeholder.svg",
      description: "Blockchain Platform",
      link: "https://solana.com"
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
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-black via-[#0D0D0D] to-black">
      <motion.div className="absolute top-0 left-0 w-full h-full z-0 opacity-70" initial={{
        opacity: 0
      }} animate={{
        opacity: 0.7
      }} transition={{
        duration: 1
      }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(153,69,255,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_0%_300px,rgba(20,241,149,0.1),transparent)]"></div>
        
        <motion.div className="absolute w-[500px] h-[500px] rounded-full bg-solana/5 blur-[100px]" animate={{
          x: [50, -50, 50],
          y: [20, -20, 20]
        }} transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }} />
        <motion.div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-wallet-accent/5 blur-[100px]" animate={{
          x: [-30, 30, -30],
          y: [-30, 30, -30]
        }} transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }} />
      </motion.div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-lg font-medium tracking-wider text-solana">
            TRUSTED PARTNERS
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Built with the Best
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {partners.map((partner) => (
            <motion.a
              key={partner.name}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="h-full p-6 bg-black/40 backdrop-blur-sm border border-[#333] hover:border-solana/50 transition-all duration-500 rounded-xl">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="w-16 h-16 object-contain opacity-70 group-hover:opacity-100 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-solana/10 to-wallet-accent/10 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-all duration-500" />
                  </div>
                  <div className="text-center group-hover:transform group-hover:translate-y-[-2px] transition-all duration-500">
                    <h4 className="font-semibold text-lg mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                      {partner.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {partner.description}
                    </p>
                    <div className="flex items-center justify-center text-solana opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-sm">Learn More</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
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
