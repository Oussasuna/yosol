
import React from 'react';
import { motion } from 'framer-motion';

const MobileAppBanner: React.FC = () => {
  return (
    <motion.div 
      className="relative z-20 bg-black/30 backdrop-blur-md px-6 py-5 rounded-xl border border-white/10 max-w-md mx-auto sm:mx-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-3 rounded-full bg-solana animate-pulse"></div>
        <p className="text-white font-medium">Mobile Apps Coming Soon</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.a 
          href="#" 
          className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-lg px-5 py-3 border border-white/10"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(153, 69, 255, 0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          <svg viewBox="0 0 24 24" height="24" width="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M16 18a4 4 0 0 0 4-4v-8a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h9"></path>
            <path d="M9 11.5h10"></path>
            <path d="M17 15.5h-3"></path>
            <path d="M12 7.5v8"></path>
            <path d="m11 17 2 2 4-4"></path>
          </svg>
          <div className="text-left">
            <div className="text-[10px] text-white/80">Download on the</div>
            <div className="text-sm font-semibold text-white">App Store</div>
          </div>
        </motion.a>
        
        <motion.a 
          href="#" 
          className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-lg px-5 py-3 border border-white/10"
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(20, 241, 149, 0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          <svg viewBox="0 0 24 24" height="24" width="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="m5 3 14 9-9 2-5 7z"></path>
            <path d="m5 3 7 5"></path>
            <path d="m5 3 4 11"></path>
          </svg>
          <div className="text-left">
            <div className="text-[10px] text-white/80">GET IT ON</div>
            <div className="text-sm font-semibold text-white">Play Store</div>
          </div>
        </motion.a>
      </div>
    </motion.div>
  );
};

export default MobileAppBanner;
