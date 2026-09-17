// components/layout/TopHeader.jsx — Premium AegisNet Command Center Navbar
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore, useAuthStore, useThemeStore, REGIONS } from '../../store/useStore'
import clsx from 'clsx'

export default function TopHeader({ onOpenCommandPalette, onOpenScenarioDrawer }) {
  const location  = useLocation()
  const navigate  = useNavigate()

  const selectedRegion    = useStore((s) => s.selectedRegion)
  const setSelectedRegion = useStore((s) => s.setSelectedRegion)
  const alerts            = useStore((s) => s.alerts)
  const nodes             = useStore((s) => s.nodes)
  const activeScenario    = useStore((s) => s.activeScenario)
  const user              = useAuthStore((s) => s.user)
  const logout            = useAuthStore((s) => s.logout)
  const theme             = useThemeStore((s) => s.theme)
  const toggleTheme       = useThemeStore((s) => s.toggleTheme)

  const [profileOpen, setProfileOpen] = useState(false)
  const profileMenuRef = useRef(null)

  const unackAlertsCount = alerts.filter((a) => !a.acknowledged).length
  const onlineCount      = nodes.filter((n) => n.status === 'online').length
  const totalCount       = nodes.length

  const NAV_LINKS = [
    { to: '/dashboard', label: 'Dashboard',    icon: '⊞'   },
    { to: '/map',       label: 'Live Map',      icon: '◉'  },
    { to: '/history',   label: 'History',       icon: '≡'  },
    { to: '/analysis',  label: 'AI Analysis',   icon: '◈'  },
    { to: '/alerts',    label: 'Alerts',        icon: '◬',  badge: unackAlertsCount },
    { to: '/console',   label: 'Console',       icon: '▸'  },
    { to: '/public',    label: 'Public Portal', icon: '⊕'  },
    { to: '/fleet',     label: 'Fleet',         icon: '◎'  },
    { to: '/settings',  label: 'Settings',      icon: '◌'  },
    { to: '/landing',   label: 'Landing',       icon: '🌐' },
  ]

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setProfileOpen(false)
    }
    function handleEscape(e) { if (e.key === 'Escape') setProfileOpen(false) }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <header className="sticky top-0 z-[1050] select-none w-full">
      {/* ── TOP BAR — Dark Slate & Glassmorphic Brand Strip ──────────────── */}
      <div className="bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="h-[62px] px-4 lg:px-6 flex items-center justify-between gap-3">

          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 text-base tracking-wider">
                  AEGISNET
                </span>
                <span className="bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  SIH26178
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block leading-none mt-0.5 font-medium tracking-wide">
                AI-Powered Edge Environmental Guardian
              </p>
            </div>
          </Link>

          {/* Center Search */}
          <div className="flex-1 max-w-sm mx-3 hidden md:block">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="w-full h-9 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 rounded-full px-4 text-xs text-slate-400 flex items-center justify-between transition-all duration-200 shadow-inner"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">🔍</span>
                <span className="text-slate-400 font-medium">Search nodes, hazards, sensors...</span>
              </div>
              <kbd className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Sim pill */}
            {activeScenario && (
              <button
                type="button"
                onClick={onOpenScenarioDrawer}
                className="h-8 px-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="font-mono uppercase font-bold">{activeScenario}</span>
              </button>
            )}

            {/* Region selector */}
            <div className="hidden lg:flex items-center">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="h-8 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-full px-3 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500/60 transition-all cursor-pointer"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* LoRa status */}
            <div
              className="hidden xl:flex items-center gap-1.5 h-8 px-3 bg-slate-900/90 border border-slate-700 rounded-full text-xs"
              title="LoRa 433/868MHz Mesh Fallback Ready"
            >
              <span className="text-sm">📡</span>
              <span className="text-slate-400 font-medium">Mesh:</span>
              <span className="font-mono font-bold text-emerald-400">433MHz OK</span>
            </div>

            {/* Node count */}
            <div
              className="hidden sm:flex items-center gap-1.5 h-8 px-3 bg-slate-900/90 border border-slate-700 rounded-full text-xs"
              title="Active sentinel nodes"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono font-bold text-slate-100">{onlineCount}/{totalCount}</span>
              <span className="text-slate-400 font-medium hidden md:inline">Online</span>
            </div>

            {/* Alert bell */}
            <Link
              to="/alerts"
              className="relative w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all"
              title="Alert Queue"
            >
              <span className="text-sm">🔔</span>
              {unackAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-mono font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md animate-pulse">
                  {unackAlertsCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 flex items-center justify-center text-sm transition-all hover:scale-105"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Simulate CTA */}
            <button
              type="button"
              onClick={onOpenScenarioDrawer}
              className="h-8 px-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-900/40 hover:scale-105"
            >
              <span>🧪</span>
              <span>Simulate</span>
            </button>

            <div className="h-5 w-px bg-slate-700 mx-0.5" aria-hidden="true" />

            {/* Profile dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                className={clsx(
                  'h-8 px-2.5 flex items-center gap-1.5 rounded-full border transition-all',
                  profileOpen
                    ? 'bg-slate-800 border-blue-500'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700'
                )}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-100 leading-tight">
                    {user?.name?.split(' ').slice(-1)[0] || 'Officer'}
                  </div>
                  <div className="text-[9px] text-slate-400 leading-none">
                    {user?.role?.split(' ')[0] || 'GSDMA'}
                  </div>
                </div>
                <span className={clsx('text-[9px] text-slate-400 transition-transform duration-200', profileOpen && 'rotate-180')}>
                  ▼
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-2.5 text-xs space-y-1 z-50 animate-fade-in">
                  <div className="px-3.5 py-3 bg-gradient-to-br from-blue-50 to-cyan-50/50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-blue-100 dark:border-slate-700 mb-2">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{user?.name || 'Duty Officer'}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">{user?.email || 'officer@gsdma.gov.in'}</div>
                    <span className="inline-block mt-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {user?.role || 'GSDMA Officer'}
                    </span>
                  </div>

                  {[
                    { to: '/settings', icon: '⚙️', label: 'Settings & Threshold Rules' },
                    { to: '/fleet',    icon: '🛰️', label: 'Node Fleet Inventory' },
                    { to: '/public',   icon: '🌐', label: 'Citizen Safety Portal', newTab: true },
                  ].map(({ to, icon, label, newTab }) => (
                    <Link
                      key={to}
                      to={to}
                      target={newTab ? '_blank' : undefined}
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </Link>
                  ))}

                  <div className="border-t border-slate-200 dark:border-slate-800 my-1 mx-1" />

                  <button
                    type="button"
                    onClick={() => { setProfileOpen(false); logout(); navigate('/') }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold transition-colors"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── NAV BAR — Sleek Pill-Tab Navigation (Light / Dark Adaptive) ───── */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="px-4 lg:px-6 flex items-center gap-1 overflow-x-auto h-12 scrollbar-none">
          {NAV_LINKS.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.aliases && item.aliases.includes(location.pathname))

            return (
              <Link
                key={item.to}
                to={item.to}
                className={clsx(
                  'relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                )}
              >
                <span className="text-sm leading-none" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className={clsx(
                    'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full',
                    isActive ? 'bg-white/25 text-white' : 'bg-red-500 text-white animate-pulse'
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}



