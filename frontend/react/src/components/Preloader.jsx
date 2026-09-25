import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, ShieldCheck, Cpu, Zap } from 'lucide-react';
import heroImg from '../assets/hero.jpg';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Clinical Neural Architecture...");

  useEffect(() => {
    let isMounted = true;
    let windowLoaded = false;

    // 1. Preload Hero Heart Image so it displays instantly on mount
    const img = new Image();
    img.src = heroImg;

    // 2. Track Window Full Load
    if (document.readyState === 'complete') {
      windowLoaded = true;
    } else {
      const handleLoad = () => { windowLoaded = true; };
      window.addEventListener('load', handleLoad);
    }

    // 3. Lock body scroll during preloader
    document.body.style.overflow = 'hidden';

    // 4. Smooth luxury progression ticker
    const startTime = performance.now();
    const minDuration = 1600; // 1.6s minimum duration for luxury feel

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const targetRatio = Math.min(elapsed / minDuration, 1);
      
      // Apple easeOutCubic curve
      const eased = 1 - Math.pow(1 - targetRatio, 3);
      const currentPct = Math.min(Math.round(eased * 100), 99);

      if (isMounted) {
        setProgress(currentPct);

        if (currentPct < 28) {
          setStatusText("Initializing Clinical Neural Architecture...");
        } else if (currentPct < 58) {
          setStatusText("Calibrating Gradient Boosting & Random Forest Models...");
        } else if (currentPct < 85) {
          setStatusText("Synthesizing 70,000+ Patient Cohort Benchmark Vectors...");
        } else {
          setStatusText("Verifying In-Memory Inference & Zero-Retention Security...");
        }
      }

      // Transition to complete
      if (elapsed >= minDuration && (windowLoaded || elapsed >= 2400)) {
        clearInterval(interval);
        if (isMounted) {
          setProgress(100);
          setStatusText("System Ready • Diagnostic Engine Online");
          setTimeout(() => {
            if (isMounted && onComplete) {
              document.body.style.overflow = '';
              onComplete();
            }
          }, 350);
        }
      }
    }, 25);

    return () => {
      isMounted = false;
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: -25, 
        scale: 1.015,
        filter: 'blur(10px)',
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#06070a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflow: 'hidden'
      }}
    >
      {/* Ambient background atmosphere glow */}
      <div 
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.12) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} 
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '440px', width: '100%' }}>
        {/* Heart Logo with rhythmic cardiac pulse */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1, 1.08, 1],
            boxShadow: [
              '0 0 25px rgba(244, 63, 94, 0.45)',
              '0 0 50px rgba(244, 63, 94, 0.85)',
              '0 0 25px rgba(244, 63, 94, 0.45)',
              '0 0 40px rgba(244, 63, 94, 0.7)',
              '0 0 25px rgba(244, 63, 94, 0.45)'
            ]
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            background: 'var(--crimson-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            color: 'white'
          }}
        >
          <Heart size={34} fill="white" />
        </motion.div>

        {/* Brand Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>
            Cardio<span style={{ color: 'var(--accent)' }}>Care</span>
          </span>
          <span className="brand-pill" style={{ fontSize: '11px', padding: '2px 8px' }}>AI v1.1</span>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          Clinical Intelligence System
        </div>

        {/* Mini ECG Pulse Monitor */}
        <div style={{ width: '100%', maxWidth: '280px', height: '36px', marginBottom: '1.5rem', opacity: 0.85 }}>
          <svg viewBox="0 0 400 60" style={{ width: '100%', height: '100%', stroke: '#f43f5e', fill: 'none', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', filter: 'drop-shadow(0 0 6px rgba(244, 63, 94, 0.6))' }}>
            <path d="M 0 30 L 100 30 L 110 30 L 120 10 L 130 50 L 140 5 L 150 55 L 160 30 L 170 30 L 250 30 L 260 30 L 270 10 L 280 50 L 290 5 L 300 55 L 310 30 L 400 30" />
          </svg>
        </div>

        {/* Progress Bar Container */}
        <div style={{ width: '100%', maxWidth: '340px', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
              {statusText}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', color: progress === 100 ? '#10b981' : 'var(--accent)' }}>
              {progress}%
            </span>
          </div>

          {/* Track */}
          <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden', position: 'relative' }}>
            <motion.div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #f43f5e 0%, #38bdf8 60%, #10b981 100%)',
                borderRadius: '9999px',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.75)',
                transition: 'width 0.15s ease-out'
              }}
            />
          </div>
        </div>

        {/* Clinical Spec Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '1.25rem', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Cpu size={12} color="var(--accent)" /> Dual ML Engine
          </span>
          <span>&bull;</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={12} color="#f43f5e" /> &lt;20ms RAM
          </span>
          <span>&bull;</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} color="#10b981" /> Zero-Retention
          </span>
        </div>
      </div>
    </motion.div>
  );
}
