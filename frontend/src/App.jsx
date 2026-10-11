import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detection from './pages/Detection';
import Results from './pages/Results';
import Experiments from './pages/Experiments';
import Research from './pages/Research';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detection" element={<Detection />} />
            <Route path="/results" element={<Results />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/research" element={<Research />} />
          </Routes>
        </main>
        <footer style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '24px',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          background: '#ffffff'
        }}>
          AI-Powered Deepfake Detection Using CNN and Vision Transformer Architectures for Cross-Dataset Generalization
        </footer>
      </div>
    </BrowserRouter>
  );
}
