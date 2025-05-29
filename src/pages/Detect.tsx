import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import FaceCanvas from '../components/FaceCanvas';
import { detectFaces } from '../services/api';
import { DetectionResponse } from '../types';
import { AlertCircle, Scan } from 'lucide-react';

const Detect: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    // Reset previous results
    setDetectionResult(null);
    setError(null);
  };

  const handleDetect = async () => {
    if (!imageFile) {
      setError('Please upload an image');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await detectFaces(imageFile);
      setDetectionResult(result);
    } catch (err) {
      console.error('Detection error:', err);
      setError('An error occurred during face detection. Please try again.');
      setDetectionResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Face Detection</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
          
          <div className="space-y-6">
            <ImageUpload 
              onImageSelect={handleImageSelect} 
              imageType="Detection" 
            />
            
            <button
              onClick={handleDetect}
              disabled={!imageFile || isLoading}
              className={`
                w-full py-2 px-4 rounded-md text-white font-medium 
                transition-colors duration-300
                ${(!imageFile || isLoading)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Detecting Faces...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Scan className="mr-2" size={18} />
                  Detect Faces
                </span>
              )}
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
          <h2 className="text-lg font-semibold mb-4">Detection Results</h2>
          
          {detectionResult ? (
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-700">
                <p className="font-medium">Detected {detectionResult.faces_detected} face(s)</p>
              </div>
              
              <div className="flex justify-center">
                <FaceCanvas 
                  imageUrl={imagePreview!} 
                  faces={detectionResult.faces} 
                  width={400}
                  height={300}
                />
              </div>
              
              {detectionResult.faces.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Face Details</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Face ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Confidence
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {detectionResult.faces.map((face) => (
                          <tr key={face.face_id}>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">Face {face.face_id}</div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{(face.confidence * 100).toFixed(2)}%</div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                x: {face.position.x}, y: {face.position.y}<br />
                                w: {face.position.width}, h: {face.position.height}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : imagePreview ? (
            <div className="flex flex-col items-center justify-center">
              <img 
                src={imagePreview} 
                alt="Image preview" 
                className="max-h-64 rounded border border-gray-200 mb-4"
              />
              <p className="text-gray-500">Click "Detect Faces" to analyze this image</p>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center text-gray-500 h-64">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Upload an image to detect faces</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h2 className="text-lg font-semibold mb-3">How Face Detection Works</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Upload any image containing one or more faces</li>
            <li>Our system analyzes the image using the DeepFace API</li>
            <li>Each detected face is highlighted with a bounding box</li>
            <li>Results include exact position data and confidence scores</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h2 className="text-lg font-semibold mb-3">Tips for Best Results</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Use high-quality images with good lighting</li>
            <li>Ensure faces are clearly visible and not obscured</li>
            <li>For group photos, make sure faces are not too small</li>
            <li>Supported formats: JPG, JPEG, and PNG</li>
            <li>Maximum file size: 16MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Detect;