import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError('קוד שגוי. נסה שוב.');
        return;
      }

      navigate('/home');
    } catch {
      setError('שגיאה בהתחברות. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container login-container">
        <div className="login-box">
            <div className="crown-logo mb-4">
                <i className="fas fa-crown fa-3x"></i>
            </div>
            <h2 className="text-center mb-4">ברוכים הבאים למשפחת הבלין</h2>
            <p className="text-center text-muted mb-4">רמז: קוד הכניסה בבית של סבא וסבתא</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password" 
                      placeholder="הקישו קוד כניסה" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                      {loading ? 'בודק...' : 'כניסה'}
                    </button>
                </div>
            </form>
            {error && <div id="error-message" className="alert alert-danger mt-3" style={{display: 'block'}}>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Login;

