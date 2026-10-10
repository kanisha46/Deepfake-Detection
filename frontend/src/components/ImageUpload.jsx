import { useState, useRef } from 'react';
import ImagePreview from './ImagePreview';

export default function ImageUpload({ onImageSelected, isAnalyzing }) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageSelected(file, url);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onImageSelected(null, null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Quick preset samples
  const loadPreset = (type) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    if (type === 'real') {
      const grad = ctx.createLinearGradient(0, 0, 300, 300);
      grad.addColorStop(0, '#fed7aa');
      grad.addColorStop(0.5, '#fdba74');
      grad.addColorStop(1, '#fb923c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 300, 300);

      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(110, 120, 14, 0, Math.PI * 2);
      ctx.arc(190, 120, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(150, 180, 45, 0.2 * Math.PI, 0.8 * Math.PI, false);
      ctx.stroke();

      for (let i = 0; i < 4000; i++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.08})`;
        ctx.fillRect(Math.random() * 300, Math.random() * 300, 1, 1);
      }
    } else {
      const grad = ctx.createRadialGradient(150, 150, 20, 150, 150, 180);
      grad.addColorStop(0, '#fbcfe8');
      grad.addColorStop(0.5, '#e9d5ff');
      grad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 300, 300);

      ctx.fillStyle = '#581c87';
      ctx.beginPath();
      ctx.arc(105, 125, 16, 0, Math.PI * 2);
      ctx.arc(195, 125, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let x = 0; x < 300; x += 4) {
        for (let y = 0; y < 300; y += 4) {
          if ((x + y) % 8 === 0) ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    canvas.toBlob((blob) => {
      const sample = new File([blob], `${type}_test_sample.png`, { type: 'image/png' });
      processFile(sample);
    }, 'image/png');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div
        className="glass-card"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !previewUrl && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--accent-indigo)' : 'var(--border-medium)'}`,
          backgroundColor: dragActive ? 'var(--accent-indigo-light)' : '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 20px',
          textAlign: 'center',
          cursor: previewUrl ? 'default' : 'pointer',
          transition: 'all 0.25s ease'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        {previewUrl ? (
          <ImagePreview
            previewUrl={previewUrl}
            file={selectedFile}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'var(--accent-indigo-light)',
              border: '1px solid #c7d2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-indigo)'
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                Drag & drop image here, or <span style={{ color: 'var(--accent-indigo)', textDecoration: 'underline' }}>browse</span>
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Supports JPEG, PNG, WebP • Max size: 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preset Samples */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        background: '#f8fafc',
        border: '1px solid var(--border-subtle)'
      }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          🧪 Test Presets:
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => loadPreset('real')}
            className="btn-secondary"
            style={{ padding: '5px 12px', fontSize: '0.78rem', background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}
          >
            📸 Natural / Real
          </button>
          <button
            type="button"
            onClick={() => loadPreset('fake')}
            className="btn-secondary"
            style={{ padding: '5px 12px', fontSize: '0.78rem', background: '#fff1f2', color: '#9f1239', borderColor: '#fecdd3' }}
          >
            🤖 Synthetic / AI
          </button>
        </div>
      </div>
    </div>
  );
}
