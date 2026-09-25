import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity, HeartPulse, ShieldCheck, TrendingUp, 
  BarChart3, Award, Info, Heart, ArrowUpRight, Trophy,
  Sparkles, CheckCircle2, ArrowRight, Zap, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeftRight
} from 'lucide-react';
import BorderGlow from './BorderGlow';
import GradualBlur from './GradualBlur';
import LatticeLoader from './LatticeLoader';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8001'
).replace(/\/$/, '');

const BENCHMARK_MODELS = [
  {
    rank: "1st",
    isChampion: true,
    name: "Gradient Boosting",
    subtitle: "HistGradientBoostingClassifier",
    accuracy: "73.56%",
    rocAuc: "80.04%",
    precision: "75.27%",
    recall: "70.13%",
    f1: "72.61%",
    status: "Integrated & Serving (Champion)",
    statusType: "champion"
  },
  {
    rank: "2nd",
    isChampion: false,
    name: "Random Forest",
    subtitle: "100 Ensemble Trees",
    accuracy: "73.10%",
    rocAuc: "79.60%",
    precision: "75.10%",
    recall: "69.07%",
    f1: "71.96%",
    status: "Integrated & Serving",
    statusType: "active"
  },
  {
    rank: "3rd",
    isChampion: false,
    name: "Decision Tree",
    subtitle: "CART Tree Baseline",
    accuracy: "72.80%",
    rocAuc: "79.06%",
    precision: "73.36%",
    recall: "71.56%",
    f1: "72.45%",
    status: "Evaluated",
    statusType: "evaluated"
  },
  {
    rank: "4th",
    isChampion: false,
    name: "Logistic Regression",
    subtitle: "L2 Regularized",
    accuracy: "72.09%",
    rocAuc: "77.74%",
    precision: "75.81%",
    recall: "64.85%",
    f1: "69.90%",
    status: "Evaluated",
    statusType: "evaluated"
  },
  {
    rank: "5th",
    isChampion: false,
    name: "K-Nearest Neighbors",
    subtitle: "Minkowski Metric (k=7)",
    accuracy: "71.85%",
    rocAuc: "76.87%",
    precision: "73.03%",
    recall: "69.24%",
    f1: "71.08%",
    status: "Evaluated",
    statusType: "evaluated"
  },
  {
    rank: "6th",
    isChampion: false,
    name: "Gaussian Naive Bayes",
    subtitle: "Bayesian Prior",
    accuracy: "66.06%",
    rocAuc: "75.89%",
    precision: "76.20%",
    recall: "46.67%",
    f1: "57.88%",
    status: "Evaluated",
    statusType: "evaluated"
  }
];

const BENCHMARK_COLUMNS = [
  { key: 'rank', label: 'Rank', align: 'center', minWidth: '76px', description: 'Overall ensemble ranking' },
  { key: 'name', label: 'Model Architecture', align: 'left', minWidth: '220px', description: 'Underlying statistical learning algorithm' },
  { key: 'accuracy', label: 'Test Accuracy', align: 'center', minWidth: '115px', description: 'Overall percentage of correct binary classifications' },
  { key: 'rocAuc', label: 'ROC-AUC', align: 'center', minWidth: '115px', isKey: true, description: 'Area under Receiver Operating Characteristic curve (Primary metric)' },
  { key: 'precision', label: 'Precision', align: 'center', minWidth: '100px', description: 'True positive rate among all positive diagnoses' },
  { key: 'recall', label: 'Recall', align: 'center', minWidth: '95px', description: 'True positive detection rate across actual CVD cases' },
  { key: 'f1', label: 'F1-Score', align: 'center', minWidth: '95px', description: 'Harmonic mean of clinical precision and recall' },
  { key: 'status', label: 'Status', align: 'center', minWidth: '160px', description: 'Live deployment and inference service status' },
];

export default function Insights() {
  const [benchmarkData, setBenchmarkData] = useState(BENCHMARK_MODELS);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortBy, setSortBy] = useState('rocAuc');
  const [sortOrder, setSortOrder] = useState('desc');
  const [syncStatus, setSyncStatus] = useState('working');

  const sortedData = useMemo(() => {
    return [...benchmarkData].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string' && valA.includes('%')) {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      }
      if (sortBy === 'rank') {
        valA = parseInt(a.rank) || (a.isChampion ? 1 : 99);
        valB = parseInt(b.rank) || (b.isChampion ? 1 : 99);
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [benchmarkData, sortBy, sortOrder]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/benchmark`)
      .then(res => res.json())
      .then(data => {
        if (data && data.models && Array.isArray(data.models)) {
          const mapped = data.models.map(m => ({
            rank: m.rank_display || `${m.rank}th`,
            isChampion: m.is_champion,
            name: m.model,
            subtitle: m.is_champion ? "HistGradientBoostingClassifier" : (m.model === "Random Forest" ? "100 Ensemble Trees" : "Evaluated Architecture"),
            accuracy: `${Number(m.test_accuracy).toFixed(2)}%`,
            rocAuc: `${Number(m.roc_auc).toFixed(2)}%`,
            precision: `${Number(m.precision).toFixed(2)}%`,
            recall: `${Number(m.recall).toFixed(2)}%`,
            f1: `${Number(m.f1_score).toFixed(2)}%`,
            status: m.status,
            statusType: m.is_champion ? "champion" : (m.status.includes("Integrated") ? "active" : "evaluated")
          }));
          setBenchmarkData(mapped);
          setSyncStatus('done');
        } else {
          setSyncStatus('done');
        }
      })
      .catch(() => {
        // Fallback to static BENCHMARK_MODELS
        setSyncStatus('done');
      });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const featureWeights = [
    { name: "Systolic Blood Pressure (ap_hi)", weight: 34, color: "#f43f5e", detail: "Primary hemodynamic indicator of vascular mechanical stress" },
    { name: "Patient Age (years)", weight: 22, color: "#38bdf8", detail: "Cumulative biological arterial remodeling and vascular stiffening" },
    { name: "Total Cholesterol Level", weight: 14, color: "#f59e0b", detail: "Atherosclerotic plaque accumulation and coronary stenosis risk" },
    { name: "Body Mass Index & Weight", weight: 11, color: "#a855f7", detail: "Metabolic workload and systemic microvascular resistance" },
    { name: "Diastolic Blood Pressure (ap_lo)", weight: 8, color: "#ec4899", detail: "Resting vascular resistance during cardiac diastole" },
    { name: "Fasting Glucose", weight: 6, color: "#10b981", detail: "Endothelial inflammation and microvascular glycated stress" },
    { name: "Lifestyle (Smoke, Alco, Active)", weight: 5, color: "#64748b", detail: "Modifiable behavioral factors amplifying endothelial degradation" },
  ];

  // Matrix hover calculator: dynamic background with high-contrast luxury glow
  const getCellBackground = (colKey, isRowHovered) => {
    const isColHovered = hoveredCol === colKey;
    const isColSorted = sortBy === colKey;

    // 1. Intersection: Cell is both in the hovered row AND hovered column (Jewel Focus)
    if (isRowHovered && isColHovered) {
      return 'rgba(56, 189, 248, 0.16)';
    }
    // 2. Cell is in hovered column (Noticeable Luxury Column Light Beam)
    if (isColHovered) {
      return 'rgba(56, 189, 248, 0.08)';
    }
    // 3. Cell is in hovered row
    if (isRowHovered) {
      return isColSorted ? 'rgba(56, 189, 248, 0.09)' : 'rgba(56, 189, 248, 0.045)';
    }
    // 4. Default active sorted column (Subtle ambient column tone)
    if (isColSorted) {
      return 'rgba(56, 189, 248, 0.035)';
    }
    return 'transparent';
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="show" 
      variants={container} 
      style={{ padding: '3rem 1.5rem 6rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <motion.div variants={item} className="section-tag">
          <BarChart3 size={14} />
          <span>Biomarker Science & Model Benchmarks</span>
        </motion.div>
        <motion.h1 variants={item} className="section-title">Deep Data & Clinical Intelligence</motion.h1>
        <motion.p variants={item} className="hero-subtitle" style={{ margin: '0 auto', fontSize: '18px' }}>
          Empirical validation across 6 machine learning architectures on 70,000 cardiovascular cohort records.
        </motion.p>
      </div>

      {/* Multi-Model Classification Benchmark Table (Interactive Column & Row Hover) */}
      <motion.div variants={item} style={{ marginBottom: '3.5rem' }}>
        <BorderGlow
          borderRadius={28}
          glowRadius={42}
          glowIntensity={1.0}
          edgeSensitivity={26}
          coneSpread={28}
          glowColor="199 95 62"
          colors={['#38bdf8', '#818cf8', '#0284c7']}
          backgroundColor="rgba(8, 12, 22, 0.92)"
          innerStyle={{ padding: '2rem' }}
        >
          {/* Header row with Title & Interactive Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Trophy size={20} color="#38bdf8" />
                <h2 style={{ margin: 0, fontSize: '23px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  Multi-Model Classification Benchmark (Test Set Evaluation)
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                Empirical validation across 14,000 holdout patient records (80/20 train-test split). Hover any column or row for interactive inspection.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', padding: '6px 14px', 
                borderRadius: '20px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)' 
              }}>
                <LatticeLoader
                  status={syncStatus}
                  label="Syncing Model Weights"
                  doneLabel="Weights Synchronized"
                  pattern="pulse"
                  grid={3}
                  shape="round"
                  cellSize={5}
                  gap={2}
                  fontSize={12}
                  color="#38bdf8"
                  glow={true}
                  glowColor="#38bdf8"
                  doneColor="#10b981"
                  showTimer={false}
                />
              </div>

              {/* Champion Badge */}
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', 
                borderRadius: '20px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#fbbf24', fontSize: '13px', fontWeight: 700,
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.15)'
              }}>
                <Sparkles size={14} />
                <span>Champion: Gradient Boosting (80.04% AUC)</span>
              </div>
            </div>
          </div>

          {/* Mobile Table Swipe Hint Pill */}
          <div className="mobile-table-swipe-pill">
            <ArrowLeftRight size={13} />
            <span>Swipe horizontally to inspect all 8 benchmark metrics</span>
          </div>

          {/* Clean, Satisfying Responsive Table with Zero Blur Over Content */}
          <div 
            onMouseLeave={() => { setHoveredCol(null); setHoveredRow(null); }}
            style={{ 
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              overflowX: 'auto', 
              WebkitOverflowScrolling: 'touch', 
              borderRadius: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              background: 'rgba(5, 8, 16, 0.85)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '920px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(10, 15, 26, 0.95)' }}>
                  {BENCHMARK_COLUMNS.map((col) => {
                    const isHovered = hoveredCol === col.key;
                    const isSorted = sortBy === col.key;
                    return (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        onMouseEnter={() => setHoveredCol(col.key)}
                        style={{
                          padding: '14px 16px',
                          fontWeight: 700,
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: (isHovered || isSorted) ? '#38bdf8' : 'var(--text-muted)',
                          cursor: 'pointer',
                          textAlign: col.align,
                          minWidth: col.minWidth,
                          transition: 'all 0.18s ease',
                          userSelect: 'none',
                          background: isHovered 
                            ? 'rgba(56, 189, 248, 0.14)' 
                            : (isSorted ? 'rgba(56, 189, 248, 0.06)' : 'rgba(10, 15, 26, 0.95)'),
                          borderBottom: isSorted 
                            ? '2px solid #38bdf8' 
                            : (isHovered ? '2px solid rgba(56, 189, 248, 0.6)' : '2px solid transparent'),
                          boxShadow: isHovered ? 'inset 0 -2px 8px rgba(56, 189, 248, 0.25)' : 'none'
                        }}
                        title={col.description}
                      >
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          justifyContent: col.align === 'center' ? 'center' : (col.align === 'right' ? 'flex-end' : 'flex-start'),
                          width: '100%'
                        }}>
                          <span>{col.label}</span>
                          <span style={{ opacity: isSorted ? 1 : (isHovered ? 0.8 : 0.25), transition: 'opacity 0.2s ease', display: 'inline-flex' }}>
                            {isSorted ? (sortOrder === 'desc' ? <ArrowDown size={13} color="#38bdf8" /> : <ArrowUp size={13} color="#38bdf8" />) : <ArrowUpDown size={12} />}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, rowIdx) => {
                  const isChamp = row.isChampion;
                  const isSecond = row.rank === "2nd";
                  const isThird = row.rank === "3rd";
                  const isRowHovered = hoveredRow === rowIdx;

                  const accVal = parseFloat(row.accuracy);
                  const rocAucVal = parseFloat(row.rocAuc);
                  const precVal = parseFloat(row.precision);
                  const recVal = parseFloat(row.recall);
                  const f1Val = parseFloat(row.f1);

                  return (
                    <tr
                      key={row.name}
                      onMouseEnter={() => setHoveredRow(rowIdx)}
                      style={{
                        borderBottom: rowIdx === sortedData.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: isRowHovered ? 'inset 4px 0 0 #38bdf8' : 'none',
                        transition: 'box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {/* 1. Rank */}
                      <td
                        onMouseEnter={() => setHoveredCol('rank')}
                        style={{
                          padding: '14px 16px',
                          textAlign: 'center',
                          background: getCellBackground('rank', isRowHovered),
                          transition: 'background 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          {isChamp ? (
                            <span style={{ 
                              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                              color: '#000', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800,
                              boxShadow: '0 2px 10px rgba(245, 158, 11, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '4px'
                            }}>
                              🥇 1st
                            </span>
                          ) : isSecond ? (
                            <span style={{ 
                              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', 
                              color: '#000', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800,
                              boxShadow: '0 2px 10px rgba(56, 189, 248, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '4px'
                            }}>
                              🥈 2nd
                            </span>
                          ) : isThird ? (
                            <span style={{ 
                              background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)',
                              color: '#fbbf24', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                              display: 'inline-flex', alignItems: 'center', gap: '4px'
                            }}>
                              🥉 3rd
                            </span>
                          ) : (
                            <span style={{ 
                              background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)',
                              color: 'var(--text-muted)', padding: '3px 9px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 
                            }}>
                              {row.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. Model Architecture */}
                      <td
                        onMouseEnter={() => setHoveredCol('name')}
                        style={{
                          padding: '14px 18px',
                          background: getCellBackground('name', isRowHovered),
                          transition: 'background 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <div style={{ 
                          fontWeight: 700, fontSize: '15px', 
                          color: isRowHovered ? '#ffffff' : (isChamp ? '#ffffff' : 'var(--text-primary)'), 
                          display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' 
                        }}>
                          <span>{row.name}</span>
                          {isChamp && (
                            <span style={{ 
                              fontSize: '10px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', 
                              border: '1px solid rgba(245, 158, 11, 0.5)', padding: '2px 8px', borderRadius: '4px', 
                              textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800,
                              display: 'inline-flex', alignItems: 'center', gap: '4px'
                            }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 6px #fbbf24' }}></span>
                              CHAMPION
                            </span>
                          )}
                          {isSecond && (
                            <span style={{ 
                              fontSize: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', 
                              border: '1px solid rgba(56, 189, 248, 0.45)', padding: '2px 8px', borderRadius: '4px', 
                              textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800,
                              display: 'inline-flex', alignItems: 'center', gap: '4px'
                            }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }}></span>
                              PRODUCTION DUAL
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {row.subtitle}
                        </div>
                      </td>

                      {/* 3. Test Accuracy */}
                      <td
                        onMouseEnter={() => setHoveredCol('accuracy')}
                        style={{
                          padding: '14px 18px',
                          textAlign: 'center',
                          background: getCellBackground('accuracy', isRowHovered),
                          transition: 'background 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: isChamp ? 800 : (isSecond || accVal >= 72.8 ? 700 : 600),
                          color: isChamp ? '#fbbf24' : (isSecond ? '#38bdf8' : (accVal >= 72.8 ? '#67e8f9' : (accVal >= 71.0 ? '#e2e8f0' : '#94a3b8'))),
                          fontVariantNumeric: 'tabular-nums'
                        }}>
                          {row.accuracy}
                        </span>
                      </td>

                      {/* 4. ROC-AUC (Primary Clinical Metric) */}
                      <td
                        onMouseEnter={() => setHoveredCol('rocAuc')}
                        style={{
                          padding: '14px 18px',
                          textAlign: 'center',
                          background: getCellBackground('rocAuc', isRowHovered),
                          transition: 'background 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {isChamp ? (
                          <span style={{ 
                            fontSize: '14.5px', fontWeight: 800, color: '#fbbf24', 
                            textShadow: '0 0 12px rgba(245, 158, 11, 0.45)',
                            background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)',
                            padding: '3px 9px', borderRadius: '6px', display: 'inline-block',
                            fontVariantNumeric: 'tabular-nums'
                          }}>
                            {row.rocAuc}
                          </span>
                        ) : isSecond ? (
                          <span style={{ 
                            fontSize: '14.5px', fontWeight: 800, color: '#38bdf8', 
                            textShadow: '0 0 12px rgba(56, 189, 248, 0.4)',
                            background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)',
                            padding: '3px 9px', borderRadius: '6px', display: 'inline-block',
                            fontVariantNumeric: 'tabular-nums'
                          }}>
                            {row.rocAuc}
                          </span>
                        ) : (
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: rocAucVal >= 79.0 ? 700 : 600, 
                            color: rocAucVal >= 79.0 ? '#a5b4fc' : (rocAucVal >= 76.5 ? '#cbd5e1' : '#94a3b8'),
                            fontVariantNumeric: 'tabular-nums'
                          }}>
                            {row.rocAuc}
                          </span>
                        )}
                      </td>

                      {/* 5. Precision */}
                      <td
                        onMouseEnter={() => setHoveredCol('precision')}
                        style={{
                          padding: '14px 18px',
                          textAlign: 'center',
                          background: getCellBackground('precision', isRowHovered),
                          transition: 'background 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: precVal >= 75.0 ? 700 : 600,
                          color: precVal >= 75.8 ? '#34d399' : (precVal >= 75.0 ? '#38bdf8' : (precVal >= 73.0 ? '#93c5fd' : '#cbd5e1')),
                          fontVariantNumeric: 'tabular-nums'
                        }}>
                          {row.precision}
                        </span>
                      </td>

                      {/* 6. Recall */}
                      <td
                        onMouseEnter={() => setHoveredCol('recall')}
                        style={{
                          padding: '14px 18px',
                          textAlign: 'center',
                          background: getCellBackground('recall', isRowHovered),
                          transition: 'background 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {recVal < 50.0 ? (
                          <span style={{ 
                            color: '#f43f5e', fontWeight: 700, fontSize: '13px', 
                            background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)',
                            padding: '2px 8px', borderRadius: '5px', display: 'inline-block',
                            fontVariantNumeric: 'tabular-nums'
                          }}>
                            {row.recall}
                          </span>
                        ) : (
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: recVal >= 68.0 ? 700 : 600,
                            color: recVal >= 70.0 ? '#34d399' : (recVal >= 68.0 ? '#38bdf8' : (recVal >= 64.0 ? '#fb923c' : '#cbd5e1')),
                            fontVariantNumeric: 'tabular-nums'
                          }}>
                            {row.recall}
                          </span>
                        )}
                      </td>

                      {/* 7. F1-Score */}
                      <td
                        onMouseEnter={() => setHoveredCol('f1')}
                        style={{
                          padding: '14px 18px',
                          textAlign: 'center',
                          background: getCellBackground('f1', isRowHovered),
                          transition: 'background 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {f1Val < 60.0 ? (
                          <span style={{ 
                            color: '#f87171', fontWeight: 600, fontSize: '13px',
                            background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.25)',
                            padding: '2px 8px', borderRadius: '5px', display: 'inline-block',
                            fontVariantNumeric: 'tabular-nums'
                          }}>
                            {row.f1}
                          </span>
                        ) : (
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: f1Val >= 71.0 ? 700 : 600,
                            color: f1Val >= 72.0 ? '#fbbf24' : (f1Val >= 71.0 ? '#38bdf8' : '#cbd5e1'),
                            fontVariantNumeric: 'tabular-nums'
                          }}>
                            {row.f1}
                          </span>
                        )}
                      </td>

                      {/* 8. Status (100% Sharp & Crisp, Never Blurred) */}
                      <td
                        onMouseEnter={() => setHoveredCol('status')}
                        style={{
                          padding: '14px 16px',
                          textAlign: 'center',
                          background: getCellBackground('status', isRowHovered),
                          transition: 'background 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {row.statusType === 'champion' ? (
                          <span style={{ 
                            padding: '5px 12px', borderRadius: '12px', 
                            background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.5)',
                            color: '#fbbf24', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap',
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            boxShadow: '0 0 14px rgba(245, 158, 11, 0.25)'
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }}></span>
                            Integrated & Serving
                          </span>
                        ) : row.statusType === 'active' ? (
                          <span style={{ 
                            padding: '5px 12px', borderRadius: '12px', 
                            background: 'rgba(56, 189, 248, 0.14)', border: '1px solid rgba(56, 189, 248, 0.45)',
                            color: '#38bdf8', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap',
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            boxShadow: '0 0 14px rgba(56, 189, 248, 0.2)'
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }}></span>
                            Integrated & Serving
                          </span>
                        ) : (
                          <span style={{ 
                            padding: '5px 10px', borderRadius: '12px', 
                            background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.09)',
                            color: 'var(--text-muted)', fontSize: '11px', whiteSpace: 'nowrap', fontWeight: 500
                          }}>
                            Evaluated Baseline
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* CTA Bar */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Dual active deployment: toggle seamlessly between Champion Gradient Boosting and Random Forest in the Risk Engine.</span>
            </div>

            <Link to="/predictor" className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Test In Risk Engine</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </BorderGlow>
      </motion.div>

      {/* Feature Importance Interactive Chart */}
      <motion.div variants={item} style={{ marginBottom: '2.5rem' }}>
        <BorderGlow
          borderRadius={24}
          glowRadius={40}
          glowIntensity={1.0}
          edgeSensitivity={32}
          coneSpread={26}
          glowColor="349 90 65"
          colors={['#f43f5e', '#fb7185', '#ec4899']}
          backgroundColor="rgba(12, 17, 28, 0.75)"
          innerStyle={{ padding: '2.25rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Model Feature Importance Distribution</h3>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Gini Impurity reduction across 100 ensemble decision trees</span>
            </div>
            <span className="brand-pill">Random Forest v1.1</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {featureWeights.map((f, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>{f.name}</span>
                  <span style={{ fontWeight: 700, color: f.color }}>{f.weight}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${f.weight * 2.8}%` }}
                    transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                    style={{ height: '100%', background: f.color, borderRadius: '9999px' }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {f.detail}
                </div>
              </div>
            ))}
          </div>
        </BorderGlow>
      </motion.div>

      {/* Clinical Standards Comparison Grid */}
      <div className="grid-2" style={{ gap: '2rem', marginBottom: '2.5rem' }}>
        <motion.div variants={item}>
          <BorderGlow
            borderRadius={24}
            glowRadius={35}
            glowIntensity={1.0}
            edgeSensitivity={32}
            coneSpread={26}
            glowColor="349 90 65"
            colors={['#f43f5e', '#fb7185', '#f59e0b']}
            backgroundColor="rgba(12, 17, 28, 0.75)"
            innerStyle={{ padding: '2rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }}>
                <HeartPulse size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Blood Pressure Classification</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Normal:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>&lt; 120 / &lt; 80 mmHg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Elevated:</span>
                <span style={{ color: '#f59e0b', fontWeight: 600 }}>120–129 / &lt; 80 mmHg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Stage 1 Hypertension:</span>
                <span style={{ color: '#f43f5e', fontWeight: 600 }}>130–139 / 80–89 mmHg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Stage 2 Hypertension:</span>
                <span style={{ color: '#f43f5e', fontWeight: 700 }}>≥ 140 / ≥ 90 mmHg</span>
              </div>
            </div>
          </BorderGlow>
        </motion.div>

        <motion.div variants={item}>
          <BorderGlow
            borderRadius={24}
            glowRadius={35}
            glowIntensity={1.0}
            edgeSensitivity={32}
            coneSpread={26}
            glowColor="199 95 65"
            colors={['#38bdf8', '#818cf8', '#10b981']}
            backgroundColor="rgba(12, 17, 28, 0.75)"
            innerStyle={{ padding: '2rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <Activity size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Lipid & Glucose Risk Tiers</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cholesterol Normal (1):</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>&lt; 200 mg/dL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cholesterol High (3):</span>
                <span style={{ color: '#f43f5e', fontWeight: 600 }}>≥ 240 mg/dL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fasting Glucose Normal (1):</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>&lt; 100 mg/dL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Glucose Diabetic (3):</span>
                <span style={{ color: '#f43f5e', fontWeight: 700 }}>≥ 126 mg/dL</span>
              </div>
            </div>
          </BorderGlow>
        </motion.div>
      </div>

      {/* Prevention Strategy Card */}
      <motion.div variants={item}>
        <BorderGlow
          borderRadius={24}
          glowRadius={40}
          glowIntensity={1.1}
          edgeSensitivity={32}
          coneSpread={26}
          glowColor="160 84 60"
          colors={['#10b981', '#34d399', '#38bdf8']}
          backgroundColor="rgba(10, 24, 20, 0.75)"
          innerStyle={{ padding: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <ShieldCheck size={22} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#10b981' }}>Epidemiological Lifestyle Impact</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
            According to the American Heart Association (AHA) and European Society of Cardiology (ESC), up to <strong>80% of premature cardiovascular events are preventable</strong> through combined blood pressure management, smoking cessation, and 150+ minutes of weekly aerobic exercise.
          </p>
        </BorderGlow>
      </motion.div>
    </motion.div>
  );
}
