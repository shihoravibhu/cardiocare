import { motion } from 'framer-motion';
import { Cpu, Database, ShieldAlert, Layers, CheckCircle2, ArrowUpRight, Zap, Code } from 'lucide-react';
import BorderGlow from './BorderGlow';

export default function About() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const techStack = [
    { name: "Scikit-Learn 1.9.0", role: "Dual ML Engines (Champion Gradient Boosting & Random Forest 100 Trees)" },
    { name: "FastAPI 0.141", role: "High-Performance Asynchronous REST Server" },
    { name: "Python 3.14", role: "Underlying Scientific Computing Runtime" },
    { name: "React 18 & Vite", role: "Client-Side Reactive Glassmorphic UI" },
    { name: "Framer Motion", role: "Fluid Physics-Based Micro-Interactions" },
    { name: "Pandas & Joblib", role: "Feature Vector Ingestion & Model Serialization" },
  ];

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      exit={{ opacity: 0 }} 
      style={{ padding: '3rem 1.5rem 6rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.div variants={fadeUp} className="section-tag">
          <Layers size={14} />
          <span>Technical Dossier</span>
        </motion.div>
        <motion.h1 variants={fadeUp} className="section-title">System Architecture</motion.h1>
        <motion.p variants={fadeUp} className="hero-subtitle" style={{ margin: '0 auto', fontSize: '18px' }}>
          Deconstructing the machine-learning pipeline, clinical training cohort, and dual-model execution framework.
        </motion.p>
      </div>

      {/* Model Blueprint */}
      <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
        <BorderGlow
          borderRadius={24}
          glowRadius={35}
          glowIntensity={1.0}
          edgeSensitivity={32}
          coneSpread={26}
          glowColor="199 95 65"
          colors={['#38bdf8', '#818cf8', '#c084fc']}
          backgroundColor="rgba(12, 17, 28, 0.75)"
          innerStyle={{ padding: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <Cpu size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Dual Machine Learning Pipeline</h3>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Supervised Binary Classification (CVD Incident Presence)</span>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8, margin: '0 0 1.5rem 0' }}>
            CardioCare operates a dual-architecture inference pipeline trained over <strong>70,000 multi-center patient records</strong>. 
            The production runtime is spearheaded by our <strong>Gradient Boosting Champion (80.04% ROC-AUC)</strong> alongside a <strong>100-Tree Random Forest Ensemble (79.60% ROC-AUC)</strong>, computing cross-biomarker non-linear dependencies across 14 orthogonal clinical dimensions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Champion Model</div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>Gradient Boosting (80.04% AUC)</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ensemble Model</div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>Random Forest (100 Trees)</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inference Latency</div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>&lt; 50ms (In-Memory CPU)</div>
            </div>
          </div>
        </BorderGlow>
      </motion.div>

      {/* Feature Engineering Architecture */}
      <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
        <BorderGlow
          borderRadius={24}
          glowRadius={35}
          glowIntensity={1.0}
          edgeSensitivity={32}
          coneSpread={26}
          glowColor="349 90 65"
          colors={['#f43f5e', '#fb7185', '#ec4899']}
          backgroundColor="rgba(12, 17, 28, 0.75)"
          innerStyle={{ padding: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }}>
              <Database size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Derived Hemodynamic Synthesis</h3>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Automated feature engineering pipeline</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '14px' }}>
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'white' }}>1. Body Mass Index (BMI):</strong>
              <code style={{ marginLeft: '8px', color: 'var(--accent)', background: 'rgba(56,189,248,0.1)', padding: '2px 6px', borderRadius: '4px' }}>weight / (height / 100)²</code>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>Quantifies metabolic adiposity independently of stature.</p>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'white' }}>2. Pulse Pressure (PP):</strong>
              <code style={{ marginLeft: '8px', color: '#f43f5e', background: 'rgba(244,63,94,0.1)', padding: '2px 6px', borderRadius: '4px' }}>ap_hi - ap_lo</code>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>Direct correlate of aortic stiffening and stroke volume.</p>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'white' }}>3. Hypertension Diagnostic Indicator:</strong>
              <code style={{ marginLeft: '8px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: '4px' }}>int(ap_hi ≥ 140 or ap_lo ≥ 90)</code>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>AHA/ACC clinical threshold flag for hypertensive cardiovascular pathology.</p>
            </div>
          </div>
        </BorderGlow>
      </motion.div>

      {/* Technology Stack Grid */}
      <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
        <BorderGlow
          borderRadius={24}
          glowRadius={38}
          glowIntensity={1.0}
          edgeSensitivity={26}
          coneSpread={28}
          glowColor="199 95 62"
          colors={['#38bdf8', '#818cf8', '#0284c7']}
          backgroundColor="rgba(8, 12, 22, 0.92)"
          innerStyle={{ padding: '2rem' }}
        >
          <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={20} color="var(--accent)" />
            <span>Technology & Infrastructure</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {techStack.map((t, idx) => (
              <div key={idx} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, color: 'white', fontSize: '15px' }}>{t.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{t.role}</div>
              </div>
            ))}
          </div>
        </BorderGlow>
      </motion.div>

      {/* Medical Disclaimer */}
      <motion.div variants={fadeUp}>
        <BorderGlow
          borderRadius={24}
          glowRadius={35}
          glowIntensity={1.1}
          edgeSensitivity={32}
          coneSpread={26}
          glowColor="349 90 65"
          colors={['#f43f5e', '#fb7185', '#f59e0b']}
          backgroundColor="rgba(24, 12, 16, 0.75)"
          innerStyle={{ padding: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', color: '#f43f5e' }}>
            <ShieldAlert size={22} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Institutional & Medical Disclaimer</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
            <strong>For Demonstration and Academic Research Only.</strong> CardioCare is a statistical machine-learning prediction tool and does not constitute a certified medical device or clinical diagnosis. Healthcare practitioners should always perform comprehensive clinical evaluations before determining patient treatment regimens.
          </p>
        </BorderGlow>
      </motion.div>
    </motion.div>
  );
}
