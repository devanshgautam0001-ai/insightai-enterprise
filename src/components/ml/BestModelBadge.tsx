import React from 'react';
import { Award } from 'lucide-react';
import { motion } from 'motion/react';

export const BestModelBadge: React.FC = () => {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
    >
      <Award className="w-3.5 h-3.5" />
      Best AutoML Model
    </motion.span>
  );
};
export default BestModelBadge;
