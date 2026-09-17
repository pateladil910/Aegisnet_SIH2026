// components/overlays/CommandPalette.jsx — Global Quick Jump & Search (Ctrl+K / Cmd+K)
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const nodes = useStore((s) => s.nodes)
  const alerts = useStore((s) => s.alerts)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const matchingNodes = nodes.filter(
    (n) =>
      n.name.toLowerCase().includes(query.toLowerCase()) ||
      n.node_id.toLowerCase().includes(query.toLowerCase()) ||
      n.location.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  const matchingAlerts = alerts.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.location.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3)

  const QUICK_PAGES = [
    { title: 'Dashboard', icon: '🏠', path: '/dashboard', desc: 'Situational awareness command center' },
    { title: 'Live Regional Map', icon: '🗺️', path: '/map', desc: 'Geographic risk & sensor mesh' },
    { title: 'Agency Command Console', icon: '🎛️', path: '/console', desc: 'Multi-agency dispatch board' },
    { title: 'Public Citizen Portal', icon: '🌐', path: '/public', desc: 'Public safety verified advisories' },
    { title: 'AI Environmental Analysis', icon: '🧠', path: '/analysis', desc: 'Edge model confidence & correlation' },
    { title: 'Alerts Triage Queue', icon: '🚨', path: '/alerts', desc: 'Immediate warnings and escalations' },
    { title: 'Node Fleet Provisioning', icon: '🛰️', path: '/fleet', desc: 'Manage hardware & sensors' },
    { title: 'System Settings', icon: '⚙️', path: '/settings', desc: 'Thresholds & dispatch rules' },
  ]

  const matchingPages = QUICK_PAGES.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.desc.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (path) => {
    onClose()
    setQuery('')
    navigate(path)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-xs">
        {/* Search input header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/80 dark:bg-slate-800/60">
          <span className="text-base text-blue-600 dark:text-cyan-400">🔍</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search command, sensor ID (e.g. NODE-01), or page..."
            className="flex-1 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none bg-transparent font-medium"
          />
          <kbd className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-300 font-bold shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3">
          {/* Quick Pages */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-2 py-1">
              Navigation Pages
            </div>
            <div className="space-y-1">
              {matchingPages.map((p) => (
                <button
                  type="button"
                  key={p.path}
                  onClick={() => handleSelect(p.path)}
                  className="w-full px-3 py-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-3 text-left transition-colors"
                >
                  <span className="text-lg" aria-hidden="true">{p.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 dark:text-white">{p.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{p.desc}</div>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-cyan-400 font-bold font-mono">Jump →</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Nodes */}
          {matchingNodes.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-2 py-1">
                Sensor Nodes
              </div>
              <div className="space-y-1">
                {matchingNodes.map((n) => (
                  <button
                    type="button"
                    key={n.node_id}
                    onClick={() => handleSelect(`/nodes/${n.node_id}`)}
                    className="w-full px-3 py-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="font-mono text-blue-600 dark:text-cyan-400">📡 {n.node_id}</span>
                        <span className="text-[11px] font-normal text-slate-600 dark:text-slate-300">{n.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-sm">{n.location}</div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      Spec →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Incidents */}
          {matchingAlerts.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-2 py-1">
                Active Alerts
              </div>
              <div className="space-y-1">
                {matchingAlerts.map((a) => (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => handleSelect('/alerts')}
                    className="w-full px-3 py-2.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-between text-left transition-colors"
                  >
                    <div>
                      <div className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <span>🚨</span>
                        <span>{a.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{a.location}</div>
                    </div>
                    <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-red-600 text-white font-bold">
                      Triage
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
