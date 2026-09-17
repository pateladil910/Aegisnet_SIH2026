import React, { useState } from 'react';
import { AlertItem, HazardType } from '../types';
import { AlertCard } from '../components/alerts/AlertCard';
import { BellRing, Download, Search, Filter } from 'lucide-react';

interface AlertHistoryPageProps {
  alerts: AlertItem[];
  onResolveAlert: (id: string) => void;
}

export const AlertHistoryPage: React.FC<AlertHistoryPageProps> = ({ alerts, onResolveAlert }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'resolved' | 'suppressed'>('all');
  const [hazardFilter, setHazardFilter] = useState<'all' | HazardType>('all');

  const filtered = alerts.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (hazardFilter !== 'all' && a.hazardType !== hazardFilter) return false;
    if (searchTerm) {
      const matchNode = a.nodeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchHazard = a.hazardType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchNode || matchHazard;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['AlertID', 'NodeID', 'Hazard', 'RiskScore', 'AreaProbability', 'Severity', 'Status', 'CreatedAt'];
    const rows = filtered.map(a => [
      a._id,
      a.nodeId,
      a.hazardType,
      a.riskScore,
      a.areaProbabilityIndex,
      a.severity,
      a.status,
      a.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aegisnet_alerts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 max-w-[1500px] w-full mx-auto space-y-4">
      {/* Header & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-950/80 border border-red-800/80 text-red-400">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-100">Disaster Incident Log & Alert History</h1>
            <p className="text-xs text-slate-400">Audit-grade incident records with edge telemetry and AI correlation context</p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 border border-slate-800 p-3 rounded-xl">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Node ID or Hazard..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {(['all', 'confirmed', 'resolved', 'suppressed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded capitalize font-medium ${
                statusFilter === st ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Hazard Filter */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {(['all', 'flood', 'fire', 'pollution'] as const).map(hz => (
            <button
              key={hz}
              onClick={() => setHazardFilter(hz)}
              className={`px-2.5 py-1 rounded capitalize font-medium ${
                hazardFilter === hz ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {hz}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(alert => (
          <AlertCard
            key={alert._id}
            alert={alert}
            onResolve={onResolveAlert}
          />
        ))}
      </div>
    </div>
  );
};
