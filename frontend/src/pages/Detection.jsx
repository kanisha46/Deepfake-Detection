import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import ModelSelector from '../components/ModelSelector';
import PredictionResult from '../components/PredictionResult';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { predictImage } from '../services/api';

export default function Detection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [_previewUrl, setPreviewUrl] = useState(null);
  const [selectedModel, setSelectedModel] = useState('efficientnet_b0');
  const [enableGradCAM, setEnableGradCAM] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelected = (file, url) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setResult(null);
    setError(null);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await predictImage(selectedFile, selectedModel, enableGradCAM);
      setResult(data);
    } catch (err) {
      console.error('Detection request failed:', err);
      setError(
        err.response?.data?.detail ||
        'Unable to complete image analysis. Please verify your connection to the service and try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Title & Introduction */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span className="badge badge-indigo" style={{ marginBottom: '10px' }}>
          Forensic Inspection Studio
        </span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', letterSpacing: '-0.02em' }}>
          Deepfake & AI Media <span className="gradient-text">Detector</span>
        </h1>
        <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
          Upload portrait or facial imagery to detect manipulation artifacts, deepfakes, and synthetic generations.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
        {/* Model Selection */}
        <div className="glass-card" style={{ padding: '24px 28px' }}>
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>

        {/* Upload Card */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <ImageUpload
            onImageSelected={handleImageSelected}
            isAnalyzing={isAnalyzing}
          />

          {selectedFile && (
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              {selectedModel === 'efficientnet_b0' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={enableGradCAM}
                    onChange={(e) => setEnableGradCAM(e.target.checked)}
                    style={{ accentColor: '#4f46e5', width: '16px', height: '16px' }}
                  />
                  Generate <strong>Visual Saliency Heatmap</strong> for anomaly localization
                </label>
              )}

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="btn-primary"
                style={{
                  fontSize: '1rem',
                  padding: '14px 42px',
                  width: '100%',
                  maxWidth: '360px',
                  opacity: isAnalyzing ? 0.7 : 1
                }}
              >
                {isAnalyzing ? 'Scanning Facial Features...' : '⚡ Analyze Authenticity'}
              </button>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {isAnalyzing && (
          <div className="glass-card">
            <Loading text="Executing deep learning feature analysis..." />
          </div>
        )}

        {/* Clean Error Alert */}
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}

        {/* Live Prediction Report */}
        {result && !isAnalyzing && (
          <PredictionResult result={result} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
