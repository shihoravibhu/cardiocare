import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Activity, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="brand-logo-glow" style={{ width: '28px', height: '28px' }}>
                <Heart size={15} fill="white" />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>
                Cardio<span style={{ color: 'var(--accent)' }}>Care</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, maxWidth: '340px' }}>
              Advanced machine-learning cardiovascular risk stratification platform. Synthesizing 14 hemodynamic and clinical biomarkers with high-dimensional ensemble intelligence.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} color="#10b981" /> Zero Retention
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Cpu size={14} color="#38bdf8" /> Ensemble Core
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/">Clinical Overview</Link></li>
              <li><Link to="/predictor">Risk Engine</Link></li>
              <li><Link to="/insights">Biomarker Insights</Link></li>
              <li><Link to="/about">System Architecture</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Clinical Standards</h4>
            <ul>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>ACC/AHA Guidelines</span></li>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>ESC Prevention Matrix</span></li>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>SCORE2 Risk Models</span></li>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>CardioTrain 70k Cohort</span></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Technology</h4>
            <ul>
              <li><a href="http://localhost:8001/docs" target="_blank" rel="noopener noreferrer">FastAPI Swagger UI ↗</a></li>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Scikit-Learn 1.9.0</span></li>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>React 18 + Vite Core</span></li>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Python 3.14 Asynchronous</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} CardioCare Platform. Designed for clinical research & demonstration.
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            Disclaimer: Not intended as definitive medical diagnosis. Consult healthcare professionals.
          </div>
        </div>
      </div>
    </footer>
  );
}
