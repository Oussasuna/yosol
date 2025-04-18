import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Twitter, Linkedin } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  initials: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
}

const TeamSection = () => {
  const teamMembers: TeamMember[] = [{
    name: "Alex Johnson",
    role: "Founder & CEO",
    bio: "Blockchain expert with 10+ years in fintech and AI innovation.",
    initials: "AJ",
    socialLinks: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com"
    }
  }, {
    name: "Sophia Chen",
    role: "CTO",
    bio: "Former Google AI engineer with expertise in voice recognition systems.",
    initials: "SC",
    socialLinks: {
      linkedin: "https://linkedin.com"
    }
  }, {
    name: "Marcus Williams",
    role: "Head of Product",
    bio: "Crypto enthusiast and UX specialist with a passion for intuitive design.",
    initials: "MW",
    socialLinks: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com"
    }
  }, {
    name: "Leila Rahman",
    role: "Lead Developer",
    bio: "Solana ecosystem developer with multiple successful DeFi projects.",
    initials: "LR",
    socialLinks: {
      twitter: "https://twitter.com"
    }
  }];

  const container = {
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

  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="team" className="py-20 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-solana/10 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-wallet-accent/10 blur-3xl opacity-30"></div>
      
      <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Passionate innovators building the future of Solana-powered voice technology.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index} 
              className="glass-card p-6 relative group"
              variants={item}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-solana/20 to-wallet-accent/20 rounded-xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-white/10">
                  {member.image ? (
                    <AvatarImage src={member.image} alt={member.name} />
                  ) : (
                    <AvatarFallback className="bg-solana/20 text-lg font-medium text-solana">
                      {member.initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                <p className="text-sm text-solana mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                
                <div className="flex space-x-3 mt-auto">
                  {member.socialLinks?.twitter && (
                    <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-wallet-accent transition-colors">
                      <Twitter size={18} />
                    </a>
                  )}
                  {member.socialLinks?.linkedin && (
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-solana transition-colors">
                      <Linkedin size={18} />
                    </a>
                  )}
                </div>
                
                <motion.div 
                  className="absolute -bottom-2 right-2 w-3 h-3 rounded-full bg-wallet-accent/30 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0, 0.7, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
