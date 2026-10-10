import { Link, useLocation } from 'react-router-dom';
import PredictionResult from '../components/PredictionResult';

export default function Results() {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', padding: '0 24px' }}>
        <div className="glass-card" style={{ padding: '40px' }}>
          <span style={{ fontSize: '2rem' }}>🔍</span>
          <h2 style={{ fontSize: '1.4rem', marginTop: '10px', marginBottom: '8px' }}>No Active Result Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Please upload an image in the Detection Studio to generate a live analysis report.
          </p>
          <Link to="/detection" className="btn-primary">
            Go to Detector Studio ➔
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem' }}>Detailed Forensic Analysis Report</h1>
        <Link to="/detection" className="btn-secondary">
          ← Test Another Image
        </Link>
      </div>
      <PredictionResult result={result} />
    </div>
  );
}
