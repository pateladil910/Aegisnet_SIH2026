// pages/Dashboard.jsx — AegisNet Command Operations Dashboard · Sleek Modern Rounded UI
import { Link, useNavigate } from 'react-router-dom'
import { useStore, SENSOR_CATEGORIES } from '../store/useStore'
import RiskMap from '../components/map/RiskMap'
import clsx from 'clsx'

export default function Dashboard() {
  const navigate       = useNavigate()
  const nodes          = useStore((s) => s.nodes)
  const alerts         = useStore((s) => s.alerts)
  const dispatches     = useStore((s) => s.dispatches)
  const selectedRegion = useStore((s) => s.selectedRegion)

  const onlineCount     = nodes.filter((n) => n.status === 'online').length
  const totalCount      = nodes.length
  const activeAlerts    = alerts.filter((a) => !a.acknowledged)
  const emergencyAlerts = alerts.filter((a) => a.severity === 'emergency' || a.severity === 'warning')

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6 font-sans animate-slide-up">

      {/* ─── 1. Hero Metric Strip (Landing Page Aesthetic, Curved 3XL) ───────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Alert count card */}
        <div className={clsx(
          'rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] hover:shadow-[0_15px_35px_-5px_rgba(37,99,235,0.12)] hover:-translate-y-0.5',
          activeAlerts.length > 0
            ? 'bg-gradient-to-br from-rose-50/90 to-red-50/70 border-2 border-red-300'
            : 'bg-white border border-slate-200/90 hover:border-blue-300'
        )}>
          <div className="flex items-center justify-between">
            <span className={clsx(
              'text-[10px] font-extrabold tracking-widest uppercase',
              activeAlerts.length > 0 ? 'text-red-700' : 'text-slate-500'
            )}>Critical Alerts</span>
            {activeAlerts.length > 0 ? (
              <span className="bg-red-500 text-white text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full animate-pulse shadow-sm">ACTIVE</span>
            ) : (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full">ALL CLEAR</span>
            )}
          </div>
          <div className="my-4 flex items-baseline justify-between">
            <div className={clsx('text-5xl font-mono font-extrabold leading-none', activeAlerts.length > 0 ? 'text-red-600' : 'text-slate-900')}>
              {activeAlerts.length}
            </div>
            <Link to="/alerts" className={clsx('text-xs font-bold hover:underline underline-offset-2', activeAlerts.length > 0 ? 'text-red-600' : 'text-blue-600')}>
              Review Queue →
            </Link>
          </div>
          <div className="space-y-2">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="bg-red-500 h-full rounded-full" style={{ width: `${(alerts.filter((a) => a.severity === 'emergency').length / (alerts.length || 1)) * 100}%` }} />
              <div className="bg-amber-400 h-full" style={{ width: `${(alerts.filter((a) => a.severity === 'warning').length / (alerts.length || 1)) * 100}%` }} />
              <div className="bg-emerald-500 h-full" style={{ width: `${(alerts.filter((a) => a.severity === 'watch').length / (alerts.length || 1)) * 100}%` }} />
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {alerts.filter((a) => a.severity === 'emergency').length} Emergency · {alerts.filter((a) => a.severity === 'warning').length} Warning
            </div>
          </div>
        </div>

        {/* Fleet online card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] hover:shadow-[0_15px_35px_-5px_rgba(37,99,235,0.12)] hover:-translate-y-0.5 hover:border-blue-300 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">LoRa Fleet Online</span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
            </span>
          </div>
          <div className="my-4 flex items-baseline justify-between">
            <div className="text-5xl font-mono font-extrabold text-slate-900">{onlineCount}</div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
              {((onlineCount / (totalCount || 1)) * 100).toFixed(0)}% mesh active
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between font-medium">
            <span>433MHz LoRa + WiFi 6</span>
            <Link to="/fleet" className="text-blue-600 hover:underline font-bold">Fleet View →</Link>
          </div>
        </div>

        {/* Latency card */}
        <div className="bg-gradient-to-br from-blue-50/90 via-sky-50/70 to-cyan-50/80 border border-blue-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] hover:shadow-[0_15px_35px_-5px_rgba(37,99,235,0.12)] hover:-translate-y-0.5 hover:border-blue-400 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-widest">On-Device Inference</span>
            <span className="text-lg">⚡</span>
          </div>
          <div className="my-4 flex items-baseline justify-between">
            <div className="text-4xl font-mono font-extrabold text-blue-600">&lt;180ms</div>
            <span className="text-xs font-mono font-bold text-blue-800 bg-blue-100/90 border border-blue-200 px-2.5 py-0.5 rounded-full shadow-xs">TinyML Micro</span>
          </div>
          <div className="text-[11px] text-blue-800/90 font-medium">
            Autonomous statistical classification with zero cloud lag
          </div>
        </div>

        {/* Grid focus card */}
        <div className="bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-500 border border-blue-400/30 rounded-3xl p-6 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-blue-100 uppercase tracking-widest">Spatial Catchment Grid</span>
            <span className="text-lg">🗺️</span>
          </div>
          <div className="my-4 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold capitalize text-white">
              {selectedRegion === 'all' ? 'Tapi Basin' : selectedRegion}
            </div>
            <span className="text-xs font-mono text-white font-bold bg-white/20 border border-white/30 px-2.5 py-0.5 rounded-full backdrop-blur-xs">15km IDW</span>
          </div>
          <div className="text-[11px] text-blue-100/90 font-medium">Multi-Sensor Spatial Co-Validation</div>
        </div>
      </div>

      {/* ─── 2. Sensor Category Health Grid (Landing Reference) ──────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Sensor Fleet Telemetry by Hazard Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time multi-channel sensor bays with on-device rate-of-change inference</p>
          </div>
          <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-3.5 py-1 rounded-full shadow-xs self-start sm:self-auto">
            ● Continuous 2s Edge Sampling
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {SENSOR_CATEGORIES.map((cat) => {
            const catNodes  = nodes.filter((n) => n.category === cat.id)
            const alertNodes = catNodes.filter((n) => n.risk_score >= 50)
            const hasAlert   = alertNodes.length > 0

            return (
              <div
                key={cat.id}
                className={clsx(
                  'rounded-2xl p-4.5 space-y-3 transition-all duration-300',
                  hasAlert
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50/70 border-2 border-amber-300 shadow-sm'
                    : 'bg-[#f8fafc] border border-slate-200/90 hover:bg-white hover:border-blue-300 hover:shadow-md'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className={clsx(
                    'w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm',
                    hasAlert ? 'bg-amber-100 text-amber-700' : 'bg-white border border-slate-200/80'
                  )}>
                    {cat.icon}
                  </div>
                  <span className={clsx(
                    'text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full',
                    hasAlert
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  )}>
                    {hasAlert ? `${alertNodes.length} WARNING` : 'NORMAL'}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{cat.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{catNodes.length} Nodes Active</div>
                </div>
                <div className="text-[10px] text-slate-400 truncate font-mono">{cat.metrics.join(' · ')}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── 3. Two-Column: Active Emergencies + Event Stream ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left: Emergencies + Mini Map */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border-2 border-red-200 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-sm font-bold border border-red-100">🚨</div>
                <h3 className="font-extrabold text-sm text-red-700 uppercase tracking-wide">Active Hazard Incidents</h3>
              </div>
              <Link to="/console" className="text-xs font-bold text-blue-600 hover:underline underline-offset-2">Open Console →</Link>
            </div>

            {emergencyAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-[#f8fafc] rounded-2xl border border-slate-200/90">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xl mx-auto mb-2">✓</div>
                All regional parameters within safe limits. Zero active emergency escalations.
              </div>
            ) : (
              <div className="space-y-3">
                {emergencyAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 rounded-2xl border border-red-200/90 bg-gradient-to-r from-red-50/80 to-rose-50/60 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-red-700 uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                        {alert.severity}: {alert.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{alert.timestamp}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-900">{alert.title}</div>
                    <div className="text-[11px] text-slate-600 truncate">{alert.location}</div>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500">
                        Confidence: <b className="text-blue-600">{alert.confidence_pct}%</b>
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate('/console')}
                        className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-sm shadow-red-500/20 transition-all hover:scale-105"
                      >
                        Action in Console →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Regional Sentinel Spatial View</span>
              <Link to="/map" className="text-xs font-bold text-blue-600 hover:underline underline-offset-2">Expand Full Map ↗</Link>
            </div>
            <div className="h-44 rounded-2xl overflow-hidden border border-slate-200">
              <RiskMap nodes={nodes} height="100%" />
            </div>
          </div>
        </div>

        {/* Right: Event Stream */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-sm">📡</div>
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                Classified Event Stream <span className="text-slate-400 font-normal">(Edge-AI Telemetry)</span>
              </h3>
            </div>
            <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full shadow-xs">
              ● Live WebSocket
            </span>
          </div>

          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
            {nodes.slice(0, 8).map((node) => {
              const isHigh = node.risk_score >= 50
              return (
                <div
                  key={node.node_id}
                  className={clsx(
                    'flex items-start justify-between gap-3 p-4 rounded-2xl border text-xs transition-all',
                    isHigh
                      ? 'bg-red-50/70 border-red-200/80 hover:bg-red-100/60'
                      : 'bg-[#f8fafc] border-slate-200/80 hover:bg-white hover:border-blue-300 hover:shadow-xs'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{SENSOR_CATEGORIES.find((c) => c.id === node.category)?.icon || '📡'}</span>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="font-mono">{node.node_id}</span>
                        <span className="text-slate-500 font-normal truncate max-w-[130px]">({node.name})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{node.location}</div>
                      <div className="text-[11px] text-slate-700 font-mono mt-1">
                        Risk Score: <b className="text-slate-900">{node.risk_score}/100</b> · {node.connectivity}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={clsx(
                      'px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase',
                      isHigh
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    )}>
                      {node.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{node.last_update}</span>
                    <Link to={`/nodes/${node.node_id}`} className="text-[11px] text-blue-600 hover:underline font-bold">
                      Spec Details →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── 4. Inter-Agency Dispatch Audit Log (Rounded Table) ──────────── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Automated Inter-Agency Dispatch Audit Log</h3>
            <p className="text-xs text-slate-500 mt-0.5">Autonomous VoIP calls, SMS dispatches, and CAD webhooks routed by GSDMA Rules Engine</p>
          </div>
          <Link to="/settings" className="text-xs font-bold text-blue-600 hover:underline underline-offset-2 self-start sm:self-auto">Configure Rules →</Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/90">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50/90 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200/90">
              <tr>
                <th className="p-3.5">Designated Agency</th>
                <th className="p-3.5">Protocol Channel</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Response Target</th>
                <th className="p-3.5">Duty Officer</th>
                <th className="p-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dispatches.map((d, i) => (
                <tr key={i} className="hover:bg-blue-50/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{d.agency}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-600">{d.channel}</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px]">
                      ✓ {d.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-blue-600 font-bold">{d.sla_min} min SLA</td>
                  <td className="p-3.5 text-slate-600">{d.officer || 'Duty Officer'}</td>
                  <td className="p-3.5 text-right font-mono text-slate-400">{d.notified_at || 'Just now'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

