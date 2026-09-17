import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { AegisNode, SensorReading, ForecastPoint } from '../types';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { ForecastChart } from '../components/charts/ForecastChart';
import { RiskGauge } from '../components/charts/RiskGauge';
import { ArrowLeft, Radio, Battery, Wifi, Calendar, RefreshCw } from 'lucide-react';
import { getNodeStatusBadge } from '../lib/riskColor';

export const NodeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [node, setNode] = useState<AegisNode | null>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [nodeData, readingsData, forecastData] = await Promise.all([
        apiClient.getNodeDetail(id),
        apiClient.getNodeReadings(id, 60),
        apiClient.getForecast(id, 'flood')
      ]);
      setNode(nodeData);
      setReadings(readingsData);
      setForecast(forecastData.series);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading && !node) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mr-2" />
        <span>Loading telemetry timeseries...</span>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Node not found.</p>
        <Link to="/dashboard" className="text-blue-400 underline mt-2 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  const statusBadge = getNodeStatusBadge(node.status);
  const latestReading = readings[readings.length - 1];

  return (
    <div className="flex-1 overflow-y-auto p-4 max-w-[1720px] w-full mx-auto space-y-4">
      {/* Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-100">{node.label}</h1>
              <span className="font-mono text-xs text-blue-400 font-bold">({node._id})</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Firmware: {node.hardware.firmwareVersion} | Sensors: {node.hardware.sensors.join(', ')} | Location: [{node.location.coordinates.join(', ')}]
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Risk Gauges Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RiskGauge
          score={node.currentRisk?.flood || 0}
          label="Flood Inundation Risk"
          hazard="flood"
        />
        <RiskGauge
          score={node.currentRisk?.fire || 0}
          label="Thermal & Wildfire Risk"
          hazard="fire"
        />
        <RiskGauge
          score={node.currentRisk?.pollution || 0}
          label="Atmospheric Pollution Risk"
          hazard="pollution"
        />
      </div>

      {/* Sensor Timeseries Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TimeSeriesChart
          readings={readings}
          dataKey="waterLevelCm"
          title="Ultrasonic Water Level"
          unit="cm"
          color="#3b82f6"
        />
        <TimeSeriesChart
          readings={readings}
          dataKey="aqi"
          title="Air Quality Index (MQ135)"
          unit="AQI"
          color="#f59e0b"
        />
        <TimeSeriesChart
          readings={readings}
          dataKey="tempC"
          title="Ambient Temperature (DHT22)"
          unit="°C"
          color="#ef4444"
        />
        <TimeSeriesChart
          readings={readings}
          dataKey="soilMoisture"
          title="Soil Moisture Saturation"
          unit="%"
          color="#10b981"
        />
      </div>

      {/* 3-6h AI Predictive Forecast Band */}
      {forecast.length > 0 && (
        <ForecastChart
          series={forecast}
          title={`${node.label} — 3 to 6-Hour Predictive Trajectory`}
          hazard="flood"
        />
      )}
    </div>
  );
};
