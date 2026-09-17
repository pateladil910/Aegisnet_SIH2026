// components/charts/TrendChart.jsx — Recharts Line Chart with Earthy & Locked Color Palette

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { format, parseISO } from 'date-fns'

const SERIES = {
  water_level_cm: { color: '#0D9488', label: 'Water Level (cm)' },
  risk_flood:     { color: '#0D9488', label: 'Flood Risk' },
  risk_fire:      { color: '#F97316', label: 'Fire Risk' },
  risk_pollution: { color: '#8B5CF6', label: 'Pollution AQI' },
  smoke_aqi:      { color: '#8B5CF6', label: 'Smoke Concentration' },
  temperature_c:  { color: '#D97706', label: 'Temperature (°C)' },
  humidity_pct:   { color: '#22C55E', label: 'Humidity (%)' },
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1F2921] border border-[#2D3B2F] rounded-lg p-3 shadow-2xl text-xs font-mono">
      <div className="text-[#6B7280] mb-2">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex justify-between gap-4 py-0.5">
          <span style={{ color: p.color }}>{SERIES[p.dataKey]?.label || p.dataKey}</span>
          <span className="text-[#EDEDE9] font-bold">{Number(p.value).toFixed(1)}</span>
        </div>
      ))}
    </div>
  )
}

export default function TrendChart({ data = [], metrics = ['risk_flood', 'risk_fire', 'risk_pollution'], height = 280 }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-[#6B7280] text-sm font-mono">
        No sensor reading points recorded
      </div>
    )
  }

  const formatted = data.map((d) => ({
    ...d,
    time: format(parseISO(d.recorded_at), 'HH:mm'),
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={formatted} margin={{ top: 8, right: 12, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2D3B2F" />
        <XAxis
          dataKey="time"
          tick={{ fill: '#6B7280', fontSize: 11 }}
          interval="preserveStartEnd"
          stroke="#2D3B2F"
        />
        <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} stroke="#2D3B2F" domain={[0, 'auto']} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: '#EDEDE9', paddingTop: '8px' }}
          formatter={(value) => SERIES[value]?.label || value}
        />

        {/* Locked Danger & Warn Reference Lines */}
        {metrics.some((m) => m.startsWith('risk')) && (
          <ReferenceLine
            y={70}
            stroke="#EF4444"
            strokeDasharray="4 2"
            label={{ value: 'CRITICAL (70)', fill: '#EF4444', fontSize: 10, position: 'top' }}
          />
        )}
        {metrics.some((m) => m.startsWith('risk')) && (
          <ReferenceLine
            y={40}
            stroke="#F59E0B"
            strokeDasharray="4 2"
            label={{ value: 'ELEVATED (40)', fill: '#F59E0B', fontSize: 10, position: 'top' }}
          />
        )}

        {metrics.map((key) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={SERIES[key]?.color || '#22C55E'}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: '#1F2921', strokeWidth: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
