import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ 
      position: 'relative',
      overflow: 'hidden',
      maxWidth: '100%', 
      margin: '0 auto', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 80px)' 
    }}>
      
      {/* Embedded CSS for Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }

          @keyframes gradientText {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-fade-up {
            animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            opacity: 0;
          }

          .delay-1 { animation-delay: 0.1s; }
          .delay-2 { animation-delay: 0.2s; }
          .delay-3 { animation-delay: 0.3s; }
          .delay-4 { animation-delay: 0.4s; }

          .animated-gradient-text {
            background: linear-gradient(270deg, #4f46e5, #0284c7, #8b5cf6, #4f46e5);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientText 6s ease infinite;
          }

          .blob {
            position: absolute;
            filter: blur(80px);
            z-index: -1;
            opacity: 0.6;
            animation: float 8s ease-in-out infinite;
          }
        `}
      </style>

      {/* Animated Background Blobs */}
      <div className="blob" style={{
        top: '-10%', left: '10%', width: '400px', height: '400px',
        background: 'rgba(79, 70, 229, 0.15)', borderRadius: '50%',
        animationDelay: '0s'
      }}></div>
      <div className="blob" style={{
        bottom: '10%', right: '10%', width: '500px', height: '500px',
        background: 'rgba(2, 132, 199, 0.12)', borderRadius: '50%',
        animationDelay: '2s'
      }}></div>
      <div className="blob" style={{
        top: '30%', left: '50%', width: '300px', height: '300px',
        background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%',
        transform: 'translateX(-50%)',
        animationDelay: '4s'
      }}></div>

      {/* Sleek Minimalist Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        width: '100%', 
        maxWidth: '900px',
        padding: '40px 24px',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="animate-fade-up delay-1" style={{
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '10px', 
          marginBottom: '24px',
          padding: '8px 20px',
          borderRadius: '30px',
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(79, 70, 229, 0.15)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: '#4f46e5',
            boxShadow: '0 0 10px rgba(79,70,229,0.8)'
          }}></span>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            color: '#4f46e5', 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase' 
          }}>
            Advanced Media Forensics
          </span>
        </div>

        <h1 className="animate-fade-up delay-2" style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          lineHeight: 1.15,
          marginBottom: '24px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)'
        }}>
          Deepfake <span className="animated-gradient-text">Detection</span>
        </h1>

        <p className="animate-fade-up delay-3" style={{
          maxWidth: '680px',
          margin: '0 auto 40px',
          color: 'var(--text-secondary)',
          fontSize: '1.15rem',
          lineHeight: 1.7,
          fontWeight: 400
        }}>
          Uncover the truth behind digital media. Powered by state-of-the-art CNNs and Vision Transformers to seamlessly authenticate portraits with forensic precision.
        </p>

        <div className="animate-fade-up delay-4" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px', 
          flexWrap: 'wrap' 
        }}>
          <Link
            to="/detection"
            className="btn-primary"
            style={{ 
              fontSize: '1.05rem', 
              padding: '16px 36px',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(79, 70, 229, 0.25)',
              transition: 'all 0.3s ease',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Launch Detector
          </Link>
          <Link
            to="/experiments"
            style={{ 
              fontSize: '1.05rem', 
              padding: '16px 36px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              color: 'var(--text-primary)',
              border: '2px solid var(--border-subtle)',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            View Benchmarks
          </Link>
        </div>
      </section>

    </div>
  );
}
