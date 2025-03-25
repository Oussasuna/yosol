
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Github, Twitter, Linkedin } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  initials: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const TeamSection = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Blockchain expert with 10+ years in fintech and AI innovation.",
      initials: "AJ",
      socialLinks: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      name: "Sophia Chen",
      role: "CTO",
      bio: "Former Google AI engineer with expertise in voice recognition systems.",
      initials: "SC",
      socialLinks: {
        github: "https://github.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      name: "Marcus Williams",
      role: "Head of Product",
      bio: "Crypto enthusiast and UX specialist with a passion for intuitive design.",
      initials: "MW",
      socialLinks: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      name: "Leila Rahman",
      role: "Lead Developer",
      bio: "Solana ecosystem developer with multiple successful DeFi projects.",
      initials: "LR",
      socialLinks: {
        github: "https://github.com",
        twitter: "https://twitter.com"
      }
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
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
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-solana/10 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-wallet-accent/10 blur-3xl opacity-30"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Passionate experts building the future of AI-powered Solana wallets.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={item}
              className="glass-card p-6 text-center group relative"
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              {/* Hover glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-solana/20 to-wallet-accent/20 rounded-xl blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="mx-auto mb-4 relative">
                  <div className="w-24 h-24 mx-auto relative">
                    <Avatar className="w-24 h-24 border-4 border-white/10 group-hover:border-white/30 transition-all duration-300 shadow-lg">
                      {member.image ? (
                        <AvatarImage src={member.image} alt={member.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-solana to-wallet-accent text-white text-xl">
                          {member.initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    {/* 3D floating element */}
                    <motion.div 
                      className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-wallet-accent/50 backdrop-blur-sm"
                      animate={{ 
                        y: [0, -5, 0],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                      }}
                    />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-solana mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                
                <div className="flex justify-center space-x-3">
                  {member.socialLinks?.github && (
                    <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" 
                      className="text-muted-foreground hover:text-solana transition-colors">
                      <Github size={18} />
                    </a>
                  )}
                  {member.socialLinks?.twitter && (
                    <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-wallet-accent transition-colors">
                      <Twitter size={18} />
                    </a>
                  )}
                  {member.socialLinks?.linkedin && (
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-solana transition-colors">
                      <Linkedin size={18} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
