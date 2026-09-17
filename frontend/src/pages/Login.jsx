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
    <div className="min-h-screen flex font-sans overflow-hidden bg-[#f8fafc] text-slate-900">

      {/* ── LEFT PANEL — Atmospheric Disaster Early Detection Branding (Landing Reference) ────── */}
      <div className="hidden lg:flex lg:w-[50%] bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-indigo-50/70 border-r border-slate-200/90 flex-col justify-between p-12 relative overflow-hidden">

        {/* Ambient early detection glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Brand */}
        <div className="relative z-10 space-y-7">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-500/25">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  AEGISNET
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-800 border border-blue-200/80">
                  SIH26178
                </span>
              </div>
              <div className="text-slate-500 text-[11px] font-mono tracking-widest uppercase mt-0.5">
                Edge-AI Environmental Guardian
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">
              Early Detection for<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Flash Floods</span> &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500">Wildfires</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              Real-time edge telemetry with TinyML on-device inference, LoRa mesh resilience, and multi-agency crisis coordination.
            </p>
          </div>

          {/* Feature pillars */}
          <div className="grid grid-cols-1 gap-3 max-w-md">
            {[
              { icon: '🌊', label: 'Flash Flood Sonic Ranging', sub: 'HC-SR04 sonar with rate-of-rise predictive alert' },
              { icon: '🔥', label: 'Wildfire Thermal & IR Verification', sub: 'Dual flame sensor & temperature co-validation' },
              { icon: '📡', label: `${nodes.length || 5} Edge Sensor Nodes Active`, sub: 'LoRa 433/868MHz self-healing peer mesh' },
              { icon: '⚡', label: '< 200ms On-Device TinyML', sub: 'Zero-cloud dependence during emergency power loss' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] hover:border-blue-300 hover:shadow-[0_15px_35px_-5px_rgba(37,99,235,0.12)] transition-all">
                <span className="text-xl leading-none mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <div className="text-slate-900 text-xs font-bold">{label}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Live grid status */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-blue-200/80 shadow-sm">
            <span className="relative flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
            </span>
            <div>
              <div className="text-blue-700 text-xs font-bold font-mono tracking-wide">LIVE LORA MESH ONLINE</div>
              <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                5 Active Sensor Nodes · 0 Cloud Latency · SIH26178
              </div>
            </div>
          </div>
          <div className="text-slate-400 text-[11px] font-mono">
            Qualcomm Hardware &amp; Edge-AI Track · Smart India Hackathon 2026
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Authentication Form ──────────────────────────────── */}
      <div className="flex-1 bg-[#f8fafc] flex flex-col justify-between">

        {/* Top bar with back button */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors group"
          >
            <span className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 bg-white group-hover:border-blue-500 group-hover:text-blue-600 transition-all shadow-xs">
              ←
            </span>
            <span className="font-bold">Back to Landing Page</span>
          </Link>

          <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-3.5 py-1 rounded-full shadow-xs">
            Command Center
          </span>
        </div>

        {/* Centered form card */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] space-y-6">

            {/* Header */}
            <div className="space-y-1.5 text-center sm:text-left">
              <h1 className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">Agency Sign In</h1>
              <p className="text-slate-500 text-xs sm:text-sm">
                Access real-time GIS monitoring, TinyML telemetry &amp; emergency dispatch.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Role selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Authority Role &amp; Jurisdiction
                </label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer font-medium"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 text-xs">
                    ▾
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="officer@agency.gov.in"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-[11px] text-blue-600 hover:underline font-semibold"
                  >
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 group hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate &amp; Enter Command Center</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Bypass */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDemoBypass}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 text-slate-700 hover:text-blue-700 text-xs font-bold font-mono rounded-full transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <span>⚡</span>
                <span>Quick Demo Access (GSDMA Duty Chief)</span>
              </button>
            </div>

            {/* Public portal link */}
            <div className="text-center pt-1">
              <Link
                to="/public"
                className="text-xs text-slate-500 hover:text-blue-600 font-medium underline underline-offset-4 transition-colors"
              >
                Are you a citizen looking for public safety advisories? Click here →
              </Link>
            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className="px-8 py-4 border-t border-slate-200/80 bg-white/70 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>AegisNet v2.0 · SIH26178</span>
          <span>Offline-First Mesh Gateway</span>
        </div>

      </div>
    </div>
  )
}
