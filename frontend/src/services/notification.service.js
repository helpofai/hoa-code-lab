import api from './api';

const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

const markAllAsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};

const sendGlobalNotification = async (notifData) => {
  const response = await api.post('/notifications/global', notifData);
  return response.data;
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  sendGlobalNotification
};
