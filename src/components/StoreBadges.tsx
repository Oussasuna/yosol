
import React from 'react';
import { Apple, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const StoreBadges = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }} 
        className="flex items-center"
      >
        <Badge 
          variant="solid" 
          className="px-4 py-2 flex items-center gap-2 bg-[#7E69AB] text-white border-none"
        >
          <Apple className="h-5 w-5" />
          <div>
            <div className="text-[10px] opacity-80">Coming soon to</div>
            <div className="text-sm font-semibold">App Store</div>
          </div>
        </Badge>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }} 
        className="flex items-center"
      >
        <Badge 
          variant="solid" 
          className="px-4 py-2 flex items-center gap-2 bg-[#0EA5E9] text-white border-none"
        >
          <ShoppingBag className="h-5 w-5" />
          <div>
            <div className="text-[10px] opacity-80">Coming soon to</div>
            <div className="text-sm font-semibold">Google Play</div>
          </div>
        </Badge>
      </motion.div>
    </div>
  );
};

export default StoreBadges;
