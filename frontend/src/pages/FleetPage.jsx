// pages/FleetPage.jsx — Node Fleet Management & Hardware Provisioning Wizard
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore, SENSOR_CATEGORIES, REGIONS } from '../store/useStore'
import clsx from 'clsx'

export default function FleetPage() {
  const nodes = useStore((s) => s.nodes)
  const addNode = useStore((s) => s.addNode)
  const muteNode = useStore((s) => s.muteNode)
  const addAuditLog = useStore((s) => s.addAuditLog)

  const [search, setSearch] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [bulkOtaSuccess, setBulkOtaSuccess] = useState(false)

  // Add Node Modal Form State
  const [newNodeName, setNewNodeName] = useState('')
  const [newNodeRegion, setNewNodeRegion] = useState('gandhinagar')
  const [newNodeCategory, setNewNodeCategory] = useState('flood')
  const [newNodeLocation, setNewNodeLocation] = useState('')
  const [newNodeLat, setNewNodeLat] = useState('23.2385')
  const [newNodeLng, setNewNodeLng] = useState('72.6710')
  const [newNodeConn, setNewNodeConn] = useState('WiFi 6 + LoRa Mesh')

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (filterRegion !== 'all' && n.region !== filterRegion) return false
      if (filterStatus !== 'all' && n.status !== filterStatus) return false
      if (search && !JSON.stringify(n).toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [nodes, filterRegion, filterStatus, search])

  // Fleet health calculations
  const totalNodes = nodes.length
  const onlineCount = nodes.filter((n) => n.status === 'online').length
  const degradedCount = nodes.filter((n) => n.status === 'degraded' || n.status === 'muted').length
  const offlineCount = totalNodes - onlineCount - degradedCount
  const avgBattery = Math.round(nodes.reduce((acc, n) => acc + (n.battery_pct || 80), 0) / totalNodes)

  const handleAddNodeSubmit = (e) => {
    e.preventDefault()
    addNode({
      name: newNodeName || `Sentinel Node (${newNodeLocation || 'Gujarat'})`,
      region: newNodeRegion,
      category: newNodeCategory,
      sensor_type: SENSOR_CATEGORIES.find((c) => c.id === newNodeCategory)?.name || 'Multi-Sensor',
      location: newNodeLocation || 'Custom Deployment Site',
      latitude: parseFloat(newNodeLat) || 23.0,
      longitude: parseFloat(newNodeLng) || 72.5,
      connectivity: newNodeConn,
      battery_pct: 100,
    })
    setShowAddModal(false)
    setNewNodeName('')
    setNewNodeLocation('')
  }

  const handleBulkOTA = () => {
    setBulkOtaSuccess(true)
    addAuditLog('Simulated OTA Push', 'System Admin', `Broadcasted firmware v2.4.2-edge to ${nodes.length} nodes`)
    setTimeout(() => setBulkOtaSuccess(false), 3000)
  }

  const handleExportCSV = () => {
    const headers = ['NodeID', 'Name', 'Region', 'Category', 'Location', 'Latitude', 'Longitude', 'Battery', 'Status', 'Firmware']
    const rows = filteredNodes.map((n) => [
      n.node_id,
      `"${n.name}"`,
      n.region,
      n.category,
      `"${n.location}"`,
      n.latitude,
      n.longitude,
      n.battery_pct,
      n.status,
      n.firmware_version,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `aegisnet-fleet-inventory-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6 font-sans">
      {/* ─── 1. Header Strip ─────────────────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-sm">
            🛰️
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Hardware Fleet & <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Provisioning</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Qualcomm Edge-AI Sentinel Grid • Gujarat State Deployment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-bold font-mono px-4 py-2.5 rounded-full transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <span>+</span> Provision New Node
          </button>
          <button
            onClick={handleBulkOTA}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold font-mono px-4 py-2.5 rounded-full transition-all"
          >
            {bulkOtaSuccess ? '✓ OTA Deployed' : 'OTA Firmware Push'}
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-mono px-4 py-2.5 rounded-full transition-all"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* ─── 2. Fleet Health KPI Strip ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Total Deployed</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1">{totalNodes}</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">Online Primary</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">{onlineCount}</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">LoRa Mesh Fallback</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">{degradedCount}</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Offline / Maintenance</div>
          <div className="text-2xl font-bold text-slate-500 dark:text-slate-400 font-mono mt-1">{offlineCount}</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-blue-600 dark:text-cyan-400 font-mono">Fleet Avg Battery</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-cyan-400 font-mono mt-1">{avgBattery}%</div>
        </div>
      </div>

      {/* ─── 3. Filter Bar ──────────────────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          {/* Region filter */}
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
          >
            <option value="all">All Regions</option>
            {REGIONS.filter((r) => r.id !== 'all').map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="online">Online</option>
            <option value="degraded">Degraded</option>
            <option value="muted">Muted</option>
          </select>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by node ID, location, or firmware..."
          className="w-full md:w-72 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </div>

      {/* ─── 4. Fleet Data Grid ─────────────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Node ID</th>
                <th className="p-4">Category & Sensor</th>
                <th className="p-4">Location & Landmark</th>
                <th className="p-4">Connectivity</th>
                <th className="p-4">Battery / Power</th>
                <th className="p-4">Firmware</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {filteredNodes.map((node) => {
                const isOnline = node.status === 'online'
                const isMuted = node.status === 'muted'

                return (
                  <tr key={node.node_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      <Link to={`/nodes/${node.node_id}`} className="text-blue-600 dark:text-cyan-400 hover:underline">
                        {node.node_id}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{node.sensor_type}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">{node.category}</div>
                    </td>
                    <td className="p-4 truncate max-w-xs text-slate-600 dark:text-slate-300">
                      <div className="text-slate-900 dark:text-white font-medium">{node.location}</div>
                      <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        {node.latitude.toFixed(4)}°N, {node.longitude.toFixed(4)}°E
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                      {node.connectivity}
                    </td>
                    <td className="p-4 font-mono">
                      <span className={clsx(node.battery_pct < 40 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-emerald-600 dark:text-emerald-400')}>
                        {node.battery_pct}%
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1">
                        {node.solar_charging ? '☀️ Solar' : '🔋 Li-Ion'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {node.firmware_version}
                    </td>
                    <td className="p-4">
                      <span
                        className={clsx(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold inline-block',
                          isMuted
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            : isOnline
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
                        )}
                      >
                        {isMuted ? 'Muted' : isOnline ? 'Online' : 'Degraded'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => muteNode(node.node_id)}
                          className="text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white underline font-mono"
                        >
                          {isMuted ? 'Unmute' : 'Mute'}
                        </button>
                        <Link
                          to={`/nodes/${node.node_id}`}
                          className="text-[11px] text-blue-600 dark:text-cyan-400 hover:underline font-mono font-bold"
                        >
                          Telemetry →
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Add Node Provisioning Modal ─────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>🛰️</span> Provision Qualcomm Edge-AI Node
              </h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">✕</button>
            </div>

            <form onSubmit={handleAddNodeSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-300 font-mono block mb-1 font-bold">Node Display Name</label>
                <input
                  type="text"
                  required
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  placeholder="e.g. Sabarmati Vasna Barrage Sensor"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-mono block mb-1 font-bold">Gujarat Region</label>
                  <select
                    value={newNodeRegion}
                    onChange={(e) => setNewNodeRegion(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                  >
                    {REGIONS.filter((r) => r.id !== 'all').map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-mono block mb-1 font-bold">Sensor Bay Category</label>
                  <select
                    value={newNodeCategory}
                    onChange={(e) => setNewNodeCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                  >
                    {SENSOR_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-300 font-mono block mb-1 font-bold">Location Description / Landmark</label>
                <input
                  type="text"
                  required
                  value={newNodeLocation}
                  onChange={(e) => setNewNodeLocation(e.target.value)}
                  placeholder="e.g. Near Vasna Barrage Sluice Gate 14"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-mono block mb-1 font-bold">Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newNodeLat}
                    onChange={(e) => setNewNodeLat(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-mono block mb-1 font-bold">Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newNodeLng}
                    onChange={(e) => setNewNodeLng(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-2.5 rounded-full font-mono transition-all shadow-md shadow-blue-500/20"
                >
                  Register Node to Mesh
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full font-mono border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
