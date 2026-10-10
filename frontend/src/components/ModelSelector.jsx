export default function ModelSelector({ selectedModel, onModelChange }) {
  const models = [
    {
      id: 'efficientnet_b0',
      name: 'EfficientNet-B0',
      category: 'Convolutional Neural Network',
      badge: 'Fast Spatial Scan',
      badgeColor: '#4f46e5',
      badgeBg: '#eef2ff',
      description: 'Scans localized pixel blending, frequency irregularities, and compression artifacts.',
      highlight: 'Visual Heatmap Supported',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      id: 'vit',
      name: 'Vision Transformer (ViT-B/16)',
      category: 'Self-Attention Architecture',
      badge: 'High Precision AUC',
      badgeColor: '#059669',
      badgeBg: '#ecfdf5',
      description: 'Decomposes facial regions into 196 image patches to detect structural inconsistencies.',
      highlight: 'Global Feature Consistency',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          Choose Detection Engine
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Select model architecture for analysis
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px'
      }}>
        {models.map((m) => {
          const isSelected = selectedModel === m.id;
          return (
            <div
              key={m.id}
              onClick={() => onModelChange(m.id)}
              style={{
                padding: '18px 20px',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? '#ffffff' : '#f8fafc',
                border: isSelected ? '2px solid #4f46e5' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 8px 20px -4px rgba(79, 70, 229, 0.15)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    color: isSelected ? '#4f46e5' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {m.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: isSelected ? '#4f46e5' : 'var(--text-primary)', margin: 0 }}>
                      {m.name}
                    </h4>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {m.category}
                    </span>
                  </div>
                </div>

                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: isSelected ? '6px solid #4f46e5' : '2px solid #cbd5e1',
                  background: '#ffffff',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }} />
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {m.description}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '8px',
                borderTop: '1px solid #f1f5f9',
                fontSize: '0.76rem'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>{m.highlight}</span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: m.badgeBg,
                  color: m.badgeColor,
                  fontWeight: 600
                }}>
                  {m.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
