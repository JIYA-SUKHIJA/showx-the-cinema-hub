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

  // 3. Clear session out cleanly when order completes
  const clearBookingSession = () => {
    setSelectedMovie(null);
    setSelectedCinema('');
    setSelectedShowtime('');
    setSelectedSeats([]);
    setTotalAmount(0);
    localStorage.removeItem('shx_movie');
    localStorage.removeItem('shx_cinema');
    localStorage.removeItem('shx_showtime');
    localStorage.removeItem('shx_seats');
    localStorage.removeItem('shx_amount');
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