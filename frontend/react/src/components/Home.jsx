import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity, ShieldCheck, Cpu, Zap, ArrowRight, Heart, 
  Sparkles, CheckCircle2, TrendingUp, BarChart3, Database, Layers
} from 'lucide-react';
import heroImg from '../assets/hero.jpg';
import BorderGlow from './BorderGlow';
import GradualBlur from './GradualBlur';

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="luxury-grid"></div>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div variants={fadeUp}>
            <div className="hero-badge">
              <Sparkles size={13} color="#38bdf8" />
              <span>Next-Gen Cardiovascular Intelligence</span>
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-title">
            Predictive Precision.<br/>
            <span className="hero-title-accent">For Every Heartbeat.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="hero-subtitle">
            Dual clinical machine learning engines—featuring our Champion Gradient Boosting architecture (80.04% ROC-AUC) and 100-tree Random Forest ensemble—trained on 70,000 patient records to synthesize 14 clinical biomarkers in real time.
          </motion.p>

          <motion.div variants={fadeUp} className="hero-actions">
            <Link to="/predictor" className="btn-primary hero-btn">
              <span>Launch Risk Engine</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn-secondary hero-btn">
              <span>Clinical Architecture</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated ECG Waveform Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ width: '100%', maxWidth: '900px', marginTop: '4rem', position: 'relative' }}
        >
          <div style={{ 
            height: '80px', 
            width: '100%', 
            borderRadius: '20px', 
            background: 'rgba(15, 20, 30, 0.4)', 
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}>
            <svg 
              viewBox="0 0 1200 100" 
              className="ecg-live-line"
              style={{ 
                width: '100%', 
                height: '100%', 
                stroke: '#f43f5e', 
                fill: 'none', 
                strokeWidth: '2.5', 
                strokeLinecap: 'round', 
                strokeLinejoin: 'round'
              }}
            >
              <path d="M 0 50 L 250 50 L 270 50 L 285 20 L 300 80 L 315 10 L 330 90 L 345 50 L 365 50 L 400 50 L 650 50 L 670 50 L 685 20 L 700 80 L 715 10 L 730 90 L 745 50 L 765 50 L 800 50 L 1050 50 L 1070 50 L 1085 20 L 1100 80 L 1115 10 L 1130 90 L 1145 50 L 1200 50" />
            </svg>
          </div>
        </motion.div>

        {/* Hero Image Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{ width: '100%', maxWidth: '1000px', marginTop: '2.5rem' }}
        >
          <BorderGlow
            borderRadius={28}
            glowRadius={45}
            glowIntensity={1.2}
            edgeSensitivity={35}
            coneSpread={28}
            glowColor="349 90 65"
            colors={['#f43f5e', '#38bdf8', '#c084fc']}
            backgroundColor="rgba(12, 17, 28, 0.7)"
            innerStyle={{ padding: '0.75rem' }}
          >
            <div style={{ borderRadius: '20px', overflow: 'hidden', maxHeight: '480px', position: 'relative' }}>
              <img 
                src={heroImg} 
                alt="AI Cardiovascular Intelligence" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.05)' }} 
              />
              <div className="hero-blur-overlay">
                <GradualBlur
                  target="parent"
                  position="bottom"
                  height="3.5rem"
                  strength={1.5}
                  divCount={5}
                  curve="bezier"
                  exponential={false}
                  tint="rgba(8, 12, 22, 0.45)"
                  opacity={0.8}
                />
              </div>
            </div>
          </BorderGlow>
        </motion.div>
      </section>

      {/* Telemetry / Live Stats Section (Apple Staggered Reveal) */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 2rem' }}
      >
        <div className="grid-4">
          {[
            { icon: Database, color: 'var(--accent)', value: '70,000+', label: 'Verified Clinical Cohort' },
            { icon: Heart, color: '#f43f5e', value: '14', label: 'Synthesized Biomarkers' },
            { icon: Zap, color: '#10b981', value: '< 130ms', label: 'In-Memory Inference' },
            { icon: ShieldCheck, color: '#a855f7', value: '100%', label: 'Zero-Retention Privacy' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: idx * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ color: stat.color }}><Icon size={22} /></div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Precision Pillars Section (Apple Luxury Scroll Reveal) */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '1200px', margin: '6rem auto', padding: '0 2rem' }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div className="section-tag">
            <Layers size={14} />
            <span>Clinical Innovations</span>
          </div>
          <h2 className="section-title">Engineered for Diagnostic Rigor.</h2>
          <p className="hero-subtitle" style={{ margin: '0 auto', fontSize: '18px' }}>
            Traditional diagnostics rely on isolated thresholds. CardioCare computes cross-biomarker non-linear dependencies.
          </p>
        </motion.div>

        <div className="grid-3">
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <BorderGlow
              borderRadius={24}
              glowRadius={35}
              glowIntensity={1.0}
              glowColor="199 95 65"
              colors={['#38bdf8', '#818cf8', '#c084fc']}
              backgroundColor="rgba(12, 17, 28, 0.7)"
              innerStyle={{ padding: '2.25rem' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '22px', margin: '0 0 0.75rem 0', fontWeight: 700 }}>Ensemble Random Forest</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
                Utilizes an ensemble of 100 decorrelated decision trees, aggregating bootstrap votes to suppress variance and prevent single-tree overfitting on outlier vitals.
              </p>
            </BorderGlow>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.17, ease: [0.16, 1, 0.3, 1] }}
          >
            <BorderGlow
              borderRadius={24}
              glowRadius={35}
              glowIntensity={1.0}
              glowColor="349 90 65"
              colors={['#f43f5e', '#fb7185', '#ec4899']}
              backgroundColor="rgba(12, 17, 28, 0.7)"
              innerStyle={{ padding: '2.25rem' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#f43f5e' }}>
                <Activity size={24} />
              </div>
              <h3 style={{ fontSize: '22px', margin: '0 0 0.75rem 0', fontWeight: 700 }}>Hemodynamic Synthesis</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
                Synthesizes real-time physiological metrics: Body Mass Index (BMI), Pulse Pressure (systolic minus diastolic vascular stiffness), and AHA/ACC Stage 1 & 2 Hypertension flags.
              </p>
            </BorderGlow>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.29, ease: [0.16, 1, 0.3, 1] }}
          >
            <BorderGlow
              borderRadius={24}
              glowRadius={35}
              glowIntensity={1.0}
              glowColor="160 84 60"
              colors={['#10b981', '#34d399', '#38bdf8']}
              backgroundColor="rgba(12, 17, 28, 0.7)"
              innerStyle={{ padding: '2.25rem' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: '#10b981' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '22px', margin: '0 0 0.75rem 0', fontWeight: 700 }}>Zero-Retention Privacy</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
                Patient biometrics are evaluated strictly in volatile RAM. No medical records, IP addresses, or patient markers are persisted to disk or external databases.
              </p>
            </BorderGlow>
          </motion.div>
        </div>
      </motion.section>

      {/* Model Benchmark Matrix (Apple Float-in Glass Card) */}
      <motion.section 
        initial={{ opacity: 0, y: 45, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '1000px', margin: '6rem auto', padding: '0 2rem' }}
      >
        <BorderGlow
          borderRadius={28}
          glowRadius={42}
          glowIntensity={1.0}
          edgeSensitivity={26}
          coneSpread={28}
          glowColor="199 95 62"
          colors={['#38bdf8', '#818cf8', '#0284c7']}
          backgroundColor="rgba(8, 12, 22, 0.92)"
          innerStyle={{ padding: '3rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-tag"><BarChart3 size={14} /> Empirical Validation</div>
              <h3 style={{ fontSize: '26px', margin: 0, fontWeight: 700 }}>Model Benchmark Performance</h3>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Evaluated across 14,000 holdout patient records (80/20 split)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Champion Gradient Boosting */}
            <motion.div 
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 10px #fbbf24' }}></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Gradient Boosting</span>
                    <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24', padding: '1px 8px', borderRadius: '6px' }}>🥇 Champion</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>HistGradientBoostingClassifier • Highest Discriminative Power</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24' }}>73.56%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24' }}>80.04%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ROC-AUC</div>
                </div>
              </div>
            </motion.div>

            {/* CardioCare Random Forest */}
            <motion.div 
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'rgba(56, 189, 248, 0.06)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Random Forest Ensemble</span>
                    <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.2)', color: 'var(--accent)', padding: '1px 8px', borderRadius: '6px' }}>🥈 2nd</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>100 Decorrelated Decision Trees • Low Variance Ensemble</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)' }}>73.10%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>79.60%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ROC-AUC</div>
                </div>
              </div>
            </motion.div>

            {/* Standard Decision Tree */}
            <motion.div 
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-muted)' }}></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>CART Decision Tree</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Single-tree recursive partition baseline</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-secondary)' }}>72.80%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-secondary)' }}>79.06%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ROC-AUC</div>
                </div>
              </div>
            </motion.div>

            {/* Logistic Regression */}
            <motion.div 
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-muted)' }}></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>Logistic Regression</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>L2 regularized linear classification boundary</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-secondary)' }}>72.09%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-secondary)' }}>77.74%</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ROC-AUC</div>
                </div>
              </div>
            </motion.div>

            {/* Link to Full Insights Table */}
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/insights" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>View Full 6-Model Benchmark Table (with Precision, Recall, F1)</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </BorderGlow>
      </motion.section>

      {/* Call to Action Banner (Apple Elevating Glass Card) */}
      <motion.section 
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '1000px', margin: '6rem auto 2rem auto', padding: '0 2rem' }}
      >
        <BorderGlow
          borderRadius={32}
          glowRadius={50}
          glowIntensity={1.25}
          edgeSensitivity={35}
          coneSpread={28}
          glowColor="349 90 65"
          colors={['#f43f5e', '#fb7185', '#38bdf8']}
          backgroundColor="rgba(14, 22, 38, 0.85)"
          innerStyle={{ padding: '4rem 2rem', textAlign: 'center' }}
        >
          <h2 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 1rem 0' }}>Ready for Instant Stratification?</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 2.5rem auto', fontSize: '17px' }}>
            Input clinical vitals into our interactive Risk Engine and receive probability scores within milliseconds.
          </p>
          <Link to="/predictor" className="btn-primary" style={{ padding: '16px 40px', fontSize: '17px' }}>
            <span>Open Risk Engine</span>
            <ArrowRight size={18} />
          </Link>
        </BorderGlow>
      </motion.section>
    </div>
  );
}
