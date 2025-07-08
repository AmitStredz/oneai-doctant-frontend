import { Check, RefreshCw } from 'lucide-react';

const KeywordSelector = ({ keywords, selectedKeywords, onKeywordSelect, onFinish, isLoading, onFetchMedicalHistory, relatedRecords }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Symptom Keywords</h3>
        <div className="flex gap-2">
          <button
            onClick={onFinish}
            disabled={selectedKeywords.length === 0}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Check size={16} />
            Finish Selection
          </button>
          <button
            type="button"
            onClick={onFetchMedicalHistory}
            disabled={selectedKeywords.length === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            Fetch Medical History
          </button>
        </div>
      </div>
      {selectedKeywords.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Selected Keywords:</p>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <RefreshCw className="animate-spin text-blue-500" size={24} />
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {keywords.map((keyword, index) => (
            <button
              key={index}
              onClick={() => onKeywordSelect(keyword)}
              className="px-4 py-2 bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              <span className="text-gray-700 font-medium">{keyword}</span>
            </button>
          ))}
        </div>
      </div>
      {relatedRecords && relatedRecords.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-purple-800 mb-3">Related Medical Records</h4>
          <ul className="space-y-4">
            {relatedRecords.map(record => (
              <li key={record.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <span className='text-black font-semibold'>ID: {record.id}</span>
                <div className="text-sm text-gray-900 whitespace-pre-line">{record.content}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default KeywordSelector; 