import React, { useState } from 'react';
import { AlertItem } from '../../types';
import { AlertCard } from './AlertCard';
import { BellRing, CheckCheck, Flame, Waves, Wind } from 'lucide-react';

interface AlertFeedProps {
  alerts: AlertItem[];
  onResolveAlert: (id: string) => void;
  onSelectNode: (nodeId: string) => void;
}

export const AlertFeed: React.FC<AlertFeedProps> = ({
  alerts,
  onResolveAlert,
  onSelectNode
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');

  const filteredAlerts = alerts.filter(a => {
    if (activeTab === 'active') return a.status === 'confirmed' || a.status === 'active';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <BellRing className="w-4 h-4 text-red-400" />
            {filteredAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Emergency Alert Feed
          </h2>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-2 py-0.5 rounded ${
              activeTab === 'active'
                ? 'bg-red-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active ({alerts.filter(a => a.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2 py-0.5 rounded ${
              activeTab === 'all'
                ? 'bg-slate-800 text-slate-200 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({alerts.length})
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500">
            <CheckCheck className="w-8 h-8 text-emerald-500/60 mb-2" />
            <p className="text-xs font-medium text-slate-400">All environmental parameters nominal</p>
            <p className="text-[10px] text-slate-600">No active disaster thresholds breached</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <AlertCard
              key={alert._id}
              alert={alert}
              onResolve={onResolveAlert}
              onSelectNode={onSelectNode}
            />
          ))
        )}
      </div>
    </div>
  );
};
