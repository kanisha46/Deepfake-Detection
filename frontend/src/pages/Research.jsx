export default function Research() {
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px 100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
          Scientific Framework
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '10px' }}>
          Research Methodology & <span className="gradient-text">Generalization Principles</span>
        </h1>
        <p style={{ maxWidth: '740px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Experimental protocol for comparing CNNs and Vision Transformers on FaceForensics++ C23, resolving class imbalance, and preventing data leakage.
        </p>
      </div>

      {/* Grid: Problems & Protocols */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* The Generalization Problem */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📌</span> The Generalization Problem
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Deepfake detectors often memorize low-level artifact patterns specific to a particular training distribution or generator. When evaluated on unseen generators (such as modern diffusion models) or different video compression profiles, accuracy degrades significantly due to domain shifts in frequency and feature representations.
          </p>
        </div>

        {/* Zero Leakage Protocol */}
        <div className="glass-card" style={{ padding: '28px', borderTop: '4px solid #4f46e5' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛡️</span> Zero Data Leakage Protocol
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Data leakage severely inflates reported performance in video-based deepfake datasets. In our protocol, all frames and crops from the same source video or subject identity are confined strictly to a single partition (train, val, or test). The test set (2,100 images) remains untouched until final metric computation.
          </p>
        </div>
      </div>

      {/* Dataset Splitting & Imbalance Architecture */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '18px' }}>
          📂 FaceForensics++ C23 Dataset Partitions & Class Distribution
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '18px'
        }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>Training Split (9,800 images)</span>
            <h4 style={{ fontSize: '1rem', margin: '4px 0' }}>1,400 Real / 8,400 Fake (1:6 Ratio)</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Face-crop images normalized with standard ImageNet statistics. Optimized using AdamW with cosine learning rate scheduling and cross-entropy loss.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Validation Split (2,100 images)</span>
            <h4 style={{ fontSize: '1rem', margin: '4px 0' }}>300 Real / 1,800 Fake</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Used exclusively for checkpoint selection (best checkpoint saved by validation ROC-AUC) and decision threshold calibration.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>Held-out Test Split (2,100 images)</span>
            <h4 style={{ fontSize: '1rem', margin: '4px 0' }}>300 Real / 1,800 Fake</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Independent split for final evaluation. EfficientNet-B0 achieves 84.29% accuracy (0.8949 ROC-AUC); ViT achieves 87.81% accuracy (0.9128 ROC-AUC).
            </p>
          </div>
        </div>
      </div>

      {/* Architectural Comparison: CNN vs ViT */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '18px' }}>
          🧠 CNN (EfficientNet-B0) vs Vision Transformer (ViT-B/16)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#4338ca', marginBottom: '8px' }}>EfficientNet-B0 (Convolutional Bias)</h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '18px' }}>
              <li><strong>Inductive Bias:</strong> Strong local spatial translation invariance via 3x3 and 5x5 depthwise convolutions.</li>
              <li><strong>Forensic Sensitivity:</strong> Excels at detecting localized pixel blending anomalies, warping borders, and edge discontinuities.</li>
              <li><strong>Explainability:</strong> Direct layer activation attribution through <strong>Grad-CAM</strong> on top feature channels.</li>
              <li><strong>Parameter Efficiency:</strong> ~5.3M parameters, high inference throughput.</li>
            </ul>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#047857', marginBottom: '8px' }}>Vision Transformer ViT-B/16 (Global Self-Attention)</h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '18px' }}>
              <li><strong>Inductive Bias:</strong> Minimal localized inductive bias; models long-range dependencies across all 196 image patches simultaneously.</li>
              <li><strong>Forensic Sensitivity:</strong> Excels at detecting structural inconsistencies across distant facial landmarks (e.g. eye-mouth symmetry, lighting incoherence).</li>
              <li><strong>Superior ROC-AUC:</strong> Achieved <strong>0.9128</strong> vs 0.8949 for EfficientNet-B0.</li>
              <li><strong>Model Capacity:</strong> ~86M parameters, requiring higher compute and careful regularization.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Evaluation Metrics & Calibration */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>
          📏 Evaluated Metrics & Forensic Indicators
        </h3>
        <ul style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '22px' }}>
          <li><strong>Balanced Accuracy:</strong> Arithmetic mean of sensitivity (Fake Recall) and specificity (Real Recall), eliminating distortion caused by the 1:6 class imbalance.</li>
          <li><strong>ROC-AUC:</strong> Area under the ROC curve, capturing discriminative ranking performance across all possible decision thresholds.</li>
          <li><strong>Threshold Tuning:</strong> Calibrating the decision boundary from default 0.50 to 0.725 for EfficientNet-B0 balances recall across both real and manipulated classes.</li>
          <li><strong>Uncertainty / Inconclusive Margin:</strong> Samples where probability falls near the decision boundary are flagged as inconclusive rather than falsely asserted as authentic or forged.</li>
        </ul>
      </div>
    </div>
  );
}
