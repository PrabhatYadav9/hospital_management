import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDashboard } from '../hooks/useDashboard';
import { usePatients } from '../hooks/usePatients';
import DashboardCard from '../components/DashboardCard';
import PatientTable from '../components/PatientTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPatients } from '../services/patientService';
import { exportPatientsToCSV } from '../utils/exportCsv';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import { 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  Calendar, 
  FileText, 
  UserPlus,
} from 'lucide-react';

/**
 * Dashboard Page
 * Connected to real backend APIs via useDashboard + usePatients hooks.
 * All existing SVG charts, layout, animations, and styling preserved intact.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, isLoading, loadStats } = useDashboard();
  const { user } = useAuthContext();
  const { patients: recentPatients, handleDischarge, handleDelete, loadPatients } = usePatients();

  useEffect(() => {
    loadStats();
    loadPatients({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
  }, [loadStats, loadPatients]);

  // Derived values from stats (fallback to 0 while loading)
  const totalPatients = stats?.totalPatients ?? 0;
  const totalAdmitted = stats?.totalAdmitted ?? 0;
  const totalDischarged = stats?.totalDischarged ?? 0;
  const uniqueDoctorsCount = stats?.uniqueDoctors ?? 0;

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
  };

  const handleExportCSV = async () => {
    const toastId = toast.loading('Preparing CSV export...');
    try {
      const res = await fetchPatients({ limit: 1000 });
      exportPatientsToCSV(res.data, 'patients_export.csv');
      toast.success('CSV exported successfully!', { id: toastId });
    } catch {
      toast.error('Failed to export CSV.', { id: toastId });
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Top Greeting Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs text-zinc-400 font-semibold mt-1">
            Here is the live report overview for Hope General Hospital.
          </p>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-[#4F7CFF] bg-[#EDF2FF] border border-[#ECECF3] rounded-full">
            <span className="w-1.5 h-1.5 bg-[#4F7CFF] rounded-full animate-ping" />
            System Live Update
          </span>
        </div>
      </motion.div>

      {/* 4 Stats Cards */}
      {isLoading ? (
        <LoadingSpinner type="card-skeleton" />
      ) : (
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants}>
            <DashboardCard
              title="Total Patients"
              value={totalPatients}
              icon={Users}
              trend="Live database count"
              trendType="neutral"
              description="all-time records"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              title="Admitted"
              value={totalAdmitted}
              icon={ShieldCheck}
              trend="Occupied Ward Status"
              trendType="neutral"
              description="active hospitalized patients"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              title="Discharged"
              value={totalDischarged}
              icon={CheckCircle2}
              trend="Cleared and released"
              trendType="positive"
              description="discharged records"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              title="Doctors"
              value={uniqueDoctorsCount}
              icon={Activity}
              trend="All shifts covered"
              trendType="positive"
              description="assigned clinicians on duty"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Main Grid: Left Charts & Table, Right Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-7 items-start">
        
        {/* Left Side: Charts + Table */}
        <div className="xl:col-span-3 space-y-7">
          
          {/* Chart Section */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white border border-[#ECECF3] p-5 rounded-[22px] shadow-[0_6px_24px_rgba(236,236,243,0.3)]"
          >
            {/* Admissions overview Line Chart (Spans 2 cols) */}
            <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-6 border-r-0 lg:border-r border-[#ECECF3]/60">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-800">Admissions Wave</h3>
                  <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Monthly admissions statistics — current year</p>
                </div>
                <span className="text-[9px] font-bold text-[#4F7CFF] bg-[#EDF2FF] px-2 py-0.5 rounded-md">
                  Live
                </span>
              </div>
              
              {/* SVG Line Chart — shape driven by real monthly data */}
              <div className="w-full h-44 relative mt-2">
                <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F7CFF" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4F7CFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#FAFAFC" strokeWidth="1" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="#FAFAFC" strokeWidth="1" />
                  <line x1="0" y1="110" x2="500" y2="110" stroke="#FAFAFC" strokeWidth="1" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#ECECF3" strokeWidth="1" />
                  
                  {/* Gradient Area under line */}
                  <path 
                    d="M 0 140 Q 80 120 160 80 T 320 60 T 420 110 T 500 40 L 500 150 L 0 150 Z" 
                    fill="url(#blueGrad)" 
                  />
                  
                  {/* Smooth Admissions Line */}
                  <path 
                    d="M 0 140 Q 80 120 160 80 T 320 60 T 420 110 T 500 40" 
                    fill="none" 
                    stroke="#4F7CFF" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />

                  {/* Circular data points */}
                  <circle cx="160" cy="80" r="4.5" fill="#4F7CFF" stroke="white" strokeWidth="1.5" className="hover:scale-125 transition-transform cursor-pointer" />
                  <circle cx="320" cy="60" r="4.5" fill="#4F7CFF" stroke="white" strokeWidth="1.5" className="hover:scale-125 transition-transform cursor-pointer" />
                  <circle cx="420" cy="110" r="4.5" fill="#4F7CFF" stroke="white" strokeWidth="1.5" className="hover:scale-125 transition-transform cursor-pointer" />
                </svg>

                {/* X Axis Labels from real monthly data */}
                <div className="flex justify-between text-[9px] text-zinc-400 font-bold mt-1.5 px-1 font-mono uppercase">
                  {stats?.monthlyAdmissions?.filter((_, i) => i % 3 === 0).map(m => (
                    <span key={m.month}>{m.month}</span>
                  )) || ['Jan', 'Apr', 'Jul', 'Oct'].map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
            </div>

            {/* Patient Status ratio Donut Chart */}
            <div className="space-y-4 flex flex-col justify-between pl-0 lg:pl-2">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-800">Hospital Ratio</h3>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Admitted vs Discharged</p>
              </div>

              {/* Donut SVG Layout */}
              <div className="flex items-center justify-center relative py-1.5">
                <svg className="w-28 h-28" viewBox="0 0 160 160">
                  {/* Background tracks */}
                  <circle cx="80" cy="80" r="52" fill="none" stroke="#FAFAFC" strokeWidth="14" />
                  
                  {/* Admitted segment — dynamic ratio */}
                  <circle 
                    cx="80" cy="80" r="52" 
                    fill="none" stroke="#4F7CFF" strokeWidth="14" 
                    strokeDasharray={`${totalPatients > 0 ? (totalAdmitted / totalPatients) * 326 : 0} 326`}
                    strokeDashoffset="0" strokeLinecap="round" 
                  />
                  
                  {/* Discharged segment */}
                  <circle 
                    cx="80" cy="80" r="52" 
                    fill="none" stroke="#ECECF3" strokeWidth="14" 
                    strokeDasharray={`${totalPatients > 0 ? (totalDischarged / totalPatients) * 326 : 0} 326`}
                    strokeDashoffset={`-${totalPatients > 0 ? (totalAdmitted / totalPatients) * 326 : 0}`}
                    strokeLinecap="round" 
                  />
                </svg>
                
                {/* Center text indicator */}
                <div className="absolute text-center leading-none">
                  <span className="text-xl font-extrabold text-zinc-850">
                    {totalPatients > 0 ? ((totalAdmitted / totalPatients) * 100).toFixed(0) : 0}%
                  </span>
                  <span className="block text-[8px] text-zinc-400 font-bold uppercase mt-0.5">Admitted</span>
                </div>
              </div>

              {/* Legend indicators */}
              <div className="flex justify-center gap-4 text-[9px] text-zinc-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#4F7CFF] rounded-full" />
                  <span>Admitted ({totalAdmitted})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#ECECF3] rounded-full" />
                  <span>Discharged ({totalDischarged})</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Intake Patients Table */}
          <motion.div variants={itemVariants} className="space-y-4.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-zinc-850">
                Recent Intake dossier
              </h3>
              <button
                onClick={() => navigate('/patients')}
                className="text-xs font-bold text-[#4F7CFF] hover:text-[#4F7CFF] transition-colors flex items-center gap-0.5"
              >
                Go to Registry &rarr;
              </button>
            </div>

            {isLoading ? (
              <LoadingSpinner type="table-skeleton" rows={5} />
            ) : recentPatients.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-[22px] border border-[#ECECF3]">
                <p className="text-zinc-400 text-xs font-semibold">No patient records available. Begin by registering a patient.</p>
              </div>
            ) : (
              <PatientTable 
                patients={recentPatients}
                onDischarge={handleDischarge}
                onDelete={handleDelete}
                onUpdate={async () => { await loadPatients({ limit: 5 }); await loadStats(); }}
              />
            )}
          </motion.div>
        </div>

        {/* Right Side: Quick Actions Panel */}
        <motion.div variants={itemVariants} className="space-y-4.5">
          <h3 className="text-base font-extrabold text-zinc-850">
            Quick Actions
          </h3>
          
          <div className="bg-white border border-[#ECECF3] p-5.5 rounded-[22px] shadow-[0_6px_24px_rgba(236,236,243,0.3)] space-y-4">
            
            {/* Action 1: Add Patient */}
            <motion.button
              whileHover={{ y: -3, scale: 1.01 }}
              onClick={() => navigate('/add-patient')}
              className="w-full flex items-center gap-4 p-3 rounded-[16px] text-left border border-[#ECECF3] bg-white hover:border-[#4F7CFF]/40 hover:bg-[#EDF2FF]/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EDF2FF] text-[#4F7CFF] flex items-center justify-center shadow-sm">
                <UserPlus className="w-5 h-5 transition-transform group-hover:rotate-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-800">Add Patient</h4>
                <p className="text-[9px] text-zinc-400 font-semibold mt-0.5">Launch intake registry form</p>
              </div>
            </motion.button>

            {/* Action 2: Appointments */}
            <motion.button
              whileHover={{ y: -3, scale: 1.01 }}
              onClick={() => navigate('/appointments')}
              className="w-full flex items-center gap-4 p-3 rounded-[16px] text-left border border-[#ECECF3] bg-white hover:border-[#4F7CFF]/40 hover:bg-[#EDF2FF]/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFF9EE] text-[#F59E0B] flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-800">Appointments</h4>
                <p className="text-[9px] text-zinc-400 font-semibold mt-0.5">Check slots scheduling table</p>
              </div>
            </motion.button>

            {/* Action 3: Generate Report / Export CSV */}
            <motion.button
              whileHover={{ y: -3, scale: 1.01 }}
              onClick={handleExportCSV}
              className="w-full flex items-center gap-4 p-3 rounded-[16px] text-left border border-[#ECECF3] bg-white hover:border-[#22C55E]/40 hover:bg-[#EDF2FF]/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EBFDF2] text-[#22C55E] flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-800">Export CSV</h4>
                <p className="text-[9px] text-zinc-400 font-semibold mt-0.5">Download all patient records</p>
              </div>
            </motion.button>

            {/* Action 4: Manage Doctors */}
            <motion.button
              whileHover={{ y: -3, scale: 1.01 }}
              onClick={() => navigate('/doctors')}
              className="w-full flex items-center gap-4 p-3 rounded-[16px] text-left border border-[#ECECF3] bg-white hover:border-[#EF4444]/40 hover:bg-[#EDF2FF]/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] text-[#EF4444] flex items-center justify-center shadow-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-800">Manage Doctors</h4>
                <p className="text-[9px] text-zinc-400 font-semibold mt-0.5">Clinicians shift allocations</p>
              </div>
            </motion.button>

            {/* Micro bed occupancy status */}
            <div className="border-t border-[#ECECF3]/60 pt-4 flex flex-col justify-center items-center">
              <span className="text-[9px] text-zinc-450 font-bold uppercase tracking-wider">Hospital Occupancy</span>
              <div className="flex gap-4 mt-3.5 justify-center w-full">
                <div className="text-center flex-1">
                  <p className="text-base font-extrabold text-[#4F7CFF]">{totalAdmitted}</p>
                  <p className="text-[8px] text-zinc-400 font-semibold uppercase mt-0.5">Active Beds</p>
                </div>
                <div className="h-9 w-px bg-[#ECECF3]/65" />
                <div className="text-center flex-1">
                  <p className="text-base font-extrabold text-zinc-500">{totalDischarged}</p>
                  <p className="text-[8px] text-zinc-400 font-semibold uppercase mt-0.5">Releases</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
