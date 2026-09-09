import React, { useEffect, useState } from 'react';
import { CalendarDays, Plus, RefreshCw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAppointments, createAppointment, updateAppointmentStatus, deleteAppointment } from '../services/appointmentService';
import { fetchPatients } from '../services/patientService';
import { fetchDoctors } from '../services/doctorService';

const initialForm = { patientId: '', patientName: '', doctor: '', date: new Date().toISOString().slice(0, 10), time: '09:00', type: 'Consultation', notes: '' };

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [appointmentRes, patientRes, doctorRes] = await Promise.all([
        fetchAppointments({ limit: 100 }), fetchPatients({ limit: 100 }), fetchDoctors({ limit: 100, status: 'Active' })
      ]);
      setAppointments(appointmentRes.data || []);
      setPatients(patientRes.data || []);
      setDoctors(doctorRes.data || []);
    } catch (error) { toast.error(error.response?.data?.message || 'Unable to load appointments.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    try { await createAppointment(form); toast.success('Appointment scheduled.'); setForm(initialForm); setShowForm(false); load(); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to schedule appointment.'); }
  };
  const changeStatus = async (appointment, status) => {
    try { await updateAppointmentStatus(appointment.appointmentId || appointment._id, status); load(); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to update appointment.'); }
  };
  const remove = async (appointment) => {
    try { await deleteAppointment(appointment.appointmentId || appointment._id); toast.success('Appointment deleted.'); load(); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to delete appointment.'); }
  };

  return <div className="space-y-6 animate-fade-in">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-3xl font-extrabold text-zinc-900">Appointments</h1><p className="text-xs text-zinc-400 font-semibold mt-1">Schedule and manage the hospital calendar.</p></div><div className="flex gap-2"><button onClick={load} title="Refresh appointments" className="p-3 border border-[#ECECF3] rounded-full bg-white text-zinc-500"><RefreshCw className="w-4 h-4" /></button><button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#4F7CFF] text-white text-xs font-bold"><Plus className="w-4 h-4" /> New appointment</button></div></div>
    {showForm && <form onSubmit={submit} className="bg-white border border-[#ECECF3] rounded-[22px] p-5 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
      <select required value={form.patientId} onChange={e => { const patient = patients.find(item => (item.patientId || item._id) === e.target.value); setForm({ ...form, patientId: e.target.value, patientName: patient?.name || '' }); }} className="input"><option value="">Select patient</option>{patients.map(patient => <option key={patient.patientId || patient._id} value={patient.patientId || patient._id}>{patient.name} ({patient.patientId})</option>)}</select>
      <select required value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} className="input"><option value="">Select doctor</option>{doctors.map(doctor => <option key={doctor.doctorId || doctor._id} value={doctor.name}>{doctor.name}</option>)}</select>
      <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input" /><input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="input" />
      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input"><option>Consultation</option><option>Follow-up</option><option>Procedure</option><option>Emergency</option></select><input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input" /><button className="md:col-span-3 justify-self-end px-5 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-bold">Schedule appointment</button>
    </form>}
    <div className="bg-white border border-[#ECECF3] rounded-[22px] overflow-x-auto shadow-sm"><table className="w-full text-left text-xs"><thead className="bg-[#FAFAFC] text-[10px] uppercase text-zinc-400"><tr><th className="p-4">Date / time</th><th className="p-4">Patient</th><th className="p-4">Doctor</th><th className="p-4">Type</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#ECECF3]/60">{!loading && appointments.map(appointment => <tr key={appointment.appointmentId || appointment._id}><td className="p-4 font-semibold">{appointment.date}<span className="block text-zinc-400">{appointment.time}</span></td><td className="p-4">{appointment.patientName}<span className="block text-zinc-400">{appointment.patientId}</span></td><td className="p-4">{appointment.doctor}</td><td className="p-4">{appointment.type}</td><td className="p-4"><select value={appointment.status} onChange={e => changeStatus(appointment, e.target.value)} className="input py-1"><option>Scheduled</option><option>Completed</option><option>Cancelled</option></select></td><td className="p-4 text-right"><button onClick={() => remove(appointment)} title="Delete appointment" className="p-2 text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>)}</tbody></table>{!loading && !appointments.length && <div className="p-12 text-center text-xs text-zinc-400"><CalendarDays className="w-8 h-8 mx-auto mb-2 text-zinc-300" />No appointments scheduled.</div>}</div>
  </div>;
}
