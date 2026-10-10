import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '50px 24px 100px' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '70px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <span className="badge badge-indigo">AI Media Forensics</span>
          <span className="badge badge-emerald">CNN & Vision Transformers</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          lineHeight: 1.15,
          marginBottom: '20px',
          fontWeight: 800,
          letterSpacing: '-0.025em'
        }}>
          Next-Generation <br />
          <span className="gradient-text">Deepfake & Synthetic Media Detection</span>
        </h1>

        <p style={{
          maxWidth: '740px',
          margin: '0 auto 32px',
          color: 'var(--text-secondary)',
          fontSize: '1.12rem',
          lineHeight: 1.7
        }}>
          Evaluate facial and portrait media authenticity in real time. Powered by deep neural networks trained to detect forensic anomalies, pixel blending traces, and synthetic generation artifacts.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            to="/detection"
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '14px 34px' }}
          >
            ⚡ Scan an Image Now
          </Link>
          <Link
            to="/experiments"
            className="btn-secondary"
            style={{ fontSize: '1rem', padding: '14px 28px' }}
          >
            📊 View Model Benchmarks
          </Link>
        </div>
      </section>

      {/* Feature Pillars */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '60px'
      }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#eef2ff',
            color: '#4f46e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Dual Neural Engines</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Toggle between EfficientNet-B0 for localized pixel edge inconsistencies and Vision Transformer (ViT-B/16) for global facial landmark coherence.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Calibrated Decisions</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Tuned decision thresholds mitigate dataset imbalance, offering definitive Authentic / Synthetic verdicts while flagging ambiguous images as Inconclusive.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#f0f9ff',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Visual Saliency Heatmaps</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Layer-activation Grad-CAM overlays reveal the precise facial regions and texture boundaries that informed the neural network's assessment.
          </p>
        </div>
      </section>

      {/* Interactive Try-it Card */}
      <section className="glass-card" style={{
        padding: '40px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        textAlign: 'center',
        marginBottom: '60px'
      }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
          Ready to verify image authenticity?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 24px' }}>
          Upload any portrait or headshot to inspect for deepfake manipulation traces, blending boundaries, and synthesis artifacts.
        </p>
        <Link to="/detection" className="btn-primary" style={{ padding: '12px 30px' }}>
          Launch Detector Studio ➔
        </Link>
      </section>

      {/* Academic Citation Footer Note */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '24px'
      }}>
        Research Project: <em>AI-Powered Deepfake Detection Using CNN and Vision Transformer Architectures for Cross-Dataset Generalization</em>  
        <br />
        Department of Information Technology • Dharmsinh Desai University
      </div>
    </div>
  );
}
