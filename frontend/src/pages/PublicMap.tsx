import React from 'react';
import { AegisNode, AlertItem } from '../types';
import { RiskMap } from '../components/map/RiskMap';
import { ShieldCheck, AlertCircle, Info } from 'lucide-react';

interface PublicMapProps {
  nodes: AegisNode[];
  alerts: AlertItem[];
}

export const PublicMap: React.FC<PublicMapProps> = ({ nodes, alerts }) => {
  const activeAlerts = alerts.filter(a => a.status === 'confirmed');

  return (
    <div className="flex-1 flex flex-col p-4 max-w-[1500px] w-full mx-auto gap-4">
      {/* Public Advisory Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-base font-extrabold tracking-wide text-slate-100">
              Community Environmental Safety & Risk Advisory
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time public hazard monitoring powered by decentralized edge AI sensor nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeAlerts.length > 0 ? (
            <div className="flex items-center gap-2 bg-red-950/80 border border-red-800/80 text-red-300 px-3 py-1.5 rounded-lg text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{activeAlerts.length} ACTIVE ADVISOR{activeAlerts.length > 1 ? 'IES' : 'Y'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SAFETY STATUS: ALL SECTORS GREEN</span>
            </div>
          )}
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 min-h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <RiskMap
          nodes={nodes}
          selectedNodeId={null}
          onSelectNode={() => {}}
          simplified={true}
        />
      </div>

      {/* Public Advisory Guidance Banner */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span>
          Emergency advisories are broadcast automatically via SMS and local alert hubs. For distress reporting or evacuation assistance, please contact the District Disaster Management control room.
        </span>
      </div>
    </div>
  );
};
