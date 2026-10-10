import { useState, useEffect } from 'react';
import { getExperiments } from '../services/api';

export default function Experiments() {
  const [experimentsData, setExperimentsData] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const data = await getExperiments();
        if (data.experiments && data.experiments.length > 0) {
          setExperimentsData(data.experiments);
          setSelectedExp(data.experiments[0]);
        }
      } catch (err) {
        console.error('Failed to load experiments:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExp();
  }, []);

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading empirical benchmark logs...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px 100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>
          FaceForensics++ C23 Benchmark
        </span>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '10px' }}>
          Empirical <span className="gradient-text">Model Evaluation & Benchmark</span>
        </h1>
        <p style={{ maxWidth: '780px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Live experimental results on 2,100 prepared FaceForensics++ C23 test face-crops (300 Real, 1,800 Fake).
          Demonstrates the impact of class imbalance (1:6 ratio), threshold calibration, and Vision Transformer self-attention.
        </p>
      </div>

      {/* Class Imbalance Warning / Research Context Callout */}
      <div className="glass-card" style={{
        padding: '24px 28px',
        marginBottom: '36px',
        borderLeft: '5px solid #4f46e5',
        background: '#f8fafc'
      }}>
        <h4 style={{ fontSize: '1.05rem', color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⚖️</span> Understanding Class Imbalance in Deepfake Research
        </h4>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
          The benchmark dataset contains an inherent 1:6 ratio (14% Real vs 86% Fake). Standard accuracy (e.g. 84.29%) can be misleading because a classifier predicting mostly "Fake" can artificially appear successful while misclassifying innocent authentic faces.
          Therefore, <strong>Balanced Accuracy</strong> and <strong>ROC-AUC</strong> are the primary scientific figures of merit.
        </p>
      </div>

      {/* Comparative Benchmark Table */}
      <div className="glass-card" style={{ padding: '30px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
            📊 Multi-Model Performance Comparison
          </h3>
          <span className="badge badge-emerald">Test Split: 2,100 Images</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Model Architecture</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Decision Threshold</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Accuracy</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Balanced Accuracy</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>ROC-AUC</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Macro F1</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Real Recall (Class 0)</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Fake Recall (Class 1)</th>
              </tr>
            </thead>
            <tbody>
              {experimentsData.map((exp) => (
                <tr
                  key={exp.id}
                  onClick={() => setSelectedExp(exp)}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    background: selectedExp?.id === exp.id ? '#f0fdf4' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1e293b' }}>
                    {exp.model}
                    {selectedExp?.id === exp.id && <span style={{ marginLeft: '6px', color: '#059669' }}>●</span>}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--accent-indigo)' }}>
                    {exp.threshold}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    {(exp.accuracy * 100).toFixed(2)}%
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#059669' }}>
                    {(exp.balanced_accuracy * 100).toFixed(2)}%
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#4f46e5' }}>
                    {exp.roc_auc.toFixed(4)}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    {exp.macro_f1.toFixed(4)}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#047857', fontWeight: 600 }}>
                    {exp.real_recall ? `${(exp.real_recall * 100).toFixed(1)}%` : '—'}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#b91c1c', fontWeight: 600 }}>
                    {exp.fake_recall ? `${(exp.fake_recall * 100).toFixed(1)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '12px', marginInline: '4px' }}>
          💡 Click any row above to view its detailed Confusion Matrix and Training History.
        </p>
      </div>

      {/* Selected Experiment Deep Dive */}
      {selectedExp && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '28px' }}>
          {/* Confusion Matrix Card */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1.1rem', margin: 0 }}>
                🎯 Confusion Matrix: {selectedExp.model} (Threshold {selectedExp.threshold})
              </h4>
              <span className="badge badge-indigo">N = 2,100</span>
            </div>

            {selectedExp.confusion_matrix && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 140px 140px', gap: '10px', textAlign: 'center', fontSize: '0.85rem' }}>
                  <div></div>
                  <div style={{ fontWeight: 700, color: '#065f46' }}>Pred. Authentic</div>
                  <div style={{ fontWeight: 700, color: '#9f1239' }}>Pred. Synthetic</div>

                  <div style={{ fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Actual Authentic (300)
                  </div>
                  <div style={{ background: '#d1fae5', padding: '16px', borderRadius: '8px', border: '1px solid #10b981' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#065f46' }}>{selectedExp.confusion_matrix[0][0]}</div>
                    <div style={{ fontSize: '0.72rem', color: '#047857' }}>True Authentic (TN)</div>
                  </div>
                  <div style={{ background: '#ffe4e6', padding: '16px', borderRadius: '8px', border: '1px solid #f43f5e' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#9f1239' }}>{selectedExp.confusion_matrix[0][1]}</div>
                    <div style={{ fontSize: '0.72rem', color: '#881337' }}>False Synthetic (FP)</div>
                  </div>

                  <div style={{ fontWeight: 700, color: '#9f1239', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Actual Synthetic (1800)
                  </div>
                  <div style={{ background: '#ffe4e6', padding: '16px', borderRadius: '8px', border: '1px solid #f43f5e' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#9f1239' }}>{selectedExp.confusion_matrix[1][0]}</div>
                    <div style={{ fontSize: '0.72rem', color: '#881337' }}>False Authentic (FN)</div>
                  </div>
                  <div style={{ background: '#d1fae5', padding: '16px', borderRadius: '8px', border: '1px solid #10b981' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#065f46' }}>{selectedExp.confusion_matrix[1][1]}</div>
                    <div style={{ fontSize: '0.72rem', color: '#047857' }}>True Synthetic (TP)</div>
                  </div>
                </div>
              </div>
            )}
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '14px' }}>
              {selectedExp.notes}
            </p>
          </div>

          {/* Training History / Loss Progression */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
              📈 Training Progression (5 Epochs)
            </h4>

            {selectedExp.training_history && selectedExp.training_history.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                      <th style={{ padding: '8px 10px' }}>Epoch</th>
                      <th style={{ padding: '8px 10px' }}>Train Loss</th>
                      <th style={{ padding: '8px 10px' }}>Train Acc</th>
                      <th style={{ padding: '8px 10px' }}>Val Loss</th>
                      <th style={{ padding: '8px 10px' }}>Val Acc</th>
                      <th style={{ padding: '8px 10px' }}>Val AUC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExp.training_history.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 700 }}>Epoch {row.epoch}</td>
                        <td style={{ padding: '8px 10px' }}>{parseFloat(row.train_loss).toFixed(4)}</td>
                        <td style={{ padding: '8px 10px' }}>{(parseFloat(row.train_accuracy) * 100).toFixed(1)}%</td>
                        <td style={{ padding: '8px 10px' }}>{parseFloat(row.val_loss).toFixed(4)}</td>
                        <td style={{ padding: '8px 10px' }}>{(parseFloat(row.val_accuracy) * 100).toFixed(1)}%</td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#4f46e5' }}>{parseFloat(row.val_auc).toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No epoch training history recorded for this experiment.</p>
            )}

            <div style={{ marginTop: '20px', padding: '12px 16px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>Optimization Protocol:</strong> Cross-entropy loss with AdamW optimizer, warmup schedule, and evaluation on independent 2,100 image validation set at each epoch boundary.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
