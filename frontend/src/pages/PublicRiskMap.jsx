// pages/PublicRiskMap.jsx — Public-facing live risk map with Earthy Theme & Locked Palette

import { useStore } from '../store/useStore'
import RiskMap from '../components/map/RiskMap'
import ScenarioRunner from '../components/demo/ScenarioRunner'

export default function PublicRiskMap() {
  const nodes  = useStore((s) => s.nodes)
  const alerts = useStore((s) => s.alerts)

  const openAlerts = alerts.filter((a) => a.status === 'open' || a.status === 'confirmed')
  const maxFlood   = Math.max(0, ...nodes.map((n) => n.risk_flood ?? 0))
  const maxFire    = Math.max(0, ...nodes.map((n) => n.risk_fire ?? 0))
  const maxPoll    = Math.max(0, ...nodes.map((n) => n.risk_pollution ?? 0))

  function riskLevel(score) {
    if (score >= 70) return { text: 'CRITICAL', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/20 border-[#EF4444]' }
    if (score >= 40) return { text: 'ELEVATED', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/20 border-[#F59E0B]' }
    return { text: 'SAFE', color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/20 border-[#22C55E]' }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#141A16] text-[#EDEDE9]">
      {/* Header banner */}
      <div className="bg-[#1F2921] border-b border-[#2D3B2F] px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Interactive 3-node scenario runner */}
          <ScenarioRunner />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-[#EDEDE9] flex items-center gap-2">
                <span>🛰️</span> Live Environmental Risk Map
              </h1>
              <p className="text-xs text-[#6B7280]">
                3-Node Sensor Array (Air, Water Level, Forest Fire) + Central Gateway · Auto-syncing every 4s
              </p>
            </div>

            {/* Locked Color Summary Badges */}
            <div className="flex gap-2.5 flex-wrap items-center">
              {/* Flood (Teal #0D9488) */}
              <div className="flex items-center gap-1.5 text-xs bg-[#141A16] border border-[#2D3B2F] px-2.5 py-1 rounded-md font-mono">
                <span className="text-[#0D9488] font-bold">💧 Water:</span>
                <span className={`font-bold ${riskLevel(maxFlood).color}`}>
                  {riskLevel(maxFlood).text} ({maxFlood.toFixed(0)})
                </span>
              </div>

              {/* Fire (Orange #F97316) */}
              <div className="flex items-center gap-1.5 text-xs bg-[#141A16] border border-[#2D3B2F] px-2.5 py-1 rounded-md font-mono">
                <span className="text-[#F97316] font-bold">🔥 Fire:</span>
                <span className={`font-bold ${riskLevel(maxFire).color}`}>
                  {riskLevel(maxFire).text} ({maxFire.toFixed(0)})
                </span>
              </div>

              {/* Pollution (Violet #8B5CF6) */}
              <div className="flex items-center gap-1.5 text-xs bg-[#141A16] border border-[#2D3B2F] px-2.5 py-1 rounded-md font-mono">
                <span className="text-[#8B5CF6] font-bold">☁️ AQI:</span>
                <span className={`font-bold ${riskLevel(maxPoll).color}`}>
                  {riskLevel(maxPoll).text} ({maxPoll.toFixed(0)})
                </span>
              </div>

              {/* Active Emergency Alert Badge */}
              {openAlerts.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444] px-2.5 py-1 rounded-md animate-pulse font-mono font-bold">
                  ⚠️ {openAlerts.length} Active Alert{openAlerts.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map display */}
      <div className="flex-1 relative">
        <RiskMap nodes={nodes} height="100%" />

        {/* Legend overlay with locked colors */}
        <div className="absolute bottom-6 left-4 z-10 bg-[#1F2921]/95 border border-[#2D3B2F] rounded-xl p-3.5 shadow-2xl backdrop-blur-sm">
          <div className="text-xs font-bold text-[#D97706] uppercase tracking-wider mb-2 font-mono">
            Node Risk Status
          </div>
          {[
            { color: '#22C55E', label: 'Safe / Normal (< 40)' },
            { color: '#F59E0B', label: 'Watch / Elevated (40–69)' },
            { color: '#EF4444', label: 'Danger / Critical (≥ 70)' },
            { color: '#9CA3AF', label: 'Offline / No Data' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-xs text-[#EDEDE9] mb-1.5 font-mono">
              <div className="w-3 h-3 rounded-full flex-shrink-0 shadow" style={{ backgroundColor: color }} />
              <span>{label}</span>
            </div>
          ))}

          <div className="border-t border-[#2D3B2F] mt-2.5 pt-2 text-[10px] text-[#6B7280]">
            <span className="text-[#0D9488] font-semibold">Teal dashed lines:</span> LoRa Mesh Relay
          </div>
        </div>

        {/* Online Nodes Indicator */}
        <div className="absolute top-4 right-4 z-10 bg-[#1F2921]/90 border border-[#2D3B2F] rounded-lg px-3 py-1.5 text-xs text-[#EDEDE9] shadow-md font-mono flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span>{nodes.filter((n) => n.status === 'online').length}/{nodes.length} nodes communicating</span>
        </div>
      </div>

      {/* Bottom Emergency Broadcast Banner */}
      {openAlerts.length > 0 && (
        <div className="bg-[#1F2921] border-t-2 border-[#EF4444] px-6 py-2 shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto">
            <span className="text-[11px] font-mono font-bold text-[#EF4444] uppercase tracking-wider whitespace-nowrap">
              🚨 LIVE INCIDENT TICKER:
            </span>
            {openAlerts.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center gap-2 text-xs whitespace-nowrap font-mono">
                <span className={
                  a.hazard === 'fire' ? 'text-[#F97316] font-bold' : a.hazard === 'flood' ? 'text-[#0D9488] font-bold' : 'text-[#8B5CF6] font-bold'
                }>
                  [{a.hazard.toUpperCase()}]
                </span>
                <span className="text-[#EDEDE9]">{a.node_name || a.node_id}</span>
                <span className="text-[#EF4444] font-bold">Score: {a.risk_score}</span>
                <span className="text-[#6B7280]">→ Govt Mail & SOS Dispatched</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
