// pages/HistoryPage.jsx — Audit-Grade Reading History & Compliance Report Generator
import { useState, useMemo } from 'react'
import { useStore, SENSOR_CATEGORIES, REGIONS } from '../store/useStore'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import clsx from 'clsx'

const MOCK_TIME_SERIES = [
  { time: '00:00', water: 42, aqi: 45, temp: 26.2, gas: 14 },
  { time: '04:00', water: 44, aqi: 40, temp: 25.4, gas: 12 },
  { time: '08:00', water: 48, aqi: 75, temp: 28.1, gas: 22 },
  { time: '12:00', water: 55, aqi: 92, temp: 32.5, gas: 36 },
  { time: '16:00', water: 62, aqi: 110, temp: 34.0, gas: 44 },
  { time: '20:00', water: 58, aqi: 85, temp: 30.2, gas: 28 },
  { time: 'Now',   water: 52, aqi: 68, temp: 29.1, gas: 20 },
]

export default function HistoryPage() {
  const nodes = useStore((s) => s.nodes)
  const [viewMode, setViewMode] = useState('table')
  const [regionFilter, setRegionFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Generate historical tabular entries from nodes
  const historicalRows = useMemo(() => {
    return nodes.map((n, i) => ({
      id: `LOG-${1000 + i}`,
      time: n.last_update || 'Just now',
      date: '2026-09-17',
      node_id: n.node_id,
      name: n.name,
      region: n.region,
      category: n.category,
      location: n.location,
      water: `${n.water_level_cm} cm`,
      temp: `${n.temperature_c}°C`,
      aqi: n.smoke_aqi,
      gas: `${n.gas_ppm} ppm`,
      severity: n.severity,
      risk_score: n.risk_score,
    })).filter((row) => {
      if (regionFilter !== 'all' && row.region !== regionFilter) return false
      if (categoryFilter !== 'all' && row.category !== categoryFilter) return false
      if (search && !JSON.stringify(row).toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [nodes, regionFilter, categoryFilter, search])

  const handleExportCSV = () => {
    const headers = ['LogID', 'Date', 'Time', 'NodeID', 'Region', 'Category', 'Location', 'Water', 'Temp', 'AQI', 'Gas', 'Severity', 'RiskScore']
    const csvRows = [headers.join(',')]
    historicalRows.forEach((r) => {
      csvRows.push([
        r.id,
        r.date,
        r.time,
        r.node_id,
        r.region,
        r.category,
        `"${r.location}"`,
        r.water,
        r.temp,
        r.aqi,
        r.gas,
        r.severity,
        r.risk_score,
      ].join(','))
    })
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `aegisnet-audit-history-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrintReport = () => {
    window.print()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6 font-sans">
      {/* ─── Header Strip ─────────────────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-sm">
            📜
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Reading History & <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">GSDMA Reports</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Audit-grade time-series sensor telemetry, environmental incidents, & PDF compliance filing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold px-4 py-2.5 rounded-full transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>📥</span> Export CSV
          </button>
          <button
            onClick={handlePrintReport}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-mono font-bold px-5 py-2.5 rounded-full transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <span>🖨️</span> Generate Incident Report (PDF)
          </button>
        </div>
      </div>

      {/* ─── Filter & View Switcher Strip ───────────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1">
            <button
              onClick={() => setViewMode('table')}
              className={clsx('px-4 py-1.5 rounded-full font-mono font-bold transition-all', viewMode === 'table' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300')}
            >
              Data Grid
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={clsx('px-4 py-1.5 rounded-full font-mono font-bold transition-all', viewMode === 'chart' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300')}
            >
              Time-Series Curves
            </button>
          </div>

          {/* Region filter */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
          >
            <option value="all">All Regions</option>
            {REGIONS.filter((r) => r.id !== 'all').map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {SENSOR_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by node ID, location, or parameter..."
          className="w-full md:w-72 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </div>

      {/* ─── Content: Table OR Chart View ───────────────────────────────── */}
      {viewMode === 'table' ? (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Log ID</th>
                  <th className="p-4">Node</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Water Level</th>
                  <th className="p-4">Air AQI</th>
                  <th className="p-4">Temperature</th>
                  <th className="p-4">Gas (VOC)</th>
                  <th className="p-4">Severity Tier</th>
                  <th className="p-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                {historicalRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">{r.id}</td>
                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-cyan-400">{r.node_id}</td>
                    <td className="p-4 text-slate-900 dark:text-white truncate max-w-xs">{r.location}</td>
                    <td className="p-4 font-mono text-blue-600 dark:text-cyan-400 font-semibold">{r.water}</td>
                    <td className="p-4 font-mono text-purple-600 dark:text-purple-400 font-semibold">{r.aqi} AQI</td>
                    <td className="p-4 font-mono text-amber-600 dark:text-amber-400 font-semibold">{r.temp}</td>
                    <td className="p-4 font-mono text-orange-600 dark:text-orange-400 font-semibold">{r.gas}</td>
                    <td className="p-4 font-mono">
                      <span className={clsx(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase',
                        r.severity === 'emergency' ? 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400' :
                        r.severity === 'warning' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      )}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-[11px] text-slate-400 dark:text-slate-500">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-mono">24-Hour Diurnal Multi-Sensor Trends</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Aggregated regional curves with shaded threshold bands</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">🌊 Hydrological Depth Trend (cm)</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_TIME_SERIES}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                    <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} fontStyle="italic" />
                    <YAxis stroke="#94A3B8" fontSize={10} domain={[30, 80]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, color: '#f8fafc', fontSize: 11 }} />
                    <Line type="monotone" dataKey="water" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">🌫️ Air Quality Index Trend (AQI)</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_TIME_SERIES}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                    <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} domain={[20, 140]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, color: '#f8fafc', fontSize: 11 }} />
                    <Line type="monotone" dataKey="aqi" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
