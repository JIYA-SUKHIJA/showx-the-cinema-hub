// src/hooks/useRazorpay.js
import { useState, useEffect } from 'react';

export function useRazorpay() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay payment script gateway.');
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  /**
   * Triggers the interactive Razorpay payment interface modal deck
   * @param {Object} paymentConfig - Configuration details passed from backend clusters
   */
  const openPaymentModal = (paymentConfig, onSuccessCallback) => {
    if (!isScriptLoaded || !window.Razorpay) {
      alert('Payment processing system is initializing. Please try again.');
      return;
    }

    const options = {
      key: paymentConfig.key, 
      amount: paymentConfig.amount,  
      currency: 'INR',
      name: 'Showx — CinemaHub',
      description: 'Movie Ticket Reservation Checkout',
      order_id: paymentConfig.orderId, 
      handler: function (response) {
        onSuccessCallback({
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        });
      },
      prefill: {
        name: 'Jiya Sukhija', 
        email: 'jiya@example.com',
      },
      theme: {
        color: '#d97706', // Premium Boutique Amber Gold Theme Hex Token
      },
    };

    const rzpInstance = new window.Razorpay(options);
    
    rzpInstance.on('payment.failed', function (response) {
      alert(`Transaction interrupted: ${response.error.description}`);
    });

    rzpInstance.open();
  };

  return { isScriptLoaded, openPaymentModal };
}