import { User, Phone, Calendar, CreditCard, Users } from "lucide-react";

const PatientDetails = ({ patient, onNextPatient }) => {
  const dummyPatientData = {
    name: "patient2",
    gender: "Female",
    phone: "956752328732",
    lastVisit: "28/08/2003",
    patientId: "P2024001",
    age: 28
  };
  
  const patientData = patient || dummyPatientData;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Patient Details</h3>
        <button
          onClick={onNextPatient}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-sm font-medium"
        >
          <Users size={14} />
          Next Patient
        </button>
      </div>

      {/* Patient Info Cards */}
      <div className="space-y-3">
        {/* Name */}
        <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
          <div className="flex items-center gap-2 mb-1">
            <User className="text-blue-600" size={16} />
            <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Name</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">{patientData.name}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
          <div className="flex items-center gap-2 mb-1">
            <User className="text-blue-600" size={16} />
            <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Patient Case</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">{patientData.case_summary}</p>
        </div>

        {/* Patient ID */}
        <div className="bg-indigo-50 rounded-lg p-3 border-l-4 border-indigo-400">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="text-indigo-600" size={16} />
            <span className="text-xs font-medium text-indigo-700 uppercase tracking-wide">Patient ID</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">{patientData.id}</p>
        </div>

        {/* Gender & Age */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
            <div className="flex items-center gap-1 mb-1">
              <User className="text-green-600" size={14} />
              <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Gender</span>
            </div>
            <p className="font-semibold text-gray-900 text-sm">{patientData.gender}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-400">
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="text-orange-600" size={14} />
              <span className="text-xs font-medium text-orange-700 uppercase tracking-wide">Age</span>
            </div>
            <p className="font-semibold text-gray-900 text-sm">{patientData.age}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="bg-emerald-50 rounded-lg p-3 border-l-4 border-emerald-400">
          <div className="flex items-center gap-2 mb-1">
            <Phone className="text-emerald-600" size={16} />
            <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Phone</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">{patientData.phone_number}</p>
        </div>

        {/* Last Visit */}
        <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-400">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="text-purple-600" size={16} />
            <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Last Visit</span>
          </div>
          <p className="font-semibold text-gray-900 text-sm">{patientData.last_visit_date}</p>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
            History
          </button>
          <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium">
            Edit
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default PatientDetails;