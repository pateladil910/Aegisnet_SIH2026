import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/apiClient';
import { HazardThreshold, HazardType } from '../types';
import { Sliders, Save, History, ShieldAlert, Waves, Flame, Wind, CheckCircle2 } from 'lucide-react';

export const ThresholdConfigPage: React.FC = () => {
  const [thresholds, setThresholds] = useState<HazardThreshold[]>([]);
  const [selectedHazard, setSelectedHazard] = useState<HazardType>('flood');
  const [watchLevel, setWatchLevel] = useState(50);
  const [warningLevel, setWarningLevel] = useState(70);
  const [criticalLevel, setCriticalLevel] = useState(85);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadThresholds();
  }, []);

  const loadThresholds = async () => {
    try {
      const data = await apiClient.getThresholds();
      setThresholds(data);
      const current = data.find(t => t.hazard === selectedHazard);
      if (current) {
        setWatchLevel(current.watchLevel);
        setWarningLevel(current.warningLevel);
        setCriticalLevel(current.criticalLevel);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleHazardSelect = (h: HazardType) => {
    setSelectedHazard(h);
    const current = thresholds.find(t => t.hazard === h);
    if (current) {
      setWatchLevel(current.watchLevel);
      setWarningLevel(current.warningLevel);
      setCriticalLevel(current.criticalLevel);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiClient.updateThreshold(selectedHazard, {
        watchLevel,
        warningLevel,
        criticalLevel,
        changedBy: 'authority@aegisnet.org'
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadThresholds();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const currentThreshold = thresholds.find(t => t.hazard === selectedHazard);

  return (
    <div className="flex-1 overflow-y-auto p-4 max-w-[1400px] w-full mx-auto space-y-4">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-800/80 text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-100">Disaster Risk Threshold Management</h1>
            <p className="text-xs text-slate-400">Configure edge AI scoring trigger points and escalation bands per hazard</p>
          </div>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thresholds Saved & Dispatched via Mesh</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Hazard Picker & Sliders */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-6">
          {/* Hazard Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: 'flood', label: 'Flood Surge', icon: Waves, color: 'text-blue-400' },
              { id: 'fire', label: 'Wildfire / Heat', icon: Flame, color: 'text-red-400' },
              { id: 'pollution', label: 'Air Pollution', icon: Wind, color: 'text-amber-400' }
            ].map(item => {
              const Icon = item.icon;
              const isSel = selectedHazard === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleHazardSelect(item.id as HazardType)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    isSel
                      ? 'bg-slate-800 border-blue-500/80 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sliders */}
          <div className="space-y-5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {/* Watch Level */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-yellow-400 font-bold uppercase">Tier 1: Watch Level (Dashboard Only)</span>
                <span className="text-yellow-400 font-bold">{watchLevel}/100</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                value={watchLevel}
                onChange={e => setWatchLevel(Number(e.target.value))}
                className="w-full accent-yellow-400 cursor-pointer"
              />
            </div>

            {/* Warning Level */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-orange-400 font-bold uppercase">Tier 2: Warning Level (Dashboard + Push)</span>
                <span className="text-orange-400 font-bold">{warningLevel}/100</span>
              </div>
              <input
                type="range"
                min="50"
                max="85"
                value={warningLevel}
                onChange={e => setWarningLevel(Number(e.target.value))}
                className="w-full accent-orange-400 cursor-pointer"
              />
            </div>

            {/* Critical Level */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-mono">
                <span className="text-red-400 font-bold uppercase">Tier 3: Critical Level (Push + Public SMS + Siren)</span>
                <span className="text-red-400 font-bold">{criticalLevel}/100</span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                value={criticalLevel}
                onChange={e => setCriticalLevel(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating Network...' : 'Commit Threshold Updates'}</span>
            </button>
          </div>
        </div>

        {/* Right: Audit Log */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
            <History className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Audit Trail ({selectedHazard.toUpperCase()})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5">
            {currentThreshold?.auditLog && currentThreshold.auditLog.length > 0 ? (
              currentThreshold.auditLog.map((log, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs">
                  <div className="flex justify-between text-slate-400 font-mono text-[10px] mb-1">
                    <span>{log.changedBy}</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300 font-mono text-[11px]">
                    New Limits: Watch={log.newValue.watchLevel} | Warn={log.newValue.warningLevel} | Crit={log.newValue.criticalLevel}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">No prior modifications recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
