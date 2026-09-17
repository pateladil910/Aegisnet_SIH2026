// pages/Login.jsx — AegisNet Command Gateway · Disaster Detection Photo BG & Frosted Glass Auth
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
    }, 700)
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
    }, 350)
  }

  return (
    <div className="relative min-h-screen font-sans overflow-hidden bg-slate-950 flex flex-col justify-between">

      {/* ── ATMOSPHERIC DISASTER EARLY DETECTION BACKGROUND PHOTO ── */}
      <div
        className="absolute -inset-4 bg-cover bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/hero-disaster-bg.jpg')",
          backgroundPosition: 'center 22%',
          filter: 'blur(2.5px) saturate(1.2) contrast(1.05)',
          transform: 'scale(1.03)',
          opacity: 0.72,
        }}
      />

      {/* Dynamic light veil overlay so photo is clearly visible yet high-contrast for text */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/80 via-white/50 to-sky-100/60"
        style={{
          backdropFilter: 'blur(1px)',
        }}
      />

      {/* Ambient disaster telemetry subtle glow orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* ── TOP HEADER / FLOATING NAVIGATION ────────────────────────── */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/85 hover:bg-white border border-slate-200/80 shadow-sm hover:shadow-md text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all group backdrop-blur-md"
        >
          <span className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 group-hover:-translate-x-0.5 transition-transform font-bold text-xs">
            ←
          </span>
          <span>Back to Landing Page</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-3.5 py-1 rounded-full shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Grid Operational
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono font-bold text-blue-800 bg-blue-50/90 border border-blue-200/80 px-3 py-1 rounded-full shadow-xs backdrop-blur-md">
            SIH26178
          </span>
        </div>
      </header>

      {/* ── MAIN CONTENT: LEFT BRAND/TELEMETRY & RIGHT LOGIN CARD ──── */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 sm:px-10 py-4 lg:py-8 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">

        {/* ── LEFT COLUMN: Disaster Detection Identity & Telemetry Pillars ── */}
        <div className="w-full lg:w-[54%] space-y-6">

          {/* Brand header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 p-2 pr-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/90 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-md shadow-blue-500/25">
                🛡️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-wider text-slate-900">
                    AEGIS<span className="text-blue-600">NET</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100/90 text-blue-800 border border-blue-200">
                    COMMAND
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] font-mono tracking-wider uppercase font-semibold">
                  Autonomous Disaster Early-Warning Network
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Real-Time Early Detection for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600 drop-shadow-xs">
                Flash Floods
              </span>{' '}
              &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-orange-600 to-amber-600 drop-shadow-xs">
                Wildfires
              </span>
            </h1>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium max-w-xl">
              Zero-cloud dependent edge computing with TinyML on-device inference, LoRa mesh resilience, and multi-agency crisis coordination for Gujarat State.
            </p>
          </div>

          {/* Frosted Feature Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl">
            {[
              {
                icon: '🌊',
                label: 'Flash Flood Sonic Ranging',
                sub: 'HC-SR04 sonar with rate-of-rise predictive alert algorithm',
                tag: 'Early Warning',
              },
              {
                icon: '🔥',
                label: 'Wildfire Thermal & IR Verification',
                sub: 'Dual flame sensor & temperature differential co-validation',
                tag: 'Multi-Spectral',
              },
              {
                icon: '📡',
                label: `${nodes.length || 5} Active Sensor Nodes`,
                sub: 'LoRa 433/868MHz self-healing peer-to-peer mesh topology',
                tag: 'Mesh Network',
              },
              {
                icon: '⚡',
                label: '< 200ms On-Device TinyML',
                sub: 'Instant localized edge inference during total grid outage',
                tag: 'Zero Cloud',
              },
            ].map(({ icon, label, sub, tag }) => (
              <div
                key={label}
                className="p-4 rounded-2xl bg-white/85 hover:bg-white/95 backdrop-blur-md border border-white/80 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_30px_-5px_rgba(37,99,235,0.15)] hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl leading-none">{icon}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {tag}
                  </span>
                </div>
                <div className="text-slate-900 text-xs font-bold group-hover:text-blue-700 transition-colors">
                  {label}
                </div>
                <div className="text-slate-600 text-[11px] mt-1 leading-snug font-medium">
                  {sub}
                </div>
              </div>
            ))}
          </div>

          {/* Live LoRa Status Strip */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-blue-200/80 shadow-sm max-w-xl">
            <span className="relative flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-blue-900 text-xs font-bold font-mono tracking-wide flex items-center gap-2">
                <span>LIVE LORA MESH PROTOCOL CONNECTED</span>
                <span className="text-[10px] font-normal px-2 py-0.2 rounded bg-blue-100/70 text-blue-800">433 MHz</span>
              </div>
              <div className="text-slate-600 text-[11px] font-mono truncate">
                Sub-GHz Long Range · 0 Cloud Latency · Failover Enabled
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Premier Frosted Glass Sign In Card ─────────── */}
        <div className="w-full lg:w-[440px] flex-shrink-0">
          <div className="w-full bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl p-7 sm:p-9 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.22)] space-y-6">

            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-blue-700 bg-blue-50/90 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
                  Secure Access Gateway
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  TLS 1.3 / AES-256
                </span>
              </div>
              <h2 className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
                Agency Sign In
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                Access real-time GIS threat mapping, TinyML telemetry &amp; multi-agency emergency dispatch.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Role selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Authority Role &amp; Jurisdiction
                </label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-slate-50/90 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 transition-all appearance-none cursor-pointer shadow-xs"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 text-xs font-bold">
                    ▾
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="officer@agency.gov.in"
                  className="w-full bg-slate-50/90 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 transition-all shadow-xs"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-bold transition-colors"
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
                  className="w-full bg-slate-50/90 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-semibold placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 transition-all shadow-xs"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 flex items-center justify-center gap-2 group hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Authority Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate &amp; Enter Command Center</span>
                    <span className="group-hover:translate-x-1 transition-transform text-sm">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Bypass */}
            <div className="pt-2 border-t border-slate-200/80">
              <button
                type="button"
                onClick={handleDemoBypass}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-bold font-mono rounded-full transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>⚡</span>
                <span>Quick Demo Access (GSDMA Duty Chief)</span>
              </button>
            </div>

            {/* Public citizen advisory link */}
            <div className="text-center pt-1">
              <Link
                to="/public"
                className="text-xs text-slate-600 hover:text-blue-600 font-semibold underline underline-offset-4 transition-colors"
              >
                Are you a citizen? View public disaster advisories →
              </Link>
            </div>

          </div>
        </div>

      </main>

      {/* ── FOOTER BAR ─────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full px-6 sm:px-12 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600 font-mono border-t border-white/60 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800">AegisNet v2.0</span>
          <span>·</span>
          <span>Qualcomm Hardware &amp; Edge-AI Track</span>
          <span>·</span>
          <span className="text-blue-700 font-bold">SIH26178</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>Gujarat State Disaster Management Authority</span>
          <span>·</span>
          <span>Offline Mesh Active</span>
        </div>
      </footer>

    </div>
  )
}
