// components/nodes/NodeHealthCard.jsx — Earthy Node Status Card with Locked Color System

import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { formatDistanceToNow, parseISO } from 'date-fns'

function RiskBar({ value, colorHex }) {
  const pct = Math.min(100, Math.max(0, value ?? 0))
  return (
    <div className="w-full bg-[#141A16] rounded-full h-1.5 overflow-hidden border border-[#2D3B2F]/50">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: colorHex }}
      />
    </div>
  )
}

function BatteryStatus({ pct }) {
  const color = pct > 50 ? 'text-[#22C55E]' : pct > 20 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
  return <span className={clsx('text-xs font-mono font-bold', color)}>{pct ?? '--'}%</span>
}

export default function NodeHealthCard({ node }) {
  if (!node) return null

  const maxRisk = Math.max(node.risk_flood ?? 0, node.risk_fire ?? 0, node.risk_pollution ?? 0)
  const statusColor = node.status === 'online' ? 'bg-[#22C55E]' : 'bg-[#9CA3AF]'

  const lastSeen = node.last_seen_at
    ? formatDistanceToNow(parseISO(node.last_seen_at), { addSuffix: true })
    : 'active'

  return (
    <Link
      to={`/nodes/${node.node_id}`}
      className="block bg-[#1F2921] border border-[#2D3B2F] rounded-xl p-4 hover:border-[#14532D] hover:shadow-lg transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className={clsx('w-2 h-2 rounded-full', statusColor)} />
            <span className="font-semibold text-sm text-[#EDEDE9] group-hover:text-[#D97706] transition-colors">
              {node.name}
            </span>
            {node.is_gateway && (
              <span className="text-[10px] bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40 px-1.5 py-0.5 rounded font-mono font-bold">
                GATEWAY
              </span>
            )}
          </div>
          <div className="text-xs text-[#6B7280] mt-0.5 ml-4">{node.location_desc}</div>
        </div>
        <span className="text-xs text-[#6B7280] font-mono">{node.node_id}</span>
      </div>

      {/* Risk scores with Locked Hazard Accents */}
      <div className="space-y-2 mb-3 bg-[#141A16] p-2.5 rounded-lg border border-[#2D3B2F]/60">
        <div>
          <div className="flex justify-between text-xs mb-1 font-mono">
            <span className="text-[#0D9488] font-medium">💧 Water Level Risk</span>
            <span className="font-bold text-[#0D9488]">{node.risk_flood ?? 0}</span>
          </div>
          <RiskBar value={node.risk_flood} colorHex="#0D9488" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1 font-mono">
            <span className="text-[#F97316] font-medium">🔥 Fire Hazard Risk</span>
            <span className="font-bold text-[#F97316]">{node.risk_fire ?? 0}</span>
          </div>
          <RiskBar value={node.risk_fire} colorHex="#F97316" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1 font-mono">
            <span className="text-[#8B5CF6] font-medium">☁️ Air / AQI Contamination</span>
            <span className="font-bold text-[#8B5CF6]">{node.risk_pollution ?? 0}</span>
          </div>
          <RiskBar value={node.risk_pollution} colorHex="#8B5CF6" />
        </div>
      </div>

      {/* Metrics footer row */}
      <div className="grid grid-cols-3 gap-2 text-xs border-t border-[#2D3B2F] pt-2.5">
        <div className="text-center">
          <div className="text-[#6B7280] text-[11px] mb-0.5">Battery</div>
          <div className="flex justify-center items-center gap-1">
            <BatteryStatus pct={node.battery_pct} />
            {node.solar_charging && <span title="Solar charging" className="text-xs">☀️</span>}
          </div>
        </div>
        <div className="text-center border-x border-[#2D3B2F]">
          <div className="text-[#6B7280] text-[11px] mb-0.5">RSSI</div>
          <span className="font-mono text-[#EDEDE9]">{node.rssi ?? '--'} dBm</span>
        </div>
        <div className="text-center">
          <div className="text-[#6B7280] text-[11px] mb-0.5">Water</div>
          <span className="font-mono text-[#0D9488] font-bold">{node.water_level_cm?.toFixed(1) ?? '--'} cm</span>
        </div>
      </div>
    </Link>
  )
}
