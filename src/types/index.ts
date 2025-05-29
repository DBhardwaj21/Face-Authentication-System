export interface FacePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceData {
  face_id: number;
  confidence: number;
  position: FacePosition;
}

export interface DetectionResponse {
  faces_detected: number;
  faces: FaceData[];
}

export interface VerificationResponse {
  verified: boolean;
  similarity: number;
  selfie_analysis: DetectionResponse;
  document_analysis: DetectionResponse;
  threshold: number;
  match: boolean;
  model_used: string;
}

export interface Model {
  name: string;
  isDefault: boolean;
}

export interface ModelsResponse {
  available_models: string[];
  default_model: string;
}

export interface ApiResponse {
  service: string;
  status: string;
  endpoints: {
    [key: string]: string;
  };
}