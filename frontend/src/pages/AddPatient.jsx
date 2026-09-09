import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PatientForm from '../components/PatientForm';
import { usePatients } from '../hooks/usePatients';
import toast from 'react-hot-toast';

/**
 * AddPatient Page — connected to real backend via usePatients hook.
 * Design unchanged from existing layout.
 */
const AddPatient = () => {
  const navigate = useNavigate();
  const { handleAdd } = usePatients();

  const handleIntakeSuccess = async (patientData) => {
    try {
      await handleAdd(patientData);
      setTimeout(() => navigate('/patients'), 1200);
    } catch {
      // Error toast is handled by handleAdd in the hook
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header and back action */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-1 text-[11px] font-bold text-zinc-450 hover:text-zinc-700 transition-colors mb-2.5"
        >
          <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
        
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
          Admit New Patient
        </h1>
        <p className="text-xs text-zinc-400 font-semibold mt-1">
          Complete the patient enrollment registry dossier. Fields marked with an asterisk (*) are mandatory.
        </p>
      </div>

      {/* Form connected to API */}
      <PatientForm onSubmitSuccess={handleIntakeSuccess} />
    </div>
  );
};

export default AddPatient;
