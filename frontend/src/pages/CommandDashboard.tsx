import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AegisNode, AlertItem } from '../types';
import { NodeList } from '../components/nodes/NodeList';
import { RiskMap } from '../components/map/RiskMap';
import { AlertFeed } from '../components/alerts/AlertFeed';
import { ExternalLink, Radio, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getNodeStatusBadge } from '../lib/riskColor';

interface CommandDashboardProps {
  nodes: AegisNode[];
  alerts: AlertItem[];
  onResolveAlert: (id: string) => void;
}

export const CommandDashboard: React.FC<CommandDashboardProps> = ({
  nodes,
  alerts,
  onResolveAlert
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?._id || 'node_002');

  const selectedNode = nodes.find(n => n._id === selectedNodeId) || nodes[0];
  const activeAlertCount = alerts.filter(a => a.status === 'confirmed').length;

  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden max-w-[1720px] w-full mx-auto">
      {/* Top Incident Status Banner */}
      {activeAlertCount > 0 ? (
        <div className="bg-red-950/40 border border-red-800/80 p-3 rounded-xl flex items-center justify-between shadow-lg shadow-red-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-600/30 border border-red-500/50 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-red-200">
                ACTIVE INCIDENT MONITORING: {activeAlertCount} CRITICAL ALERT{activeAlertCount > 1 ? 'S' : ''} IN PROGRESS
              </h3>
              <p className="text-[11px] text-red-300/80">
                LoRa Mesh relay active. Automated SMS notifications dispatched to District Disaster Management authority.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-red-400 font-bold bg-red-950/80 px-2.5 py-1 rounded border border-red-800">
              ESCALATION TIER 3 (SMS + PUSH)
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/30 border border-emerald-800/60 p-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Tapi River Basin Network Status: ALL SECTORS NOMINAL</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400/80">Continuous LoRa Ingestion Active</span>
        </div>
      )}

      {/* 3-Column Ops Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Column: Live Node Health List */}
        <div className="lg:col-span-3 h-full flex flex-col min-h-[350px]">
          <NodeList
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
          />
        </div>

        {/* Center Column: Interactive Map + Selected Node Quick Card */}
        <div className="lg:col-span-6 h-full flex flex-col gap-3 min-h-[450px]">
          <div className="flex-1">
            <RiskMap
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
            />
          </div>

          {/* Selected Node Quick Overview Card */}
          {selectedNode && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-800/60 flex items-center justify-center">
                  <Radio className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{selectedNode.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">({selectedNode._id})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getNodeStatusBadge(selectedNode.status).color}`}>
                      {getNodeStatusBadge(selectedNode.status).label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-mono mt-0.5">
                    <span>Coordinates: [{selectedNode.location.coordinates.join(', ')}]</span>
                    <span>Battery: {selectedNode.battery}%</span>
                    <span>RSSI: {selectedNode.rssi} dBm</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/nodes/${selectedNode._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
              >
                <span>Full Telemetry</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Real-Time Alert Feed */}
        <div className="lg:col-span-3 h-full flex flex-col min-h-[350px]">
          <AlertFeed
            alerts={alerts}
            onResolveAlert={onResolveAlert}
            onSelectNode={setSelectedNodeId}
          />
        </div>
      </div>
    </div>
  );
};
