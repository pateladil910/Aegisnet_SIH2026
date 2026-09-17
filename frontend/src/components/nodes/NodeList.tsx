import React, { useState } from 'react';
import { AegisNode } from '../../types';
import { NodeHealthBadge } from './NodeHealthBadge';
import { getNodeStatusBadge } from '../../lib/riskColor';
import { Waves, Flame, Wind, Filter, Radio } from 'lucide-react';

interface NodeListProps {
  nodes: AegisNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

export const NodeList: React.FC<NodeListProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode
}) => {
  const [filter, setFilter] = useState<'all' | 'flood' | 'fire' | 'pollution' | 'alert'>('all');

  const filteredNodes = nodes.filter(node => {
    if (filter === 'all') return true;
    if (filter === 'alert') return node.status === 'alert' || node.status === 'warning';
    return node.hazardTypes.includes(filter);
  });

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
      {/* Header & Filter Controls */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/90 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Edge Sensor Nodes ({filteredNodes.length}/{nodes.length})
            </h2>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          {(['all', 'flood', 'fire', 'pollution', 'alert'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Node Cards List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {filteredNodes.map(node => {
          const isSelected = node._id === selectedNodeId;
          const statusBadge = getNodeStatusBadge(node.status);
          const maxRisk = Math.max(
            node.currentRisk?.flood || 0,
            node.currentRisk?.fire || 0,
            node.currentRisk?.pollution || 0
          );

          return (
            <div
              key={node._id}
              onClick={() => onSelectNode(node._id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500/80 ring-1 ring-blue-500/50 shadow-md shadow-blue-950/50'
                  : 'bg-slate-900/40 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      {node._id}
                    </span>
                    <h3 className="text-xs font-semibold text-slate-100 truncate max-w-[150px]">
                      {node.label}
                    </h3>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
              </div>

              {/* Current Risk Bars */}
              <div className="flex items-center gap-2 my-2 text-[11px] bg-slate-950/50 p-1.5 rounded border border-slate-800/60">
                <div className="flex items-center gap-1 text-slate-300">
                  <Waves className="w-3 h-3 text-blue-400" />
                  <span className="font-mono">{node.currentRisk?.flood || 0}%</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Flame className="w-3 h-3 text-red-400" />
                  <span className="font-mono">{node.currentRisk?.fire || 0}%</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Wind className="w-3 h-3 text-amber-400" />
                  <span className="font-mono">{node.currentRisk?.pollution || 0}%</span>
                </div>
              </div>

              {/* Health Footer */}
              <NodeHealthBadge
                battery={node.battery}
                solarCharging={node.solarCharging}
                rssi={node.rssi}
                lastSeen={node.lastSeen}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
