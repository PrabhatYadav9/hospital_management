import React, { useEffect, useState } from 'react';
import { useDoctors } from '../hooks/useDoctors';
import { 
  User, 
  CalendarDays, 
  Phone, 
  Home, 
  AlertTriangle 
} from 'lucide-react';

/**
 * PatientForm Component
 * Two-column clean layout matching Apple HIG. Uses rounded 16px inputs,
 * desaturated blue focus indicators, and solid blue primary submit buttons.
 */
const PatientForm = ({ onSubmitSuccess }) => {
  const { doctors, loadDoctors } = useDoctors();
  const initialFormState = {
    name: '',
    age: '',
    gender: 'Male',
    disease: '',
    doctor: '',
    phone: '',
    address: '',
    emergencyContact: '',
    admissionDate: new Date().toISOString().split('T')[0], // Defaults to today
    status: 'Admitted'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => { loadDoctors({ limit: 100, status: 'Active' }); }, [loadDoctors]);
  useEffect(() => {
    if (!formData.doctor && doctors.length) setFormData(prev => ({ ...prev, doctor: doctors[0].name }));
  }, [doctors, formData.doctor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error dynamically
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Patient name is required";
    if (!formData.age) {
      tempErrors.age = "Patient age is required";
    } else if (isNaN(formData.age) || parseInt(formData.age) <= 0) {
      tempErrors.age = "Please provide a valid age";
    }
    if (!formData.disease.trim()) tempErrors.disease = "Disease diagnosis is required";
    if (!formData.phone.trim()) tempErrors.phone = "Phone number contact is required";
    if (!formData.address.trim()) tempErrors.address = "Patient address is required";
    if (!formData.emergencyContact.trim()) tempErrors.emergencyContact = "Emergency contact details are required";
    if (!formData.admissionDate) tempErrors.admissionDate = "Admission date is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (onSubmitSuccess) {
      onSubmitSuccess({
        ...formData,
        age: parseInt(formData.age)
      });
    }

    setIsSuccess(true);
    setFormData(initialFormState);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <div className="w-full bg-white border border-[#ECECF3] rounded-[22px] shadow-[0_4px_24px_rgba(236,236,243,0.35)] overflow-hidden transition-all duration-300">
      
      {/* Success banner */}
      {isSuccess && (
        <div className="bg-[#EDF2FF]/85 border-b border-[#4F7CFF]/15 p-4 flex items-center gap-2.5 text-[#4F7CFF] text-xs font-semibold animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F7CFF] animate-ping" />
          <span>Intake dossier added successfully. Returning to active listings...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 md:p-9.5 space-y-7 text-xs">
        
        {/* Two-Column Grid spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Patient Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              Patient Name <span className="text-[#EF4444] ml-0.5">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
              className={`w-full px-4 py-2.8 border rounded-[16px] text-xs focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all ${
                errors.name ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#ECECF3]'
              }`}
            />
            {errors.name && (
              <span className="text-[10px] text-[#EF4444] flex items-center gap-1 mt-1 font-semibold">
                <AlertTriangle className="w-3 h-3" />
                {errors.name}
              </span>
            )}
          </div>

          {/* Age */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Age <span className="text-[#EF4444] ml-0.5">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="e.g. 45"
              className={`w-full px-4 py-2.8 border rounded-[16px] text-xs focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all ${
                errors.age ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#ECECF3]'
              }`}
            />
            {errors.age && (
              <span className="text-[10px] text-[#EF4444] flex items-center gap-1 mt-1 font-semibold">
                <AlertTriangle className="w-3 h-3" />
                {errors.age}
              </span>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Gender <span className="text-[#EF4444] ml-0.5">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2.8 border border-[#ECECF3] rounded-[16px] text-xs focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Disease */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Intake Diagnosis / Disease <span className="text-[#EF4444] ml-0.5">*</span>
            </label>
            <input
              type="text"
              name="disease"
              value={formData.disease}
              onChange={handleInputChange}
              placeholder="e.g. Pneumonia"
              className={`w-full px-4 py-2.8 border rounded-[16px] text-xs focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all ${
                errors.disease ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#ECECF3]'
              }`}
            />
            {errors.disease && (
              <span className="text-[10px] text-[#EF4444] flex items-center gap-1 mt-1 font-semibold">
                <AlertTriangle className="w-3 h-3" />
                {errors.disease}
              </span>
            )}
          </div>

          {/* Doctor */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Assigned Doctor <span className="text-[#EF4444] ml-0.5">*</span>
            </label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              className="w-full px-4 py-2.8 border border-[#ECECF3] rounded-[16px] text-xs focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all bg-white"
            >
              {doctors.map((doc) => (
                <option key={doc.doctorId || doc._id} value={doc.name}>{doc.name}</option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              Phone <span className="text-[#EF4444] ml-0.5">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g. +1 (555) 012-3456"
              className={`w-full px-4 py-2.8 border rounded-[16px] text-xs focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all ${
                errors.phone ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#ECECF3]'
              }`}
            />
            {errors.phone && (
              <span className="text-[10px] text-[#EF4444] flex items-center gap-1 mt-1 font-semibold">
                <AlertTriangle className="w-3 h-3" />
                {errors.phone}
              </span>
            )}
          </div>

          {/* Admission Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-zinc-400" />
              Admission Date <span className="text-[#EF4444] ml-0.5">*</span>
            </label>
            <input
              type="date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.8 border rounded-[16px] text-xs focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all bg-white ${
                errors.admissionDate ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#ECECF3]'
              }`}
            />
            {errors.admissionDate && (
              <span className="text-[10px] text-[#EF4444] flex items-center gap-1 mt-1 font-semibold">
                <AlertTriangle className="w-3 h-3" />
                {errors.admissionDate}
              </span>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Admission Status <span className="text-[#EF4444] ml-0.5">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2.8 border border-[#ECECF3] rounded-[16px] text-xs focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all bg-white"
            >
              <option value="Admitted">Admitted</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-zinc-400" />
            Home Address <span className="text-[#EF4444] ml-0.5">*</span>
          </label>
          <textarea
            name="address"
            rows="2"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Complete residential address..."
            className={`w-full px-4 py-2.8 border rounded-[16px] text-xs focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all resize-none ${
              errors.address ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#ECECF3]'
            }`}
          />
          {errors.address && (
            <span className="text-[10px] text-[#EF4444] flex items-center gap-1 mt-1 font-semibold">
              <AlertTriangle className="w-3 h-3" />
              {errors.address}
            </span>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Emergency Contact Name & Phone <span className="text-[#EF4444] ml-0.5">*</span>
          </label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            placeholder="e.g. Jane Doe (Wife) - +1 (555) 012-3457"
            className={`w-full px-4 py-2.8 border rounded-[16px] text-xs focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all ${
              errors.emergencyContact ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#ECECF3]'
            }`}
          />
          {errors.emergencyContact && (
            <span className="text-[10px] text-[#EF4444] flex items-center gap-1 mt-1 font-semibold">
              <AlertTriangle className="w-3 h-3" />
              {errors.emergencyContact}
            </span>
          )}
        </div>

        {/* Buttons Panel */}
        <div className="flex justify-end gap-3 pt-6 border-t border-[#ECECF3]/60">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 text-xs font-semibold text-zinc-500 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-full transition-colors"
          >
            Reset Form
          </button>
          
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 rounded-full transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-blue-100/50"
          >
            Admit Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
