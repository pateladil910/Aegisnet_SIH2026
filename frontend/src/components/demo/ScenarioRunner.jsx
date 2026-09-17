// components/demo/ScenarioRunner.jsx — 3-Node Environmental Room Scenario Controller

import { useStore } from '../../store/useStore'
import clsx from 'clsx'

export default function ScenarioRunner() {
  const activeScenario = useStore((s) => s.activeScenario)
  const triggerScenario = useStore((s) => s.triggerScenario)

  return (
    <div className="bg-[#1F2921] border border-[#2D3B2F] rounded-xl p-4 shadow-lg mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Scenario description */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0B3820] border border-[#22C55E]/30 flex items-center justify-center flex-shrink-0 text-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-[#EDEDE9] uppercase tracking-wide">
                Environmental 3-Node Sentinel Controller
              </h3>
              {activeScenario && (
                <span className="bg-[#EF4444]/20 text-[#EF4444] text-[10px] font-mono px-2 py-0.5 rounded border border-[#EF4444]/40 animate-pulse font-semibold">
                  ⚠️ ACTIVE HAZARD: {activeScenario.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Room/Forest environment simulation: <b className="text-[#8B5CF6]">Node 1 (Air)</b> • <b className="text-[#0D9488]">Node 2 (Water Level)</b> • <b className="text-[#F97316]">Node 3 (Forest Fire)</b>
            </p>
            <p className="text-[11px] text-[#D97706] mt-0.5 flex items-center gap-1.5 font-medium">
              <span>🚨 Threshold Overflow Rule:</span>
              <span className="text-[#EDEDE9]">
                {activeScenario === 'fire'
                  ? 'Fire Surge → Automated SOS Phone Call to Fire Station (101) + Urgent Govt Email Dispatched'
                  : activeScenario === 'flood'
                  ? 'Water Overflow → Urgent Govt Email to Flood Control & District Magistrate Dispatched'
                  : activeScenario === 'pollution'
                  ? 'Air Contamination → Official Report to Pollution Control Board & Health Ministry Dispatched'
                  : 'Normal readings stay silent on radio (power-saving); surges auto-notify Govt & Emergency Services.'}
              </span>
            </p>
          </div>
        </div>

        {/* Action buttons with Earthy Theme */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Node 1: Air */}
          <button
            onClick={() => triggerScenario('pollution')}
            className={clsx(
              'text-xs px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm border',
              activeScenario === 'pollution'
                ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] ring-2 ring-[#8B5CF6]/50'
                : 'bg-[#0B3820] hover:bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#2D3B2F]'
            )}
          >
            <span>☁️</span>
            <span>Test Node 1 (Air AQI)</span>
          </button>

          {/* Node 2: Water */}
          <button
            onClick={() => triggerScenario('flood')}
            className={clsx(
              'text-xs px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm border',
              activeScenario === 'flood'
                ? 'bg-[#0D9488] text-white border-[#0D9488] ring-2 ring-[#0D9488]/50'
                : 'bg-[#0B3820] hover:bg-[#0D9488]/20 text-[#0D9488] border-[#2D3B2F]'
            )}
          >
            <span>🌊</span>
            <span>Test Node 2 (Water Level)</span>
          </button>

          {/* Node 3: Fire */}
          <button
            onClick={() => triggerScenario('fire')}
            className={clsx(
              'text-xs px-3.5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm border',
              activeScenario === 'fire'
                ? 'bg-[#F97316] text-white border-[#F97316] ring-2 ring-[#F97316]/50'
                : 'bg-[#0B3820] hover:bg-[#F97316]/20 text-[#F97316] border-[#2D3B2F]'
            )}
          >
            <span>🔥</span>
            <span>Test Node 3 (Forest Fire)</span>
          </button>

          {/* Reset Baseline */}
          <button
            onClick={() => triggerScenario('normal')}
            className="text-xs px-3.5 py-2 rounded-lg font-medium bg-[#14532D] hover:bg-[#0B3820] text-[#EDEDE9] border border-[#2D3B2F] transition-colors flex items-center gap-1.5"
            title="Reset to safe baseline"
          >
            <span>🔄</span>
            <span>Reset Safe</span>
          </button>
        </div>
      </div>
    </div>
  )
}
