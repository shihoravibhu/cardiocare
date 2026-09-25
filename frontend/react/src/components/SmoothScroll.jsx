import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Apple MacBook Pro Signature Smooth Scrolling Provider
 * Provides buttery-smooth inertial momentum scrolling and guaranteed
 * scroll restoration to top (scrollY = 0) on every route change.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Detect mobile touchscreens (smartphones, tablets)
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches);

    // On mobile touchscreens, DO NOT attach synthetic scroll listeners.
    // Native mobile OS hardware momentum scrolling runs on the GPU compositor at true 120Hz with zero input lag.
    if (isTouch) {
      return;
    }

    // High-precision 120Hz / 144Hz desktop wheel smooth scrolling
    const lenis = new Lenis({
      duration: 0.85, // Snappy, instant response; avoids the floaty 60Hz feeling
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      autoRaf: true, // Native sub-millisecond 120Hz display refresh synchronization
      infinite: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  // Guaranteed route-change scroll reset: starts every page at the top (scrollY = 0)
  useEffect(() => {
    const scrollToTop = () => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Immediate reset
    scrollToTop();

    // Re-verify after route transition / component mount to prevent any late scroll position retention
    const frameId = requestAnimationFrame(scrollToTop);
    const timer = setTimeout(scrollToTop, 50);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return children || null;
}
