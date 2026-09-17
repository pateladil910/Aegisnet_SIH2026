import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('authority@aegisnet.org');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email is required.'); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('aegisnet_token', data.token);
        localStorage.setItem('aegisnet_user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch {
      // Offline fallback — proceed without token for demo
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { label: 'Admin', email: 'admin@aegisnet.org', badge: 'bg-purple-900/60 text-purple-300 border-purple-700/60' },
    { label: 'Authority', email: 'authority@aegisnet.org', badge: 'bg-blue-900/60 text-blue-300 border-blue-700/60' },
    { label: 'Viewer', email: 'viewer@aegisnet.org', badge: 'bg-slate-800 text-slate-300 border-slate-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          style={{
            position: 'absolute', width: 500, height: 500, borderRadius: '50%',
            background: 'rgba(37,99,235,0.12)', filter: 'blur(100px)',
            top: -120, left: -120,
          }}
        />
        <div
          style={{
            position: 'absolute', width: 400, height: 400, borderRadius: '50%',
            background: 'rgba(124,58,237,0.10)', filter: 'blur(100px)',
            bottom: -80, right: -80,
          }}
        />
        {/* Grid */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(37,99,235,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,.04) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* ── Back to Landing Page ── */}
        <a
          href="/landing.html"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors mb-8 group"
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-700 bg-slate-900/80 group-hover:border-blue-500 group-hover:bg-blue-950/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </span>
          <span>Back to Landing Page</span>
        </a>

        {/* ── Login Card ── */}
        <div
          style={{
            background: 'rgba(15,23,42,0.8)',
            border: '1px solid rgba(30,41,59,0.8)',
            borderRadius: 24,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
          }}
          className="p-8"
        >
          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div
              style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg,#2563eb,#06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', marginBottom: '1rem',
                boxShadow: '0 0 30px rgba(37,99,235,0.4)',
              }}
            >
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">AEGISNET</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Command Operations Portal · SIH26178</p>
          </div>

          {/* Quick Role Presets */}
          <div className="mb-6">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Quick Access — Select Role</p>
            <div className="flex gap-2 flex-wrap">
              {roles.map(r => (
                <button
                  key={r.email}
                  onClick={() => setEmail(r.email)}
                  className={`text-xs px-3 py-1 rounded-full border font-semibold cursor-pointer transition-all ${r.badge} ${email === r.email ? 'ring-1 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="officer@ddma.gov.in"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Password <span className="text-slate-600 font-normal normal-case">(leave blank for demo)</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 pr-11 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-950/60 border border-red-800/60 text-red-300 text-xs rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg,#2563eb,#06b6d4)',
                borderRadius: 12, padding: '0.75rem',
                fontWeight: 700, fontSize: '0.95rem',
                color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 30px rgba(37,99,235,0.35)',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity .2s, transform .2s',
              }}
              onMouseEnter={e => !loading && ((e.target as HTMLButtonElement).style.transform = 'translateY(-2px)')}
              onMouseLeave={e => ((e.target as HTMLButtonElement).style.transform = '')}
            >
              {loading ? 'Authenticating...' : '🚀  Enter Command Dashboard'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-600">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Continue as Public */}
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 rounded-xl border border-slate-700 bg-transparent text-slate-400 text-sm font-semibold hover:border-slate-500 hover:text-slate-200 transition-all"
          >
            🌍  Continue as Public Viewer
          </button>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-600 mt-5">
            AegisNet Disaster Management Platform · Smart India Hackathon 2026
          </p>
        </div>
      </div>
    </div>
  );
};
