export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      className="glass-card"
      style={{
        padding: '16px 20px',
        borderLeft: '4px solid #e11d48',
        background: '#fff1f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.3rem' }}>⚠️</span>
        <div>
          <div style={{ fontWeight: 700, color: '#9f1239', fontSize: '0.9rem' }}>
            System Notice
          </div>
          <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '2px' }}>
            {message}
          </div>
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={{ background: 'transparent', color: '#9f1239', fontWeight: 700, fontSize: '1rem' }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
