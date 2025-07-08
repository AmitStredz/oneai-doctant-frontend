import { useState, useRef } from 'react';
import { Check, Clock, Send, User, Calendar, FileText, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const COMMON_MEDICATIONS = [
  'Amoxicillin', 'Paracetamol', 'Dextromethorphan', 'Ibuprofen', 'Azithromycin', 'Cetirizine', 'Metformin', 'Lisinopril'
];
const COMMON_DOSAGES = ['125mg', '250mg', '500mg', '1g', '5ml', '10ml', '15mg'];
const COMMON_FREQUENCIES = [
  'Once daily', 'Twice daily', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'PRN'
];
const COMMON_EATING_TIMINGS = ['Before food', 'After food', 'With food'];
const COMMON_ROUTES = ['Oral', 'Topical', 'Injection', 'Inhaled', 'Sublingual'];
const COMMON_DURATIONS = ['3 days', '5 days', '7 days', '10 days'];
const COMMON_RECOMMENDATIONS = [
  'Get adequate rest',
  'Stay hydrated',
  'Monitor temperature',
  'Avoid smoking',
  'Follow up if symptoms worsen',
  'Take medications as prescribed'
];

const PrescriptionPanel = ({ prescription, onSendToPharmacy }) => {
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [customRecommendations, setCustomRecommendations] = useState(['']);
  const [editingMedication, setEditingMedication] = useState(null);
  const [customMedications, setCustomMedications] = useState([]);
  const [showAddMedForm, setShowAddMedForm] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    route: 'Oral',
    eatingTiming: ''
  });
  const [showAddRecForm, setShowAddRecForm] = useState(false);
  const [newRec, setNewRec] = useState('');
  
  // Default prescription data structure
  const defaultPrescription = {
    patient: {
      name: 'Ajmal',
      age: 20, 
      gender: 'Male',
      phone: '87348723239',
      address: 'RG Road, Devi Nagar, Kottayam',
      patientId: '5'
    },
    doctor: {
      name: 'Dr. Sarah Johnson',
      license: 'MD123456',
      specialty: 'Internal Medicine',
      clinic: 'City Medical Center',
      phone: '+1-555-0123'
    },
    symptoms: ['Fever', 'Cough', 'Fatigue', 'Body aches'],
    conditions: ['Upper Respiratory Infection', 'Mild Dehydration'],
    diagnosis: 'Upper respiratory tract infection with associated symptoms. Patient shows signs of viral infection with secondary bacterial component.',
    keywords: ['fever', 'cough', 'respiratory', 'infection', 'viral'],
    recommendations: [
      'Get adequate rest (8-10 hours of sleep)',
      'Stay hydrated - drink plenty of fluids',
      'Avoid smoking and alcohol',
      'Use a humidifier to ease breathing',
      'Gargle with warm salt water',
      'Take medications as prescribed'
    ],
    medications: [
      {
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '7 days',
        instructions: 'Take with food',
        route: 'Oral',
        eatingTiming: 'After food'
      },
      {
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Every 6 hours as needed',
        duration: '5 days',
        instructions: 'For fever and pain',
        route: 'Oral',
        eatingTiming: 'With food'
      },
      {
        name: 'Dextromethorphan',
        dosage: '15mg',
        frequency: 'Every 4 hours',
        duration: '5 days',
        instructions: 'For cough suppression',
        route: 'Oral',
        eatingTiming: 'Before food'
      }
    ]
  };

  const currentPrescription = defaultPrescription || prescription ;

  // Add a ref for the prescription content
  const prescriptionRef = useRef(null);

  const toggleMedication = (medicationIndex) => {
    setSelectedMedications(prev => 
      prev.includes(medicationIndex)
        ? prev.filter(i => i !== medicationIndex)
        : [...prev, medicationIndex]
    );
  };

  const updateCustomRecommendation = (index, value) => {
    setCustomRecommendations(prev => 
      prev.map((rec, i) => i === index ? value : rec)
    );
  };

  const removeCustomRecommendation = (index) => {
    setCustomRecommendations(prev => prev.filter((_, i) => i !== index));
  };

  const updateCustomMedication = (index, field, value) => {
    setCustomMedications(prev => 
      prev.map((med, i) => i === index ? { ...med, [field]: value } : med)
    );
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Download as PDF handler
  const handleDownload = () => {
    if (prescriptionRef.current) {
      html2pdf().from(prescriptionRef.current).set({
        margin: 0.5,
        filename: `prescription_${currentPrescription.patient.patientId}_${new Date().toISOString().split('T')[0]}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }).save();
    }
  };

  // Print only prescription content
  const handlePrint = () => {
    if (prescriptionRef.current) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Prescription</title>');
      printWindow.document.write('<link rel="stylesheet" href="/src/index.css" />');
      printWindow.document.write('</head><body>');
      printWindow.document.write(prescriptionRef.current.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  // Add Medication Handler
  const handleAddMedication = () => {
    setCustomMedications(prev => [...prev, newMed]);
    setNewMed({
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      route: 'Oral',
      eatingTiming: ''
    });
    setShowAddMedForm(false);
  };

  // Add Recommendation Handler
  const handleAddRecommendation = () => {
    setCustomRecommendations(prev => [...prev, newRec]);
    setNewRec('');
    setShowAddRecForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div ref={prescriptionRef} id="prescription-content">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentPrescription?.doctor?.clinic}</h2>
              <p className="text-gray-800">{currentPrescription?.doctor?.name}</p>
              <p className="text-sm text-gray-700">{currentPrescription?.doctor?.specialty}</p>
              <p className="text-sm text-gray-700">License: {currentPrescription?.doctor?.license}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700">Date: {getCurrentDate()}</p>
              <p className="text-sm text-gray-700">Phone: {currentPrescription?.doctor?.phone}</p>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <User size={20} />
            Patient Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium text-gray-800">Name:</span> <span className="text-gray-900">{currentPrescription.patient?.name}</span></p>
              <p><span className="font-medium text-gray-800">Age:</span> <span className="text-gray-900">{currentPrescription.patient?.age}</span></p>
              <p><span className="font-medium text-gray-800">Gender:</span> <span className="text-gray-900">{currentPrescription.patient?.gender}</span></p>
            </div>
            <div>
              <p><span className="font-medium text-gray-800">Patient ID:</span> <span className="text-gray-900">{currentPrescription.patient?.patientId}</span></p>
              <p><span className="font-medium text-gray-800">Phone:</span> <span className="text-gray-900">{currentPrescription.patient?.phone}</span></p>
              <p><span className="font-medium text-gray-800">Address:</span> <span className="text-gray-900">{currentPrescription.patient?.address}</span></p>
            </div>
          </div>
        </div>

        {/* Symptoms & Conditions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Symptoms & Conditions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Symptoms:</h4>
              <ul className="list-disc list-inside text-gray-800 space-y-1">
                {currentPrescription.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Conditions:</h4>
              <ul className="list-disc list-inside text-gray-800 space-y-1">
                {currentPrescription.conditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
            <FileText size={20} />
            Diagnosis Summary
          </h3>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-gray-900">{currentPrescription.diagnosis}</p>
          </div>
          <div className="mt-3">
            <h4 className="font-medium text-gray-800 mb-2">Key Indicators:</h4>
            <div className="flex flex-wrap gap-2">
              {currentPrescription.keywords.map((keyword, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-900 rounded-full text-sm border border-blue-200">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {COMMON_RECOMMENDATIONS.map((rec, idx) => (
              <button
                key={idx}
                type="button"
                className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${customRecommendations.includes(rec) ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-green-50'}`}
                onClick={() => setCustomRecommendations(prev => prev.includes(rec) ? prev : [...prev, rec])}
              >
                {rec}
              </button>
            ))}
          </div>
          {/* Custom Recommendations */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-2">Custom Recommendations:</h4>
            {customRecommendations.map((rec, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={rec}
                  onChange={(e) => updateCustomRecommendation(index, e.target.value)}
                  placeholder="Enter custom recommendation..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button
                  onClick={() => removeCustomRecommendation(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {showAddRecForm ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={newRec}
                  onChange={e => setNewRec(e.target.value)}
                  placeholder="Enter recommendation..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button
                  onClick={handleAddRecommendation}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => setShowAddRecForm(false)}
                  className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddRecForm(true)}
                className="flex items-center gap-2 px-3 py-2 text-blue-700 hover:bg-blue-50 rounded-lg"
              >
                <Plus size={16} />
                Add Custom Recommendation
              </button>
            )}
          </div>
        </div>

        {/* Medications */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Medications</h3>
          <div className="space-y-3">
            {[...currentPrescription.medications, ...customMedications].map((med, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedMedications.includes(index)}
                      onChange={() => toggleMedication(index)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <h5 className="font-semibold text-gray-900">{med.name}</h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-800 font-medium">{med.dosage}</span>
                    <button
                      onClick={() => setEditingMedication(index)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>
                {editingMedication === index ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {/* Medication Name Dropdown */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Medication Name</label>
                      <select
                        value={med.name}
                        onChange={e => updateCustomMedication(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        <option value="">Select medication</option>
                        {COMMON_MEDICATIONS.map((name, idx) => (
                          <option key={idx} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                    {/* Dosage Dropdown */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Dosage</label>
                      <select
                        value={med.dosage}
                        onChange={e => updateCustomMedication(index, 'dosage', e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        <option value="">Select dosage</option>
                        {COMMON_DOSAGES.map((d, idx) => (
                          <option key={idx} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    {/* Frequency Quick-pick */}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Frequency</label>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_FREQUENCIES.map((freq, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${med.frequency === freq ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-blue-50'}`}
                            onClick={() => updateCustomMedication(index, 'frequency', freq)}
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Eating Timing Quick-pick */}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Eating Timing</label>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_EATING_TIMINGS.map((timing, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${med.eatingTiming === timing ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-blue-50'}`}
                            onClick={() => updateCustomMedication(index, 'eatingTiming', timing)}
                          >
                            {timing}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Route Dropdown */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Route</label>
                      <select
                        value={med.route}
                        onChange={e => updateCustomMedication(index, 'route', e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        {COMMON_ROUTES.map((route, idx) => (
                          <option key={idx} value={route}>{route}</option>
                        ))}
                      </select>
                    </div>
                    {/* Duration Quick-pick */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_DURATIONS.map((dur, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${med.duration === dur ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-blue-50'}`}
                            onClick={() => updateCustomMedication(index, 'duration', dur)}
                          >
                            {dur}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Instructions */}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Instructions</label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={e => updateCustomMedication(index, 'instructions', e.target.value)}
                        placeholder="Instructions (optional)"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setEditingMedication(null)}
                        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={() => setEditingMedication(null)}
                        className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{med.frequency}</span>
                    </div>
                    <div>
                      <span className="font-medium">Duration: </span>
                      {med.duration}
                    </div>
                    <div>
                      <span className="font-medium">Route: </span>
                      {med.route}
                    </div>
                    <div>
                      <span className="font-medium">Instructions: </span>
                      {med.instructions}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Add Medication Form */}
          {showAddMedForm ? (
            <div className="border rounded-lg p-4 mt-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {/* Medication Name Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Medication Name</label>
                  <select
                    value={newMed.name}
                    onChange={e => setNewMed(med => ({ ...med, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Select medication</option>
                    {COMMON_MEDICATIONS.map((name, idx) => (
                      <option key={idx} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                {/* Dosage Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Dosage</label>
                  <select
                    value={newMed.dosage}
                    onChange={e => setNewMed(med => ({ ...med, dosage: e.target.value }))}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Select dosage</option>
                    {COMMON_DOSAGES.map((d, idx) => (
                      <option key={idx} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                {/* Frequency Quick-pick */}
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Frequency</label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_FREQUENCIES.map((freq, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${newMed.frequency === freq ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-blue-50'}`}
                        onClick={() => setNewMed(med => ({ ...med, frequency: freq }))}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Eating Timing Quick-pick */}
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Eating Timing</label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_EATING_TIMINGS.map((timing, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${newMed.eatingTiming === timing ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-blue-50'}`}
                        onClick={() => setNewMed(med => ({ ...med, eatingTiming: timing }))}
                      >
                        {timing}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Route Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Route</label>
                  <select
                    value={newMed.route}
                    onChange={e => setNewMed(med => ({ ...med, route: e.target.value }))}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    {COMMON_ROUTES.map((route, idx) => (
                      <option key={idx} value={route}>{route}</option>
                    ))}
                  </select>
                </div>
                {/* Duration Quick-pick */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_DURATIONS.map((dur, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${newMed.duration === dur ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-blue-50'}`}
                        onClick={() => setNewMed(med => ({ ...med, duration: dur }))}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Instructions */}
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Instructions</label>
                  <input
                    type="text"
                    value={newMed.instructions}
                    onChange={e => setNewMed(med => ({ ...med, instructions: e.target.value }))}
                    placeholder="Instructions (optional)"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleAddMedication}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus size={16} /> Add Medication
                </button>
                <button
                  onClick={() => setShowAddMedForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddMedForm(true)}
              className="flex items-center gap-2 px-3 py-2 text-blue-700 hover:bg-blue-50 rounded-lg mt-4"
            >
              <Plus size={16} /> Add Medication
            </button>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <button
          onClick={() => onSendToPharmacy?.(selectedMedications)}
          disabled={selectedMedications.length === 0}
          className="flex-1 min-w-[200px] px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Send size={16} />
          Send to Pharmacy ({selectedMedications.length} medications)
        </button>
        
        <button
          onClick={handlePrint}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Print Prescription
        </button>
        
        <button
          onClick={handleDownload}
          className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PrescriptionPanel;