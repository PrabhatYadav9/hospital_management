import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext(null);

/**
 * AuthProvider
 * Wraps the entire app. On mount, verifies the stored token is still valid.
 */
export function AuthProvider({ children }) {
  const auth = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (auth.token) {
        await auth.verifySession();
      }
      setIsInitializing(false);
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isInitializing) {
    // Full-page spinner while verifying token
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#4F7CFF]/20 border-t-[#4F7CFF] animate-spin" />
          <p className="text-[11px] font-semibold text-zinc-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * useAuthContext
 * Hook to consume auth state in any component.
 */
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}
