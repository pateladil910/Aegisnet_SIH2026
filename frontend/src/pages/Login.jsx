// pages/Login.jsx — AegisNet Command Gateway · Full-Screen Auth · Sleek Rounded UI
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore, useStore } from '../store/useStore'

const ROLES = [
  { value: 'GSDMA Officer',        label: 'GSDMA State Disaster Officer' },
  { value: 'Municipal Officer',    label: 'Municipal Environmental Cell (AMC/SMC)' },
  { value: 'Fire Dept Officer',    label: 'Fire & Emergency Services (101)' },
  { value: 'Police Control',       label: 'Gujarat Police Control (100)' },
  { value: 'Super Admin',          label: 'Command Super Admin' },
]

export default function Login() {
  const navigate = useNavigate()
  const setAuth   = useAuthStore((s) => s.setAuth)
  const nodes     = useStore((s)    => s.nodes)

  const [email,        setEmail]        = useState('officer.patel@gsdma.gov.in')
  const [password,     setPassword]     = useState('demo1234')
  const [selectedRole, setSelectedRole] = useState('GSDMA Officer')
  const [showPass,     setShowPass]     = useState(false)
  const [loading,      setLoading]      = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setAuth(
        {
          id: 1,
          name: 'Officer K. Patel',
          email,
          role: selectedRole,
          agency: 'Gujarat State Disaster Management Authority',
        },
        'demo-jwt-token'
      )
      navigate('/dashboard')
    }, 800)
  }

  const handleDemoBypass = () => {
    setLoading(true)
    setTimeout(() => {
      setAuth(
        {
          id: 1,
          name: 'Duty Chief (GSDMA)',
          email: 'authority@aegisnet.local',
          role: 'GSDMA Officer',
          agency: 'State Emergency Operation Center (SEOC)',
        },
        'demo-jwt-token'
      )
      navigate('/dashboard')
    }, 400)
  }

  return (
    <div className="min-h-screen flex font-sans overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* ── LEFT PANEL — Atmospheric Disaster Early Detection Branding ────── */}
      <div className="hidden lg:flex lg:w-[50%] bg-slate-950 flex-col justify-between p-12 relative overflow-hidden">

        {/* Ambient early detection glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Brand */}
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-2xl shadow-xl shadow-blue-500/30">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  AEGISNET
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  SIH26178
                </span>
              </div>
              <div className="text-slate-400 text-[11px] font-mono tracking-widest uppercase mt-0.5">
                Edge-AI Environmental Guardian
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-white text-3xl font-extrabold leading-tight tracking-tight">
              Early Detection for<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Flash Floods</span> &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Wildfires</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Real-time edge telemetry with TinyML on-device inference, LoRa mesh resilience, and multi-agency crisis coordination.
            </p>
          </div>

          {/* Feature pillars */}
          <div className="grid grid-cols-1 gap-3.5 max-w-md">
            {[
              { icon: '🌊', label: 'Flash Flood Sonic Ranging', sub: 'HC-SR04 sonar with rate-of-rise predictive alert' },
              { icon: '🔥', label: 'Wildfire Thermal & IR Verification', sub: 'Dual flame sensor & temperature co-validation' },
              { icon: '📡', label: `${nodes.length || 5} Edge Sensor Nodes Active`, sub: 'LoRa 433/868MHz self-healing peer mesh' },
              { icon: '⚡', label: '< 200ms On-Device TinyML', sub: 'Zero-cloud dependence during emergency power loss' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md hover:border-blue-500/40 transition-colors">
                <span className="text-xl leading-none mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <div className="text-white text-xs font-bold">{label}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Live grid status */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 backdrop-blur-md">
            <span className="relative flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
            </span>
            <div>
              <div className="text-cyan-300 text-xs font-bold font-mono tracking-wide">LIVE LORA MESH ONLINE</div>
              <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                5 Active Sensor Nodes · 0 Cloud Latency · SIH26178
              </div>
            </div>
          </div>
          <div className="text-slate-500 text-[11px] font-mono">
            Qualcomm Hardware &amp; Edge-AI Track · Smart India Hackathon 2026
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Authentication Form ──────────────────────────────── */}
      <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col justify-between transition-colors duration-300">

        {/* Top bar with back button */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800/80">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors group"
          >
            <span className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 group-hover:border-blue-500 transition-all shadow-sm">
              ←
            </span>
            <span>Back to Landing Page</span>
          </Link>

          <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 px-2.5 py-1 rounded-full">
            Command Center
          </span>
        </div>

        {/* Centered form card */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md space-y-6">

            {/* Header */}
            <div className="space-y-1.5">
              <h1 className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">Agency Sign In</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Access real-time GIS monitoring, TinyML telemetry &amp; emergency dispatch.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Official Email / User ID
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@gsdma.gov.in"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Security Passcode / Key
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 pr-12 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-base leading-none transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Designated Agency Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                >
                  {ROLES.map(({ value, label }) => (
                    <option key={value} value={value} className="dark:bg-slate-800">{label}</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-70 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Authenticating…
                  </>
                ) : (
                  'Authenticate & Launch Operations →'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-slate-400 text-xs font-medium">or</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Demo bypass */}
            <div className="space-y-3">
              <button
                onClick={handleDemoBypass}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800/80 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-cyan-300 font-bold py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 hover:scale-[1.01]"
              >
                <span>🚀</span>
                <span>Enter Instant Demo Mode (1-Click Access)</span>
              </button>

              <div className="text-center">
                <Link
                  to="/public"
                  className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline underline-offset-2 transition-colors"
                >
                  View Public Citizen Portal — No Sign In Required →
                </Link>
              </div>
            </div>

            {/* Security notice */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <span className="text-base flex-shrink-0 mt-0.5">🔒</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                256-bit encrypted authentication. Dedicated to authorized GSDMA, NDRF, Emergency Fire, and State Disaster Response teams.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="px-8 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-slate-400 dark:text-slate-500 text-[11px] font-mono">
          <span>AegisNet v2.0 · SIH26178</span>
          <span>© 2026 GSDMA Sentinel Network</span>
        </div>
      </div>
    </div>
  )
}


