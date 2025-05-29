import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiStatus } from '../services/api';
import { Camera, Shield, AlertTriangle, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('connecting');
  
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await getApiStatus();
        setApiStatus(response.status || 'inactive');
      } catch (error) {
        setApiStatus('error');
      }
    };
    
    checkApiStatus();
    
    // Periodically check API status
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const renderStatusBadge = () => {
    switch (apiStatus) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 mr-2 rounded-full bg-green-500"></span>
            Connected
          </span>
        );
      case 'connecting':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <span className="w-2 h-2 mr-2 rounded-full bg-blue-500 animate-pulse"></span>
            Connecting...
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <span className="w-2 h-2 mr-2 rounded-full bg-red-500"></span>
            Disconnected
          </span>
        );
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Face Authentication System</h1>
        {renderStatusBadge()}
      </div>
      
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl shadow-xl overflow-hidden mb-12">
        <div className="px-6 py-12 md:p-12 md:flex items-center">
          <div className="md:w-3/5 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Secure Face Authentication</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Verify identity by comparing faces in selfies and documents with our advanced facial recognition technology.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/verify" className="inline-flex items-center px-5 py-3 rounded-lg bg-teal-500 text-white font-medium transition-colors hover:bg-teal-600">
                Get Started
                <ChevronRight size={20} className="ml-1" />
              </Link>
              <Link to="/detect" className="inline-flex items-center px-5 py-3 rounded-lg bg-blue-700 text-white font-medium transition-colors hover:bg-blue-600 border border-blue-600">
                Detect Faces
              </Link>
            </div>
          </div>
          <div className="md:w-2/5 flex justify-center">
            <div className="w-56 h-56 md:w-64 md:h-64 bg-blue-700 rounded-full flex items-center justify-center">
              <Camera size={100} className="text-blue-300" />
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-gray-200">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Camera size={28} className="text-blue-800" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Face Verification</h3>
          <p className="text-gray-600">
            Compare faces from selfie and document images to verify identity with high precision.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-gray-200">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-4">
            <Shield size={28} className="text-teal-800" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Multiple Models</h3>
          <p className="text-gray-600">
            Choose from various recognition models like Facenet, VGG-Face, and more for different use cases.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-gray-200">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-amber-800" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Face Detection</h3>
          <p className="text-gray-600">
            Detect and visualize faces in images with bounding boxes and confidence scores.
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-xl p-6 md:p-8 border border-blue-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">API Status</h2>
        <div className={`rounded-lg p-4 mb-4 ${
          apiStatus === 'active' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {apiStatus === 'active' 
            ? 'Face Authentication API is up and running' 
            : 'Face Authentication API is currently unavailable'
          }
        </div>
        <p className="text-gray-600 text-sm">
          {apiStatus === 'active' 
            ? 'All endpoints are operational and ready to use.' 
            : 'Please check your backend server connection and ensure it\'s running on http://localhost:5000.'
          }
        </p>
      </div>
    </div>
  );
};

export default Home;