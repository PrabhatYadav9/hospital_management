/**
 * exportCsv utility
 * Converts an array of patient objects to a downloadable CSV file.
 */
export function exportPatientsToCSV(patients, filename = 'patients.csv') {
  if (!patients || patients.length === 0) return;

  const headers = [
    'Patient ID', 'Name', 'Age', 'Gender', 'Blood Group',
    'Phone', 'Email', 'Disease', 'Doctor', 'Admission Date',
    'Status', 'Address', 'Emergency Contact',
  ];

  const rows = patients.map(p => [
    p.patientId || '',
    p.name || '',
    p.age || '',
    p.gender || '',
    p.bloodGroup || '',
    p.phone || '',
    p.email || '',
    p.disease || '',
    p.doctor || '',
    p.admissionDate || '',
    p.status || '',
    `"${(p.address || '').replace(/"/g, '""')}"`,
    `"${(p.emergencyContact || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
