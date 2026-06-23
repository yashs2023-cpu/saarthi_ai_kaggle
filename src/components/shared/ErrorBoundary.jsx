import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Saarthi Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', maxWidth: 500, margin: '100px auto' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🙏</div>
          <h2 style={{ color: '#800020', marginBottom: 12, fontSize: 24, fontWeight: 700 }}>
            Kuch gadbad ho gayi...
          </h2>
          <p style={{ color: '#6B7280', marginBottom: 8, fontSize: 15, lineHeight: 1.6 }}>
            Something went wrong. Please refresh the page and try again.
          </p>
          {this.state.error && (
            <details style={{ marginBottom: 20, textAlign: 'left', background: '#F9FAFB', borderRadius: 8, padding: '8px 14px' }}>
              <summary style={{ fontSize: 12, color: '#9CA3AF', cursor: 'pointer' }}>Error details</summary>
              <pre style={{ fontSize: 11, color: '#EF4444', marginTop: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #800020, #6B0F2A)',
              color: '#fff', border: 'none', padding: '12px 32px',
              borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(128,0,32,0.3)',
            }}
          >
            🔄 Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
