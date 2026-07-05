// src/utils/toastConfig.js
import toast from 'react-hot-toast';

// Base premium theme styles aligned with your dark cinematic branding
const baseToastOptions = {
  duration: 4000,
  style: {
    background: '#070b12', // Matches your premium deep canvas hex
    color: '#94a3b8',      // Slate-400 prose text
    padding: '14px 18px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.025em',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(245, 158, 11, 0.02)',
    fontFamily: 'sans-serif',
  },
};

export const showxToast = {
  // 1. Authentication alerts
  loginSuccess: (name = "User") => {
    toast.success(`WELCOME BACK, ${name.toUpperCase()} • AUTHENTICATION TOKEN GRANTED`, {
      ...baseToastOptions,
      iconTheme: { primary: '#f59e0b', secondary: '#070b12' }, // Amber-500 fill
      style: { ...baseToastOptions.style, borderLeft: '3px solid #f59e0b' }
    });
  },
  
  loginFailed: (reason = "INVALID CREDENTIALS") => {
    toast.error(`ACCESS DENIED • ${reason.toUpperCase()}`, {
      ...baseToastOptions,
      iconTheme: { primary: '#ef4444', secondary: '#070b12' }, // Rose error red
      style: { ...baseToastOptions.style, borderLeft: '3px solid #ef4444' }
    });
  },

  logout: () => {
    toast('SESSION TERMINATED • CREDENTIAL CACHE CLEARED', {
      ...baseToastOptions,
      icon: '🔒',
      style: { ...baseToastOptions.style, borderLeft: '3px solid #64748b' }
    });
  },

  // 2. Ticket booking alerts
  bookingSuccess: (movieTitle = "Show") => {
    toast.success(`SEATS CONFIRMED • ${movieTitle.toUpperCase()} MATRIX SECURED`, {
      ...baseToastOptions,
      icon: '🎟️',
      style: { ...baseToastOptions.style, borderLeft: '3px solid #10b981' } // Emerald confirmation
    });
  },

  bookingFailed: (error = "ALLOCATION TIMEOUT") => {
    toast.error(`RESERVATION ABORTED • ${error.toUpperCase()}`, {
      ...baseToastOptions,
      iconTheme: { primary: '#ef4444', secondary: '#070b12' },
      style: { ...baseToastOptions.style, borderLeft: '3px solid #ef4444' }
    });
  },

  // 3. Financial settlement metrics
  paymentSuccess: (orderId = "SHX-PAY") => {
    toast.success(`SETTLEMENT VERIFIED • INVOICE ${orderId} CAPTURED`, {
      ...baseToastOptions,
      icon: '💳',
      style: { 
        ...baseToastOptions.style, 
        border: '1px solid rgba(245, 158, 11, 0.15)',
        borderLeft: '3px solid #f59e0b',
        color: '#ffffff'
      }
    });
  },

  paymentFailed: () => {
    toast.error(`GATEWAY DECLINED • TRANSACTION DISPATCH TERMINATED`, {
      ...baseToastOptions,
      iconTheme: { primary: '#rose', secondary: '#070b12' },
      style: { ...baseToastOptions.style, borderLeft: '3px solid #ef4444' }
    });
  },

  // 4. Operational user updates
  profileUpdated: () => {
    toast.success(`ACCOUNT MODIFICATIONS SYNCED SUCCESSFULLY`, {
      ...baseToastOptions,
      icon: '✨',
      style: { ...baseToastOptions.style, borderLeft: '3px solid #f59e0b' }
    });
  }
};