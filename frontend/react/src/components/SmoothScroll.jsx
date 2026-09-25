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
    // Apple-grade ease-out-expo inertia physics
    const lenis = new Lenis({
      duration: 1.25,
      // Apple MacBook Pro deceleration formula
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 0,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    let animId;
    function raf(time) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }
    animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
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
