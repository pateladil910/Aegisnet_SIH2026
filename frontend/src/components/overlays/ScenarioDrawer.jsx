// components/overlays/ScenarioDrawer.jsx — Global Slide-Out Scenario Simulation Controller
import { useStore } from '../../store/useStore'
import clsx from 'clsx'

export default function ScenarioDrawer({ isOpen, onClose }) {
  const activeScenario = useStore((s) => s.activeScenario)
  const triggerScenario = useStore((s) => s.triggerScenario)
  const hardwareMode = useStore((s) => s.hardwareMode)
  const setHardwareMode = useStore((s) => s.setHardwareMode)

  if (!isOpen) return null

  const SCENARIOS = [
    {
      id: 'flood',
      title: '🌊 Flash Flood: Sabarmati Upstream Surge',
      hero: true,
      badge: 'HERO DEMO',
      desc: 'Simulates high-velocity water ingress across 3 upstream nodes (Sant Sarovar Dam). Sub-5s local siren trips on-device. Downstream nodes receive early correlated warnings 42 min before threshold crest.',
      tags: ['Multi-Hop Correlated', 'Offline-First Siren', 'Upstream Early Warning'],
    },
    {
      id: 'fire',
      title: '🔥 Forest Fire Outbreak: Indroda Reserve',
      desc: 'Simulates rapid thermal spike (>55°C) and optical IR flame detection in dry scrubland. Calculates real-time wind drift cone and auto-notifies Fire Dept (101).',
      tags: ['Thermal IR Array', 'Wind Plume Cone', 'Auto CAD Dispatch'],
    },
    {
      id: 'gas',
      title: '☣️ Industrial Gas Leak: Narol-Vatva GIDC',
      desc: 'Simulates toxic chemical VOC surge (145 ppm) across industrial cluster. Triggers HAZMAT multi-agency protocol and drafts bilingual public evacuation advisory.',
      tags: ['HAZMAT Protocol', 'PID Sensor Fusion', 'Public Advisory'],
    },
    {
      id: 'false_positive',
      title: '🛡️ False Positive Edge Suppression Drill',
      badge: 'PROVES AI',
      desc: 'Injects transient smoke spike on a single node without multi-sensor or neighbor corroboration. Demonstrates the Qualcomm Edge-AI model suppressing the false alarm dispatch.',
      tags: ['Edge Classification', 'Zero Alert Fatigue', 'Audit Logged'],
    },
    {
      id: 'lora_drill',
      title: '📡 Network Degradation & LoRa Mesh Drill',
      desc: 'Simulates complete WAN/Cellular blackout. Nodes fallback seamlessly to peer-to-peer LoRa mesh (868 MHz); local sirens fire autonomously in <5s.',
      tags: ['WAN Blackout', 'SX1262 LoRa Mesh', 'Zero Cloud Lag'],
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400">🧪</span>
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Scenario Simulator Engine</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Controllable Live Demonstration for Evaluators</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Hardware Mode Indicator */}
        <div className="px-5 py-3 bg-blue-50/60 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs">
          <span className="text-blue-900 dark:text-cyan-300 font-bold flex items-center gap-1.5">
            <span>⚙️ Hardware:</span>
            <span className="font-mono uppercase">{hardwareMode}</span>
          </span>
          <button
            type="button"
            onClick={() => setHardwareMode(hardwareMode === 'simulated' ? 'live' : 'simulated')}
            className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 underline hover:text-blue-800"
          >
            Switch to {hardwareMode === 'simulated' ? 'Live Qualcomm QNN' : 'Simulated'}
          </button>
        </div>

        {/* Scenario List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          <div className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
            Select Preset Disaster Scenario
          </div>

          {SCENARIOS.map((sc) => {
            const isSelected = activeScenario === sc.id

            return (
              <div
                key={sc.id}
                className={clsx(
                  'rounded-3xl border p-4 transition-all text-left space-y-2.5',
                  isSelected
                    ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/30 shadow-md'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{sc.title}</div>
                  {sc.badge && (
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                      {sc.badge}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{sc.desc}</p>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {sc.tags.map((t) => (
                    <span
                      key={t}
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => triggerScenario(sc.id)}
                    className={clsx(
                      'px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs',
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-500/20'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    )}
                  >
                    {isSelected ? '✓ Running Injection' : 'Inject Scenario →'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 space-y-3">
          {activeScenario && (
            <div className="text-xs text-blue-600 dark:text-cyan-400 font-bold flex items-center justify-between">
              <span>Active: {activeScenario.toUpperCase()}</span>
              <span className="font-mono text-amber-500 font-bold">● Injected</span>
            </div>
          )}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => triggerScenario('reset')}
              className="flex-1 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-300 font-bold py-2.5 rounded-full text-xs transition-colors shadow-xs"
            >
              🔄 Reset Safe Baseline
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-full text-xs font-bold transition-colors shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
