import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmationModal Component
 * Redesigned popup matching the soft lavender design. Features rounded-[20px] corners,
 * Lucide warning symbols, and full-rounded action pills.
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, primary
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop glass blur */}
      <div 
        className="fixed inset-0 bg-zinc-950/5 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card content */}
      <div className="relative w-full max-w-sm transform overflow-hidden rounded-[20px] bg-white p-6 text-left align-middle shadow-xl border border-[#ECECF3] transition-all animate-fade-in">
        <div className="flex flex-col items-center text-center space-y-4">
          
          {/* Warning Icon Badge */}
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            type === 'danger' 
              ? 'bg-[#FFF0F0] text-[#EF4444]' 
              : type === 'warning'
              ? 'bg-[#FFF9EE] text-[#F59E0B]'
              : 'bg-[#EDF2FF] text-[#4F7CFF]'
          }`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          
          <div className="space-y-1.5">
            <h3 className="text-sm font-extrabold text-zinc-800">
              {title}
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons Panel */}
        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            className="flex-1 px-4 py-2.5 text-xs font-semibold text-zinc-500 bg-[#FAFAFC] hover:bg-zinc-100 border border-[#ECECF3] rounded-full transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            className={`flex-1 px-4 py-2.5 text-xs font-bold text-white rounded-full transition-all hover:scale-[1.02] ${
              type === 'danger'
                ? 'bg-[#EF4444] hover:bg-[#EF4444]/90 shadow-lg shadow-rose-100/50'
                : type === 'warning'
                ? 'bg-[#F59E0B] hover:bg-[#F59E0B]/90 shadow-lg shadow-amber-100/50'
                : 'bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 shadow-md shadow-blue-100/50'
            }`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
