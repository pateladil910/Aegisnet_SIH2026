// pages/NodeDetail.jsx — Individual Node Diagnostic Console & Telemetry Inspection
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore, SENSOR_CATEGORIES } from '../store/useStore'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import clsx from 'clsx'

const MOCK_NODE_HISTORY = [
  { time: '00:00', val: 42, threshold: 70 },
  { time: '04:00', val: 44, threshold: 70 },
  { time: '08:00', val: 48, threshold: 70 },
  { time: '12:00', val: 56, threshold: 70 },
  { time: '16:00', val: 64, threshold: 70 },
  { time: '20:00', val: 58, threshold: 70 },
  { time: 'Now',   val: 52, threshold: 70 },
]

export default function NodeDetail() {
  const { id } = useParams()
  const nodes = useStore((s) => s.nodes)
  const muteNode = useStore((s) => s.muteNode)
  const triggerScenario = useStore((s) => s.triggerScenario)
  const [timeRange, setTimeRange] = useState('24h')

  const node = nodes.find((n) => n.node_id === id) || nodes[0]
  const catInfo = SENSOR_CATEGORIES.find((c) => c.id === node.category)
  const isMuted = node.status === 'muted'

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6 font-sans">
      {/* ─── Top Breadcrumb & Actions Strip ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link to="/fleet" className="text-xs text-blue-600 dark:text-cyan-400 hover:underline font-mono font-bold flex items-center gap-1.5">
          ← Back to Node Fleet
        </Link>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => muteNode(node.node_id)}
            className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold px-4 py-2 rounded-full shadow-xs transition-all"
          >
            {isMuted ? 'Unmute Node' : 'Mute (Maintenance Mode)'}
          </button>
          <button
            onClick={() => triggerScenario('flood')}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-mono font-bold px-5 py-2 rounded-full shadow-md shadow-blue-500/20 transition-all"
          >
            Simulate Surge on Node
          </button>
        </div>
      </div>

      {/* ─── 1. Node Diagnostic Header Card ─────────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-3xl flex items-center justify-center font-bold flex-shrink-0">
              {catInfo?.icon || '📡'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{node.node_id}</h1>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold px-3 py-0.5 rounded-full uppercase">
                  {node.status}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
                  {node.connectivity}
                </span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{node.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{node.location}</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs font-mono text-slate-500 dark:text-slate-400 space-y-1">
            <div>GPS: <b className="text-slate-800 dark:text-slate-200">{node.latitude.toFixed(4)}°N, {node.longitude.toFixed(4)}°E</b></div>
            <div>Firmware: <b className="text-slate-800 dark:text-slate-200">{node.firmware_version}</b></div>
            <div>Power: <b className="text-emerald-600 dark:text-emerald-400">{node.battery_pct}% (Solar 5W)</b></div>
          </div>
        </div>
      </div>

      {/* ─── 2. Live Sensor Channel Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">WATER LEVEL</div>
          <div className="text-xl font-bold font-mono text-blue-600 dark:text-cyan-400 mt-1">{node.water_level_cm} cm</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Ultrasonic Depth</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">AIR AQI</div>
          <div className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">{node.smoke_aqi}</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Laser PM2.5</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">TEMPERATURE</div>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{node.temperature_c}°C</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Dallas DS18B20</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">HUMIDITY</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{node.humidity_pct}%</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">DHT22 Digital</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">GAS (VOC)</div>
          <div className="text-xl font-bold font-mono text-orange-600 dark:text-orange-400 mt-1">{node.gas_ppm} ppm</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">MQ-135 Cell</div>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">LOCAL SIREN</div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {node.local_siren ? '🚨 ON' : 'Idle'}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Sub-5s Hardware</div>
        </div>
      </div>

      {/* ─── 3. Telemetry Trend Curve ───────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase font-mono">
              Primary Sensor Telemetry & Threshold Band
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sampled continuously at edge node</p>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 text-xs font-mono">
            {['1h', '6h', '24h', '7d'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={clsx('px-3 py-1 rounded-full transition-all', timeRange === r ? 'bg-gradient-to-r from-blue-600 to-cyan-500 font-bold text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white')}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_NODE_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} fontStyle="italic" />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[20, 90]} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, color: '#f8fafc', fontSize: 11 }} />
              <Line type="monotone" dataKey="val" stroke="#06b6d4" strokeWidth={2.5} name="Recorded Reading" />
              <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" name="Emergency Cutoff" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
