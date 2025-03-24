
import React from 'react';
import NavBar from './NavBar';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react'; // Import the Wallet icon from lucide-react

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e] text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {/* 3D grid effect */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        {/* Background glow spots */}
        <div className="absolute top-20 left-[20%] w-[30vw] h-[30vw] rounded-full bg-solana/5 filter blur-[120px]"></div>
        <div className="absolute bottom-10 right-[20%] w-[20vw] h-[20vw] rounded-full bg-wallet-accent/5 filter blur-[100px]"></div>
      </div>
      
      <NavBar />
      
      <main className="relative z-10">
        {children}
      </main>
      
      <footer className="py-12 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-4">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Wallet className="h-6 w-6 text-solana" />
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-solana to-wallet-accent">yosol</h3>
              </motion.div>
              <p className="text-sm text-muted-foreground">Your AI-Powered Voice Wallet for Solana</p>
              
              <div className="flex space-x-4 pt-2">
                {['Twitter', 'Discord', 'GitHub'].map((social, index) => (
                  <motion.a 
                    key={social}
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Features', 'Dashboard', 'Roadmap', 'Team'].map((link) => (
                  <motion.li 
                    key={link}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Documentation', 'API', 'Support', 'Privacy'].map((link) => (
                  <motion.li 
                    key={link}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Subscribe</h4>
              <p className="text-sm text-muted-foreground mb-3">Stay updated with the latest features and releases</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-white/5 text-sm border border-white/10 rounded-l-md focus:outline-none focus:ring-1 focus:ring-solana/50"
                />
                <button className="bg-solana hover:bg-solana-dark px-3 py-2 text-sm font-medium rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} yosol. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {['Terms', 'Privacy', 'Cookies'].map((item) => (
                <a key={item} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
