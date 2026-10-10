import ConfidenceBar from './ConfidenceBar';
import GradCAMViewer from './GradCAMViewer';

export default function PredictionResult({ result }) {
  if (!result) return null;

  const isAI = result.prediction === 'FAKE' || result.prediction === 'AI Generated';
  const isInconclusive = result.prediction === 'INCONCLUSIVE' || result.is_inconclusive;

  const realProb = result.probabilities?.real ?? 0;
  const aiProb = result.probabilities?.ai_generated ?? 0;

  // Colors & badges based on verdict
  let borderColor = '#a7f3d0';
  let bgColor = '#ecfdf5';
  let iconBg = '#d1fae5';
  let strokeColor = '#059669';
  let textColor = '#065f46';
  let badgeClass = 'badge-emerald';
  let badgeLabel = 'Authentic Natural Image (REAL)';

  if (isAI) {
    borderColor = '#fecdd3';
    bgColor = '#fff1f2';
    iconBg = '#ffe4e6';
    strokeColor = '#e11d48';
    textColor = '#be123c';
    badgeClass = 'badge-rose';
    badgeLabel = 'Manipulated / Deepfake Detected (FAKE)';
  } else if (isInconclusive) {
    borderColor = '#fde68a';
    bgColor = '#fffbeb';
    iconBg = '#fef3c7';
    strokeColor = '#d97706';
    textColor = '#92400e';
    badgeClass = 'badge-amber';
    badgeLabel = 'Uncertain / Inconclusive Margin';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner Verdict */}
      <div
        className="glass-card"
        style={{
          padding: '26px 30px',
          border: `1.5px solid ${borderColor}`,
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            background: iconBg,
            border: `1.5px solid ${strokeColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {isAI ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            ) : isInconclusive ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
          </div>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span className={`badge ${badgeClass}`}>
                {badgeLabel}
              </span>
              <span className="badge badge-indigo">
                {result.model}
              </span>
              <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                Threshold: {result.threshold}
              </span>
            </div>
            <h2 style={{
              fontSize: '1.85rem',
              color: textColor,
              margin: '2px 0 4px 0',
              fontWeight: 800
            }}>
              {result.prediction}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Inference Time: <strong>{result.inference_time_ms} ms</strong> • Checkpoint: <strong>{result.model_status}</strong>
            </p>
          </div>
        </div>

        {/* Confidence pill */}
        <div style={{
          textAlign: 'right',
          padding: '12px 22px',
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Model Confidence
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: textColor, lineHeight: 1.1 }}>
            {result.confidence}%
          </div>
        </div>
      </div>

      {/* Probabilities Breakdown */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '14px' }}>
          📊 Class Probabilities (0: REAL, 1: FAKE / AI Generated)
        </h3>
        <ConfidenceBar realProb={realProb} aiProb={aiProb} />
      </div>

      {/* Grad-CAM Viewer if present */}
      {result.gradcam_image_base64 && (
        <GradCAMViewer gradcamBase64={result.gradcam_image_base64} modelName={result.model} />
      )}

      {/* Explanation note */}
      {result.explanation && (
        <div style={{
          padding: '14px 20px',
          background: 'var(--accent-indigo-light)',
          borderLeft: '4px solid var(--accent-indigo)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          color: '#334155',
          lineHeight: 1.5
        }}>
          <strong>Forensic Context:</strong> {result.explanation}
        </div>
      )}
    </div>
  );
}
