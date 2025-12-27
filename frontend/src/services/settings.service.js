import api from './api';

const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

const updateSettings = async (data) => {
  const response = await api.put('/settings', data);
  return response.data;
};

export default { getSettings, updateSettings };
