import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Predictor from './components/Predictor';
import Insights from './components/Insights';
import About from './components/About';
import GhostFibers from './components/GhostFibers';
import GradualBlur from './components/GradualBlur';
import SmoothScroll from './components/SmoothScroll';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/predictor" element={<Predictor />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <SmoothScroll>
        {/* Living WebGL GhostFibers Luxury Atmosphere */}
      <div className="ghost-fibers-bg-wrapper">
        <GhostFibers
          backdropColor="#06070a"
          lineColor="#0a1526"
          glowColor="#e11d48"
          speed={0.14}
          scale={1.85}
          rotation={0}
          rotationSpeed={0.05}
          layers={4}
          waveAmplitude={0.015}
          waveFrequency={2.8}
          waveSpeed={0.12}
          layerSpeed={0.06}
          twist={0.09}
          twistFrequency={4.5}
          twistSpeed={0.8}
          lineFrequency={4.5}
          lineSpacing={1.8}
          lineSharpness={18}
          glowFalloff={10}
          glowIntensity={1.35}
          brightness={1.65}
          blueBoost={1.22}
          vignette={0.82}
          grain={0.03}
          dpr={1.5}
        />
        <div className="ghost-fibers-overlay"></div>
      </div>

      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <Navbar />
      {/* Luxury Progressive Glass Header Blur behind floating Navbar */}
      <GradualBlur
        target="page"
        position="top"
        height="6rem"
        strength={3.5}
        divCount={6}
        curve="bezier"
        exponential={true}
        opacity={1}
        tint="rgba(6, 7, 10, 0.65)"
        zIndex={850}
      />
      <main className="main-content">
        <AnimatedRoutes />
      </main>
      <Footer />
      </SmoothScroll>
    </Router>
  );
}

export default App;
