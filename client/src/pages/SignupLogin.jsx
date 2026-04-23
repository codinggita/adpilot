import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../store/api/authApi';
import { setCredentials } from '../store/slices/authSlice';

const SignupLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const isLoading = loginLoading || registerLoading;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!isLogin && !formData.name) {
      setError('Please enter your name');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const res = isLogin
        ? await login({ email: formData.email, password: formData.password }).unwrap()
        : await register(formData).unwrap();

      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      navigate('/dashboard');
    } catch (err) {
      setError(err?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#141218', fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#e6e0e9' }}>
      
      {/* ── Left Panel ── */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#0f0d13',
        padding: '48px',
      }}
        className="hidden lg:!flex"
      >
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '25%', left: '25%', width: 320, height: 320, background: '#6750a4', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: 200, height: 200, background: '#3ECF8E', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.08, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 480, width: '100%' }}>
          {/* Logo icon */}
          <div style={{ width: 56, height: 56, margin: '0 auto 32px', borderRadius: 16, background: 'rgba(103,80,164,0.15)', border: '1px solid rgba(207,188,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: '#cfbcff', fontSize: 28, fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>

          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 700, lineHeight: 1.2, color: '#fff', margin: '0 0 16px' }}>
            AI-Powered Google Ads Optimization
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#cbc4d2', margin: '0 0 48px' }}>
            Let AdPilot handle the complexity of Google Ads so you can focus on growing your brand.
          </p>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: 'auto_awesome', label: 'AI Audit', value: '92/100' },
              { icon: 'trending_up', label: 'ROAS Lift', value: '+34%' },
              { icon: 'savings', label: 'Saved', value: '₹42K' },
            ].map((stat, i) => (
              <div key={i} style={{ background: '#211f24', border: '1px solid #494551', borderRadius: 12, padding: '16px 12px', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#cfbcff', fontSize: 20, display: 'block', marginBottom: 8 }}>{stat.icon}</span>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 600, color: '#fff' }}>{stat.value}</div>
                <div style={{ fontFamily: "'Source Code Pro', monospace", fontSize: 10, letterSpacing: '1.2px', color: '#cbc4d2', marginTop: 4, textTransform: 'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 48px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', width: 400, height: 400, background: '#6750a4', opacity: 0.03, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        
        <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#6750a4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: '#e0d2ff', fontSize: 20, fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>AdPilot AI</span>
          </div>

          {/* Title */}
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: '#cbc4d2', margin: '0 0 32px' }}>
            {isLogin ? 'Sign in to your AdPilot dashboard.' : 'Start optimizing your Google Ads today.'}
          </p>

          {/* Google OAuth */}
          <button
            type="button"
            style={{ width: '100%', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#211f24', border: '1px solid #494551', borderRadius: 12, color: '#e6e0e9', fontWeight: 500, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#948e9c'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#494551'}
          >
            <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
              <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" fill="#4285F4" />
              <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" fill="#34A853" />
              <path d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" fill="#FBBC05" />
              <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#494551' }} />
            <span style={{ fontFamily: "'Source Code Pro', monospace", fontSize: 11, letterSpacing: '1.2px', color: '#cbc4d2' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#494551' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontFamily: "'Source Code Pro', monospace", fontSize: 11, letterSpacing: '1.2px', color: '#cbc4d2', marginBottom: 8, textTransform: 'uppercase' }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={{ width: '100%', height: 48, background: '#211f24', border: '1px solid #494551', borderRadius: 12, padding: '0 16px', color: '#e6e0e9', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#cfbcff'}
                  onBlur={e => e.target.style.borderColor = '#494551'}
                />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontFamily: "'Source Code Pro', monospace", fontSize: 11, letterSpacing: '1.2px', color: '#cbc4d2', marginBottom: 8, textTransform: 'uppercase' }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@brand.com"
                style={{ width: '100%', height: 48, background: '#211f24', border: '1px solid #494551', borderRadius: 12, padding: '0 16px', color: '#e6e0e9', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#cfbcff'}
                onBlur={e => e.target.style.borderColor = '#494551'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Source Code Pro', monospace", fontSize: 11, letterSpacing: '1.2px', color: '#cbc4d2', marginBottom: 8, textTransform: 'uppercase' }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                style={{ width: '100%', height: 48, background: '#211f24', border: '1px solid #494551', borderRadius: 12, padding: '0 16px', color: '#e6e0e9', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#cfbcff'}
                onBlur={e => e.target.style.borderColor = '#494551'}
              />
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: 'rgba(147,0,10,0.15)', border: '1px solid rgba(255,180,171,0.3)', borderRadius: 8 }}>
                <span className="material-symbols-outlined" style={{ color: '#ffb4ab', fontSize: 18 }}>error</span>
                <span style={{ color: '#ffb4ab', fontSize: 13 }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: 48,
                background: '#cfbcff',
                color: '#381e72',
                fontWeight: 600,
                fontSize: 14,
                border: 'none',
                borderRadius: 9999,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 8,
                opacity: isLoading ? 0.5 : 1,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              {isLoading ? (
                <div style={{ width: 20, height: 20, border: '2px solid #381e72', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p style={{ textAlign: 'center', color: '#cbc4d2', marginTop: 24 }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({ name: '', email: '', password: '' }); }}
              style={{ background: 'none', border: 'none', color: '#cfbcff', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, textDecoration: 'underline', textUnderlineOffset: 2 }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default SignupLogin;
