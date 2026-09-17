// pages/AlertHistory.jsx — Filterable Incident & Government Dispatch History

import { useState, useMemo } from 'react'
import { useStore, useAuthStore } from '../store/useStore'
import { formatDistanceToNow, parseISO } from 'date-fns'
import AlertFeed from '../components/alerts/AlertFeed'
import client from '../api/client'
import clsx from 'clsx'

const STATUS_OPTIONS = ['all', 'open', 'confirmed', 'false_positive', 'resolved']
const HAZARD_OPTIONS = ['all', 'flood', 'fire', 'pollution']

export default function AlertHistory() {
  const alerts = useStore((s) => s.alerts)
  const { updateAlertStatus } = useStore()
  const user = useAuthStore((s) => s.user)

  const [statusFilter, setStatusFilter] = useState('all')
  const [hazardFilter, setHazardFilter] = useState('all')
  const [search, setSearch]             = useState('')
  const [view, setView]                 = useState('cards')

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false
      if (hazardFilter !== 'all' && a.hazard !== hazardFilter) return false
      if (search && !JSON.stringify(a).toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [alerts, statusFilter, hazardFilter, search])

  const handleStatusChange = async (id, status) => {
    updateAlertStatus(id, status)
    try {
      await client.patch(`/api/alerts/${id}`, { status })
    } catch {
      // Mock mode
    }
  }

  const pillClass = (selected, value) => clsx(
    'text-xs px-3 py-1 rounded-md transition-colors cursor-pointer capitalize font-mono border',
    selected === value
      ? 'bg-[#14532D] text-[#D97706] border-[#D97706]/50 font-bold'
      : 'bg-[#141A16] text-[#6B7280] border-[#2D3B2F] hover:text-[#EDEDE9]'
  )

  const stats = {
    open:          alerts.filter((a) => a.status === 'open').length,
    confirmed:     alerts.filter((a) => a.status === 'confirmed').length,
    false_positive:alerts.filter((a) => a.status === 'false_positive').length,
    resolved:      alerts.filter((a) => a.status === 'resolved').length,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-[#141A16] text-[#EDEDE9]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#EDEDE9] mb-1 flex items-center gap-2">
          <span>📜</span> Incident Logs & Government Dispatch Record
        </h1>
        <p className="text-[#6B7280] text-xs font-mono">
          All threshold breach events, emergency call dispatches, and encrypted emails
        </p>
      </div>

      {/* Stats with locked colors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Watch / Open',        count: stats.open,          color: 'text-[#F59E0B]', border: 'border-[#F59E0B]/30' },
          { label: 'Critical / Confirmed',count: stats.confirmed,     color: 'text-[#EF4444]', border: 'border-[#EF4444]/30' },
          { label: 'False Alarms',        count: stats.false_positive,color: 'text-[#6B7280]', border: 'border-[#2D3B2F]'     },
          { label: 'Safe / Resolved',     count: stats.resolved,      color: 'text-[#22C55E]', border: 'border-[#22C55E]/30' },
        ].map(({ label, count, color, border }) => (
          <div key={label} className={`bg-[#1F2921] border ${border} rounded-xl p-4 shadow-sm font-mono`}>
            <div className={`text-3xl font-bold ${color}`}>{count}</div>
            <div className="text-xs text-[#6B7280] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter toolbar */}
      <div className="bg-[#1F2921] border border-[#2D3B2F] rounded-xl p-3.5 mb-5 flex flex-col md:flex-row gap-3 items-start md:items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search incident records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#141A16] border border-[#2D3B2F] rounded-lg px-3 py-1.5 text-xs text-[#EDEDE9] placeholder-[#6B7280] focus:outline-none focus:border-[#D97706] w-full md:w-60 font-mono"
        />

        {/* Status filter */}
        <div className="flex gap-1 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button key={s} className={pillClass(statusFilter, s)} onClick={() => setStatusFilter(s)}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Hazard filter */}
        <div className="flex gap-1">
          {HAZARD_OPTIONS.map((h) => (
            <button key={h} className={pillClass(hazardFilter, h)} onClick={() => setHazardFilter(h)}>
              {h === 'flood' ? '💧 Water' : h === 'fire' ? '🔥 Fire' : h === 'pollution' ? '☁️ Air' : 'All'}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-1 ml-auto">
          {[['cards', 'Cards'], ['table', 'Table']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={clsx(
                'text-xs px-2.5 py-1 rounded-md font-mono transition-colors border',
                view === v
                  ? 'bg-[#14532D] text-[#D97706] border-[#D97706]/40 font-bold'
                  : 'bg-[#141A16] text-[#6B7280] border-[#2D3B2F]'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {view === 'cards' ? (
        <AlertFeed
          alerts={filtered}
          onStatusChange={user ? handleStatusChange : undefined}
        />
      ) : (
        <div className="bg-[#1F2921] border border-[#2D3B2F] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#141A16] text-[#6B7280] border-b border-[#2D3B2F]">
              <tr>
                <th className="p-3">Hazard</th>
                <th className="p-3">Node Source</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Govt Dispatched Action</th>
                <th className="p-3">Status</th>
                <th className="p-3">Triggered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3B2F]/60">
              {filtered.map((alert) => (
                <tr key={alert.id} className="hover:bg-[#141A16]/50 transition-colors">
                  <td className="p-3 font-semibold uppercase">
                    <span className={alert.hazard === 'fire' ? 'text-[#F97316]' : alert.hazard === 'flood' ? 'text-[#0D9488]' : 'text-[#8B5CF6]'}>
                      {alert.hazard}
                    </span>
                  </td>
                  <td className="p-3 text-[#EDEDE9]">{alert.node_name || alert.node_id}</td>
                  <td className="p-3 font-bold text-[#EF4444]">{alert.risk_score}</td>
                  <td className="p-3 text-[11px] text-[#D97706]">
                    {alert.hazard === 'fire'
                      ? 'Call Fire Dept (101) + Govt Email'
                      : alert.hazard === 'flood'
                      ? 'Email Flood Control & DM'
                      : 'Email Pollution Control Board'}
                  </td>
                  <td className="p-3">
                    <span className={clsx('text-[10px] px-2 py-0.5 rounded capitalize font-bold', {
                      'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40': alert.status === 'open',
                      'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40': alert.status === 'confirmed',
                      'bg-[#6B7280]/20 text-[#6B7280] border border-[#6B7280]/40': alert.status === 'false_positive',
                      'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40': alert.status === 'resolved',
                    })}>
                      {alert.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-[#6B7280]">
                    {formatDistanceToNow(parseISO(alert.triggered_at), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
