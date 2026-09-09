import React from 'react';
import { Users } from 'lucide-react';

/**
 * EmptyState Component
 * Displays clean visual notification state when results match zero filters.
 */
const EmptyState = ({
  title = "No Patients Found",
  description = "Try adjusting your search query or filters to find what you are looking for.",
  icon: Icon = Users,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white border border-[#ECECF3] rounded-[22px] shadow-[0_4px_24px_rgba(236,236,243,0.25)]">
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#EDF2FF] text-[#4F7CFF] mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-extrabold text-zinc-800">{title}</h3>
      <p className="text-xs text-zinc-400 font-semibold max-w-sm mt-1.5 mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 shadow-md shadow-blue-100/50 rounded-full transition-all hover:scale-[1.02]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
