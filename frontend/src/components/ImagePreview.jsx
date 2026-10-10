export default function ImagePreview({ previewUrl, file, onClear, isAnalyzing }) {
  if (!previewUrl) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-subtle)',
        background: '#f1f5f9'
      }}>
        <img
          src={previewUrl}
          alt="Target preview"
          style={{
            maxWidth: '100%',
            maxHeight: '260px',
            objectFit: 'contain',
            display: 'block'
          }}
        />
        {isAnalyzing && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '100%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #4f46e5, transparent)',
              animation: 'radarScan 1.8s ease-in-out infinite'
            }} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span className="badge badge-indigo">{file?.name || 'Selected Image'}</span>
        {file && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {(file.size / 1024).toFixed(1)} KB
          </span>
        )}
        {!isAnalyzing && onClear && (
          <button
            type="button"
            onClick={onClear}
            style={{
              background: 'transparent',
              color: '#e11d48',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '4px'
            }}
          >
            ✕ Change
          </button>
        )}
      </div>
    </div>
  );
}
