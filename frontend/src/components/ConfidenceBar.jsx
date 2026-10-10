export default function ConfidenceBar({ realProb = 0, aiProb = 0 }) {
  const realPercent = Math.round(realProb * 100);
  const aiPercent = Math.round(aiProb * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Authentic Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#065f46' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
            Authentic Media
          </div>
          <span style={{ fontWeight: 700, color: '#065f46' }}>
            {realPercent}%
          </span>
        </div>
        <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', padding: '1px' }}>
          <div style={{
            height: '100%',
            width: `${Math.max(realPercent, 2)}%`,
            background: 'linear-gradient(90deg, #10b981, #059669)',
            borderRadius: '5px',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>

      {/* Synthetic Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#9f1239' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e11d48', display: 'inline-block' }} />
            Synthetic / Manipulated
          </div>
          <span style={{ fontWeight: 700, color: '#9f1239' }}>
            {aiPercent}%
          </span>
        </div>
        <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', padding: '1px' }}>
          <div style={{
            height: '100%',
            width: `${Math.max(aiPercent, 2)}%`,
            background: 'linear-gradient(90deg, #f43f5e, #e11d48)',
            borderRadius: '5px',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>
    </div>
  );
}
