import api from './api';

const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export default {
  getAllUsers,
  deleteUser
};
