
// src/__tests__/BookingFlow.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest'; // Added beforeEach
import { BrowserRouter } from 'react-router-dom';
import { BookingProvider } from '../context/BookingContext';
import SelectSeats from '../pages/SelectSeats';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithProviders = (ui) => {
  return render(
    <BookingProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </BookingProvider>
  );
};

describe('Showx Cinema Hub - Seat Selection Integration Tests', () => {
  
  // Clean up state tracking before every test execution block
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('should verify the initial empty state configurations', () => {
    renderWithProviders(<SelectSeats />);
    expect(screen.getByText(/0\.00/)).toBeInTheDocument();
    const proceedButton = screen.getByRole('button', { name: /proceed to payment/i });
    expect(proceedButton).toBeDisabled();
  });

  it('should dynamically calculate total values when selecting seats C-5, C-6, and C-7', () => {
    renderWithProviders(<SelectSeats />);

    const seatC5 = screen.getByTitle('Seat C-5');
    const seatC6 = screen.getByTitle('Seat C-6');
    const seatC7 = screen.getByTitle('Seat C-7');

    fireEvent.click(seatC5);
    fireEvent.click(seatC6);
    fireEvent.click(seatC7);

    expect(screen.getByText('C-5, C-6, C-7')).toBeInTheDocument();
    expect(screen.getByText(/600\.00/)).toBeInTheDocument();

    const proceedButton = screen.getByRole('button', { name: /proceed to payment/i });
    expect(proceedButton).not.toBeDisabled();
  });

  it('should forward the user downstream onto the payment gate when submitted', () => {
    renderWithProviders(<SelectSeats />);

    const seatC5 = screen.getByTitle('Seat C-5');
    fireEvent.click(seatC5);

    const proceedButton = screen.getByRole('button', { name: /proceed to payment/i });
    fireEvent.click(proceedButton);

    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  it('should prevent selection changes on pre-booked nodes', () => {
    renderWithProviders(<SelectSeats />);

    // Query pre-booked element Node matching layout configurations
    const blockedSeat = screen.getByTitle('Seat B-10');
    expect(blockedSeat).toBeDisabled();

    fireEvent.click(blockedSeat);
    
    // Using a regular expression matcher ensures string-split flexibilities pass reliably
    expect(screen.getByText(/0\.00/)).toBeInTheDocument();
  });
});