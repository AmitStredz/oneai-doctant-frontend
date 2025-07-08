const mockAPI = {
  fetchPatientDetails: async (patientId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: patientId,
      name: 'John Doe',
      phone: '+1-555-0123',
      age: 35,
      gender: 'Male',
      lastVisit: '2024-12-15'
    };
  },
  fetchInitialKeywords: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      'headache', 'fever', 'cough', 'fatigue', 'nausea',
      'chest pain', 'shortness of breath', 'dizziness', 'stomach pain', 'joint pain',
      'skin rash', 'insomnia', 'anxiety', 'back pain', 'muscle aches'
    ];
  },
  fetchRelatedKeywords: async (selectedKeywords) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const keywordMap = {
      headache: ['migraine', 'tension headache', 'cluster headache', 'sinus pressure', 'eye strain'],
      fever: ['chills', 'sweating', 'high temperature', 'body aches', 'dehydration'],
      cough: ['dry cough', 'productive cough', 'wheezing', 'throat irritation', 'chest congestion'],
      'chest pain': ['heart palpitations', 'angina', 'acid reflux', 'muscle strain', 'anxiety'],
      'stomach pain': ['bloating', 'cramping', 'acid reflux', 'gas', 'diarrhea']
    };
    const lastKeyword = selectedKeywords[selectedKeywords.length - 1];
    return keywordMap[lastKeyword] || ['general weakness', 'loss of appetite', 'mood changes', 'sleep issues', 'stress'];
  },
  fetchPatientHistory: async (patientId) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return {
      previousDiagnosis: ['Hypertension', 'Type 2 Diabetes'],
      allergies: ['Penicillin', 'Shellfish'],
      medications: ['Metformin 500mg', 'Lisinopril 10mg'],
      reports: [
        { type: 'Blood Test', date: '2024-12-10', status: 'Normal' },
        { type: 'X-Ray', date: '2024-11-25', status: 'Clear' },
        { type: 'ECG', date: '2024-10-15', status: 'Normal' }
      ]
    };
  },
  generatePrescription: async (selectedKeywords, patientId) => {
    await new Promise(resolve => setTimeout(resolve, 900));
    return {
      diagnosis: 'Viral Upper Respiratory Infection',
      recommendations: [
        'Rest and adequate hydration',
        'Monitor temperature regularly',
        'Follow up if symptoms worsen'
      ],
      medications: [
        {
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'Every 6 hours',
          duration: '5 days',
          instructions: 'Take with food'
        },
        {
          name: 'Cough Syrup',
          dosage: '10ml',
          frequency: 'Every 8 hours',
          duration: '3 days',
          instructions: 'Take after meals'
        }
      ]
    };
  }
};

export default mockAPI; 