import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '50px 24px 100px' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="badge badge-indigo">Academic Research Project</span>
          <span className="badge badge-cyan">CNN & Vision Transformers</span>
          <span className="badge badge-emerald">FaceForensics++ C23</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.3rem, 4.5vw, 3.6rem)',
          lineHeight: 1.18,
          marginBottom: '18px',
          fontWeight: 800
        }}>
          AI-Powered Deepfake Detection <br />
          <span className="gradient-text">Using CNN & Vision Transformer Architectures</span>
        </h1>

        <p style={{
          maxWidth: '820px',
          margin: '0 auto 20px',
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          lineHeight: 1.7
        }}>
          A computer vision research application evaluating and improving cross-dataset and cross-generator generalization in AI-generated and manipulated image detection using trained EfficientNet-B0 and Vision Transformer (ViT-B/16) models.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '32px',
          fontSize: '0.88rem',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ background: '#f1f5f9', padding: '5px 14px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
            <strong>Priyanka Ganjawala</strong> (IT035)
          </span>
          <span style={{ background: '#f1f5f9', padding: '5px 14px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
            <strong>Kanisha Jasoliya</strong> (IT047)
          </span>
          <span style={{ background: '#f1f5f9', padding: '5px 14px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
            <em>Dharmsinh Desai University</em>
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/detection" className="btn-primary" style={{ fontSize: '0.98rem', padding: '13px 30px' }}>
            ⚡ Launch Live Detector Studio
          </Link>
          <Link to="/experiments" className="btn-secondary" style={{ fontSize: '0.98rem', padding: '13px 26px' }}>
            📊 View Benchmark Experiments
          </Link>
          <Link to="/research" className="btn-secondary" style={{ fontSize: '0.98rem', padding: '13px 26px', color: '#4f46e5', borderColor: '#c7d2fe' }}>
            🔬 Research Methodology
          </Link>
        </div>
      </section>

      {/* Model Benchmark Overview Cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '50px'
      }}>
        <div className="glass-card" style={{ padding: '28px', borderTop: '4px solid #4f46e5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="badge badge-indigo">CNN Backbone</span>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>VERIFIED CHECKPOINT</span>
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>EfficientNet-B0</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
            Compound scaled convolutional architecture trained on 9,800 FaceForensics++ C23 face-crops. Achieves <strong>84.29%</strong> accuracy (ROC-AUC <strong>0.8949</strong>) at threshold 0.50, and <strong>79.94%</strong> balanced accuracy at threshold 0.725.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '10px 14px', background: '#f8fafc', borderRadius: '6px' }}>
            <span>Explainability:</span>
            <strong style={{ color: '#4f46e5' }}>Grad-CAM Supported</strong>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '28px', borderTop: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="badge badge-emerald">Vision Transformer</span>
            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>VERIFIED CHECKPOINT</span>
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Vision Transformer (ViT-B/16)</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
            Multi-head self-attention architecture decomposing images into 16x16 patch tokens. Achieves <strong>87.81%</strong> accuracy (ROC-AUC <strong>0.9128</strong>) at threshold 0.65, demonstrating superior discrimination of global facial inconsistencies.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '10px 14px', background: '#f8fafc', borderRadius: '6px' }}>
            <span>ROC-AUC:</span>
            <strong style={{ color: '#059669' }}>0.9128 (Top Performer)</strong>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="glass-card" style={{ padding: '36px', marginBottom: '50px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-indigo" style={{ marginBottom: '6px' }}>System Architecture</span>
          <h2 style={{ fontSize: '1.7rem' }}>End-to-End Forensic Evaluation Pipeline</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px'
        }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>📥 1. Image Validation</div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>Deterministic Preprocessing</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Validates image format and size, converts to sanitized RGB, resizes to 224x224, and applies PyTorch ImageNet normalization.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>🧠 2. Deep Learning</div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>Dual-Model Inference</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Executes inference through verified EfficientNet-B0 or ViT-B/16 checkpoints loaded with strict weight compatibility.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>⚖️ 3. Decision Policy</div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>Uncertainty Calibration</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Labels as REAL, FAKE, or INCONCLUSIVE if predicted probability falls within the uncertainty margin near the calibrated threshold.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>🔍 4. Explainability</div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>Grad-CAM Activation</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Computes gradient attribution across top convolution layers in EfficientNet-B0 to visually locate forensic anomaly cues.
            </p>
          </div>
        </div>
      </section>

      {/* Scientific Disclaimer */}
      <section style={{
        padding: '20px 24px',
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.85rem',
        color: '#92400e',
        lineHeight: 1.6
      }}>
        <strong>Scientific Integrity Notice:</strong> AI predictions are probabilistic statistical estimates and do not constitute absolute legal or forensic proof of authenticity. In real-world forensic applications, cross-generator evaluation, threshold calibration, and human-in-the-loop review are essential to avoid false accusations.
      </section>
    </div>
  );
}
