// src/context/BookingContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  // 1. Initialize states from localStorage if they exist, otherwise use defaults
  const [selectedMovie, setSelectedMovie] = useState(() => {
    const saved = localStorage.getItem('shx_movie');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedCinema, setSelectedCinema] = useState(() => {
    return localStorage.getItem('shx_cinema') || '';
  });

  const [selectedShowtime, setSelectedShowtime] = useState(() => {
    return localStorage.getItem('shx_showtime') || '';
  });

  const [selectedSeats, setSelectedSeats] = useState(() => {
    const saved = localStorage.getItem('shx_seats');
    return saved ? JSON.parse(saved) : [];
  });

  const [totalAmount, setTotalAmount] = useState(() => {
    const saved = localStorage.getItem('shx_amount');
    return saved ? Number(saved) : 0;
  });

  // Initialize city location from cache, otherwise default to premium baseline cluster 'Karnal'
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('shx_city') || 'Karnal';
  });

  // The full real Show document (from backend) selected during booking flow
  const [selectedShow, setSelectedShow] = useState(() => {
    const saved = localStorage.getItem('shx_show');
    return saved ? JSON.parse(saved) : null;
  });

  // The real Booking _id returned by the backend after creating a booking
  const [bookingId, setBookingId] = useState(() => {
    return localStorage.getItem('shx_bookingId') || '';
  });

  // 2. Synchronize states with localStorage whenever they update
  useEffect(() => {
    if (selectedMovie) localStorage.setItem('shx_movie', JSON.stringify(selectedMovie));
    else localStorage.removeItem('shx_movie');
  }, [selectedMovie]);

  useEffect(() => {
    if (selectedCinema) localStorage.setItem('shx_cinema', selectedCinema);
    else localStorage.removeItem('shx_cinema');
  }, [selectedCinema]);

  useEffect(() => {
    if (selectedShowtime) localStorage.setItem('shx_showtime', selectedShowtime);
    else localStorage.removeItem('shx_showtime');
  }, [selectedShowtime]);

  useEffect(() => {
    localStorage.setItem('shx_seats', JSON.stringify(selectedSeats));
  }, [selectedSeats]);

  useEffect(() => {
    localStorage.setItem('shx_amount', totalAmount.toString());
  }, [totalAmount]);

  // Synchronize the city selection state to localStorage
  useEffect(() => {
    if (selectedCity) localStorage.setItem('shx_city', selectedCity);
    else localStorage.removeItem('shx_city');
  }, [selectedCity]);

  useEffect(() => {
    if (selectedShow) localStorage.setItem('shx_show', JSON.stringify(selectedShow));
    else localStorage.removeItem('shx_show');
  }, [selectedShow]);

  useEffect(() => {
    if (bookingId) localStorage.setItem('shx_bookingId', bookingId);
    else localStorage.removeItem('shx_bookingId');
  }, [bookingId]);

  // 3. Clear session out cleanly when order completes
  const clearBookingSession = () => {
    setSelectedMovie(null);
    setSelectedCinema('');
    setSelectedShowtime('');
    setSelectedSeats([]);
    setTotalAmount(0);
    setSelectedShow(null);
    setBookingId('');
    localStorage.removeItem('shx_movie');
    localStorage.removeItem('shx_cinema');
    localStorage.removeItem('shx_showtime');
    localStorage.removeItem('shx_seats');
    localStorage.removeItem('shx_amount');
    localStorage.removeItem('shx_show');
    localStorage.removeItem('shx_bookingId');
    // Note: selectedCity is intentionally preserved so the user's location remains fixed across completions
  };

  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        setSelectedMovie,
        selectedCinema,
        setSelectedCinema,
        selectedShowtime,
        setSelectedShowtime,
        selectedSeats,
        setSelectedSeats,
        totalAmount,
        setTotalAmount,
        selectedCity,       // Exposed layout tracking hook
        setSelectedCity,   // Exposed mutation dispatch variable
        selectedShow,
        setSelectedShow,
        bookingId,
        setBookingId,
        clearBookingSession,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}