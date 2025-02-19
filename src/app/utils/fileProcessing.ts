import { encodeData } from './encryption';

export interface ProcessFileResult {
  insights: any;
  error?: string;
}

export async function processFile(file: File, useEncryption = false): Promise<ProcessFileResult> {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    throw new Error('Please upload a CSV file');
  }

  const formData = new FormData();
  
  if (useEncryption) {
    const fileContent = await file.text();
    const encodedData = encodeData(fileContent);
    formData.append('file', new Blob([encodedData], { type: 'text/plain' }), file.name);
  } else {
    formData.append('file', file);
  }

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  
  if (!response.ok || result.error) {
    throw new Error(result.error || `Analysis failed: ${response.statusText}`);
  }

  if (!result.insights || !result.insights.spending_overview) {
    throw new Error('Invalid insights data received from server');
  }

  return { insights: result.insights };
}
