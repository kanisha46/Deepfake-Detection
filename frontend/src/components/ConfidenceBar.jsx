export default function ConfidenceBar({ realProb = 0, aiProb = 0 }) {
  const realPercent = Math.round(realProb * 100);
  const aiPercent = Math.round(aiProb * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Real Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
          <span style={{ color: '#065f46', fontWeight: 600 }}>Authentic / Real</span>
          <span style={{ fontWeight: 700 }}>{realPercent}% ({realProb.toFixed(4)})</span>
        </div>
        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${realPercent}%`,
            background: '#059669',
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* AI Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
          <span style={{ color: '#9f1239', fontWeight: 600 }}>AI Generated / Deepfake</span>
          <span style={{ fontWeight: 700 }}>{aiPercent}% ({aiProb.toFixed(4)})</span>
        </div>
        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${aiPercent}%`,
            background: '#e11d48',
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>
    </div>
  );
}
