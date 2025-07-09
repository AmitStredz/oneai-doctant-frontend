import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../App';

const fetchPatients = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('Not authenticated');
  const response = await fetch(`${BASE_URL}/patients/list`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 401) throw new Error('Not authenticated');
  if (!response.ok) throw new Error('Failed to fetch patients');
  return await response.json();
};

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients()
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSelect = (patient) => {
    navigate('/dashboard', { state: { patient } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 font-sans">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Select a Patient</h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading patients...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error === 'Not authenticated' ? 'You must be logged in to view patients.' : error}</div>
        ) : patients.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No patients found. Please add a patient to get started.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {patients.map(patient => (
              <li
                key={patient.id}
                className="flex items-center gap-4 py-4 cursor-pointer hover:bg-blue-50 rounded-lg px-2 transition"
                onClick={() => handleSelect(patient)}
              >
                <User className="text-blue-500" size={32} />
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-900">{patient.name}</div>
                  <div className="text-sm text-gray-800 font-semibold">Case: {patient.case_summary}</div>
                  <div className="text-sm text-gray-600">Age: {patient.age} | Gender: {patient.gender}</div>
                  <div className="text-xs text-gray-500">Last Visit: {patient.last_visit_date} | Phone: {patient.phone_number}</div>
                </div>
                <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">View</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 