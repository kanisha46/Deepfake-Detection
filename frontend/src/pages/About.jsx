export default function About() {
  const team = [
    { name: 'Priyanka Ganjawala', id: 'IT035', role: 'Research Lead & Deep Learning Architect' },
    { name: 'Kanisha Jasoliya', id: 'IT047', role: 'Dataset Forensics & Experimentation Engineer' },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>
          Academic Project Team
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '10px' }}>
          About the <span className="gradient-text">Research Team</span>
        </h1>
        <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Department of Information Technology • Dharmsinh Desai University, Surat, Gujarat, India.
        </p>
      </div>

      {/* Team Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {team.map((member, i) => (
          <div key={i} className="glass-card" style={{ padding: '28px', borderTop: '4px solid #4f46e5' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--accent-indigo-light)',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
              marginBottom: '14px'
            }}>
              {member.name.charAt(0)}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{member.name}</h3>
            <div style={{ fontSize: '0.84rem', color: '#4f46e5', fontWeight: 700, marginBottom: '6px' }}>
              Student ID: {member.id}
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              {member.role}
            </p>
          </div>
        ))}
      </div>

      {/* Dataset & Architecture Status */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
          📚 Research Status & Dataset Benchmark
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
          The system evaluates CNN and Vision Transformer architectures on the standardized <strong>FaceForensics++ C23</strong> face-crop benchmark, with dataset adapters prepared for external cross-dataset generalization:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid #10b981' }}>
            <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.88rem' }}>✓ FaceForensics++ C23</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Status: <strong>COMPLETED & ACTIVE</strong><br />
              9,800 train | 2,100 val | 2,100 test<br />
              Both EfficientNet-B0 & ViT-B/16 checkpoints verified
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: '#0284c7', fontSize: '0.88rem' }}>⏳ Celeb-DF (v2)</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Status: Cross-Evaluation Adapter Ready<br />
              High-visual-quality deepfake benchmark
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: '#7c3aed', fontSize: '0.88rem' }}>⏳ DFDC Challenge</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Status: Cross-Evaluation Adapter Ready<br />
              Diverse lighting & camera conditions
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: '#d97706', fontSize: '0.88rem' }}>⏳ GenImage (GLIDE / Midjourney)</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Status: Generative Diffusion Baseline<br />
              Tests diffusion vs manipulation transfer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
