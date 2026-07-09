// src/utils/ScrollToTop.jsx
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Renders nothing — just watches the route and scrolls the window to the
// top every time the path changes.
//
// useLayoutEffect (not useEffect) is important here: it runs synchronously
// BEFORE the browser paints the new page. Using useEffect caused a visible
// 1-second flash/blink, because the old scroll position briefly rendered
// before jumping to the top. useLayoutEffect avoids that flash entirely.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}