import React from 'react';

/**
 * StatusBadge Component
 * Redesigned for Apple HIG. Uses soft desaturated blue for active admissions
 * and desaturated gray for discharged patients.
 */
const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase() || '';
  
  let badgeStyles = 'bg-zinc-50 text-zinc-500 border-zinc-200/60';
  let dotStyles = 'bg-zinc-400';
  
  if (s === 'admitted' || s === 'green' || s === 'success') {
    badgeStyles = 'bg-[#EDF2FF] text-[#4F7CFF] border-[#D6E4FF]/60';
    dotStyles = 'bg-[#4F7CFF] animate-pulse';
  } else if (s === 'discharged' || s === 'neutral' || s === 'gray') {
    badgeStyles = 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]/60';
    dotStyles = 'bg-zinc-400';
  } else if (s === 'danger' || s === 'red') {
    badgeStyles = 'bg-[#FFF0F0] text-[#EF4444] border-[#FEE4E2]/60';
    dotStyles = 'bg-[#EF4444]';
  } else if (s === 'warning' || s === 'orange') {
    badgeStyles = 'bg-[#FFF9EE] text-[#F59E0B] border-[#FEF0D9]/60';
    dotStyles = 'bg-[#F59E0B]';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${badgeStyles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
