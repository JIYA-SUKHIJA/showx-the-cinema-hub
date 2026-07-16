// src/utils/ScrollToTop.jsx
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Pure high-fidelity route transition utility.
 * Renders zero DOM elements to ensure no visual footprint.
 * Runs synchronously BEFORE the browser paints to eliminate layout flashes entirely.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Locked to instant execution to prevent synthetic scrolling artifacts during view mounting
      });
    } catch (error) {
      // Fallback architecture target safely protecting legacy browser engines
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}