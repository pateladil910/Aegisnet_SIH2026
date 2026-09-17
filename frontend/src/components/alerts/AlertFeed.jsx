// components/alerts/AlertFeed.jsx — Earthy Alert Feed with Locked Status & Hazard Palette

import { formatDistanceToNow, parseISO } from 'date-fns'
import clsx from 'clsx'

const HAZARD_META = {
  flood: {
    icon: '💧',
    title: 'Water Level Overflow',
    color: 'text-[#0D9488]',
    border: 'border-[#0D9488]/40',
    badge: 'bg-[#0D9488]/20 text-[#0D9488]',
  },
  fire: {
    icon: '🔥',
    title: 'Forest Fire Hazard',
    color: 'text-[#F97316]',
    border: 'border-[#F97316]/40',
    badge: 'bg-[#F97316]/20 text-[#F97316]',
  },
  pollution: {
    icon: '☁️',
    title: 'Air Quality / Gas Anomaly',
    color: 'text-[#8B5CF6]',
    border: 'border-[#8B5CF6]/40',
    badge: 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
  },
}

// Locked Risk Status Colors per spec
const STATUS_STYLES = {
  open:           'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50', // Watch / Elevated
  confirmed:      'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/50', // Danger / Critical
  false_positive: 'bg-[#6B7280]/20 text-[#6B7280] border border-[#6B7280]/50', // Muted
  resolved:       'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/50', // Safe / Normal
}

export default function AlertFeed({ alerts = [], onStatusChange, compact = false }) {
  if (!alerts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[#6B7280] bg-[#1F2921] rounded-xl border border-[#2D3B2F]">
        <span className="text-4xl mb-2 text-[#22C55E]">✓</span>
        <p className="text-sm font-medium text-[#EDEDE9]">All 3 Nodes Normal</p>
        <p className="text-xs text-[#6B7280] mt-0.5">No active threshold overflows or fire risks</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {alerts.map((alert) => {
        const meta = HAZARD_META[alert.hazard] || HAZARD_META.flood
        const timeAgo = formatDistanceToNow(parseISO(alert.triggered_at), { addSuffix: true })

        return (
          <div
            key={alert.id}
            className={clsx(
              'rounded-xl border p-3.5 transition-all bg-[#1F2921] hover:border-[#2D3B2F] shadow-sm',
              meta.border
            )}
          >
            <div className="flex items-start justify-between gap-2">
              {/* Icon + title */}
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="text-xl flex-shrink-0">{meta.icon}</span>
                <div className="min-w-0">
                  <div className={clsx('font-bold text-xs uppercase tracking-wider font-mono', meta.color)}>
                    {meta.title} — Risk Score {alert.risk_score}
                  </div>
                  {!compact && (
                    <div className="text-xs text-[#EDEDE9] mt-0.5 font-medium">{alert.message}</div>
                  )}
                </div>
              </div>

              {/* Status badge with locked status colors */}
              <span className={clsx('text-[11px] font-mono font-bold px-2 py-0.5 rounded capitalize flex-shrink-0', STATUS_STYLES[alert.status])}>
                {alert.status?.replace('_', ' ')}
              </span>
            </div>

            {/* Incident metadata & dispatch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#2D3B2F] text-xs">
              <div className="text-[11px] text-[#6B7280] font-mono flex flex-wrap gap-3">
                <span className="text-slate-300">📍 {alert.node_name || alert.node_id}</span>
                {alert.area_probability != null && (
                  <span>AI Area Prob: <b className="text-[#22C55E]">{(alert.area_probability * 100).toFixed(0)}%</b></span>
                )}
                <span>{timeAgo}</span>
              </div>

              {/* Authority action buttons */}
              {onStatusChange && alert.status === 'open' && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onStatusChange(alert.id, 'confirmed')}
                    className="text-xs px-2.5 py-1 rounded bg-[#14532D] hover:bg-[#0B3820] text-[#EF4444] font-semibold border border-[#EF4444]/40 transition-colors"
                  >
                    Confirm Alert
                  </button>
                  <button
                    onClick={() => onStatusChange(alert.id, 'false_positive')}
                    className="text-xs px-2 py-1 rounded bg-[#141A16] hover:bg-[#2D3B2F] text-[#6B7280] font-medium border border-[#2D3B2F] transition-colors"
                  >
                    False Alarm
                  </button>
                  <button
                    onClick={() => onStatusChange(alert.id, 'resolved')}
                    className="text-xs px-2.5 py-1 rounded bg-[#14532D] hover:bg-[#0B3820] text-[#22C55E] font-semibold border border-[#22C55E]/40 transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
