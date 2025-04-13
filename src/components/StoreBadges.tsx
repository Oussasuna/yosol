import React from 'react';
import { Apple, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
const StoreBadges = () => {
  return <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
      <motion.div whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.95
    }} className="flex items-center">
        
      </motion.div>
      
      <motion.div whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.95
    }} className="flex items-center">
        
      </motion.div>
    </div>;
};
export default StoreBadges;