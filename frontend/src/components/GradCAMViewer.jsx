export default function GradCAMViewer({ gradcamBase64, modelName }) {
  if (!gradcamBase64) {
    return (
      <div className="glass-card" style={{ padding: '20px', background: '#f8fafc' }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>🔍 Grad-CAM Explainable AI</h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Grad-CAM visualization is generated for CNN convolutional architectures (EfficientNet-B0 and ResNet-50).
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔍</span> Explainable AI: Grad-CAM Activation Heatmap
        </h3>
        <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>Feature Attribution</span>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
        Highlights regions in the final convolutional layer of <strong>{modelName}</strong> that triggered the model's prediction.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <img
          src={gradcamBase64}
          alt="Grad-CAM Heatmap"
          style={{
            width: '140px',
            height: '140px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-medium)',
            objectFit: 'cover'
          }}
        />
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
          <div>• <strong>Red / Warm Areas:</strong> Strongest feature activation contributing to classification.</div>
          <div style={{ marginTop: '4px' }}>• <strong>Blue / Cool Areas:</strong> Background or natural photographic baseline.</div>
          <div style={{ marginTop: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Evaluates localized textural anomalies without altering input geometry.
          </div>
        </div>
      </div>
    </div>
  );
}
