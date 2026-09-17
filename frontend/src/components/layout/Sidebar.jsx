// components/layout/Sidebar.jsx — Rebuilt Command Center Sidebar with Clean Design Tokens & Semantic Navigation
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import clsx from 'clsx'

export default function Sidebar({ onOpenScenarioDrawer }) {
  const location = useLocation()
  const collapsed = useStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useStore((s) => s.toggleSidebar)
  const alerts = useStore((s) => s.alerts)

  const unackAlertsCount = alerts.filter((a) => !a.acknowledged).length

  const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠', aliases: ['/'] },
    { to: '/map', label: 'Live Regional Map', icon: '🗺️' },
    { to: '/history', label: 'History & Reports', icon: '📜' },
    { to: '/analysis', label: 'AI Analysis', icon: '🧠' },
    { to: '/alerts', label: 'Alerts Queue', icon: '🚨', badge: unackAlertsCount },
    { to: '/console', label: 'Command Console', icon: '🎛️' },
    { to: '/public', label: 'Public Portal', icon: '🌐' },
    { to: '/fleet', label: 'Node Fleet', icon: '🛰️' },
    { to: '/settings', label: 'Settings & Admin', icon: '⚙️' },
  ]

  return (
    <aside
      className={clsx(
        'fixed left-0 top-16 bottom-0 z-30 bg-white border-r border-surface-muted flex flex-col justify-between transition-all duration-200 shadow-card select-none',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* ─── Top Navigation Items ────────────────────────────────────────── */}
      <nav aria-label="Main Navigation" className="py-3 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.aliases && item.aliases.includes(location.pathname))

          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={clsx(
                'flex items-center gap-3 px-3 h-9 rounded-control text-xs font-medium transition-colors group relative',
                isActive
                  ? 'bg-brand-subtle text-brand-primary font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
              )}
            >
              {/* Left Active Accent Bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-brand-primary rounded-r-full"
                  aria-hidden="true"
                />
              )}

              {/* Icon */}
              <span className="text-sm flex-shrink-0" aria-hidden="true">
                {item.icon}
              </span>

              {/* Label in clean sans-serif */}
              {!collapsed && (
                <span className="truncate flex-1 font-sans font-medium">{item.label}</span>
              )}

              {/* Badges in full pill radius */}
              {!collapsed && item.badge > 0 && (
                <span className="bg-alert-critical text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}

        {/* Semantic Divider */}
        <div className="pt-2 my-1 border-t border-surface-muted" />

        {/* Clean, Dignified Scenario Simulator Entry (No jarring yellow highlight) */}
        <button
          type="button"
          onClick={onOpenScenarioDrawer}
          title={collapsed ? 'Scenario Simulator' : undefined}
          className={clsx(
            'w-full flex items-center gap-3 px-3 h-9 rounded-control text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <span className="text-sm flex-shrink-0" aria-hidden="true">🧪</span>
          {!collapsed && <span className="truncate font-sans font-medium">Scenario Simulator</span>}
        </button>
      </nav>

      {/* ─── Bottom Collapse Toggle ───────────────────────────────────────── */}
      <div className="p-2 border-t border-surface-muted bg-surface-subtle">
        <button
          type="button"
          onClick={toggleSidebar}
          className="w-full h-8 flex items-center justify-center text-xs font-sans text-text-muted hover:text-text-primary hover:bg-white rounded-control border border-transparent hover:border-surface-strong transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span>{collapsed ? '▶' : '◀ Collapse Sidebar'}</span>
        </button>
      </div>
    </aside>
  )
}
