import React from 'react';
import { getRiskColor } from '../../lib/riskColor';

interface RiskGaugeProps {
  score: number;
  label: string;
  hazard: 'flood' | 'fire' | 'pollution';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, label, hazard }) => {
  const color = getRiskColor(score);
  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
          <circle
            cx="45"
            cy="45"
            r="38"
            className="text-slate-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="45"
            cy="45"
            r="38"
            stroke={color.hex}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold font-mono text-slate-100">{score}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-300 mt-2">{label}</span>
      <span className={`text-[10px] font-mono mt-0.5 px-2 py-0.5 rounded-full ${color.badge}`}>
        {score >= 75 ? 'CRITICAL' : score >= 50 ? 'WARNING' : 'NORMAL'}
      </span>
    </div>
  );
};
