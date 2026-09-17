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

      {/* ── CINEMATIC SYSTEM DETECTION & RESCUE THEMED BACKGROUND PHOTO ── */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/login-rescue-bg.jpg')",
          backgroundPosition: 'center 38%',
        }}
      />

      {/* Subtle atmospheric vignette so the artwork shines through vibrantly */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-slate-950/45 via-transparent to-slate-950/45" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30" />

      {/* ── TOP BAR: Clean Minimal Floating Back Navigation ── */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/50 hover:bg-slate-900/75 border border-white/20 hover:border-white/40 text-xs font-semibold text-white transition-all group backdrop-blur-md shadow-lg"
        >
          <span className="w-6 h-6 rounded-full flex items-center justify-center bg-white/15 text-white group-hover:-translate-x-0.5 transition-transform font-bold text-xs">
            ←
          </span>
          <span>Back to Landing Page</span>
        </Link>
      </header>

      {/* ── MAIN VIEWPORT: Minimalist Brand on Left & Transparent Glass Login Box on Right ── */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 py-4 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

        {/* ── LEFT SIDE: Minimalist Brand Title (Zero Clutter) ── */}
        <div className="hidden lg:flex flex-col justify-end max-w-lg mb-6 space-y-3.5">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/55 backdrop-blur-md border border-white/20 text-white shadow-lg w-fit">
            <span className="text-base">🛡️</span>
            <span className="text-xs font-bold font-mono tracking-widest uppercase text-cyan-300">
              AegisNet Command Gateway
            </span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            Detecting Disasters &amp; Saving Lives in Real Time
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] max-w-md">
            Edge-AI telemetry alerting rescue agencies ahead of flash floods and wildfires, safeguarding Gujarat State.
          </p>
        </div>

        {/* ── RIGHT SIDE: Premium Transparent Frosted Glass Sign-In Card ── */}
        <div className="w-full sm:max-w-md lg:max-w-[420px] mx-auto lg:mx-0 my-auto">
          <div className="w-full bg-slate-950/45 hover:bg-slate-950/50 backdrop-blur-2xl border border-white/20 hover:border-white/30 rounded-3xl p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] space-y-6 transition-colors">

            {/* Header */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-300 bg-cyan-500/20 border border-cyan-400/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  Agency Sign In
                </span>
                <span className="text-[10px] font-mono text-slate-300">
                  TLS 1.3 / AES-256
                </span>
              </div>
              <h2 className="text-white text-2xl font-extrabold tracking-tight pt-1 drop-shadow-sm">
                Command Center Access
              </h2>
              <p className="text-slate-200 text-xs font-medium">
                Enter your official credentials to access real-time dispatch.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Role selector */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Authority Role &amp; Jurisdiction
                </label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/20 rounded-2xl px-4 py-3 text-xs text-white font-semibold focus:bg-slate-900/85 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer shadow-inner backdrop-blur-md"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value} className="bg-slate-900 text-white">
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-300 text-xs font-bold">
                    ▾
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="officer@agency.gov.in"
                  className="w-full bg-slate-900/60 border border-white/20 rounded-2xl px-4 py-3 text-xs text-white font-semibold placeholder-slate-400 focus:bg-slate-900/85 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner backdrop-blur-md"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-[11px] text-cyan-300 hover:text-cyan-200 font-bold transition-colors cursor-pointer"
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
                  className="w-full bg-slate-900/60 border border-white/20 rounded-2xl px-4 py-3 text-xs text-white font-semibold placeholder-slate-400 focus:bg-slate-900/85 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner backdrop-blur-md"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-200 flex items-center justify-center gap-2 group hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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
            <div className="pt-2 border-t border-white/15">
              <button
                type="button"
                onClick={handleDemoBypass}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-cyan-400/40 text-white text-xs font-bold font-mono rounded-full transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer backdrop-blur-md"
              >
                <span>⚡</span>
                <span>Quick Demo Access (GSDMA Duty Chief)</span>
              </button>
            </div>

            {/* Public citizen advisory link */}
            <div className="text-center pt-1">
              <Link
                to="/public"
                className="text-xs text-slate-300 hover:text-cyan-300 font-medium underline underline-offset-4 transition-colors"
              >
                Are you a citizen? View public disaster advisories →
              </Link>
            </div>

          </div>
        </div>

      </main>

    </div>
  )
}
