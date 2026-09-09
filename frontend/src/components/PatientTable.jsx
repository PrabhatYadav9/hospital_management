import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import ConfirmationModal from './ConfirmationModal';
import { useDoctors } from '../hooks/useDoctors';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  LogOut,
  X,
  AlertTriangle
} from 'lucide-react';

/**
 * PatientTable Component
 * Redesigned for Apple HIG. Features pure white card layout, soft desaturated
 * blue icon hover actions, and sleek input focus sheets.
 */
const PatientTable = ({ patients, onDischarge, onDelete, onUpdate }) => {
  const navigate = useNavigate();
  const { doctors, loadDoctors } = useDoctors();
  // Modal states
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // Confirmation state
  const [confirmAction, setConfirmAction] = useState({ isOpen: false, type: '', patientId: '', patientName: '' });

  // Form states
  const [editFormData, setEditFormData] = useState({});
  const [editErrors, setEditErrors] = useState({});

  React.useEffect(() => {
    loadDoctors({ limit: 100, status: 'Active' });
  }, [loadDoctors]);

  const handleOpenView = (patient) => {
    navigate(`/patients/${patient.patientId || patient.id}`);
  };

  const handleOpenEdit = (patient) => {
    setSelectedPatient(patient);
    setEditFormData({ ...patient });
    setEditErrors({});
    setIsEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEditForm = () => {
    const errors = {};
    if (!editFormData.name?.trim()) errors.name = "Patient name is required";
    if (!editFormData.age || isNaN(editFormData.age) || editFormData.age <= 0) {
      errors.age = "Please enter a valid age";
    }
    if (!editFormData.disease?.trim()) errors.disease = "Disease detail is required";
    if (!editFormData.doctor?.trim()) errors.doctor = "Doctor is required";
    if (!editFormData.phone?.trim()) errors.phone = "Phone number is required";
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;
    
    if (onUpdate && selectedPatient) {
      try {
        await onUpdate(selectedPatient.patientId, {
          ...editFormData,
          age: parseInt(editFormData.age)
        });
        setIsEditOpen(false);
      } catch {
        // Error handled by parent hook
      }
    }
  };

  const handleOpenConfirm = (type, id, name) => {
    setConfirmAction({
      isOpen: true,
      type,
      patientId: id,
      patientName: name
    });
  };

  const handleExecuteConfirm = () => {
    const { type, patientId } = confirmAction;
    if (type === 'discharge') {
      if (onDischarge) onDischarge(patientId);
    } else if (type === 'delete') {
      if (onDelete) onDelete(patientId);
    }
    setConfirmAction({ isOpen: false, type: '', patientId: '', patientName: '' });
  };

  return (
    <div className="w-full bg-white border border-[#ECECF3] rounded-[22px] shadow-[0_4px_24px_rgba(236,236,243,0.3)] overflow-hidden">
      
      {/* Horizontal scroll grid */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAFAFC] border-b border-[#ECECF3] text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <th className="py-4.5 px-6">ID</th>
              <th className="py-4.5 px-6">Name</th>
              <th className="py-4.5 px-4">Age</th>
              <th className="py-4.5 px-4">Gender</th>
              <th className="py-4.5 px-6">Disease</th>
              <th className="py-4.5 px-6">Doctor</th>
              <th className="py-4.5 px-6">Admission Date</th>
              <th className="py-4.5 px-6">Status</th>
              <th className="py-4.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-[#ECECF3]/60 text-xs text-zinc-700">
            {patients.map((patient) => (
              <tr 
                key={patient.patientId || patient._id} 
                className="hover:bg-[#EDF2FF]/20 transition-all duration-150"
              >
                <td className="py-4 px-6 font-mono text-[10px] text-zinc-450 font-semibold">
                  {patient.patientId || patient.id}
                </td>
                
                {/* Name */}
                <td className="py-4 px-6 font-semibold text-zinc-800">
                  {patient.name}
                </td>
                
                {/* Age */}
                <td className="py-4 px-4 text-zinc-500 font-medium">
                  {patient.age}
                </td>
                
                {/* Gender */}
                <td className="py-4 px-4 text-zinc-500 font-medium">
                  {patient.gender}
                </td>
                
                {/* Disease */}
                <td className="py-4 px-6 max-w-[140px] truncate text-zinc-500 font-medium" title={patient.disease}>
                  {patient.disease}
                </td>
                
                {/* Doctor */}
                <td className="py-4 px-6 text-zinc-500 font-medium">
                  {patient.doctor}
                </td>
                
                {/* Date */}
                <td className="py-4 px-6 text-zinc-400 font-medium">
                  {patient.admissionDate}
                </td>
                
                {/* Status Badges */}
                <td className="py-4 px-6">
                  <StatusBadge status={patient.status} />
                </td>
                
                {/* Actions: Icons Only */}
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    {/* View Details */}
                    <button
                      onClick={() => handleOpenView(patient)}
                      title="View Details"
                      className="p-2 text-zinc-400 hover:text-[#4F7CFF] hover:bg-[#EDF2FF]/60 rounded-full transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {/* Edit info */}
                    <button
                      onClick={() => handleOpenEdit(patient)}
                      title="Edit Record"
                      className="p-2 text-zinc-400 hover:text-[#4F7CFF] hover:bg-[#EDF2FF]/60 rounded-full transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    
                    {/* Discharge button */}
                    <button
                      onClick={() => handleOpenConfirm('discharge', patient.patientId || patient.id, patient.name)}
                      disabled={patient.status === 'Discharged'}
                      title="Discharge Patient"
                      className={`p-2 rounded-full transition-colors ${
                        patient.status === 'Discharged'
                          ? 'text-zinc-200 cursor-not-allowed'
                          : 'text-zinc-400 hover:text-[#F59E0B] hover:bg-[#FFF9EE]/70'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                    
                    {/* Delete button */}
                    <button
                      onClick={() => handleOpenConfirm('delete', patient.patientId || patient.id, patient.name)}
                      title="Delete Patient"
                      className="p-2 text-zinc-400 hover:text-[#EF4444] hover:bg-[#FFF0F0] rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================== */}
      {/* 1. VIEW PATIENT DETAILS MODAL              */}
      {/* ========================================== */}
      {isViewOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-950/5 backdrop-blur-xs" onClick={() => setIsViewOpen(false)} />
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-[20px] bg-white p-7 text-left align-middle shadow-xl border border-[#ECECF3] transition-all animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ECECF3]/60 pb-4 mb-4.5">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest font-bold text-[#4F7CFF]">
                  Intake Profile: {selectedPatient.patientId || selectedPatient.id}
                </span>
                <h3 className="text-base font-extrabold text-zinc-800">
                  {selectedPatient.name}
                </h3>
              </div>
              <button 
                onClick={() => setIsViewOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-650 flex items-center justify-center transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-2 gap-y-4.5 gap-x-6 text-xs text-zinc-600">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Age & Gender</span>
                <p className="font-semibold text-zinc-800 mt-0.5">
                  {selectedPatient.age} yrs &bull; {selectedPatient.gender}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedPatient.status} />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Admitted Diagnosis</span>
                <p className="font-semibold text-zinc-800 mt-0.5">
                  {selectedPatient.disease}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Assigned Doctor</span>
                <p className="font-semibold text-zinc-800 mt-0.5">
                  {selectedPatient.doctor}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Contact Phone</span>
                <p className="font-semibold text-zinc-800 mt-0.5">
                  {selectedPatient.phone}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Intake Date</span>
                <p className="font-semibold text-zinc-800 mt-0.5">
                  {selectedPatient.admissionDate}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Residential Address</span>
                <p className="font-semibold text-zinc-800 mt-0.5 leading-relaxed">
                  {selectedPatient.address}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Emergency Contact Person</span>
                <p className="font-semibold text-[#4F7CFF] mt-0.5">
                  {selectedPatient.emergencyContact}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-[#ECECF3]/60 pt-4">
              <button
                type="button"
                className="px-5 py-2.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 bg-[#FAFAFC] hover:bg-zinc-100 rounded-full transition-all border border-[#ECECF3]"
                onClick={() => setIsViewOpen(false)}
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. EDIT PATIENT DETAILS MODAL              */}
      {/* ========================================== */}
      {isEditOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-950/5 backdrop-blur-xs" onClick={() => setIsEditOpen(false)} />
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-[20px] bg-white p-7 text-left align-middle shadow-xl border border-[#ECECF3] transition-all animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ECECF3]/60 pb-4 mb-4.5">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest font-bold text-[#4F7CFF]">
                  Edit File: {selectedPatient.id}
                </span>
                <h3 className="text-base font-extrabold text-zinc-800">
                  Update Patient Details
                </h3>
              </div>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-zinc-650 flex items-center justify-center transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all text-xs"
                  />
                  {editErrors.name && <p className="text-[10px] text-[#EF4444] mt-1 font-semibold">{editErrors.name}</p>}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={editFormData.age || ''}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all text-xs"
                  />
                  {editErrors.age && <p className="text-[10px] text-[#EF4444] mt-1 font-semibold">{editErrors.age}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Gender</label>
                  <select
                    name="gender"
                    value={editFormData.gender || 'Male'}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all text-xs bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Status</label>
                  <select
                    name="status"
                    value={editFormData.status || 'Admitted'}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all text-xs bg-white"
                  >
                    <option value="Admitted">Admitted</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </div>

                {/* Disease */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Disease</label>
                  <input
                    type="text"
                    name="disease"
                    value={editFormData.disease || ''}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all text-xs"
                  />
                  {editErrors.disease && <p className="text-[10px] text-[#EF4444] mt-1 font-semibold">{editErrors.disease}</p>}
                </div>

                {/* Doctor */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Clinician</label>
                  <select
                    name="doctor"
                    value={editFormData.doctor || ''}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all text-xs bg-white"
                  >
                    {doctors.map((doctor) => (
                      <option key={doctor.doctorId || doctor._id} value={doctor.name}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                  {editErrors.doctor && <p className="text-[10px] text-[#EF4444] mt-1 font-semibold">{editErrors.doctor}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Contact Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone || ''}
                    onChange={handleEditChange}
                    className="w-full px-3.5 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all text-xs"
                  />
                  {editErrors.phone && <p className="text-[10px] text-[#EF4444] mt-1 font-semibold">{editErrors.phone}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Residential Address</label>
                <textarea
                  name="address"
                  rows="2"
                  value={editFormData.address || ''}
                  onChange={handleEditChange}
                  className="w-full px-3.5 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all text-xs resize-none"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Emergency Contact Person</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={editFormData.emergencyContact || ''}
                  onChange={handleEditChange}
                  className="w-full px-3.5 py-2.5 border border-[#ECECF3] rounded-[16px] focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all text-xs"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2.5 border-t border-[#ECECF3]/60 pt-4">
                <button
                  type="button"
                  className="px-5 py-2.5 text-xs font-semibold text-zinc-500 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-full transition-colors"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5.5 py-2.5 text-xs font-bold text-white bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 rounded-full transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. CONFIRMATION DIALOG (DELETE/DISCHARGE)  */}
      {/* ========================================== */}
      <ConfirmationModal
        isOpen={confirmAction.isOpen}
        onClose={() => setConfirmAction({ isOpen: false, type: '', patientId: '', patientName: '' })}
        onConfirm={handleExecuteConfirm}
        title={confirmAction.type === 'discharge' ? "Discharge Patient File" : "Delete Patient File"}
        message={
          confirmAction.type === 'discharge'
            ? `Discharge ${confirmAction.patientName}? This updates their status.`
            : `Are you sure you want to permanently delete ${confirmAction.patientName}'s file?`
        }
        confirmText={confirmAction.type === 'discharge' ? "Discharge" : "Delete"}
        type={confirmAction.type === 'discharge' ? 'warning' : 'danger'}
      />
    </div>
  );
};

export default PatientTable;
