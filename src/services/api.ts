import { DetectionResponse, ModelsResponse, VerificationResponse } from '../types';

const API_URL = 'http://localhost:5000';

export const getApiStatus = async (): Promise<{ service: string; status: string }> => {
  try {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) throw new Error('Failed to fetch API status');
    return await response.json();
  } catch (error) {
    console.error('Error fetching API status:', error);
    throw error;
  }
};

export const getAvailableModels = async (): Promise<ModelsResponse> => {
  try {
    const response = await fetch(`${API_URL}/models`);
    if (!response.ok) throw new Error('Failed to fetch models');
    return await response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

export const detectFaces = async (imageFile: File): Promise<DetectionResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_URL}/detect`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to detect faces');
    }

    return await response.json();
  } catch (error) {
    console.error('Error detecting faces:', error);
    throw error;
  }
};

export const verifyFaces = async (
  selfieFile: File,
  documentFile: File,
  modelName?: string
): Promise<VerificationResponse> => {
  try {
    const formData = new FormData();
    formData.append('selfie', selfieFile);
    formData.append('document', documentFile);
    
    if (modelName) {
      formData.append('model_name', modelName);
    }

    const response = await fetch(`${API_URL}/verify`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to verify faces');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying faces:', error);
    throw error;
  }
};