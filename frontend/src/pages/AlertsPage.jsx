// pages/AlertsPage.jsx — Immediate Warnings, GSDMA Triage Queue & Audit Acknowledgment
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, SENSOR_CATEGORIES } from '../store/useStore'
import clsx from 'clsx'

const SEVERITY_TABS = ['All', 'Emergency', 'Warning', 'Watch', 'Advisory', 'Resolved']

export default function AlertsPage() {
  const navigate = useNavigate()
  const alerts = useStore((s) => s.alerts)
  const acknowledgeAlert = useStore((s) => s.acknowledgeAlert)
  const [activeTab, setActiveTab] = useState('All')
  const [selectedAlertForAck, setSelectedAlertForAck] = useState(null)
  const [officerName, setOfficerName] = useState('Officer K. Patel (GSDMA)')

  // Filter alerts by tab
  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'All') return true
    if (activeTab === 'Resolved') return a.acknowledged
    return a.severity.toLowerCase() === activeTab.toLowerCase()
  })

  const unackCount = alerts.filter((a) => !a.acknowledged).length

  const handleConfirmAck = () => {
    if (!selectedAlertForAck) return
    acknowledgeAlert(selectedAlertForAck.id, officerName)
    setSelectedAlertForAck(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6 font-sans">
      {/* ─── Header Strip ─────────────────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-sm">
            🚨
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Immediate Warnings & <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">Alerts Queue</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Action-oriented triage queue for multi-channel hazard incidents & GSDMA escalation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-2xl text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400">Pending Acknowledgment:</span>{' '}
            <b className={clsx(unackCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>
              {unackCount} incidents
            </b>
          </div>
        </div>
      </div>

      {/* ─── Severity Filter Tabs ───────────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
        {SEVERITY_TABS.map((tab) => {
          const count =
            tab === 'All'
              ? alerts.length
              : tab === 'Resolved'
              ? alerts.filter((a) => a.acknowledged).length
              : alerts.filter((a) => a.severity.toLowerCase() === tab.toLowerCase()).length

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'px-4 py-2 rounded-full transition-all font-medium flex items-center gap-2 whitespace-nowrap',
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <span>{tab}</span>
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold',
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ─── Alerts Incident List ───────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <span className="text-3xl block mb-2 text-emerald-600 dark:text-emerald-400">✓</span>
            <div className="font-bold text-slate-900 dark:text-white text-base">No Active Incidents in Category</div>
            <p>All environmental telemetry streams operating within seasonal thresholds.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isEmergency = alert.severity === 'emergency'
            const isWarning = alert.severity === 'warning'
            const catInfo = SENSOR_CATEGORIES.find((c) => c.id === alert.category)

            return (
              <div
                key={alert.id}
                className={clsx(
                  'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm transition-all border space-y-4',
                  isEmergency
                    ? 'border-l-4 border-l-red-500 border-t-slate-200 dark:border-t-slate-800 border-r-slate-200 dark:border-r-slate-800 border-b-slate-200 dark:border-b-slate-800'
                    : isWarning
                    ? 'border-l-4 border-l-amber-500 border-t-slate-200 dark:border-t-slate-800 border-r-slate-200 dark:border-r-slate-800 border-b-slate-200 dark:border-b-slate-800'
                    : 'border-slate-200/80 dark:border-slate-800'
                )}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80">{catInfo?.icon || '🚨'}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{alert.id}</span>
                        <span
                          className={clsx(
                            'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase',
                            isEmergency
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                              : isWarning
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          )}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Confidence: <b className="text-blue-600 dark:text-cyan-400">{alert.confidence_pct}%</b>
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">{alert.title}</h2>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs font-mono text-slate-500 dark:text-slate-400">
                    <div>Detected: <b className="text-slate-700 dark:text-slate-300">{alert.timestamp}</b></div>
                    <div className="text-[11px] text-blue-600 dark:text-cyan-400 font-semibold">
                      Correlated: {alert.correlated_nodes} Nodes
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">Affected Landmark</span>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{alert.location}</div>
                    <div className="text-[11px] text-blue-600 dark:text-cyan-400 font-mono">{alert.landmark_tag}</div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl space-y-1 md:col-span-2">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">Root Cause Analysis</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{alert.root_cause}</p>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>Dispatch Status:</span>
                    <b className="text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-[11px]">
                      {alert.dispatch_status || 'Delivered'}
                    </b>
                    {alert.acknowledged_by && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        (Verified by {alert.acknowledged_by})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {!alert.acknowledged ? (
                      <button
                        onClick={() => setSelectedAlertForAck(alert)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-mono font-bold px-4 py-2 rounded-full transition-all shadow-md shadow-blue-500/20"
                      >
                        ✓ Acknowledge Alert
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
                        ✓ Acknowledged
                      </span>
                    )}

                    <button
                      onClick={() => navigate('/console')}
                      className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-mono font-bold px-4 py-2 rounded-full transition-all shadow-sm"
                    >
                      Open Command Console →
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ─── Acknowledgment Audit Modal ─────────────────────────────────── */}
      {selectedAlertForAck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Incident Acknowledgment Audit</h3>
              <button onClick={() => setSelectedAlertForAck(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Acknowledging logs your official ID to the GSDMA immutable incident register and silences acoustic siren queues.
            </p>

            <div className="space-y-2 text-xs">
              <label className="text-slate-600 dark:text-slate-300 font-mono block font-bold">Duty Officer Credential</label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleConfirmAck}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-2.5 rounded-full text-xs font-mono shadow-md shadow-blue-500/20 transition-all"
              >
                Confirm Acknowledgment
              </button>
              <button
                onClick={() => setSelectedAlertForAck(null)}
                className="px-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-mono border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
