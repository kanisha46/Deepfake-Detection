export default function Loading({ text = "Analyzing Spatial & Frequency Domain Traces..." }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      gap: '20px'
    }}>
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Outer glowing pulsing ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px dashed rgba(6, 182, 212, 0.4)',
          animation: 'spin 8s linear infinite'
        }} />
        {/* Inner spinning gradient ring */}
        <div style={{
          position: 'absolute',
          inset: '8px',
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: 'var(--accent-cyan)',
          borderRightColor: 'var(--accent-indigo)',
          animation: 'spin 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite'
        }} />
        {/* Center core pulse */}
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
          boxShadow: '0 0 15px rgba(6, 182, 212, 0.8)'
        }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontWeight: 600,
          fontSize: '1rem',
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em'
        }}>
          {text}
        </p>
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          marginTop: '4px'
        }}>
          Evaluating 2D FFT Spectrum & Pretrained Feature Map
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
