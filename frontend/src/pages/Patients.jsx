import React, { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, RefreshCw, Download } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import PatientTable from '../components/PatientTable';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { usePatients } from '../hooks/usePatients';
import { exportPatientsToCSV } from '../utils/exportCsv';
import { fetchPatients } from '../services/patientService';
import toast from 'react-hot-toast';
import { useDoctors } from '../hooks/useDoctors';

/**
 * Patients Page — wired to real backend via usePatients hook.
 * All design, animations, and layout unchanged.
 */
const Patients = () => {
  const { patients, meta, isLoading, error, loadPatients, handleDischarge, handleDelete, handleUpdate } = usePatients();
  const { doctors, loadDoctors } = useDoctors();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { loadDoctors({ limit: 100, status: 'Active' }); }, [loadDoctors]);

  // Debounced search + filter reload
  const fetchData = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (statusFilter !== 'All') params.status = statusFilter;
    if (genderFilter !== 'All') params.gender = genderFilter;
    if (doctorFilter !== 'All') params.doctor = doctorFilter;
    loadPatients(params);
  }, [currentPage, searchQuery, statusFilter, genderFilter, doctorFilter, loadPatients]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setGenderFilter('All');
    setDoctorFilter('All');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= meta.totalPages) setCurrentPage(page);
  };

  const handleExportCSV = async () => {
    const toastId = toast.loading('Preparing CSV export...');
    try {
      const res = await fetchPatients({ limit: 1000 });
      exportPatientsToCSV(res.data, 'patients_export.csv');
      toast.success('CSV exported!', { id: toastId });
    } catch {
      toast.error('Failed to export CSV.', { id: toastId });
    }
  };

  const hasFilters = searchQuery || statusFilter !== 'All' || genderFilter !== 'All' || doctorFilter !== 'All';

  return (
    <div className="space-y-7 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Patient Directory</h1>
          <p className="text-xs text-zinc-400 font-semibold mt-1">
            Browse admissions records database &bull; {meta.total} patient{meta.total !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-600 bg-white border border-[#ECECF3] hover:text-[#4F7CFF] hover:border-[#4F7CFF]/30 rounded-full transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-600 bg-white border border-[#ECECF3] hover:text-[#4F7CFF] hover:border-[#4F7CFF]/30 rounded-full transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#ECECF3] p-5 rounded-[22px] shadow-[0_6px_24px_rgba(236,236,243,0.3)] space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <SearchBar 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md w-full"
            placeholder="Search by name, ID, disease, doctor..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 lg:max-w-xl text-xs">
            {/* Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full pl-3.5 pr-8 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-none focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all bg-white appearance-none text-zinc-600 font-semibold"
              >
                <option value="All">Status: All</option>
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
              </select>
              <div className="absolute right-3.5 inset-y-0 flex items-center pointer-events-none text-zinc-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Gender */}
            <div className="relative">
              <select
                value={genderFilter}
                onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
                className="w-full pl-3.5 pr-8 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-none focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all bg-white appearance-none text-zinc-600 font-semibold"
              >
                <option value="All">Gender: All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute right-3.5 inset-y-0 flex items-center pointer-events-none text-zinc-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Doctor */}
            <div className="relative">
              <select
                value={doctorFilter}
                onChange={(e) => { setDoctorFilter(e.target.value); setCurrentPage(1); }}
                className="w-full pl-3.5 pr-8 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-none focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all bg-white appearance-none text-zinc-600 font-semibold"
              >
                <option value="All">Clinician: All</option>
                {doctors.map(doc => (
                  <option key={doc.doctorId || doc._id} value={doc.name}>{doc.name}</option>
                ))}
              </select>
              <div className="absolute right-3.5 inset-y-0 flex items-center pointer-events-none text-zinc-400">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table or States */}
      {isLoading ? (
        <LoadingSpinner type="table-skeleton" rows={itemsPerPage} />
      ) : error ? (
        <EmptyState 
          title="Failed to Load Patients"
          description={error}
          actionText="Retry"
          onAction={fetchData}
        />
      ) : patients.length === 0 ? (
        <EmptyState 
          title="No Patient Matches"
          description={hasFilters
            ? "No records match those filters. Clear to return to the full database."
            : "No patients in the database yet. Start by admitting a patient."
          }
          actionText={hasFilters ? "Clear Filters" : "Add First Patient"}
          onAction={hasFilters ? handleClearFilters : undefined}
        />
      ) : (
        <div className="space-y-5">
          <PatientTable 
            patients={patients}
            onDischarge={async (id) => { await handleDischarge(id); fetchData(); }}
            onDelete={async (id) => { await handleDelete(id); fetchData(); }}
            onUpdate={async (id, data) => { await handleUpdate(id, data); fetchData(); }}
          />

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-[#ECECF3] rounded-[22px] shadow-[0_4px_24px_rgba(236,236,243,0.25)] gap-4">
              <span className="text-[11px] font-semibold text-zinc-400">
                Showing <strong className="text-zinc-700">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong className="text-zinc-700">{Math.min(currentPage * itemsPerPage, meta.total)}</strong> of{' '}
                <strong className="text-zinc-700">{meta.total}</strong> records
              </span>
              
              <div className="flex gap-2.5 items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                    currentPage === 1
                      ? 'text-zinc-300 bg-zinc-50 border-zinc-200/60 cursor-not-allowed'
                      : 'text-zinc-600 bg-white border-[#ECECF3] hover:text-[#4F7CFF] hover:border-[#4F7CFF]/30'
                  }`}
                >
                  Prev
                </button>

                {[...Array(Math.min(meta.totalPages, 7))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 text-xs font-bold rounded-full transition-all ${
                        currentPage === page
                          ? 'bg-[#4F7CFF] text-white shadow-md shadow-blue-100/50'
                          : 'text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === meta.totalPages}
                  className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                    currentPage === meta.totalPages
                      ? 'text-zinc-300 bg-zinc-50 border-zinc-200/60 cursor-not-allowed'
                      : 'text-zinc-600 bg-white border-[#ECECF3] hover:text-[#4F7CFF] hover:border-[#4F7CFF]/30'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Patients;
