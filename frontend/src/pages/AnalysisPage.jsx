// pages/AnalysisPage.jsx — AI Edge-Correlation Pipeline & Explainability Engine
import { useState } from 'react'
import { useStore } from '../store/useStore'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const FORECAST_DATA = [
  { hour: 'Now', actual: 48, forecastUpper: 48, forecastLower: 48 },
  { hour: '+30m', actual: null, forecastUpper: 54, forecastLower: 50 },
  { hour: '+1h',  actual: null, forecastUpper: 62, forecastLower: 55 },
  { hour: '+1.5h',actual: null, forecastUpper: 72, forecastLower: 62 },
  { hour: '+2h',  actual: null, forecastUpper: 84, forecastLower: 70 },
]

export default function AnalysisPage() {
  const suppressionLog = useStore((s) => s.suppressionLog)
  const activeScenario = useStore((s) => s.activeScenario)

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6 font-sans">
      {/* ─── Header Strip ─────────────────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-sm">
            🧠
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Environmental <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Analysis & Explainability</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Qualcomm Edge-AI Sensor Fusion, Cross-Node Spatial Reinforcement, & False-Alarm Suppression
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-2xl">
            <span className="text-slate-500 dark:text-slate-400">Model Engine:</span>{' '}
            <b className="text-blue-600 dark:text-cyan-400">QNN TFLite v2.4</b>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-2xl">
            <span className="text-slate-500 dark:text-slate-400">Statistical Confidence:</span>{' '}
            <b className="text-emerald-600 dark:text-emerald-400">89.4% (R²)</b>
          </div>
        </div>
      </div>

      {/* ─── 1. Model Confidence Explainer (Feature Weights) ───────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wide">
              Feature Weight Deconstruction (Why Did the Alert Fire?)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-channel on-device inference breakdown for Active Incident ALT-101
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            Fused Score: 0.89 Fused Risk
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {[
            { feature: 'Instantaneous Water Rate of Change (ΔW/dt)', weight: '+0.34', pct: 85, color: '#2563eb', desc: 'Rising +22 cm/min acceleration detected across 8-sample rolling FIFO window.' },
            { feature: 'Upstream Sensor Correlation (NODE-01 to NODE-02)', weight: '+0.28', pct: 72, color: '#06b6d4', desc: 'Spatial distance decay confirmed neighbor surge 6.4 km upstream.' },
            { feature: 'Rain Gauge Precipitation Ingress', weight: '+0.18', pct: 45, color: '#3b82f6', desc: 'Tipping bucket recorded continuous 38 mm/hr catchment rainfall.' },
            { feature: 'Optical Smoke / Flare Inversion', weight: '+0.09', pct: 25, color: '#f97316', desc: 'Background baseline normal; negligible contribution.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-white">{item.feature}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{item.weight} Contribution</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 2. Cross-Node Correlation Graph & Short-Term Forecast ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Node-Link Spatial Correlation Visual */}
        <div className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-mono uppercase">
              Cross-Node Spatial Reinforcement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How upstream telemetry reinforces downstream alerts before local crest
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 text-xs font-mono space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-600 dark:text-cyan-400">NODE-01 (Upstream Dam)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Surge Detected (T = 0)</span>
            </div>
            <div className="text-center text-slate-400 dark:text-slate-500 font-bold text-[11px]">
              ↓ Spatial Propagation: 4.8 km distance decay (22 min fluid transit lag) ↓
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-600 dark:text-cyan-300">NODE-02 (Canal Siphon)</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">Reinforced Early Warning (+42 min lead)</span>
            </div>
            <div className="text-center text-slate-400 dark:text-slate-500 font-bold text-[11px]">
              ↓ Multi-Hop LoRa Mesh Relay (Zero Cloud WAN Dependency) ↓
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-600 dark:text-red-400">NODE-06 (Vasna Barrage Downstream)</span>
              <span className="text-red-600 dark:text-red-400 font-bold">Gates Prepared Before Surge Arrival</span>
            </div>
          </div>
        </div>

        {/* Short-Term Projected Trajectory */}
        <div className="lg:col-span-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-mono uppercase">
                2-Hour Ahead Predictive Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Forward-looking projected depth with statistical uncertainty bands
              </p>
            </div>
            <span className="text-[11px] font-mono text-blue-600 dark:text-cyan-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
              Confidence: ±4 cm
            </span>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FORECAST_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} fontStyle="italic" />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[40, 90]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, color: '#f8fafc', fontSize: 11 }} />
                <Line type="monotone" dataKey="forecastUpper" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" name="Projected Upper Crest (cm)" />
                <Line type="monotone" dataKey="forecastLower" stroke="#06b6d4" strokeWidth={2} name="Conservative Trajectory (cm)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── 3. False-Positive Edge Model Suppression Log ───────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase font-mono flex items-center gap-2">
              <span>🛡️</span> False-Positive Suppression Log (Proves AI Over Fixed Thresholds)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transient sensor anomalies classified as non-emergencies by the on-device model, preventing alert fatigue
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Zero False Dispatches
          </span>
        </div>

        <div className="space-y-3">
          {suppressionLog.map((sup) => (
            <div
              key={sup.id}
              className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 text-xs space-y-1.5 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-800"
            >
              <div className="flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{sup.node_id}</span>
                  <span className="text-slate-500 dark:text-slate-400">({sup.sensor})</span>
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Spike: {sup.spike_val}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">{sup.time}</span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{sup.reason}</p>

              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                <span>✓ Decision:</span>
                <span>{sup.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
