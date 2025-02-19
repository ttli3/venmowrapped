'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { processFile } from '../utils/fileProcessing';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [step, setStep] = useState(1);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    setLoading(true);
    
    try {
      const { insights: result } = await processFile(file);
      console.log('Success:', result);
      // Save insights to localStorage
      localStorage.setItem('venmo_insights', JSON.stringify(result));
      setInsights(result);
      setStep(3);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to process the file. Please try again.');
      event.target.value = ''; // Reset file input
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto text-center space-y-8">
      <h2 className="text-3xl font-bold">Get Your Venmo Wrapped</h2>
      
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-gray-100 rounded-full" />
        
        {/* Active progress bar */}
        <div 
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center 
                  transition-all duration-500
                  ${i <= step ? 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg shadow-blue-200' : 'bg-white border-2 border-gray-200'}
                `}
              >
                <span className={i <= step ? 'text-white' : 'text-gray-400'}>
                  {i <= step ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={i < step ? 'M5 13l4 4L19 7' : 'M12 12h.01'} />
                    </svg>
                  ) : i}
                </span>
              </div>
              <span 
                className={`
                  mt-3 text-sm font-medium
                  ${i <= step ? 'text-blue-600' : 'text-gray-400'}
                `}
              >
                {i === 1 ? 'Login' : i === 2 ? 'Download' : 'Upload'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-lg">First, make sure you're logged into Venmo</p>
            <a
              href="https://account.venmo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setStep(2)}
            >
              Open Venmo
            </a>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-lg">Great! Now download your statement</p>
            <a
              href="https://account.venmo.com/api/statement/download?startDate=2024-01-01&endDate=2024-12-31&csv=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setStep(3)}
            >
              Download Statement
            </a>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-lg">Finally, upload your statement</p>
            <div className="relative">
              <label className="block w-full cursor-pointer">
                <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors">
                  <div className="text-center px-4">
                    <p className="text-lg mb-2">Drop your CSV file here</p>
                    <p className="text-sm text-gray-500">
                      {file ? file.name : 'or click to browse'}
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-gray-600">Processing...</div>
        )}

        {result && (
          <pre className="mt-6 p-4 bg-gray-50 rounded-lg text-left overflow-auto max-h-96">
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
