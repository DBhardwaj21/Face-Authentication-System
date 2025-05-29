import React, { useEffect, useState } from 'react';
import { getAvailableModels } from '../services/api';
import { ChevronDown } from 'lucide-react';

interface ModelSelectProps {
  onModelSelect: (model: string) => void;
}

const ModelSelect: React.FC<ModelSelectProps> = ({ onModelSelect }) => {
  const [models, setModels] = useState<string[]>([]);
  const [defaultModel, setDefaultModel] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const response = await getAvailableModels();
        setModels(response.available_models);
        setDefaultModel(response.default_model);
        setSelectedModel(response.default_model);
        onModelSelect(response.default_model);
      } catch (error) {
        console.error('Failed to fetch models:', error);
        setError('Failed to load face recognition models');
        setModels(['Facenet', 'VGG-Face', 'OpenFace', 'DeepFace', 'ArcFace', 'Dlib']);
        setDefaultModel('Facenet');
        setSelectedModel('Facenet');
        onModelSelect('Facenet');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [onModelSelect]);

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setIsOpen(false);
    onModelSelect(model);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recognition Model
        </label>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recognition Model
        </label>
        <select
          className="form-select w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={selectedModel}
          onChange={(e) => handleModelSelect(e.target.value)}
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model} {model === defaultModel && '(Default)'}
            </option>
          ))}
        </select>
        <p className="text-xs text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Recognition Model
      </label>
      <div className="relative">
        <button
          type="button"
          className="relative w-full pl-3 pr-10 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block truncate">{selectedModel} {selectedModel === defaultModel && '(Default)'}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </span>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            <ul className="py-1">
              {models.map((model) => (
                <li
                  key={model}
                  className={`
                    cursor-pointer select-none relative py-2 pl-3 pr-9 
                    ${model === selectedModel ? 'bg-blue-50 text-blue-800' : 'text-gray-900 hover:bg-gray-50'}
                  `}
                  onClick={() => handleModelSelect(model)}
                >
                  <span className="block truncate">
                    {model} {model === defaultModel && '(Default)'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelSelect;