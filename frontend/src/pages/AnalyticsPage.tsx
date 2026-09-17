import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/apiClient';
import { ForecastChart } from '../components/charts/ForecastChart';
import { ForecastPoint } from '../types';
import { BarChart3, TrendingUp, ShieldAlert, Waves, Network, RefreshCw } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [floodData, setFloodData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [flood, summary, fc] = await Promise.all([
        apiClient.getFloodIndex('Tapi-Basin'),
        apiClient.getSummary(),
        apiClient.getForecast('node_002', 'flood')
      ]);
      setFloodData(flood);
      setSummaryData(summary);
      setForecast(fc.series);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 max-w-[1500px] w-full mx-auto space-y-4">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-800/80 text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-100">Regional Risk Analytics & AI Forecasting</h1>
            <p className="text-xs text-slate-400">Cloud AI multi-node spatial correlation, Area Probability Index, and surge trajectory</p>
          </div>
        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Flood Probability Index */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Area Flood Probability</span>
            <Waves className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-400 font-mono">
              {floodData ? `${floodData.areaProbabilityIndex}%` : '--'}
            </span>
            <span className="text-xs text-slate-400">
              ({floodData ? floodData.riskBand : 'Analyzing'})
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 font-mono">
            Spatial Multiplier: {floodData?.elevatedNodesCount >= 2 ? '1.25x (Multi-node surge)' : '1.0x (Nominal)'}
          </div>
        </div>

        {/* Monitored Nodes */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Online Mesh Nodes</span>
            <Network className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400 font-mono">
              {summaryData ? `${summaryData.onlineNodes}/${summaryData.totalNodes}` : '--'}
            </span>
            <span className="text-xs text-emerald-400 font-bold">100% Active</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 font-mono">
            {summaryData?.meshHealth || 'LoRa Flood-Routing Active'}
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Critical Incident Alerts</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-400 font-mono">
              {summaryData ? summaryData.criticalAlertsCount : '--'}
            </span>
            <span className="text-xs text-slate-400">active escalations</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 font-mono">
            Total Ingested: {summaryData?.activeAlertsCount || 0}
          </div>
        </div>

        {/* Battery Health */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Fleet Battery Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              {summaryData ? `${summaryData.avgBatteryPercent}%` : '--'}
            </span>
            <span className="text-xs text-emerald-400 font-medium">Solar Assisted</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 font-mono">
            Power depletion risk: Nominal
          </div>
        </div>
      </div>

      {/* Main Forecast Visualizer */}
      <div className="grid grid-cols-1 gap-4">
        {forecast.length > 0 && (
          <ForecastChart
            series={forecast}
            title="Tapi Catchment Sector — 6-Hour Inundation & Risk Predictive Trajectory"
            hazard="flood"
          />
        )}
      </div>
    </div>
  );
};
