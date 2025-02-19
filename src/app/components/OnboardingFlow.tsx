'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
const MotionDiv = motion.div;
import { useDropzone } from 'react-dropzone';
import VenmoStories from './VenmoStories';
import { processFile } from '../utils/fileProcessing';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const handleFileProcess = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError('');
    
    try {
      const { insights: result } = await processFile(file, true);
      localStorage.setItem('venmo_insights', JSON.stringify(result));
      setInsights(result);
      setFile(file);
      setStep(4);
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'Failed to process the file');
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleFileProcess(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="max-w-2xl mx-auto p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl animate-pulse" />
      <div className="mb-12 relative">
        <div className="relative">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
                    i < step
                      ? 'border-blue-400 bg-gradient-to-br from-blue-400 to-purple-400 text-white'
                      : i === step
                      ? 'border-blue-400 bg-blue-500/10 text-blue-400'
                      : 'border-white/20 bg-white/5 text-white/40'
                  }`}
                >
                  {i < step ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${i <= step ? 'text-blue-400' : 'text-white/40'}`}
                >
                  {i === 1 ? 'Login' : i === 2 ? 'Download' : 'Upload'}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-5 left-0 right-0 flex -z-10">
            <div
              className={`h-0.5 w-1/2 transition-all duration-300 ${step > 1 ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-white/10'}`}
            />
            <div
              className={`h-0.5 w-1/2 transition-all duration-300 ${step > 2 ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-white/10'}`}
            />
          </div>
        </div>
      </div>

      {step === 1 && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center relative z-10 bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Log into Venmo</h2>
          <p className="text-white/70 mb-6">
            First, make sure you're logged into your Venmo account
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.open('https://account.venmo.com', '_blank')}
              className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:opacity-90 active:opacity-100"
            >
              Open Venmo
            </button>
            <button
              onClick={() => setStep(2)}
              className="block w-full bg-white/10 text-white px-6 py-3 rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all"
            >
              I'm logged in!
            </button>
          </div>
        </MotionDiv>
      )}
      {step === 2 && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center relative z-10 bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Download Your Statement</h2>
          <p className="text-white/70 mb-6">
            Open this link in a new tab and download your statement (may take 1-2 minutes to load):
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                const url = 'https://account.venmo.com/api/statement/download?referer=%2Fstatement%3FaccountType%3Dpersonal%26month%3D2%26profileId%3D%26year%3D2024&startDate=2024-01-01&endDate=2024-12-31&csv=true&profileId=&accountType=personal';
                const firstWindow = window.open(url, '_blank');
                setTimeout(() => {
                  window.open(url, '_blank');
                  if (firstWindow) firstWindow.close();
                }, 500);
              }}
              className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:opacity-90 active:opacity-100"
            >
              Download Venmo Statement
            </button>
            <p className="text-sm text-white/50 mt-2">If statement is not directly downloaded, check your email for your statement</p>
            <button
              onClick={() => setStep(3)}
              className="block w-full bg-white/10 text-white px-6 py-3 rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all"
            >
              I've downloaded it!
            </button>
          </div>
        </MotionDiv>
      )}

      {step === 3 && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center relative z-10 bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Upload Your Statement</h2>
          <p className="text-white/70 mb-6">
            Upload the CSV file you just downloaded
          </p>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
              <div 
                {...getRootProps()}
                className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer backdrop-blur-sm
                  ${isDragActive ? 'border-blue-400 bg-blue-500/10' :
                    file ? 'border-blue-400 bg-blue-500/5' : 
                    'border-white/20 hover:border-blue-400 hover:bg-blue-500/5'}`}
              >
                <input {...getInputProps()} />
                <div className="text-center space-y-2">
                  {isUploading ? (
                    <>
                      <div className="flex items-center justify-center text-sky-500">
                        <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-white/70">Processing file...</p>
                    </>
                  ) : file ? (
                    <>
                      <div className="flex items-center justify-center text-sky-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-white/70">{file.name}</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center text-gray-400 group-hover:text-sky-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-white/70">
                        {isDragActive ? 'Drop the CSV file here' : 'Drop your CSV file here'}
                      </p>
                      <p className="text-xs text-white/50">or click to browse</p>
                    </>
                  )}
                </div>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
              {!isUploading && (
                file ? (
                  <button
                    onClick={() => setStep(4)}
                    className="w-full bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Continue</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    {...getRootProps()}
                    className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:opacity-90 active:opacity-100"
                    >

                    <span>Get Wrapped 🎁</span>
                  </button>
                )
              )}
            </div>
          </div>
        </MotionDiv>
      )}

      {step === 4 && insights && (
        <div className="fixed inset-0 bg-black">
          <VenmoStories insights={insights} />
        </div>
      )}
    </div>
  );
}
