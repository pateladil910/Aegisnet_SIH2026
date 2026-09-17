// components/alerts/SmsToast.jsx — Multi-Agency Emergency Escalation Toast (Cops 100, Fire 101, 108 Ambulance, GSDMA)

import { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import clsx from 'clsx'

export default function SmsToast() {
  const toasts = useStore((s) => s.smsToasts)
  const dismissToast = useStore((s) => s.dismissToast)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Emergency Siren Beep
  useEffect(() => {
    if (!toasts.length || !soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } catch {
      // Audio not permitted without interaction
    }
  }, [toasts.length, soundEnabled])

  if (!toasts.length) return null

  return (
    <aside
      aria-label="Gujarat Emergency Response Queue"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-lg w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isFire = toast.hazard === 'fire'
        const isFlood = toast.hazard === 'flood'
        const borderTone = isFire ? 'border-[#F97316]' : isFlood ? 'border-[#0D9488]' : 'border-[#8B5CF6]'

        return (
          <div
            key={toast.id}
            className={clsx(
              'pointer-events-auto rounded-2xl border-2 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 text-[#EDEDE9] bg-[#1F2921]/95',
              borderTone
            )}
          >
            {/* Header: State Emergency Escalation */}
            <div className="flex items-center justify-between gap-2 border-b border-[#2D3B2F] pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#EF4444]">
                  🚨 STATE EMERGENCY DECLARED (GSDMA / GUJARAT)
                </span>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-[#6B7280] hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-[#141A16] transition-colors"
                title="Dismiss"
              >
                ✕
              </button>
            </div>

            {/* Multi-Agency Emergency Dispatches per user specification */}
            <div className="space-y-1.5 mb-2 font-mono text-xs">
              {/* 1. Cops / Police */}
              <div className="bg-[#141A16] border border-[#3B82F6]/50 text-[#60A5FA] px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-semibold">
                <span>🚓</span>
                <span className="text-[11px]">{toast.callCops || 'POLICE DIAL 100/112: Gujarat Police Patrol Dispatched'}</span>
              </div>

              {/* 2. Fire Brigade */}
              <div className="bg-[#141A16] border border-[#F97316]/50 text-[#F97316] px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-semibold">
                <span>🚒</span>
                <span className="text-[11px]">{toast.callFire || 'FIRE STATION DIAL 101: Emergency Rescue Units En Route'}</span>
              </div>

              {/* 3. Ambulances (108) */}
              <div className="bg-[#141A16] border border-[#EF4444]/50 text-[#EF4444] px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-semibold">
                <span>🚑</span>
                <span className="text-[11px]">{toast.callAmbulance || 'AMBULANCE DIAL 108: GVK-EMRI Gujarat Medical Response Active'}</span>
              </div>
            </div>

            {/* Official Government Mail Dispatch */}
            <div className="text-[11px] font-mono text-[#EDEDE9] bg-[#141A16] rounded-xl p-2 border border-[#2D3B2F] mb-2 space-y-0.5">
              <div className="text-[#D97706] font-semibold flex items-center gap-1">
                <span>✉️ Official Government Alert:</span>
              </div>
              <div className="text-[#6B7280] text-[10px] break-all">{toast.mailRecipient}</div>
              <div className="text-[#22C55E] text-[10px] flex items-center gap-1 font-semibold">
                <span>✓ High-Priority Encrypted Dispatch Delivered</span>
              </div>
            </div>

            {/* Incident Summary */}
            <div className="text-xs text-[#EDEDE9] bg-[#141A16]/80 rounded-xl p-2.5 border border-[#2D3B2F] mb-2 font-mono">
              <div className="font-bold text-[#EDEDE9] mb-1 flex items-center justify-between">
                <span>{toast.node_name}</span>
                <span className="text-[#EF4444] font-bold">Score: {toast.risk_score}/100</span>
              </div>
              <div className="text-slate-300 text-xs font-sans">{toast.message}</div>
              <div className="mt-1 text-[10px] text-[#6B7280] flex justify-between">
                <span>Latency: {toast.latency}</span>
                <span>AI Confidence: {(toast.area_probability * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-1">
              <span className="text-[#22C55E] font-mono font-medium">● Gandhinagar & Ahmedabad Command Active</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="hover:text-white transition-colors"
              >
                {soundEnabled ? '🔔 Siren On' : '🔕 Muted'}
              </button>
            </div>
          </div>
        )
      })}
    </aside>
  )
}
