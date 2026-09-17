// pages/MapPage.jsx — Geographic Environmental Risk Map with Layer Toggles & 24h Time Scrubber
import { useState } from 'react'
import { useStore, REGIONS, SENSOR_CATEGORIES, detectGujaratLandmark } from '../store/useStore'
import RiskMap from '../components/map/RiskMap'
import clsx from 'clsx'

export default function MapPage() {
  const nodes = useStore((s) => s.nodes)
  const addNode = useStore((s) => s.addNode)
  const selectedRegion = useStore((s) => s.selectedRegion)

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [placementMode, setPlacementMode] = useState(false)
  const [clickedCoords, setClickedCoords] = useState(null)
  const [timeHour, setTimeHour] = useState(24) // 24 = "Now"

  // Layer toggles
  const [showRings, setShowRings] = useState(true)
  const [showWind, setShowWind] = useState(true)

  // Camera center based on selected region
  const activeRegionObj = REGIONS.find((r) => r.id === selectedRegion) || REGIONS[0]

  // Filter nodes by category
  const displayedNodes = nodes.filter((n) => {
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false
    return true
  })

  const handleMapClick = (lat, lng) => {
    if (!placementMode) return
    setClickedCoords({ lat, lng })
  }

  return (
    <div className="relative flex-1 h-full w-full overflow-hidden font-sans">
      {/* ─── Top Floating Filter Strip ──────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
        {/* Left: Category Filter Pills */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full p-1.5 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.08)] flex items-center gap-1.5 overflow-x-auto max-w-full">
          <button
            onClick={() => setCategoryFilter('all')}
            className={clsx(
              'px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all',
              categoryFilter === 'all'
                ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            All Sensors ({nodes.length})
          </button>
          {SENSOR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap font-medium',
                categoryFilter === cat.id
                  ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white font-bold shadow-md shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <span>{cat.icon}</span>
              <span className="hidden md:inline">{cat.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Right: Layer Controls & Placement Trigger */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full p-1.5 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.08)] flex items-center gap-2">
          <button
            onClick={() => setShowRings(!showRings)}
            className={clsx(
              'px-3.5 py-1.5 rounded-full text-xs font-mono transition-all font-semibold',
              showRings
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            ⭕ Correlation Rings
          </button>
          <button
            onClick={() => setShowWind(!showWind)}
            className={clsx(
              'px-3.5 py-1.5 rounded-full text-xs font-mono transition-all font-semibold',
              showWind
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            💨 Wind Plume
          </button>
          <button
            onClick={() => setPlacementMode(!placementMode)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5',
              placementMode
                ? 'bg-red-600 text-white animate-pulse shadow-red-500/30'
                : 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-blue-500/25'
            )}
          >
            <span>{placementMode ? '✕ Cancel' : '📍 Deploy Node'}</span>
          </button>
        </div>
      </div>

      {/* ─── Bottom-Left: 24h Time Scrubber Slider ──────────────────────── */}
      <div className="absolute bottom-6 left-4 z-[500] bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-4 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.1)] w-80 space-y-2 pointer-events-auto font-sans">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <span>⏱️</span> 24h Spatial Event Replay
          </span>
          <span className="text-blue-600 font-bold">
            {timeHour === 24 ? 'LIVE (Now)' : `T - ${24 - timeHour}h`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="24"
          value={timeHour}
          onChange={(e) => setTimeHour(parseInt(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>-24 hours</span>
          <span>-12h</span>
          <span>Live Telemetry</span>
        </div>
      </div>

      {/* ─── Main Map Component ─────────────────────────────────────────── */}
      <RiskMap
        nodes={displayedNodes}
        height="100%"
        center={activeRegionObj.center}
        zoom={activeRegionObj.zoom}
        placementMode={placementMode}
        onMapClick={handleMapClick}
        showCorrelationRings={showRings}
        showWindDrift={showWind}
      />

      {/* ─── Modal for Click-to-Deploy Sensor ───────────────────────────── */}
      {clickedCoords && (
        <DeploymentModal
          point={clickedCoords}
          onClose={() => setClickedCoords(null)}
          onConfirm={(sensorData) => {
            addNode(sensorData)
            setClickedCoords(null)
            setPlacementMode(false)
          }}
        />
      )}
    </div>
  )
}

function DeploymentModal({ point, onClose, onConfirm }) {
  const detected = detectGujaratLandmark(point.lat, point.lng)
  const [sensorType, setSensorType] = useState('Flood & Water Level')
  const [nodeName, setNodeName] = useState(
    detected.isNearby ? `${detected.name.split(',')[0]} Sentinel` : `Sensor Node (${point.lat.toFixed(3)}, ${point.lng.toFixed(3)})`
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm({
      name: nodeName,
      category: detected.category || 'flood',
      sensor_type: sensorType,
      region: detected.region || 'ahmedabad',
      location: detected.name,
      latitude: point.lat,
      longitude: point.lng,
      connectivity: 'WiFi 6 + LoRa Mesh (Auto GPS)',
      battery_pct: 100,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Deploy Node at Selected GPS</h3>
            <p className="text-[11px] text-slate-500 font-mono">Gujarat Geographic Mesh Layer</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            ✕
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200/90 p-3.5 rounded-2xl text-xs space-y-1 font-mono">
          <div>GPS: <b className="text-blue-600">{point.lat.toFixed(4)}° N, {point.lng.toFixed(4)}° E</b></div>
          <div className="text-slate-700">Asset Match: <b className="text-slate-900">{detected.distanceText}</b></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-700 font-mono block mb-1 font-bold">Node Name</label>
            <input
              type="text"
              required
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-2.5 text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-slate-700 font-mono block mb-1 font-bold">Sensor Bay Category</label>
            <select
              value={sensorType}
              onChange={(e) => setSensorType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-2.5 text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none transition-all"
            >
              {SENSOR_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-2.5 rounded-full font-mono shadow-md shadow-blue-500/25 transition-all"
            >
              Confirm Deployment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 bg-slate-100 text-slate-600 rounded-full font-mono border border-slate-200 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
