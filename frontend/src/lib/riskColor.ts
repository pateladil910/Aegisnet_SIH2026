export function getRiskColor(score: number): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  hex: string;
} {
  if (score >= 75) {
    return {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/50',
      badge: 'bg-red-950/80 text-red-400 border-red-800',
      hex: '#dc2626'
    };
  } else if (score >= 50) {
    return {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/50',
      badge: 'bg-yellow-950/80 text-yellow-400 border-yellow-800',
      hex: '#eab308'
    };
  } else {
    return {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/50',
      badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800',
      hex: '#16a34a'
    };
  }
}

export function getNodeStatusBadge(status: string) {
  switch (status) {
    case 'alert':
      return { label: 'CRITICAL ALERT', color: 'bg-red-600 text-white animate-pulse' };
    case 'warning':
      return { label: 'ELEVATED WATCH', color: 'bg-yellow-600 text-slate-900' };
    case 'offline':
      return { label: 'OFFLINE', color: 'bg-slate-700 text-slate-300' };
    default:
      return { label: 'NORMAL', color: 'bg-emerald-600/30 text-emerald-400 border border-emerald-600/50' };
  }
}
