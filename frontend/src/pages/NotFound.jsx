import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

/**
 * NotFound Component (404 Page)
 * Sleek visual screen directing users back to safe routing channels.
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="bg-white border border-[#ECECF3] p-10 rounded-[24px] shadow-[0_8px_30px_rgba(236,236,243,0.4)] max-w-md w-full space-y-6">
        
        {/* Warning Icon Banner */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFF0F0] text-[#EF4444]">
          <AlertCircle className="w-7 h-7" />
        </div>
        
        <div className="space-y-2">
          <span className="text-[9px] uppercase font-mono tracking-widest font-bold text-[#EF4444] bg-[#FFF0F0]/60 px-2.5 py-1 rounded-full">
            Error 404
          </span>
          <h2 className="text-lg font-extrabold text-zinc-800 mt-3">
            Dossier File Not Found
          </h2>
          <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
            The page directory you are requesting does not exist, has been archived, or was moved during hospital database synchronization.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2.8 px-4 text-xs font-bold text-white bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 shadow-md shadow-blue-100/50 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-2.8 px-4 text-xs font-bold text-zinc-550 bg-[#FAFAFC] hover:bg-zinc-100 border border-[#ECECF3] rounded-full transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
      
      <p className="text-[9px] text-zinc-400 font-bold mt-6 uppercase tracking-wider">
        Hospital Patient Management OS &bull; REDESIGN PHASE
      </p>
    </div>
  );
};

export default NotFound;
