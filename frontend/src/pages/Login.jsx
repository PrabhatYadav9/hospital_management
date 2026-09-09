import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

/**
 * Login Page
 * Apple HIG design: white card, #4F7CFF accent, clean typography.
 * Matches the existing design system exactly.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error } = useAuthContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Already logged in — redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Enter a valid email address.';
    if (!formData.password) errs.password = 'Password is required.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard', { replace: true });
    } catch {
      // error is handled by useAuth and displayed via context
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Hospital Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#4F7CFF] shadow-lg shadow-blue-200/60 mb-4">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">MedFlow OS</h1>
          <p className="text-xs font-semibold text-zinc-400 mt-1">Hope General Hospital — Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#ECECF3] rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-zinc-800">Welcome back</h2>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">Sign in to access the patient management system.</p>
          </div>

          {/* API Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3 mb-4 bg-[#FFF0F0] border border-[#EF4444]/15 rounded-2xl text-[#EF4444]"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-xs font-semibold">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@hopehospital.com"
                autoComplete="email"
                className={`w-full px-4 py-3 text-xs border rounded-[16px] focus:outline-none focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all ${
                  formErrors.email
                    ? 'border-[#EF4444] focus:border-[#EF4444]'
                    : 'border-[#ECECF3] focus:border-[#4F7CFF]'
                }`}
              />
              {formErrors.email && (
                <p className="text-[10px] text-[#EF4444] font-semibold">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[10px] font-semibold text-[#4F7CFF] hover:underline"
                  onClick={() => {/* Forgot password UI placeholder */}}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-10 text-xs border rounded-[16px] focus:outline-none focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all ${
                    formErrors.password
                      ? 'border-[#EF4444] focus:border-[#EF4444]'
                      : 'border-[#ECECF3] focus:border-[#4F7CFF]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 inset-y-0 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-[10px] text-[#EF4444] font-semibold">{formErrors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                  formData.rememberMe ? 'bg-[#4F7CFF] border-[#4F7CFF]' : 'border-[#ECECF3]'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }))}
              >
                {formData.rememberMe && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-zinc-500">Remember me for 24 hours</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-xs font-bold text-white bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 rounded-full transition-all shadow-md shadow-blue-200/50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in to MedFlow OS'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-zinc-400 font-semibold mt-6 uppercase tracking-wider">
          Hospital Patient Management System &bull; Secure Portal
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
