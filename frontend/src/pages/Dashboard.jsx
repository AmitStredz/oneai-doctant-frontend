import React, { useState, useEffect } from 'react';
import VoiceRecorder from '../components/VoiceRecorder';
import PatientDetails from '../components/PatientDetails';
import KeywordSelector from '../components/KeywordSelector';
import PatientHistory from '../components/PatientHistory';
import PrescriptionPanel from '../components/PrescriptionPanel';
import mockAPI from '../api/mockAPI';
import { RefreshCw } from 'lucide-react';
import { BASE_URL } from '../App';

const Dashboard = ({ initialPatient }) => {
  const [currentPatient, setCurrentPatient] = useState(initialPatient || null);
  const [patientHistory, setPatientHistory] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [currentStep, setCurrentStep] = useState('keywords'); // 'keywords' or 'prescription'
  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [relatedRecords, setRelatedRecords] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  useEffect(() => {
    if (initialPatient) {
      console.log('Initial patient provided:', initialPatient);
      loadPatient(initialPatient);
    } else {
      console.log('No initial patient, loading next patient');
      loadNextPatient();
    }
    // eslint-disable-next-line
  }, [initialPatient]);

  const fetchKeywords = async (patientId, selectedKeywordsArr) => {
    const token = localStorage.getItem('auth_token');
    console.log('Fetching keywords for patient:', patientId, 'with keywords:', selectedKeywordsArr);
    const response = await fetch(`${BASE_URL}/getkeywords/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({keywords: selectedKeywordsArr })
    });
    const data = await response.json();
    console.log('Keywords API response:', data);
    if (!response.ok) throw new Error('Failed to fetch keywords');
    return data;
  };

  const loadPatient = async (patient) => {
    setIsLoading(true);
    try {
      console.log('Loading patient details for:', patient.id, 'case:', patient.case);
      const [history, initialKeywords] = await Promise.all([
        mockAPI.fetchPatientHistory(patient.id),
        fetchKeywords(patient.id, [patient.case_summary])
      ]);
      setCurrentPatient(patient);
      setPatientHistory(history);
      setKeywords(initialKeywords);
      setSelectedKeywords([]);
      setCurrentStep('keywords');
      setPrescription(null);
      console.log('Loaded patient history:', history);
      console.log('Loaded initial keywords:', initialKeywords);
    } catch (error) {
      console.error('Error loading patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextPatient = async () => {
    setIsLoading(true);
    try {
      const patientId = Math.floor(Math.random() * 1000) + 1;
      console.log('Loading next random patient:', patientId);
      const [patient, history, initialKeywords] = await Promise.all([
        mockAPI.fetchPatientDetails(patientId),
        mockAPI.fetchPatientHistory(patientId),
        fetchKeywords(patientId, [])
      ]);
      setCurrentPatient(patient);
      setPatientHistory(history);
      setKeywords(initialKeywords);
      setSelectedKeywords([]);
      setCurrentStep('keywords');
      setPrescription(null);
      console.log('Loaded random patient:', patient);
      console.log('Loaded patient history:', history);
      console.log('Loaded initial keywords:', initialKeywords);
    } catch (error) {
      console.error('Error loading patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeywordSelect = async (keyword) => {
    const newSelected = [...selectedKeywords, keyword];
    setSelectedKeywords(newSelected);
    setIsLoading(true);
    try {
      console.log('Selecting keyword:', keyword, 'Current patient:', currentPatient?.id);
      const relatedKeywords = await fetchKeywords(currentPatient.id, newSelected);
      setKeywords(relatedKeywords);
      console.log('Fetched related keywords:', relatedKeywords);
    } catch (error) {
      console.error('Error fetching related keywords:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishKeywordSelection = async () => {
    setIsLoading(true);
    try {
      // Prepare payload for prescription API
      const payload = {
        case_summary: currentPatient?.case_summary || '',
        transcript: transcript,
        keyword_list: selectedKeywords,
        medical_history: relatedRecords[0]?.content,
      };
      console.log('payload (before API call):', payload);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${BASE_URL}/generateprescription/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to generate prescription');
      setPrescription(data);
      setCurrentStep('prescription');
      console.log('Prescription API response:', data);
    } catch (error) {
      console.error('Error generating prescription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToPharmacy = async (selectedMedications) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Prescription sent to pharmacy with ${selectedMedications.length} medications!`);
  };

  // Handler to receive transcript updates from VoiceRecorder
  const handleTranscriptChange = (newTranscript) => {
    console.log("new transcript:", newTranscript)
    setTranscript(newTranscript);
    console.log('Transcript updated from VoiceRecorder:', newTranscript);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Remove direct setTranscript here; VoiceRecorder will handle transcript updates
  };

  const handleFetchMedicalHistory = async () => {
    if (!currentPatient || selectedKeywords.length === 0) return;
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${BASE_URL}/getrelatedrecords/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ patient_id: currentPatient.id, keywords: selectedKeywords.join(',') })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to fetch medical history');
      setRelatedRecords(data.related_records || []);
      console.log('Fetched related medical records:', data.related_records);
    } catch (err) {
      setHistoryError(err.message);
      setRelatedRecords([]);
      console.error('Error fetching medical history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctor's Assistant Dashboard</h1>
          <p className="text-gray-600">AI-powered patient consultation and prescription management</p>
        </div>
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (2/3 width on large screens) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <PatientHistory history={patientHistory} />
            {currentStep === 'keywords' ? (
              <KeywordSelector
                keywords={keywords}
                selectedKeywords={selectedKeywords}
                onKeywordSelect={handleKeywordSelect}
                onFinish={handleFinishKeywordSelection}
                isLoading={isLoading}
                onFetchMedicalHistory={handleFetchMedicalHistory}
                relatedRecords={relatedRecords}
              />
            ) : (
              <PrescriptionPanel
                prescription={prescription}
                onSendToPharmacy={handleSendToPharmacy}
              />
            )}
            {historyLoading && (
              <div className="text-center text-purple-600 mt-4">Fetching medical history...</div>
            )}
            {historyError && (
              <div className="text-center text-red-500 mt-4">{historyError}</div>
            )}
          </div>
          {/* Sidebar (1/3 width on large screens) */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-8">
            <VoiceRecorder
              isRecording={isRecording}
              onToggleRecording={toggleRecording}
              transcript={transcript}
              onTranscriptChange={handleTranscriptChange}
            />
            <PatientDetails
              patient={currentPatient}
              onNextPatient={loadNextPatient}
            />
          </div>
        </div>
        {/* Loading Overlay */}
        {isLoading && currentStep === 'prescription' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex items-center gap-4">
              <RefreshCw className="animate-spin text-blue-500" size={32} />
              <span className="text-lg">Generating prescription...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;