import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.warn('Backend health check failed:', error?.message);
    return { status: 'offline', checkpoint_loaded: false, device: 'unknown' };
  }
};

export const predictImage = async (imageFile, modelId = null, generateGradcam = false) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  if (modelId) {
    formData.append('model', modelId);
  }

  const endpoint = generateGradcam ? '/predict/gradcam' : '/predict';
  const response = await apiClient.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getModels = async () => {
  try {
    const response = await apiClient.get('/models');
    return response.data;
  } catch (error) {
    console.warn('Backend models list fetch failed:', error?.message);
    return { active_model: 'efficientnet_b0', available_models: [] };
  }
};

export const selectModel = async (modelId) => {
  const response = await apiClient.post('/models/select', { model_id: modelId });
  return response.data;
};

export const getExperiments = async () => {
  try {
    const response = await apiClient.get('/experiments');
    return response.data;
  } catch (error) {
    console.warn('Could not fetch experiments:', error.message);
    return { total_experiments: 0, experiments: [] };
  }
};
