// src/services/adminApi.js
import axiosInstance from './axiosInstance';

export const fetchDashboardStats = async () => {
  const { data } = await axiosInstance.get('/admin/dashboard-stats');
  return data.stats;
};

export const fetchWeeklyTrend = async () => {
  const { data } = await axiosInstance.get('/admin/weekly-trend');
  return data.trend;
};

export const fetchAllBookings = async () => {
  const { data } = await axiosInstance.get('/admin/bookings');
  return data.bookings;
};

export const fetchAllUsers = async () => {
  const { data } = await axiosInstance.get('/admin/users');
  return data.users;
};

export const updateUserRole = async (userId, role) => {
  const { data } = await axiosInstance.put(`/admin/users/${userId}/role`, { role });
  return data.user;
};

// Movie Hub — full CRUD, matches api.js's confirmed response shape (data.movies / data.movie)
export const fetchAllMoviesAdmin = async () => {
  const { data } = await axiosInstance.get('/movies');
  return data.movies.map((m) => ({ ...m, id: m._id }));
};

export const createMovieAdmin = async (payload) => {
  const { data } = await axiosInstance.post('/movies', payload);
  return data.movie;
};

export const updateMovieAdmin = async (movieId, payload) => {
  const { data } = await axiosInstance.put(`/movies/${movieId}`, payload);
  return data.movie;
};

export const deleteMovieAdmin = async (movieId) => {
  const { data } = await axiosInstance.delete(`/movies/${movieId}`);
  return data;
};

// Theatres — full CRUD
export const fetchAllTheatresAdmin = async () => {
  const { data } = await axiosInstance.get('/theatres');
  return data.theatres.map((t) => ({ ...t, id: t._id }));
};

export const createTheatreAdmin = async (payload) => {
  const { data } = await axiosInstance.post('/theatres', payload);
  return data.theatre;
};

export const updateTheatreAdmin = async (theatreId, payload) => {
  const { data } = await axiosInstance.put(`/theatres/${theatreId}`, payload);
  return data.theatre;
};

export const deleteTheatreAdmin = async (theatreId) => {
  const { data } = await axiosInstance.delete(`/theatres/${theatreId}`);
  return data;
};

// Shows — full CRUD
export const fetchAllShowsAdmin = async () => {
  const { data } = await axiosInstance.get('/shows');
  return data.shows.map((s) => ({ ...s, id: s._id }));
};

export const createShowAdmin = async (payload) => {
  const { data } = await axiosInstance.post('/shows', payload);
  return data.show;
};

export const updateShowAdmin = async (showId, payload) => {
  const { data } = await axiosInstance.put(`/shows/${showId}`, payload);
  return data.show;
};

export const deleteShowAdmin = async (showId) => {
  const { data } = await axiosInstance.delete(`/shows/${showId}`);
  return data;
};

// Payments — derived view from paid bookings (no separate Payment model needed)
export const fetchAllPaymentsAdmin = async () => {
  const { data } = await axiosInstance.get('/admin/bookings');
  return data.bookings.filter((b) => b.paymentStatus === 'paid');
};