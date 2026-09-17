import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { SensorReading } from '../../types';

interface TimeSeriesChartProps {
  readings: SensorReading[];
  dataKey: keyof SensorReading;
  title: string;
  unit: string;
  color: string;
  dangerThreshold?: number;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  readings,
  dataKey,
  title,
  unit,
  color,
  dangerThreshold
}) => {
  const chartData = readings.map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: Number(r[dataKey]) || 0
  }));

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col h-64">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">{title}</h4>
        <span className="text-xs font-mono text-slate-400">Unit: {unit}</span>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${String(dataKey)}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              minTickGap={20}
            />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d16',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#f8fafc'
              }}
              formatter={(value: any) => [`${value} ${unit}`, title]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad-${String(dataKey)})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
