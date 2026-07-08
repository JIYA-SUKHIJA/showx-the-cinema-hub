// src/services/api.js

// Safely pull the base backend URL from your local .env file.
// If it's not set, it will fallback to localhost:5000 as a safety measure.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

import axiosInstance from './axiosInstance';

const simulateNetworkRequest = (dataResolver, delay = 200) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(dataResolver()), delay);
  });
};

export const fetchAllMovies = async (search = '') => {
  try {
    const query = search ? `/movies?search=${encodeURIComponent(search)}` : '/movies';
    const res = await axiosInstance.get(query);
    return res.data.movies
      .filter((item) => item.type === 'movie' || !item.type)
      .map((item) => ({ ...item, id: item._id }));
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const fetchItemsByType = async (type) => {
  try {
    const res = await axiosInstance.get(`/movies?type=${type}`);
    return res.data.movies.map((item) => ({ ...item, id: item._id }));
  } catch (error) {
    console.error("Error fetching items by type:", error);
    return [];
  }
};

export const fetchItemById = async (id) => {
  try {
    const res = await axiosInstance.get(`/movies/${id}`);
    return { ...res.data.movie, id: res.data.movie._id };
  } catch (error) {
    console.error("Error fetching item by id:", error);
    return null;
  }
};

export const fetchMovieById = fetchItemById;

export const fetchBookedSeats = () => {
  return simulateNetworkRequest(() => []);
};

export const fetchMyBookings = async () => {
  try {
    const res = await axiosInstance.get('/bookings/my-bookings');
    return res.data.bookings;
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    return [];
  }
};

export const fetchShowsForMovie = async (movieId) => {
  try {
    const res = await axiosInstance.get(`/shows?movieId=${movieId}`);
    return res.data.shows;
  } catch (error) {
    console.error("Error fetching shows for movie:", error);
    return [];
  }
};

export const fetchLiveCollectionNode = async (endpointPath) => {
  try {
    const res = await axiosInstance.get(endpointPath);
    return res.data;
  } catch (error) {
    console.error("Error fetching live collection node:", error);
    return null;
  }
};