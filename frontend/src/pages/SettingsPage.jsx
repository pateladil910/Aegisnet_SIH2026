// pages/SettingsPage.jsx — System Settings, Threshold Sensitivity, Dispatch Rules & Audit Log
import { useState } from 'react'
import { useStore, useAuthStore } from '../store/useStore'
import clsx from 'clsx'

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const auditLog = useStore((s) => s.auditLog)
  const hardwareMode = useStore((s) => s.hardwareMode)
  const setHardwareMode = useStore((s) => s.setHardwareMode)
  const addAuditLog = useStore((s) => s.addAuditLog)

  const [activeTab, setActiveTab] = useState('thresholds')

  // Thresholds state
  const [thresholds, setThresholds] = useState({
    flood: { name: 'Flood & Hydrology', warn: 0.8, crit: 1.4, unit: 'm', icon: '🌊' },
    fire: { name: 'Thermal & Fire', warn: 42, crit: 50, unit: '°C', icon: '🔥' },
    air: { name: 'Air Quality (AQI)', warn: 100, crit: 160, unit: 'AQI', icon: '🌫️' },
    chem: { name: 'Toxic Gas (VOC)', warn: 35, crit: 60, unit: 'ppm', icon: '☣️' },
    seismic: { name: 'Seismic Acceleration', warn: 0.15, crit: 0.35, unit: 'g', icon: '📳' },
  })

  const [savedSuccess, setSavedSuccess] = useState(false)

  // Dispatch rules matrix state
  const [dispatchRules] = useState([
    { hazard: 'Flood', severity: 'Warning', agencies: 'GSDMA, Municipal, Police', channel: 'SMS + VoIP', sla: '5 min' },
    { hazard: 'Flood', severity: 'Emergency', agencies: 'GSDMA, Municipal, Police, Fire, EMS (108)', channel: 'CAD Direct Call', sla: '2 min' },
    { hazard: 'Fire', severity: 'Warning', agencies: 'Fire Dept (101), Forest Dept', channel: 'SMS + Webhook', sla: '5 min' },
    { hazard: 'Fire', severity: 'Emergency', agencies: 'Fire Dept (101), Police, Hospitals, GSDMA', channel: 'Direct CAD Call', sla: '2 min' },
    { hazard: 'Chemical/Gas', severity: 'Warning+', agencies: 'Fire (HAZMAT), Hospitals, Police, GSDMA', channel: 'Direct Siren & Call', sla: '2 min' },
    { hazard: 'Air Quality', severity: 'Warning', agencies: 'Municipal Health Cell, GPCB', channel: 'Daily Summary SMS', sla: '30 min' },
  ])

  const handleSaveThresholds = () => {
    setSavedSuccess(true)
    addAuditLog('Thresholds Modified', user?.name || 'Admin', 'Updated environmental warning/emergency cutoffs')
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6 font-sans">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/60 text-blue-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-xs">
            ⚙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Settings & <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 bg-clip-text text-transparent">Administration</span>
              </h1>
              <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase">
                GSDMA Edge
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              GSDMA Security Credentials, Edge Sensitivity, & Automated Rules Engine
            </p>
          </div>
        </div>

        <div className="text-xs font-mono bg-slate-50 border border-slate-200/90 px-4 py-2 rounded-2xl text-slate-600 shadow-xs">
          Platform Mode: <b className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase font-bold">{hardwareMode}</b>
        </div>
      </div>

      {/* ─── Settings Layout (Left Nav + Right Content) ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Tab List */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-3 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-1.5 h-fit">
          {[
            { id: 'thresholds', label: 'Thresholds & Sensitivity', icon: '🎚️' },
            { id: 'rules', label: 'Dispatch Rules Engine', icon: '📋' },
            { id: 'hardware', label: 'Hardware Mode (Qualcomm)', icon: '🔌' },
            { id: 'integrations', label: 'Agency API Integrations', icon: '🔗' },
            { id: 'profile', label: 'Officer Profile & Role', icon: '👤' },
            { id: 'audit', label: 'Platform Audit Log', icon: '📜' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold text-left transition-all',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Content Panel */}
        <div className="md:col-span-3 space-y-6">
          {/* Tab 1: Thresholds & Sensitivity */}
          {activeTab === 'thresholds' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-base text-slate-900">Environmental Hazard Thresholds</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Base cutoffs for triggering GSDMA Watch and Emergency states. The Qualcomm Edge-AI models continuously evaluate rolling rate-of-change and multi-channel correlation around these thresholds.
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                {Object.entries(thresholds).map(([key, t]) => (
                  <div key={key} className="bg-slate-50/80 border border-slate-200/90 p-4 rounded-2xl space-y-3 hover:border-blue-300 transition-colors">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>{t.icon}</span>
                        <span>{t.name}</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                        Unit: {t.unit}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-500 block mb-1 font-mono text-[11px]">Watch Level ({t.unit})</label>
                        <input
                          type="number"
                          step="0.1"
                          value={t.warn}
                          onChange={(e) =>
                            setThresholds({
                              ...thresholds,
                              [key]: { ...thresholds[key], warn: parseFloat(e.target.value) || 0 },
                            })
                          }
                          className="w-full bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 text-slate-900 font-mono text-xs focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block mb-1 font-mono text-[11px]">Emergency Level ({t.unit})</label>
                        <input
                          type="number"
                          step="0.1"
                          value={t.crit}
                          onChange={(e) =>
                            setThresholds({
                              ...thresholds,
                              [key]: { ...thresholds[key], crit: parseFloat(e.target.value) || 0 },
                            })
                          }
                          className="w-full bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 text-slate-900 font-mono text-xs focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveThresholds}
                  className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-6 py-2.5 rounded-full text-xs font-mono transition-all shadow-md shadow-blue-500/25"
                >
                  {savedSuccess ? '✓ Protocols Updated & Audited' : 'Save Sensitivity Protocols'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Dispatch Rules */}
          {activeTab === 'rules' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900">Automated Dispatch Rules Matrix</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Maps Incident Category × Severity Tier to Designated Inter-Agency Contacts and Response SLA.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/90">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Hazard</th>
                      <th className="p-3.5">Severity</th>
                      <th className="p-3.5">Agencies Notified</th>
                      <th className="p-3.5">Channel</th>
                      <th className="p-3.5">SLA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dispatchRules.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{rule.hazard}</td>
                        <td className="p-3.5 font-mono font-bold text-red-600">{rule.severity}</td>
                        <td className="p-3.5 text-slate-600">{rule.agencies}</td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-800">{rule.channel}</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-600">{rule.sla}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Hardware Mode */}
          {activeTab === 'hardware' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900">Hardware Mode & Edge Runtime</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Toggle between virtual simulated node fleet and live Qualcomm Dragonwing / RB-class hardware ingestion endpoint.
                </p>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/90 p-5 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-sm text-slate-900">Active Ingestion Source</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Current: <b className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase font-mono">{hardwareMode}</b>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const next = hardwareMode === 'simulated' ? 'live' : 'simulated'
                      setHardwareMode(next)
                      addAuditLog('Hardware Mode Changed', user?.name || 'Admin', `Switched mode to ${next}`)
                    }}
                    className="bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-mono font-bold px-5 py-2.5 rounded-full transition-all shadow-md shadow-blue-500/25"
                  >
                    Switch to {hardwareMode === 'simulated' ? 'Live Qualcomm QNN' : 'Simulated Fleet'}
                  </button>
                </div>

                <div className="pt-2 text-xs text-slate-600 space-y-2 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>QNN Runtime Endpoint:</span>
                    <code className="bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-800">http://192.168.1.100:8000/qnn/telemetry</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>LoRa Mesh Gateway:</span>
                    <code className="bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-800">SX1262 SPI /dev/spidev0.0 @ 868.1 MHz</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>Edge Classification Model:</span>
                    <code className="bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-800">tflite_edge_hazard_v2.tflite (1.8 MB)</code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Integrations */}
          {activeTab === 'integrations' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900">Agency API Integrations</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live keys for GSDMA State Emergency Operation Center, Twilio SMS, and IMD Weather.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-700 font-mono block mb-1 font-bold">GSDMA Emergency API Gateway Key</label>
                  <input
                    type="password"
                    readOnly
                    value="gsdma_live_sec_9934812a0f8b89412e"
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-3 font-mono text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-mono block mb-1 font-bold">State Police & Fire CAD Webhook URL</label>
                  <input
                    type="text"
                    readOnly
                    value="https://cad.gujarat.gov.in/api/v1/dispatch/emergency"
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-3 font-mono text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900">Officer Credentials & Role</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Server-enforced role-based access control (RBAC).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="bg-slate-50/80 border border-slate-200/90 p-4 rounded-2xl">
                  <div className="text-slate-500 text-[10px] font-mono">Assigned Name</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{user?.name}</div>
                </div>
                <div className="bg-slate-50/80 border border-slate-200/90 p-4 rounded-2xl">
                  <div className="text-slate-500 text-[10px] font-mono">Official Agency</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{user?.agency}</div>
                </div>
                <div className="bg-slate-50/80 border border-slate-200/90 p-4 rounded-2xl">
                  <div className="text-slate-500 text-[10px] font-mono">RBAC Role</div>
                  <div className="font-bold text-blue-600 text-sm mt-0.5">{user?.role}</div>
                </div>
                <div className="bg-slate-50/80 border border-slate-200/90 p-4 rounded-2xl">
                  <div className="text-slate-500 text-[10px] font-mono">Official Email</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5 font-mono">{user?.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Audit Log */}
          {activeTab === 'audit' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900">Platform Audit Log (Immutable)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verifiable audit trail recording every acknowledge, escalate, advisory publish, and setting change.
                </p>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {auditLog.map((log) => (
                  <div key={log.id} className="bg-slate-50/80 border border-slate-200/90 p-3.5 rounded-2xl text-xs space-y-1 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs">
                        {log.action}
                      </span>
                      <span className="text-slate-500">{log.time}</span>
                    </div>
                    <p className="text-slate-800 mt-1">{log.details}</p>
                    <div className="text-[10px] text-blue-600 font-mono font-semibold">User: {log.user}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
