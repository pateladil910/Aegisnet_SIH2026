import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { ForecastPoint } from '../../types';

interface ForecastChartProps {
  series: ForecastPoint[];
  title: string;
  hazard: string;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ series, title, hazard }) => {
  const chartData = series.map((p, idx) => ({
    time: `+${idx + 1}h`,
    predicted: p.predictedValue,
    bandLow: p.confidenceLow,
    bandHigh: p.confidenceHigh,
    confidenceRange: [p.confidenceLow, p.confidenceHigh]
  }));

  const lineColor = hazard === 'fire' ? '#ef4444' : hazard === 'flood' ? '#3b82f6' : '#f59e0b';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col h-72">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{title}</h4>
          <p className="text-[10px] text-slate-400">3–6h predictive trajectory with 95% confidence interval</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
          FastAPI AI Model
        </span>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d16',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#f8fafc'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            {/* Uncertainty envelope */}
            <Area
              dataKey="bandHigh"
              stroke="transparent"
              fill={lineColor}
              fillOpacity={0.15}
              name="Confidence Range (Upper)"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke={lineColor}
              strokeWidth={3}
              dot={{ r: 4, fill: lineColor }}
              name="Predicted Risk Metric"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
