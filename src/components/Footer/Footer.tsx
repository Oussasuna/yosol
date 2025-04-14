
import React, { useState } from 'react';
import { Send, Github, Twitter, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  const socialLinks = [
    {
      name: 'TELEGRAM',
      icon: <Send className="h-5 w-5" />,
      description: 'Join the community',
      href: '#'
    },
    {
      name: 'TWITTER',
      icon: <Twitter className="h-5 w-5" />,
      description: 'Follow the latest news',
      href: '#'
    },
    {
      name: 'DISCORD',
      icon: <MessageCircle className="h-5 w-5" />,
      description: 'Explore the community',
      href: '#'
    },
    {
      name: 'GITHUB',
      icon: <Github className="h-5 w-5" />,
      description: 'Issues & Feature request',
      href: '#'
    }
  ];

  return (
    <footer className="relative z-10 py-20 border-t border-white/5">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.img 
            src="/lovable-uploads/d07cc954-9c88-4ecd-8aaf-4bd39838b67f.png" 
            alt="Planet" 
            className="w-16 h-16 mb-8"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-4xl font-bold mb-4">Stay Connected.</h2>
          <h3 className="text-4xl font-bold mb-8">Get Updates.</h3>
          
          <form onSubmit={handleSubmit} className="w-full max-w-md mb-12">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/5 border-white/10"
              />
              <Button type="submit" className="bg-solana hover:bg-solana-dark">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4 mb-2">
                {link.icon}
                <span className="font-semibold">{link.name}</span>
              </div>
              <p className="text-sm text-gray-400">{link.description}</p>
            </motion.a>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} yosol. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
