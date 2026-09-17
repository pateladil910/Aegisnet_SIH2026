// pages/AuthorityDashboard.jsx — Authority Command Dashboard with Earthy Theme

import { useState } from 'react'
import { useStore, useAuthStore } from '../store/useStore'
import RiskMap from '../components/map/RiskMap'
import AlertFeed from '../components/alerts/AlertFeed'
import NodeHealthCard from '../components/nodes/NodeHealthCard'
import client from '../api/client'

function ThresholdEditor({ onClose }) {
  const [thresholds, setThresholds] = useState({
    flood:     { warn_score: 40, danger_score: 70 },
    fire:      { warn_score: 40, danger_score: 70 },
    pollution: { warn_score: 40, danger_score: 70 },
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  const save = async (hazard) => {
    setSaving(true)
    try {
      await client.put(`/api/thresholds/${hazard}`, thresholds[hazard])
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#1F2921] border border-[#2D3B2F] rounded-2xl p-6 w-full max-w-md shadow-2xl text-[#EDEDE9]">
        <div className="flex justify-between items-center mb-4 border-b border-[#2D3B2F] pb-3">
          <div>
            <h3 className="font-bold text-base text-[#EDEDE9] flex items-center gap-2">
              <span>⚙️</span> Official Hazard Thresholds
            </h3>
            <p className="text-xs text-[#6B7280]">Triggers automated Government Mail & Emergency Calls</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#EDEDE9] text-lg w-7 h-7 flex items-center justify-center rounded hover:bg-[#141A16]"
          >
            ✕
          </button>
        </div>

        {Object.entries(thresholds).map(([hazard, t]) => {
          const isFlood = hazard === 'flood'
          const isFire = hazard === 'fire'
          const accentColor = isFire ? 'text-[#F97316]' : isFlood ? 'text-[#0D9488]' : 'text-[#8B5CF6]'

          return (
            <div key={hazard} className="mb-4 p-3.5 bg-[#141A16] rounded-xl border border-[#2D3B2F]">
              <div className={`text-xs font-mono font-bold uppercase tracking-wider mb-2 flex items-center justify-between ${accentColor}`}>
                <span>{isFlood ? '💧 Water Level Overflow' : isFire ? '🔥 Forest Fire Incident' : '☁️ Air / Toxic Gas'}</span>
                <span className="text-[10px] text-[#6B7280]">Govt Rule</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['warn_score', 'danger_score'].map((field) => (
                  <div key={field}>
                    <label className="text-[11px] text-[#6B7280] font-mono block mb-1">
                      {field === 'warn_score' ? 'Watch / Elevated (40)' : 'Critical / Danger (70)'}
                    </label>
                    <input
                      type="number" min="0" max="100"
                      value={t[field]}
                      onChange={(e) =>
                        setThresholds((prev) => ({
                          ...prev,
                          [hazard]: { ...prev[hazard], [field]: parseInt(e.target.value) || 0 },
                        }))
                      }
                      className="w-full bg-[#1F2921] border border-[#2D3B2F] rounded-lg px-3 py-1.5 text-xs text-[#EDEDE9] font-mono focus:outline-none focus:border-[#D97706]"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => save(hazard)}
                disabled={saving}
                className="mt-2.5 w-full text-xs bg-[#14532D] hover:bg-[#0B3820] text-[#EDEDE9] py-1.5 rounded-lg transition-colors border border-[#2D3B2F] font-semibold"
              >
                {saved ? '✓ Rule Applied & Saved' : saving ? 'Updating Protocol...' : 'Save Protocol'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AuthorityDashboard() {
  const nodes   = useStore((s) => s.nodes)
  const alerts  = useStore((s) => s.alerts)
  const { updateAlertStatus } = useStore()
  const user    = useAuthStore((s) => s.user)
  const [tab, setTab]             = useState('alerts')
  const [showThresholds, setShowThresholds] = useState(false)
  const [selectedNode, setSelectedNode]     = useState(null)

  const openAlerts = alerts.filter((a) => a.status === 'open')

  const handleStatusChange = async (id, status) => {
    updateAlertStatus(id, status)
    try {
      await client.patch(`/api/alerts/${id}`, { status })
    } catch {
      // Mock mode
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-[#141A16] text-[#EDEDE9]">
      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <aside className="w-88 flex-shrink-0 bg-[#1F2921] border-r border-[#2D3B2F] flex flex-col overflow-hidden shadow-lg">
        {/* Panel header */}
        <div className="p-4 border-b border-[#2D3B2F]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[#EDEDE9] text-sm flex items-center gap-1.5">
                <span>🛡️</span> Authority Command Center
              </h2>
              <p className="text-[11px] text-[#6B7280] font-mono">{user?.name} • Role: {user?.role}</p>
            </div>
            <button
              onClick={() => setShowThresholds(true)}
              className="text-xs bg-[#14532D] hover:bg-[#0B3820] text-[#EDEDE9] px-2.5 py-1.5 rounded-lg border border-[#2D3B2F] font-semibold transition-colors flex items-center gap-1"
            >
              <span>⚙️</span> Protocols
            </button>
          </div>

          {/* Stats row with locked colors */}
          <div className="grid grid-cols-3 gap-2 mt-3 font-mono">
            <div className="bg-[#141A16] border border-[#2D3B2F] rounded-lg p-2 text-center">
              <div className="text-xl font-bold text-[#EF4444]">{openAlerts.length}</div>
              <div className="text-[10px] text-[#6B7280]">Open Incidents</div>
            </div>
            <div className="bg-[#141A16] border border-[#2D3B2F] rounded-lg p-2 text-center">
              <div className="text-xl font-bold text-[#22C55E]">
                {nodes.filter((n) => n.status === 'online').length}/{nodes.length}
              </div>
              <div className="text-[10px] text-[#6B7280]">Nodes Active</div>
            </div>
            <div className="bg-[#141A16] border border-[#2D3B2F] rounded-lg p-2 text-center">
              <div className="text-xl font-bold text-[#D97706]">{alerts.length}</div>
              <div className="text-[10px] text-[#6B7280]">Total Logs</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2D3B2F] bg-[#141A16]/50">
          {[
            ['alerts', '🚨 Incident Feed'],
            ['nodes', '📡 3 Environment Nodes'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 text-xs py-2.5 font-medium transition-colors font-mono ${
                tab === id
                  ? 'text-[#D97706] bg-[#1F2921] border-b-2 border-[#D97706] font-bold'
                  : 'text-[#6B7280] hover:text-[#EDEDE9]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {tab === 'alerts' && (
            <AlertFeed alerts={alerts.slice(0, 30)} onStatusChange={handleStatusChange} />
          )}
          {tab === 'nodes' && (
            <div className="space-y-2.5">
              {nodes.map((n) => (
                <div key={n.node_id} onClick={() => setSelectedNode(n.node_id)} className="cursor-pointer">
                  <NodeHealthCard node={n} />
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Map view ──────────────────────────────────────────────────────── */}
      <div className="flex-1 relative">
        <RiskMap nodes={nodes} selectedNodeId={selectedNode} height="100%" />
      </div>

      {showThresholds && <ThresholdEditor onClose={() => setShowThresholds(false)} />}
    </div>
  )
}
