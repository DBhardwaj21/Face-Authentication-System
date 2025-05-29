import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import ModelSelect from '../components/ModelSelect';
import VerificationResult from '../components/VerificationResult';
import FaceCanvas from '../components/FaceCanvas';
import { verifyFaces } from '../services/api';
import { VerificationResponse } from '../types';
import { AlertCircle } from 'lucide-react';

const Verify: React.FC = () => {
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);

  const handleSelfieSelect = (file: File) => {
    setSelfieFile(file);
    setSelfiePreview(URL.createObjectURL(file));
  };

  const handleDocumentSelect = (file: File) => {
    setDocumentFile(file);
    setDocumentPreview(URL.createObjectURL(file));
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
  };

  const handleVerify = async () => {
    if (!selfieFile || !documentFile) {
      setError('Please upload both selfie and document images');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyFaces(selfieFile, documentFile, selectedModel);
      setVerificationResult(result);
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred during verification. Please try again.');
      setVerificationResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Face Verification</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
          
          <div className="space-y-6">
            <ImageUpload 
              onImageSelect={handleSelfieSelect} 
              imageType="Selfie" 
            />
            
            <ImageUpload 
              onImageSelect={handleDocumentSelect} 
              imageType="Document" 
            />
            
            <ModelSelect onModelSelect={handleModelSelect} />
            
            <button
              onClick={handleVerify}
              disabled={!selfieFile || !documentFile || isLoading}
              className={`
                w-full py-2 px-4 rounded-md text-white font-medium 
                transition-colors duration-300
                ${(!selfieFile || !documentFile || isLoading)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-800'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : 'Verify Face Match'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-start">
              <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Face Preview</h2>
          
          {(selfiePreview || documentPreview) ? (
            <div className="space-y-6">
              {verificationResult ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selfie Analysis</h3>
                    <FaceCanvas 
                      imageUrl={selfiePreview!} 
                      faces={verificationResult.selfie_analysis.faces} 
                      width={300}
                      height={225}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Document Analysis</h3>
                    <FaceCanvas 
                      imageUrl={documentPreview!} 
                      faces={verificationResult.document_analysis.faces} 
                      width={300}
                      height={225}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-center">
                    {selfiePreview ? (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Selfie Preview</h3>
                        <img 
                          src={selfiePreview} 
                          alt="Selfie preview" 
                          className="max-h-48 rounded border border-gray-200"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center p-6">
                        <p>No selfie uploaded</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center">
                    {documentPreview ? (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Document Preview</h3>
                        <img 
                          src={documentPreview} 
                          alt="Document preview" 
                          className="max-h-48 rounded border border-gray-200"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center p-6">
                        <p>No document uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center text-gray-500 h-64">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Upload images to see face previews</p>
            </div>
          )}
        </div>
      </div>
      
      {verificationResult && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Verification Results</h2>
          <VerificationResult result={verificationResult} />
        </div>
      )}
      
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h2 className="text-lg font-semibold mb-2">How Face Verification Works</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Upload a clear selfie photo of your face</li>
          <li>Upload a document containing a face (ID card, passport, etc.)</li>
          <li>Our system analyzes both images and detects faces</li>
          <li>Facial features are compared using advanced recognition models</li>
          <li>Results show whether the faces match and display confidence levels</li>
        </ol>
        <p className="mt-4 text-sm text-gray-500">
          For best results, ensure both images are well-lit and the face is clearly visible without obstructions.
        </p>
      </div>
    </div>
  );
};

export default Verify;