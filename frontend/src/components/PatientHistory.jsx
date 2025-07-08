import { Activity, Pill, FileImage } from 'lucide-react';

const PatientHistory = ({ history }) => {
  if (!history) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Patient History</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Previous Diagnosis</h4>
          <ul className="space-y-1">
            {history.previousDiagnosis.map((diagnosis, index) => (
              <li key={index} className="text-gray-600 flex items-center gap-2">
                <Activity size={14} className="text-red-500" />
                {diagnosis}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Current Medications</h4>
          <ul className="space-y-1">
            {history.medications.map((medication, index) => (
              <li key={index} className="text-gray-600 flex items-center gap-2">
                <Pill size={14} className="text-blue-500" />
                {medication}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold text-gray-700 mb-2">Recent Reports</h4>
        <div className="flex flex-wrap gap-2">
          {history.reports.map((report, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
              <FileImage size={14} className="text-purple-500" />
              <span className="text-sm text-gray-600">{report.type}</span>
              <span className="text-xs text-gray-500">({report.date})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientHistory; 