import React from 'react';
import { Battery, BatteryCharging, Wifi, WifiOff, Sun } from 'lucide-react';

interface NodeHealthBadgeProps {
  battery: number;
  solarCharging: boolean;
  rssi: number;
  lastSeen: string;
}

export const NodeHealthBadge: React.FC<NodeHealthBadgeProps> = ({
  battery,
  solarCharging,
  rssi,
  lastSeen
}) => {
  // Battery color
  const batteryColor =
    battery >= 60 ? 'text-emerald-400' : battery >= 25 ? 'text-yellow-400' : 'text-red-400';

  // RSSI quality
  const rssiQuality =
    rssi >= -65 ? 'Optimal' : rssi >= -80 ? 'Good' : 'Weak';
  const rssiColor =
    rssi >= -65 ? 'text-emerald-400' : rssi >= -80 ? 'text-yellow-400' : 'text-red-400';

  // Format last seen
  const secondsAgo = Math.max(0, Math.round((Date.now() - new Date(lastSeen).getTime()) / 1000));
  const timeText = secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.round(secondsAgo / 60)}m ago`;

  return (
    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
      {/* Battery */}
      <div className="flex items-center gap-1">
        {solarCharging ? (
          <Sun className="w-3 h-3 text-amber-400 animate-spin-slow" />
        ) : battery >= 50 ? (
          <Battery className={`w-3.5 h-3.5 ${batteryColor}`} />
        ) : (
          <BatteryCharging className={`w-3.5 h-3.5 ${batteryColor}`} />
        )}
        <span className={batteryColor}>{battery}%</span>
      </div>

      {/* RSSI */}
      <div className="flex items-center gap-1" title={`LoRa Mesh RSSI: ${rssi} dBm (${rssiQuality})`}>
        <Wifi className={`w-3 h-3 ${rssiColor}`} />
        <span className={rssiColor}>{rssi}dBm</span>
      </div>

      {/* Last Seen */}
      <span className="text-slate-500">{timeText}</span>
    </div>
  );
};
