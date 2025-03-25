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
  const teamMembers: TeamMember[] = [{
    name: "Alex Johnson",
    role: "Founder & CEO",
    bio: "Blockchain expert with 10+ years in fintech and AI innovation.",
    initials: "AJ",
    socialLinks: {
      github: "https://github.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com"
    }
  }, {
    name: "Sophia Chen",
    role: "CTO",
    bio: "Former Google AI engineer with expertise in voice recognition systems.",
    initials: "SC",
    socialLinks: {
      github: "https://github.com",
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
      github: "https://github.com",
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
  return <section id="team" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-solana/10 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-wallet-accent/10 blur-3xl opacity-30"></div>
      
      
    </section>;
};
export default TeamSection;