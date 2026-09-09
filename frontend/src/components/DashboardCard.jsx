import React from 'react';
import { motion } from 'framer-motion';

/**
 * DashboardCard Component
 * Redesigned for Apple HIG specifications. Features pure white card surfaces,
 * soft desaturated blue pastel icon highlights, and spring hover lifts.
 */
const DashboardCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'positive', // positive, negative, neutral
  description
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, shadow: '0 10px 30px rgba(0, 0, 0, 0.03)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-white border border-[#ECECF3] p-6 rounded-[22px] shadow-[0_4px_24px_rgba(236,236,243,0.35)] flex flex-col justify-between relative overflow-hidden group cursor-default"
    >
      {/* Label and desaturated blue icon circle */}
      <div className="flex items-center justify-between mb-4.5">
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#EDF2FF] text-[#4F7CFF] transition-transform duration-300 group-hover:scale-102">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
      </div>

      {/* Metric details */}
      <div>
        <h3 className="text-3xl font-extrabold tracking-tight text-zinc-800">
          {value}
        </h3>
        
        <div className="flex items-center gap-1.5 mt-2.5">
          {trend && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              trendType === 'positive'
                ? 'bg-[#EBFDF2] text-[#22C55E]'
                : trendType === 'negative'
                ? 'bg-[#FFF0F0] text-[#EF4444]'
                : 'bg-[#EDF2FF] text-[#4F7CFF]'
            }`}>
              {trend}
            </span>
          )}
          {description && (
            <span className="text-[10px] font-semibold text-zinc-400">
              {description}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
