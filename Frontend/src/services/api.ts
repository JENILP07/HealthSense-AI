import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export interface PatientData {
  age: number;
  gender: number;
  height: number;
  weight: number;
  ap_hi: number;
  ap_lo: number;
  cholesterol: number;
  gluc: number;
  smoke: number;
  alco: number;
  active: number;
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  risk_label: string;
}

export const getHeartPrediction = async (data: PatientData): Promise<PredictionResponse> => {
  const response = await api.post<PredictionResponse>('/predict', data);
  return response.data;
};
