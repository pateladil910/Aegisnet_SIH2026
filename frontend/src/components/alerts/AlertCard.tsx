import React, { useState } from 'react';
import { AlertItem } from '../../types';
import { Waves, Flame, Wind, CheckCircle, ChevronDown, ChevronUp, Bot, Share2 } from 'lucide-react';

interface AlertCardProps {
  alert: AlertItem;
  onResolve?: (id: string) => void;
  onSelectNode?: (nodeId: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onResolve, onSelectNode }) => {
  const [expanded, setExpanded] = useState(false);

  const getHazardIcon = () => {
    switch (alert.hazardType) {
      case 'flood':
        return <Waves className="w-4 h-4 text-blue-400" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-red-400" />;
      default:
        return <Wind className="w-4 h-4 text-amber-400" />;
    }
  };

  const isResolved = alert.status === 'resolved';
  const isSuppressed = alert.status === 'suppressed';

  const severityColor =
    alert.severity === 'critical' || alert.severity === 'high'
      ? 'bg-red-900/60 text-red-300 border-red-700/60'
      : alert.severity === 'warning'
      ? 'bg-yellow-900/60 text-yellow-300 border-yellow-700/60'
      : 'bg-blue-900/60 text-blue-300 border-blue-700/60';

  const timeFormatted = new Date(alert.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div
      className={`p-3 rounded-xl border transition-all ${
        isResolved
          ? 'bg-slate-900/40 border-slate-800/80 opacity-70'
          : isSuppressed
          ? 'bg-slate-900/50 border-amber-900/40'
          : 'bg-slate-900/90 border-red-500/50 shadow-md shadow-red-950/30 ring-1 ring-red-500/30'
      }`}
    >
      {/* Top Row: Hazard, Node & Timestamp */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
            {getHazardIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
                {alert.hazardType} ALERT
              </span>
              <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${severityColor}`}>
                {alert.severity}
              </span>
            </div>
            <button
              onClick={() => onSelectNode && onSelectNode(alert.nodeId)}
              className="text-[11px] font-mono text-cyan-400 hover:underline"
            >
              Origin: {alert.nodeId}
            </button>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-400">{timeFormatted}</span>
        </div>
      </div>

      {/* Metrics Row: Risk Score & Area Probability */}
      <div className="grid grid-cols-2 gap-2 my-2.5 bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Edge AI Risk</span>
          <span className="text-base font-extrabold text-red-400 font-mono">{alert.riskScore}/100</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Area Prob Index</span>
          <span className="text-base font-extrabold text-amber-400 font-mono">{alert.areaProbabilityIndex}%</span>
        </div>
      </div>

      {/* Spatial Correlation Info */}
      {alert.correlatedNodes && alert.correlatedNodes.length > 0 && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mb-2">
          <Share2 className="w-3 h-3 text-cyan-400" />
          <span>Corroborating Nodes:</span>
          <div className="flex gap-1">
            {alert.correlatedNodes.map(c => (
              <span key={c} className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Validation Rationale */}
      {alert.aiValidation && (
        <div className="bg-blue-950/30 border border-blue-800/40 p-2 rounded text-[11px] text-blue-200/90 mb-2 flex items-start gap-1.5">
          <Bot className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
          <span>{alert.aiValidation.reason}</span>
        </div>
      )}

      {/* Expandable Sensor Telemetry */}
      {expanded && alert.rawReading && (
        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs font-mono space-y-1 mb-2 text-slate-300">
          <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Raw Ingested Sensor Frame:</div>
          {alert.rawReading.waterLevelCm !== undefined && (
            <div>Water Level: <span className="text-blue-400">{alert.rawReading.waterLevelCm} cm</span></div>
          )}
          {alert.rawReading.tempC !== undefined && (
            <div>Temperature: <span className="text-amber-400">{alert.rawReading.tempC} °C</span></div>
          )}
          {alert.rawReading.smokePpm !== undefined && (
            <div>Smoke / AQI: <span className="text-yellow-400">{alert.rawReading.smokePpm} ppm</span></div>
          )}
          {alert.rawReading.flame !== undefined && (
            <div>Flame Sensor: <span className={alert.rawReading.flame ? 'text-red-400 font-bold' : 'text-slate-400'}>
              {alert.rawReading.flame ? 'TRIPPED' : 'NORMAL'}
            </span></div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          <span>{expanded ? 'Hide Telemetry' : 'Inspect Telemetry'}</span>
        </button>

        {!isResolved ? (
          <button
            onClick={() => onResolve && onResolve(alert._id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 hover:border-emerald-800 text-slate-300 border border-slate-700 transition-all text-[11px] font-medium"
          >
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Mark Resolved</span>
          </button>
        ) : (
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Resolved
          </span>
        )}
      </div>
    </div>
  );
};
