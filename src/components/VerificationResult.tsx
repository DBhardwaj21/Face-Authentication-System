import React from 'react';
import { VerificationResponse } from '../types';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface VerificationResultProps {
  result: VerificationResponse;
}

const VerificationResult: React.FC<VerificationResultProps> = ({ result }) => {
  const { verified, similarity, threshold, match, model_used } = result;
  
  // Determine status
  const getStatusInfo = () => {
    if (!verified) {
      return {
        icon: <AlertCircle size={40} className="text-yellow-500" />,
        title: 'Verification Inconclusive',
        description: 'The verification process could not be completed successfully.',
        color: 'yellow'
      };
    }
    
    if (match) {
      return {
        icon: <CheckCircle size={40} className="text-green-600" />,
        title: 'Match Confirmed',
        description: 'The face in the selfie matches the face in the document.',
        color: 'green'
      };
    }
    
    return {
      icon: <XCircle size={40} className="text-red-600" />,
      title: 'No Match',
      description: 'The face in the selfie does not match the face in the document.',
      color: 'red'
    };
  };
  
  const statusInfo = getStatusInfo();
  
  // Calculate background color based on similarity score
  const getSimilarityColor = () => {
    if (similarity >= threshold) return 'bg-gradient-to-r from-green-500 to-teal-500';
    if (similarity >= threshold * 0.8) return 'bg-gradient-to-r from-yellow-500 to-amber-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };
  
  const similarityPercentage = Math.round(similarity);
  const thresholdPercentage = Math.round(threshold);
  
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-md">
      <div className={`p-4 flex items-center border-b ${
        statusInfo.color === 'green' 
          ? 'bg-green-50 border-green-100' 
          : statusInfo.color === 'yellow'
            ? 'bg-yellow-50 border-yellow-100'
            : 'bg-red-50 border-red-100'
      }`}>
        {statusInfo.icon}
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{statusInfo.title}</h3>
          <p className="text-sm text-gray-600">{statusInfo.description}</p>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-5">
          <h4 className="text-sm uppercase font-semibold text-gray-500 mb-2">Similarity Score</h4>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-blue-800">
                  {similarityPercentage}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  Threshold: {thresholdPercentage}%
                </span>
              </div>
            </div>
            
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${similarity}%` }} 
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getSimilarityColor()}`}
              ></div>
              <div 
                style={{ left: `${threshold}%` }} 
                className="absolute w-px h-2 bg-blue-800"
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm uppercase font-semibold text-gray-500 mb-2">Face Detection Results</h4>
            <div className="text-sm">
              <p className="flex justify-between py-1 border-b">
                <span>Selfie Faces:</span> 
                <span className="font-medium">{result.selfie_analysis.faces_detected}</span>
              </p>
              <p className="flex justify-between py-1 border-b">
                <span>Document Faces:</span> 
                <span className="font-medium">{result.document_analysis.faces_detected}</span>
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm uppercase font-semibold text-gray-500 mb-2">Verification Details</h4>
            <div className="text-sm">
              <p className="flex justify-between py-1 border-b">
                <span>Model Used:</span>
                <span className="font-medium">{model_used}</span>
              </p>
              <p className="flex justify-between py-1 border-b">
                <span>Confidence Level:</span>
                <span className={`font-medium ${
                  similarity >= threshold ? 'text-green-600' : 'text-red-600'
                }`}>
                  {similarity >= threshold ? 'High' : similarity >= threshold * 0.8 ? 'Medium' : 'Low'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationResult;