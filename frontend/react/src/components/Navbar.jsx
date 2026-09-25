import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Heart, Activity, BarChart3, Layers, Menu, X, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { to: '/', label: 'Overview', icon: Heart, end: true },
    { to: '/predictor', label: 'Risk Engine', icon: Activity, end: false },
    { to: '/insights', label: 'Insights', icon: BarChart3, end: false },
    { to: '/about', label: 'Architecture', icon: Layers, end: false },
  ];

  return (
    <header className="nav-container">
      <nav className="nav">
        {/* Brand Link */}
        <NavLink to="/" className="brand-link" onClick={() => setIsOpen(false)}>
          <div className="brand-logo-glow">
            <Heart size={18} fill="white" />
          </div>
          <span className="brand-text">
            Cardio<span style={{ color: 'var(--accent)' }}>Care</span>
          </span>
          <span className="brand-pill">AI v1.1</span>
        </NavLink>

        {/* Desktop Nav Links */}
        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="nav-cta">
          <div className="status-pill">
            <span className="status-dot"></span>
            <span>Online</span>
          </div>

          <NavLink to="/predictor" className="btn-nav-action">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} />
              <span>Assess Risk</span>
            </span>
          </NavLink>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Luxury Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mobile-nav-backdrop"
              onClick={() => setIsOpen(false)}
            />

            {/* Floating Glass Sheet */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mobile-nav-sheet"
            >
              <div className="mobile-nav-header">
                <div className="status-pill">
                  <span className="status-dot"></span>
                  <span>Clinical API Online &middot; &lt;20ms</span>
                </div>
                <button
                  type="button"
                  className="mobile-close-btn"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mobile-nav-list">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx, duration: 0.25 }}
                    >
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `mobile-nav-link ${isActive ? 'active' : ''}`
                        }
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="mobile-nav-icon">
                          <Icon size={18} />
                        </div>
                        <span className="mobile-nav-title">{item.label}</span>
                        <ArrowRight size={16} className="mobile-nav-arrow" />
                      </NavLink>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mobile-nav-footer">
                <NavLink
                  to="/predictor"
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px 20px', fontSize: '15px' }}
                  onClick={() => setIsOpen(false)}
                >
                  <Activity size={18} />
                  <span>Launch Risk Engine</span>
                </NavLink>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
                  Dual ML Model Architecture &bull; 80.04% ROC-AUC Champion
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
