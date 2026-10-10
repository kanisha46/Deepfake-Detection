import { useState } from 'react';
import ConfidenceBar from './ConfidenceBar';
import GradCAMViewer from './GradCAMViewer';

export default function PredictionResult({ result, onReset }) {
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);
  if (!result) return null;

  const isAI = result.prediction === 'FAKE' || result.prediction === 'AI Generated';
  const isInconclusive = result.prediction === 'INCONCLUSIVE' || result.is_inconclusive;

  const realProb = result.probabilities?.real ?? 0;
  const aiProb = result.probabilities?.ai_generated ?? 0;

  // Theming based on verdict
  let theme = {
    title: 'Authentic Photograph',
    subtitle: 'No manipulation or synthetic generation artifacts detected.',
    badgeText: 'Verified Authentic',
    badgeClass: 'badge-emerald',
    borderColor: '#a7f3d0',
    bgColor: '#f0fdf4',
    iconBg: '#d1fae5',
    color: '#065f46',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  };

  if (isAI) {
    theme = {
      title: 'Deepfake / AI-Generated',
      subtitle: 'Structural or pixel-level manipulation patterns identified.',
      badgeText: 'Synthetic Media',
      badgeClass: 'badge-rose',
      borderColor: '#fecdd3',
      bgColor: '#fff1f2',
      iconBg: '#ffe4e6',
      color: '#be123c',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    };
  } else if (isInconclusive) {
    theme = {
      title: 'Analysis Inconclusive',
      subtitle: 'Image traits fall within the uncertainty boundary. Human review recommended.',
      badgeText: 'Ambiguous Pattern',
      badgeClass: 'badge-amber',
      borderColor: '#fde68a',
      bgColor: '#fffbeb',
      iconBg: '#fef3c7',
      color: '#92400e',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    };
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Primary Verdict Card */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          border: `1.5px solid ${theme.borderColor}`,
          background: theme.bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: theme.iconBg,
            border: `1.5px solid ${theme.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
          }}>
            {theme.icon}
          </div>

          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
              <span className={`badge ${theme.badgeClass}`}>
                {theme.badgeText}
              </span>
              <span className="badge" style={{ background: '#ffffff', color: '#475569', border: '1px solid #e2e8f0' }}>
                Engine: {result.model || 'Deep Learning'}
              </span>
            </div>
            <h2 style={{
              fontSize: '1.85rem',
              color: theme.color,
              margin: '2px 0 4px 0',
              fontWeight: 800
            }}>
              {theme.title}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              {theme.subtitle}
            </p>
          </div>
        </div>

        {/* Confidence Display */}
        <div style={{
          textAlign: 'right',
          padding: '14px 26px',
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          minWidth: '150px'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            Confidence
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: theme.color, lineHeight: 1.1 }}>
            {result.confidence}%
          </div>
        </div>
      </div>

      {/* Probabilities Breakdown */}
      <div className="glass-card" style={{ padding: '24px 28px' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '14px', fontWeight: 700 }}>
          Biometric Authenticity Probability
        </h3>
        <ConfidenceBar realProb={realProb} aiProb={aiProb} />
      </div>

      {/* Explainability Heatmap if present */}
      {result.gradcam_image_base64 && (
        <GradCAMViewer gradcamBase64={result.gradcam_image_base64} modelName={result.model} />
      )}

      {/* Forensic Context & Transparency */}
      <div style={{
        padding: '16px 22px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            <span>🛡️</span> Forensic Assessment
          </div>
          <button
            type="button"
            onClick={() => setShowDetailedInfo(!showDetailedInfo)}
            style={{ background: 'none', color: '#4f46e5', fontSize: '0.8rem', fontWeight: 600 }}
          >
            {showDetailedInfo ? 'Hide Details ▲' : 'Show Details ▼'}
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          {result.message || 'Analysis completed using deep learning feature representations.'}
        </p>

        {showDetailedInfo && (
          <div style={{
            marginTop: '8px',
            paddingTop: '10px',
            borderTop: '1px solid #e2e8f0',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div><strong>Engine:</strong> {result.model}</div>
            <div><strong>Response Time:</strong> {result.inference_time_ms} ms</div>
            <div><strong>Assessment Note:</strong> Results reflect learned statistical visual representations. For judicial or high-stakes verification, human forensic cross-examination is recommended.</div>
          </div>
        )}
      </div>

      {/* Actions */}
      {onReset && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
          <button
            type="button"
            onClick={onReset}
            className="btn-secondary"
            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
          >
            ← Test Another Image
          </button>
        </div>
      )}
    </div>
  );
}
