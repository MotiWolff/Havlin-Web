import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('loading'); // loading | authed | unauthed

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/.netlify/functions/auth-check', {
          method: 'GET',
          credentials: 'include',
        });
        if (!alive) return;
        setStatus(res.ok ? 'authed' : 'unauthed');
      } catch {
        if (!alive) return;
        setStatus('unauthed');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="container text-center" style={{ padding: '4rem 1rem' }}>
        טוען...
      </div>
    );
  }

  if (status !== 'authed') return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;

