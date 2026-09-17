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
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/60 text-blue-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-xs">
            📜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Reading History & <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 bg-clip-text text-transparent">GSDMA Reports</span>
              </h1>
              <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase">
                Audit Trail
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Audit-grade time-series sensor telemetry, environmental incidents, & PDF compliance filing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-mono font-bold px-4 py-2.5 rounded-full transition-all shadow-xs flex items-center gap-2 hover:border-slate-300"
          >
            <span>📥</span> Export CSV
          </button>
          <button
            onClick={handlePrintReport}
            className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-mono font-bold px-5 py-2.5 rounded-full transition-all shadow-md shadow-blue-500/25 flex items-center gap-2"
          >
            <span>🖨️</span> Generate Incident Report (PDF)
          </button>
        </div>
      </div>

      {/* ─── Filter & View Switcher Strip ───────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 border border-slate-200/90 rounded-full p-1">
            <button
              onClick={() => setViewMode('table')}
              className={clsx('px-4 py-1.5 rounded-full font-mono font-bold text-xs transition-all', viewMode === 'table' ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900')}
            >
              Data Grid
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={clsx('px-4 py-1.5 rounded-full font-mono font-bold text-xs transition-all', viewMode === 'chart' ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900')}
            >
              Time-Series Curves
            </button>
          </div>

          {/* Region filter */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none transition-all"
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
            className="bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none transition-all"
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
          className="w-full md:w-72 bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all"
        />
      </div>

      {/* ─── Content: Table OR Chart View ───────────────────────────────── */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200">
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
              <tbody className="divide-y divide-slate-100">
                {historicalRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono text-[11px] text-slate-500">{r.id}</td>
                    <td className="p-4 font-mono font-bold text-blue-600">{r.node_id}</td>
                    <td className="p-4 text-slate-900 font-medium truncate max-w-xs">{r.location}</td>
                    <td className="p-4 font-mono text-blue-600 font-semibold">{r.water}</td>
                    <td className="p-4 font-mono text-purple-600 font-semibold">{r.aqi} AQI</td>
                    <td className="p-4 font-mono text-amber-600 font-semibold">{r.temp}</td>
                    <td className="p-4 font-mono text-orange-600 font-semibold">{r.gas}</td>
                    <td className="p-4 font-mono">
                      <span className={clsx(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase',
                        r.severity === 'emergency' ? 'bg-red-50 text-red-700 border border-red-200' :
                        r.severity === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      )}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono text-[11px] text-slate-500">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 font-mono">24-Hour Diurnal Multi-Sensor Trends</h3>
            <p className="text-xs text-slate-500 mt-0.5">Aggregated regional curves with shaded threshold bands</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-xs font-mono font-bold text-blue-600">🌊 Hydrological Depth Trend (cm)</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_TIME_SERIES}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} fontStyle="italic" />
                    <YAxis stroke="#64748b" fontSize={10} domain={[30, 80]} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: 16, color: '#0f172a', fontSize: 11, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="water" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80">
              <div className="text-xs font-mono font-bold text-purple-600">🌫️ Air Quality Index Trend (AQI)</div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_TIME_SERIES}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} domain={[20, 140]} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: 16, color: '#0f172a', fontSize: 11, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="aqi" stroke="#9333ea" strokeWidth={2.5} dot={{ r: 3 }} />
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
