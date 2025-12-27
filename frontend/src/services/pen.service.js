import api from './api';

const savePen = async (penData) => {
  const response = await api.post('/pens/save', penData);
  return response.data;
};

const getUserPens = async () => {
  const response = await api.get('/pens/user');
  return response.data;
};

const getPublicPens = async () => {
  const response = await api.get('/pens/public');
  return response.data;
};

const getTopRatedPens = async () => {
  const response = await api.get('/pens/top-rated');
  return response.data;
};

const getPenById = async (id) => {
  const response = await api.get(`/pens/${id}`);
  return response.data;
};

const deletePen = async (id) => {
  const response = await api.delete(`/pens/${id}`);
  return response.data;
};

const likePen = async (id) => {
  const response = await api.post(`/pens/${id}/like`);
  return response.data;
};

const sharePen = async (id) => {
  const response = await api.post(`/pens/${id}/share`);
  return response.data;
};

export default {
  savePen,
  getUserPens,
  getPublicPens,
  getTopRatedPens,
  getPenById,
  deletePen,
  likePen,
  sharePen
};
