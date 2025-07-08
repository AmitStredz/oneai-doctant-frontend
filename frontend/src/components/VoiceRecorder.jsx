import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Play } from 'lucide-react';

const VoiceRecorder = ({ onTranscriptChange, onTranscriptComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += t;
          } else {
            interimTranscript += t;
          }
        }
        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript(interimTranscript);
      };
      recognition.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    // if (onTranscriptChange) {
      onTranscriptChange(transcript);
    // }
  }, [transcript, onTranscriptChange]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch {
        setError('Error starting speech recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  const finishTranscription = () => {
    const finalText = transcript.trim();
    if (finalText && onTranscriptComplete) {
      onTranscriptComplete(finalText);
    }
    clearTranscript();
  };

  if (!isSupported) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2 text-red-700">
          <MicOff className="w-5 h-5" />
          <span>Speech recognition is not supported in this browser</span>
        </div>
        <p className="mt-2 text-sm text-red-600">
          Please use Chrome, Safari, or Edge for voice-to-text functionality.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Voice to Text</h2>
        <div className="flex items-center space-x-2">
          {isListening && (
            <div className="flex items-center space-x-1 text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Listening...</span>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
      {/* Transcript Display */}
      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-32">
        <div className="text-gray-800">
          {transcript && (
            <span className="text-gray-900">{transcript}</span>
          )}
          {interimTranscript && (
            <span className="text-gray-500 italic">{interimTranscript}</span>
          )}
          {!transcript && !interimTranscript && (
            <span className="text-gray-400">Your speech will appear here...</span>
          )}
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {isListening ? (
              <>
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Start</span>
              </>
            )}
          </button>
          <button
            onClick={clearTranscript}
            disabled={!transcript}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
        <button
          onClick={finishTranscription}
          disabled={!transcript.trim()}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          <span>Finish</span>
        </button>
      </div>
      {/* Usage Instructions */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
        <strong>Instructions:</strong> Click "Start" to begin recording. Speak clearly into your microphone. 
        Click "Stop" to pause recording, or "Finish" to complete and send the transcript to the parent component.
      </div>
    </div>
  );
};

export default VoiceRecorder;