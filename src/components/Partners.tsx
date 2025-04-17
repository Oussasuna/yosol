
import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Check, Award } from "lucide-react";

const Partners = () => {
  const partners = [
    {
      name: "Dexscreener",
      logo: "/placeholder.svg",
      description: "DEX Analytics Platform",
      link: "https://dexscreener.com",
      icon: <Award className="h-5 w-5 text-solana/70" />
    },
    {
      name: "Jupiter",
      logo: "/placeholder.svg",
      description: "Liquidity Aggregator",
      link: "https://jup.ag",
      icon: <Check className="h-5 w-5 text-solana/70" />
    },
    {
      name: "Orca",
      logo: "/placeholder.svg",
      description: "DEX Protocol",
      link: "https://www.orca.so",
      icon: <Shield className="h-5 w-5 text-solana/70" />
    },
    {
      name: "Solana",
      logo: "/placeholder.svg",
      description: "Blockchain Platform",
      link: "https://solana.com",
      icon: <Shield className="h-5 w-5 text-solana/70" />
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
      {/* Mesh gradient background with soft glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[300px] left-[10%] w-[600px] h-[600px] rounded-full bg-solana/5 blur-[100px] opacity-30"></div>
        <div className="absolute -bottom-[200px] right-[5%] w-[500px] h-[500px] rounded-full bg-wallet-accent/5 blur-[100px] opacity-30"></div>
        
        {/* Subtle grid patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px)] bg-[size:3rem_1px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:1px_3rem]"></div>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-lg font-medium tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-solana/80 to-wallet-accent/80">
            TRUSTED PARTNERS
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Building the Future Together
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
            We collaborate with industry leaders to bring you the most secure and innovative blockchain experience.
          </p>
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
              <Card className="h-full p-6 bg-black/40 backdrop-blur-sm border border-white/[0.08] hover:border-solana/30 transition-all duration-500 rounded-xl overflow-hidden relative">
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-solana/5 to-wallet-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Card content */}
                <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
                  <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                    <div className="absolute inset-0 bg-white/5 rounded-full"></div>
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="w-12 h-12 object-contain opacity-80 group-hover:opacity-100 transition-all duration-500"
                    />
                    {/* Trust indicator */}
                    <div className="absolute -bottom-1 -right-1 bg-black/60 p-1 rounded-full border border-white/10">
                      {partner.icon}
                    </div>
                  </div>
                  
                  <div className="text-center group-hover:transform group-hover:translate-y-[-2px] transition-all duration-500">
                    <h4 className="font-semibold text-lg mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                      {partner.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {partner.description}
                    </p>
                    <div className="flex items-center justify-center text-solana opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-xs font-medium">Verified Partner</span>
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.a>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Our partners undergo a thorough verification process to ensure the highest standards of security and reliability for our users.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
